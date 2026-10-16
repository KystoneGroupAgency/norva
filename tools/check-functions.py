#!/usr/bin/env python3
"""Check 5 da rede de segurança: funções do site (ROADMAP-REDESIGN.md, 0.2/0.3).

Automatiza o teste "manual" de funções em Chromium (Playwright):
  - carrega index e portal sem erros de console/JS;
  - PT por padrão, troca para EN, recarrega (idioma persiste em kystone_lang)
    e volta para PT; cada [data-i18n] bate com o dicionário do JS;
  - menu mobile (.nav-toggle) abre e fecha em 390px;
  - FAQ (<details>) abre e fecha;
  - contadores [data-to] chegam ao valor final; barras [data-bars] preenchem;
  - .reveal entram em cena ao rolar; marquee anda; escultura WebGL inicializa;
  - formulário HubSpot: mesmo endpoint e mesmos campos. A requisição é
    INTERCEPTADA e respondida localmente: nada é enviado ao HubSpot;
  - banner de cookies aparece na primeira visita e some ao aceitar.

Uso: python3 tools/check-functions.py [--ref <commit>]
Saída 0 = tudo PASS.
"""
import argparse
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import CONSENT_DECLINED, serve, site_root  # noqa: E402

HUBSPOT = "https://api.hsforms.com/submissions/v3/integration/submit/51846094/b42a3450-04db-45d6-abf7-0530c8ad8724"
HS_FIELDS = ["firstname", "lastname", "email", "company", "servico", "mensagem"]

results = []


def ok(name, cond, detail=""):
    results.append((name, bool(cond)))
    print(("  PASS " if cond else "  FAIL ") + name + (f"  -> {detail}" if (detail and not cond) else ""))


def load_dicts(root):
    here = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, here)
    import importlib.util
    spec = importlib.util.spec_from_file_location("cp", os.path.join(here, "check-preservation.py"))
    cp = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(cp)
    return cp.js_dicts(root)


I18N_MISMATCH = """([dict]) => {
  const bad = [];
  const t = document.createElement('div');
  const canon = v => { t.innerHTML = v; return t.innerHTML; };  // & -> &amp; etc.
  document.querySelectorAll('[data-i18n]').forEach(n => {
    const k = n.getAttribute('data-i18n');
    if (k in dict && n.innerHTML !== canon(dict[k])) bad.push(k);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(n => {
    const k = n.getAttribute('data-i18n-ph');
    if (k in dict && n.getAttribute('placeholder') !== dict[k]) bad.push('ph:' + k);
  });
  return bad;
}"""


def scroll_through(pg):
    h = pg.evaluate("document.documentElement.scrollHeight")
    y = 0
    while y < h:
        pg.evaluate(f"window.scrollTo({{top:{y},behavior:'instant'}})")
        pg.wait_for_timeout(60)
        y += 400
        h = pg.evaluate("document.documentElement.scrollHeight")


