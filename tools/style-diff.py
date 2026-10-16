#!/usr/bin/env python3
"""Compara os estilos COMPUTADOS de cada elemento entre um commit e a árvore atual.

É a prova mais forte de "nenhuma mudança visual" em refatorações de CSS
(Fase 1): se nenhum valor de getComputedStyle muda, em nenhum elemento ou
pseudo-elemento (::before, ::after, ::placeholder), o visual não muda.

Estados comparados, para index e portal, em 1440, 1024, 768 e 390px:
  normal    | hover (forçado em todos os elementos via DevTools Protocol)
  focus     (focus + focus-visible + focus-within forçados) | active
  menu      (390px: menu mobile aberto)  | reduced (1440px, prefers-reduced-motion)
  banner    (1440 e 390px: primeira visita, banner de cookies visível)

Animações finitas e transições são concluídas, infinitas são canceladas,
e os rAF são congelados antes da leitura (mesmo preparo de screenshots.py).
Propriedades que variam entre duas leituras do MESMO commit (ruído) são
detectadas automaticamente e ignoradas.

Uso:
  python3 tools/style-diff.py --ref a6ffe89            # commit x árvore de trabalho
  python3 tools/style-diff.py --ref a6ffe89 --quick    # só 1440 e 390, estados normal e hover
Saída 0 = nenhuma diferença.
"""
import argparse
import collections
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import CONSENT_DECLINED, PAGES, serve, site_root  # noqa: E402

VIEWPORTS = {1440: 900, 1024: 768, 768: 1024, 390: 844}
RAF_FREEZE_INIT = """(() => { const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => window.__norvaFreeze ? 0 : raf(cb); })();"""

COLLECT = """() => {
  const out = {};
  const path = el => { const p = []; while (el && el !== document.body) {
      let i = 1, s = el; while ((s = s.previousElementSibling)) if (s.tagName === el.tagName) i++;
      p.unshift(el.tagName.toLowerCase() + ':' + i); el = el.parentElement; } return 'body/' + p.join('/'); };
  const ser = cs => { const o = {}; for (let i = 0; i < cs.length; i++) { const k = cs[i]; o[k] = cs.getPropertyValue(k); } return o; };
  // <canvas> fica de fora: o tamanho da escultura WebGL varia entre leituras.
  const els = [document.body, ...document.body.querySelectorAll('*:not(canvas)')];
  for (const el of els) {
    const k = el === document.body ? 'body' : path(el);
    out[k] = ser(getComputedStyle(el));
    for (const ps of ['::before', '::after']) {
      const cs = getComputedStyle(el, ps);
      if (cs.content && cs.content !== 'none' && cs.content !== 'normal') out[k + ps] = ser(cs);
    }
    if (el.matches('input,textarea')) out[k + '::placeholder'] = ser(getComputedStyle(el, '::placeholder'));
  }
  out['html'] = ser(getComputedStyle(document.documentElement));
  return out;
}"""

SETTLE = """async () => {
  const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const h = () => document.documentElement.scrollHeight;
  for (let y = 0; y < h(); y += 300) { window.scrollTo({top: y, behavior: 'instant'}); window.dispatchEvent(new Event('scroll')); await frame(); }
  await new Promise(r => setTimeout(r, 1900));
  // determinismo: sob carga o watcher de rolagem pode perder um .reveal;
  // o disparo real do .reveal é testado em check-functions.py.
  document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'));
  window.scrollTo({top: 0, behavior: 'instant'});
  document.querySelectorAll('[data-parallax]').forEach(e => e.style.transform = '');
  window.dispatchEvent(new Event('scroll'));
  await frame();
  await new Promise(r => setTimeout(r, 700));
  window.dispatchEvent(new Event('scroll'));
  await frame();
  window.__norvaFreeze = true;
  document.querySelectorAll('.marquee-track').forEach(e => e.style.transform = 'none');
}"""

FINISH = """async () => {
  await new Promise(r => setTimeout(r, 120));
  for (const a of document.getAnimations()) {
    try { if (a.effect && a.effect.getTiming().iterations === Infinity) a.cancel(); else a.finish(); } catch (e) { a.cancel(); }
  }
  await new Promise(r => setTimeout(r, 30));
}"""


def force_state(cdp, pseudo):
    root = cdp.send("DOM.getDocument", {"depth": -1})["root"]["nodeId"]
    ids = cdp.send("DOM.querySelectorAll", {"nodeId": root, "selector": "html, html *"})["nodeIds"]
    for nid in ids:
        cdp.send("CSS.forcePseudoState", {"nodeId": nid, "forcedPseudoClasses": pseudo})


def collect(browser, base, page, width, state):
    mobile = width <= 390
    ctx = browser.new_context(viewport={"width": width, "height": VIEWPORTS[width]}, device_scale_factor=1,
                              is_mobile=mobile, has_touch=mobile,
                              reduced_motion="reduce" if state == "reduced" else "no-preference")
    ctx.add_init_script(RAF_FREEZE_INIT)
    if state != "banner":
        ctx.add_init_script(CONSENT_DECLINED)
    pg = ctx.new_page()
    pg.goto(base + page, wait_until="networkidle")
    pg.evaluate("document.fonts.ready")
    if state == "menu":
        pg.locator(".nav-toggle").click()
    pg.evaluate(SETTLE)
    if state in ("hover", "focus", "active"):
        cdp = ctx.new_cdp_session(pg)
        cdp.send("DOM.enable")
        cdp.send("CSS.enable")
        force_state(cdp, {"hover": ["hover"], "focus": ["focus", "focus-visible", "focus-within"],
                          "active": ["active"]}[state])
    pg.evaluate(FINISH)
    data = pg.evaluate(COLLECT)
    ctx.close()
    return data


def compare(a, b, noise):
    diffs = []
    for k in sorted(set(a) | set(b)):
        if k not in a or k not in b:
            diffs.append((k, "(elemento)", "presente" if k in a else "ausente", "presente" if k in b else "ausente"))
            continue
        for prop, v in a[k].items():
            if (k, prop) in noise:
                continue
            if b[k].get(prop) != v:
                diffs.append((k, prop, v, b[k].get(prop)))
    return diffs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", required=True, help="commit de referência (ex.: a6ffe89)")
    ap.add_argument("--target", help="commit a comparar (padrão: árvore de trabalho)")
    ap.add_argument("--quick", action="store_true")
    ap.add_argument("--widths", help="ex.: 1440,390")
    ap.add_argument("--pages", help="ex.: index.html")
    ap.add_argument("--max", type=int, default=40, help="diferenças mostradas por combinação")
    args = ap.parse_args()
    from playwright.sync_api import sync_playwright

    widths = [1440, 390] if args.quick else list(VIEWPORTS)
    if args.widths:
        widths = [int(x) for x in args.widths.split(",")]
    combos = []
    for page in (args.pages.split(",") if args.pages else PAGES):
        for w in widths:
            states = ["normal", "hover"] if args.quick else ["normal", "hover", "focus", "active"]
            if w == 390 and not args.quick:
                states.append("menu")
            if w == 1440 and not args.quick:
                states.append("reduced")
            if w in (1440, 390) and not args.quick:
                states.append("banner")
            combos += [(page, w, s) for s in states]

    total = 0
    with site_root(args.ref) as ra, site_root(args.target) as rb, serve(ra) as ba, serve(rb) as bb, \
            sync_playwright() as p:
        br = p.chromium.launch()
        for page, w, st in combos:
            a1 = collect(br, ba, page, w, st)
            a2 = collect(br, ba, page, w, st)
            noise = {(k, prop) for k, prop, _, _ in compare(a1, a2, set())}
            b = collect(br, bb, page, w, st)
            d = compare(a1, b, noise)
            total += len(d)
            print(f"{'ok  ' if not d else 'DIFF'} {page} {w}px {st}: {len(a1)} nós, {len(d)} diferenças"
                  + (f" (ruído ignorado: {len(noise)})" if noise else ""))
            byprop = collections.Counter(x[1] for x in d)
            if d:
                print("     por propriedade:", dict(byprop.most_common(12)))
            for k, prop, v1, v2 in d[:args.max]:
                print(f"     {k}  {prop}: {v1!r} -> {v2!r}")
        br.close()
    print(f"\nTotal de diferenças: {total}")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