def run(root):
    from playwright.sync_api import sync_playwright
    dicts = load_dicts(root)
    with serve(root) as base, sync_playwright() as p:
        b = p.chromium.launch()
        for page, jsf in (("index.html", "app.js"), ("portal.html", "portal-page.js")):
            tag = page.split(".")[0]
            PT, EN = dicts[jsf]["PT"], dicts[jsf]["EN"]
            print(f"\n{page}")
            # ---------- desktop ----------
            ctx = b.new_context(viewport={"width": 1440, "height": 900})
            ctx.add_init_script(CONSENT_DECLINED)
            pg = ctx.new_page()
            errs = []
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(base + page, wait_until="networkidle")
            pg.wait_for_timeout(500)
            ok(f"{tag}: html lang pt-BR por padrão", pg.get_attribute("html", "lang") == "pt-BR")
            bad = pg.evaluate(I18N_MISMATCH, [PT])
            ok(f"{tag}: textos PT batem com o dicionário PT", not bad, bad[:5])
            pg.locator('.lang button[data-lang="en"]').first.click(force=True)
            pg.wait_for_timeout(200)
            bad = pg.evaluate(I18N_MISMATCH, [EN])
            ok(f"{tag}: EN aplica o dicionário EN", pg.get_attribute("html", "lang") == "en" and not bad, bad[:5])
            pg.reload(wait_until="networkidle")
            pg.wait_for_timeout(300)
            ok(f"{tag}: EN persiste após recarregar",
               pg.get_attribute("html", "lang") == "en" and pg.evaluate("localStorage.getItem('kystone_lang')") == "en")
            pg.locator('.lang button[data-lang="pt"]').first.click(force=True)
            pg.wait_for_timeout(200)
            ok(f"{tag}: volta para PT", pg.get_attribute("html", "lang") == "pt-BR"
               and not pg.evaluate(I18N_MISMATCH, [PT]) and pg.evaluate("localStorage.getItem('kystone_lang')") == "pt")

            scroll_through(pg)
            pg.wait_for_timeout(1900)
            pending = pg.evaluate("[...document.querySelectorAll('.reveal:not(.in)')].filter(e=>e.offsetParent!==null).length")
            ok(f"{tag}: todos os .reveal visíveis entram em cena", pending == 0, f"{pending} sem .in")
            bars = pg.evaluate("""[...document.querySelectorAll('[data-bars] .bar-fill,[data-bars] .engage-line .fill')]
                .filter(f=>f.offsetParent!==null).map(f=>[f.dataset.w, f.style.width])""")
            ok(f"{tag}: barras [data-bars] preenchidas", all(w is None or s == f"{w}%" for w, s in bars), bars[:4])
            counters = pg.evaluate("""[...document.querySelectorAll('[data-to]')].filter(e=>e.offsetParent!==null).map(e=>[
                e.textContent, (e.dataset.prefix||'') + parseFloat(e.dataset.to).toFixed(parseInt(e.dataset.dec||'0',10)) + (e.dataset.suffix||'')])""")
            ok(f"{tag}: contadores [data-to] chegam ao valor final ({len(counters)})", all(a == e for a, e in counters), counters)

            if tag == "index":
                det = pg.locator("#faq details").first
                det.locator("summary").click()
                pg.wait_for_timeout(150)
                opened = det.evaluate("d=>d.open")
                det.locator("summary").click()
                pg.wait_for_timeout(150)
                ok("index: FAQ <details> abre e fecha", opened and not det.evaluate("d=>d.open"))
                mq1 = pg.evaluate("getComputedStyle(document.querySelector('.marquee-track')).transform")
                pg.wait_for_timeout(500)
                mq2 = pg.evaluate("getComputedStyle(document.querySelector('.marquee-track')).transform")
                ok("index: marquee em movimento", mq1 != mq2)
                pg.evaluate("window.scrollTo({top:0,behavior:'instant'})")
                pg.wait_for_timeout(300)
                sc = pg.evaluate("""(()=>{const c=document.querySelector('canvas[data-hero-sculpture]');
                    return c && {w:c.width,h:c.height,fb:c.classList.contains('is-fallback')}})()""")
                ok("index: escultura WebGL inicializa (canvas com tamanho)", sc and sc["w"] > 0 and sc["h"] > 0, sc)

                # formulário: intercepta HubSpot, nada sai da máquina
                captured = []

                def hs(route, request):
                    captured.append({"url": request.url, "method": request.method, "body": request.post_data})
                    route.fulfill(status=200, content_type="application/json", body="{}")
                ctx.route("**/api.hsforms.com/**", hs)
                f = pg.locator("#contactForm")
                f.scroll_into_view_if_needed()
                f.locator('input[name="name"]').fill("Teste QA Norva")
                f.locator('input[name="company"]').fill("QA")
                f.locator('input[name="email"]').fill("qa@example.com")
                sel = f.locator('select[name="servico"]')
                opts = sel.locator("option").evaluate_all("os=>os.map(o=>o.value).filter(Boolean)")
                if opts:
                    sel.select_option(opts[0])
                f.locator('textarea[name="mensagem"]').fill("teste automatizado - interceptado, não enviado")
                f.locator('input[name="consent"]').check(force=True)
                f.locator('button[type="submit"]').click(force=True)
                pg.wait_for_timeout(800)
                good = False
                detail = captured
                if captured:
                    c = captured[0]
                    body = json.loads(c["body"] or "{}")
                    names = [x["name"] for x in body.get("fields", [])]
                    good = c["url"] == HUBSPOT and c["method"] == "POST" and names == HS_FIELDS \
                        and body["fields"][0]["value"] == "Teste" and "legalConsentOptions" in body
                    detail = (c["url"], names)
                ok("index: formulário HubSpot (mesmo endpoint e campos; interceptado)", good, detail)
                ok("index: mensagem de sucesso aparece", pg.evaluate("document.getElementById('formSuccess').classList.contains('show')"))
            ok(f"{tag}: sem erros de console/JS (desktop)", not errs, errs[:5])
            ctx.close()

            # ---------- mobile ----------
            ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
            ctx.add_init_script(CONSENT_DECLINED)
            pg = ctx.new_page()
            merrs = []
            pg.on("pageerror", lambda e: merrs.append(str(e)))
            pg.goto(base + page, wait_until="networkidle")
            pg.wait_for_timeout(400)
            t = pg.locator(".nav-toggle")
            ok(f"{tag}: menu mobile visível em 390px", t.is_visible())
            t.click()
            pg.wait_for_timeout(250)
            opened = pg.evaluate("document.querySelector('.nav').classList.contains('menu-open') && document.body.classList.contains('menu-lock')")
            t.click()
            pg.wait_for_timeout(250)
            closed = pg.evaluate("!document.querySelector('.nav').classList.contains('menu-open') && !document.body.classList.contains('menu-lock')")
            ok(f"{tag}: menu mobile abre e fecha", opened and closed)
            ok(f"{tag}: sem rolagem horizontal em 390px", pg.evaluate("document.documentElement.scrollWidth<=window.innerWidth"))
            ok(f"{tag}: sem erros JS (mobile)", not merrs, merrs[:5])
            ctx.close()

            # ---------- banner de cookies (primeira visita) ----------
            ctx = b.new_context(viewport={"width": 1440, "height": 900})
            pg = ctx.new_page()
            pg.goto(base + page, wait_until="networkidle")
            pg.wait_for_timeout(700)
            ban = pg.locator("#norva-cookie-consent")
            vis = ban.is_visible()
            pg.locator('[data-ncc="accept"]').click()
            pg.wait_for_timeout(200)
            st = pg.evaluate("localStorage.getItem('norva_cookie_consent')") or "{}"
            ok(f"{tag}: banner de cookies aparece e aceita", vis and not ban.is_visible() and json.loads(st).get("value") == "accepted")
            ctx.close()
        b.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref")
    args = ap.parse_args()
    with site_root(args.ref) as root:
        run(root)
    failed = [n for n, c in results if not c]
    print(f"\nFunções: {len(results) - len(failed)}/{len(results)} PASS")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
