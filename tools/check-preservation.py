#!/usr/bin/env python3
"""Rede de segurança do redesign da Norva (ROADMAP-REDESIGN.md, seção 0.3).

Compara o site atual com o baseline salvo em tools/baseline/preservation.json:

  1. Textos      texto visível (HTML cru e renderizado em PT e EN), chaves
                 data-i18n / data-i18n-ph, atributos de texto (alt, aria-label,
                 title, placeholder) e os dicionários PT e EN de app.js e
                 portal-page.js.                                  -> diff vazio
  2. Estrutura   ordem de section[id], header, footer, h1-h4 e todos os ids.
                                                                  -> idêntica
  3. Links       todos os href, src, srcset e action (e URLs dentro dos JS).
                 O ?v= de cache é ignorado. Só são aceitas imagens novas.
                 Folhas de estilo locais são informativas (a Fase 1 mexe nelas).
                                                                  -> idêntica
  4. SEO         <title>, lang, todas as <meta>, canonical, JSON-LD,
                 robots.txt e sitemap.xml (sem <lastmod>).        -> idêntico
  5. Funções     tools/check-functions.py (PT/EN + persistência, menu mobile,
                 FAQ, contadores, barras, escultura, marquee, formulário
                 HubSpot sem envio real, banner de cookies).      -> tudo PASS

Uso:
  python3 tools/check-preservation.py                 # compara com o baseline
  python3 tools/check-preservation.py --skip-functions
  python3 tools/check-preservation.py --write-baseline --ref a6ffe89
  python3 tools/check-preservation.py --allow-seo-additions   # só p/ adições aprovadas

Requer: python3 com playwright (chromium), beautifulsoup4; node no PATH.
Saída 0 = 5/5 verde.
"""
import argparse
import difflib
import json
import os
import re
import subprocess
import sys

from bs4 import BeautifulSoup, Comment

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import BASELINE, CONSENT_DECLINED, PAGES, TOOLS, git_rev, serve, site_root  # noqa: E402

BASELINE_FILE = os.path.join(BASELINE, "preservation.json")
JS_DICT_FILES = ["app.js", "portal-page.js"]
SKIP_TEXT_PARENTS = {"script", "style", "noscript", "template", "head"}
TEXT_ATTRS = ["alt", "aria-label", "title", "placeholder"]
IMG_EXT = re.compile(r"\.(avif|webp|jpe?g|png|gif|svg)(\?.*)?$", re.I)
NODE_DICT = r"""
const fs = require('fs');
const out = {};
for (const f of process.argv.slice(1)) {
  const s = fs.readFileSync(f, 'utf8');
  out[f] = {};
  for (const name of ['PT', 'EN']) {
    const a = s.indexOf('var ' + name + ' = {');
    if (a < 0) { out[f][name] = null; continue; }
    const b = s.indexOf('\n  };', a);
    const src = s.slice(s.indexOf('{', a), b + 4);
    out[f][name] = (0, eval)('(' + src + ')');
  }
}
process.stdout.write(JSON.stringify(out));
"""

RENDER_JS = """() => {
  const i18n = [...document.querySelectorAll('[data-i18n]')].map(n => [n.getAttribute('data-i18n'), n.innerHTML]);
  const ph = [...document.querySelectorAll('[data-i18n-ph]')].map(n => [n.getAttribute('data-i18n-ph'), n.getAttribute('placeholder')]);
  return { lang: document.documentElement.lang, innerText: document.body.innerText, i18n, ph };
}"""


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def strip_v(url):
    """Remove o ?v=N de cache-busting de assets locais."""
    if re.match(r"^[a-z]+:", url) or url.startswith("//"):
        return url
    return re.sub(r"\?v=[^&#]*$", "", url)


def static_page(path):
    soup = BeautifulSoup(open(path, encoding="utf-8").read(), "html.parser")
    body = soup.body
    texts = []
    for node in body.find_all(string=True):
        if isinstance(node, Comment):
            continue
        if any(p.name in SKIP_TEXT_PARENTS for p in node.parents):
            continue
        t = norm(str(node))
        if t:
            texts.append(t)
    attrs = []
    for el in soup.find_all(True):
        for a in TEXT_ATTRS:
            if el.has_attr(a):
                attrs.append(f"{el.name}@{a}={norm(el[a])}")
    i18n = [f"{el.name}[data-i18n={el['data-i18n']}]" for el in soup.find_all(attrs={"data-i18n": True})]
    i18n += [f"{el.name}[data-i18n-ph={el['data-i18n-ph']}]" for el in soup.find_all(attrs={"data-i18n-ph": True})]

    structure = []
    for el in body.find_all(["section", "header", "footer", "h1", "h2", "h3", "h4"]):
        if el.name == "section":
            if el.has_attr("id"):
                structure.append(f"section#{el['id']}")
        elif el.name in ("header", "footer"):
            structure.append(el.name + (f"#{el['id']}" if el.has_attr("id") else ""))
        else:
            key = el.get("data-i18n")
            structure.append(f"{el.name}[{key}]" if key else f"{el.name}:{norm(el.get_text())[:60]}")
    ids = [el["id"] for el in soup.find_all(attrs={"id": True})]

    links, styles = [], []
    for el in soup.find_all(True):
        for a in ("href", "src", "action", "srcset", "poster", "data-src"):
            if not el.has_attr(a):
                continue
            v = el[a]
            if el.name == "link" and "stylesheet" in (el.get("rel") or []) and not re.match(r"^https?:", v):
                styles.append(strip_v(v))
                continue
            links.append(f"{el.name}@{a}={strip_v(v)}")

    head = soup.head
    metas = []
    for m in head.find_all("meta"):
        metas.append(" ".join(f'{k}="{m[k]}"' for k in sorted(m.attrs)))
    seo_links = [f'{",".join(l.get("rel", []))}={l.get("href")}' + (f' hreflang={l["hreflang"]}' if l.has_attr("hreflang") else "")
                 for l in head.find_all("link") if set(l.get("rel", [])) & {"canonical", "alternate"}]
    ldjson = [json.dumps(json.loads(s.string), sort_keys=True, ensure_ascii=False)
              for s in soup.find_all("script", attrs={"type": "application/ld+json"})]
    seo = {
        "title": norm(head.title.get_text()) if head.title else None,
        "html_lang": soup.html.get("lang"),
        "meta": metas,
        "links": seo_links,
        "ld_json": ldjson,
    }
    return {"text": texts, "text_attrs": attrs, "i18n_keys": i18n}, {"order": structure, "ids": ids}, \
        {"links": links, "stylesheets": styles}, seo


def js_dicts(root):
    files = [os.path.join(root, f) for f in JS_DICT_FILES]
    out = subprocess.run(["node", "-e", NODE_DICT, *files], check=True, capture_output=True, text=True).stdout
    data = json.loads(out)
    return {os.path.basename(k): v for k, v in data.items()}


def js_urls(root):
    urls = {}
    for f in sorted(os.listdir(root)):
        if f.endswith(".js"):
            s = open(os.path.join(root, f), encoding="utf-8").read()
            urls[f] = sorted(set(re.findall(r"https?://[^\s'\"`)<>]+", s)))
    return urls


def rendered(root):
    from playwright.sync_api import sync_playwright
    res = {}
    with serve(root) as base, sync_playwright() as p:
        b = p.chromium.launch()
        for page in PAGES:
            ctx = b.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
            ctx.add_init_script(CONSENT_DECLINED)
            pg = ctx.new_page()
            pg.goto(base + page, wait_until="networkidle")
            pg.wait_for_timeout(300)
            r = {"pt": pg.evaluate(RENDER_JS)}
            pg.locator('.lang button[data-lang="en"]').first.click(force=True)
            pg.wait_for_timeout(200)
            r["en"] = pg.evaluate(RENDER_JS)
            ctx.close()
            res[page] = r
        b.close()
    return res


def snapshot(root, render=True):
    snap = {"text": {}, "structure": {}, "links": {}, "seo": {}}
    for page in PAGES:
        t, s, l, seo = static_page(os.path.join(root, page))
        snap["text"][page] = t
        snap["structure"][page] = s
        snap["links"][page] = l
        snap["seo"][page] = seo
    snap["text"]["js_dicts"] = js_dicts(root)
    snap["links"]["js_urls"] = js_urls(root)
    snap["seo"]["robots.txt"] = open(os.path.join(root, "robots.txt"), encoding="utf-8").read()
    sm = open(os.path.join(root, "sitemap.xml"), encoding="utf-8").read()
    snap["seo"]["sitemap.xml"] = re.sub(r"<lastmod>[^<]*</lastmod>", "<lastmod/>", sm)
    if render:
        snap["text"]["rendered"] = rendered(root)
    return snap


def lines(obj):
    return json.dumps(obj, indent=1, ensure_ascii=False, sort_keys=True).splitlines()


def diff(a, b, label):
    d = list(difflib.unified_diff(lines(a), lines(b), f"baseline:{label}", f"atual:{label}", n=2, lineterm=""))
    return d


def check_links(base, cur):
    """Links idênticos, exceto imagens novas (Fase 5). Folhas de estilo locais: informativo."""
    problems, info = [], []
    for page in PAGES:
        bl, cl = base[page]["links"], cur[page]["links"]
        non_img = lambda xs: [x for x in xs if not IMG_EXT.search(x.split("=", 1)[1])]
        img = lambda xs: [x for x in xs if IMG_EXT.search(x.split("=", 1)[1])]
        if non_img(bl) != non_img(cl):
            problems += diff(non_img(bl), non_img(cl), f"{page} links")
        missing = [x for x in img(bl) if x not in img(cl)]
        if missing:
            problems.append(f"{page}: imagens removidas: {missing}")
        added = [x for x in img(cl) if x not in img(bl)]
        if added:
            info.append(f"{page}: imagens novas (permitido): {added}")
        if base[page]["stylesheets"] != cur[page]["stylesheets"]:
            info.append(f"{page}: folhas de estilo {base[page]['stylesheets']} -> {cur[page]['stylesheets']}")
    if base["js_urls"] != cur["js_urls"]:
        problems += diff(base["js_urls"], cur["js_urls"], "URLs nos JS")
    return problems, info


def check_seo(base, cur, allow_add):
    problems, info = [], []
    for page in PAGES:
        b, c = base[page], cur[page]
        for k in ("title", "html_lang", "links", "ld_json"):
            if b[k] != c[k]:
                problems += diff(b[k], c[k], f"{page} {k}")
        removed = [m for m in b["meta"] if m not in c["meta"]]
        added = [m for m in c["meta"] if m not in b["meta"]]
        if removed:
            problems.append(f"{page}: meta removida/alterada: {removed}")
        if added:
            (info if allow_add else problems).append(f"{page}: meta adicionada: {added}")
    for f in ("robots.txt", "sitemap.xml"):
        if base[f] != cur[f]:
            problems += diff(base[f], cur[f], f)
    return problems, info


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--write-baseline", action="store_true", help="grava o baseline em vez de comparar")
    ap.add_argument("--ref", help="commit git a usar (padrão: árvore de trabalho)")
    ap.add_argument("--skip-functions", action="store_true", help="não roda o check 5 (funções)")
    ap.add_argument("--no-render", action="store_true", help="não renderiza no navegador (só HTML cru)")
    ap.add_argument("--allow-seo-additions", action="store_true", help="aceita <meta> novas (adições aprovadas)")
    ap.add_argument("-v", "--verbose", action="store_true", help="mostra o diff completo")
    args = ap.parse_args()

    with site_root(args.ref) as root:
        snap = snapshot(root, render=not args.no_render)

    if args.write_baseline:
        os.makedirs(BASELINE, exist_ok=True)
        snap["_meta"] = {"commit": git_rev(args.ref or "HEAD"), "source": args.ref or "worktree"}
        json.dump(snap, open(BASELINE_FILE, "w", encoding="utf-8"), indent=1, ensure_ascii=False, sort_keys=True)
        print(f"baseline gravado em {os.path.relpath(BASELINE_FILE)} (commit {snap['_meta']['commit']})")
        return 0

    base = json.load(open(BASELINE_FILE, encoding="utf-8"))
    print(f"Baseline: commit {base.get('_meta', {}).get('commit')}  |  atual: {args.ref or 'árvore de trabalho'} ({git_rev(args.ref or 'HEAD')})")
    if args.no_render:
        base["text"].pop("rendered", None)

    results = []

    def report(n, name, problems, info=()):
        ok = not problems
        results.append(ok)
        print(f"\n[{'PASS' if ok else 'FAIL'}] {n}. {name}")
        for i in info:
            print("   info:", i)
        shown = problems if args.verbose else problems[:80]
        for p in shown:
            print("   ", p)
        if len(problems) > len(shown):
            print(f"    … mais {len(problems) - len(shown)} linhas (use -v)")

    report(1, "Textos (HTML cru, renderizado PT/EN, chaves i18n, dicionários PT/EN)",
           diff(base["text"], snap["text"], "textos") if base["text"] != snap["text"] else [])
    report(2, "Estrutura (seções, header/footer, h1-h4, ids)",
           diff(base["structure"], snap["structure"], "estrutura") if base["structure"] != snap["structure"] else [])
    report(3, "Links (href/src/srcset/action e URLs nos JS)", *check_links(base["links"], snap["links"]))
    report(4, "SEO (title, lang, meta, canonical, JSON-LD, robots, sitemap)",
           *check_seo(base["seo"], snap["seo"], args.allow_seo_additions))

    if args.skip_functions:
        print("\n[SKIP] 5. Funções (use sem --skip-functions)")
    else:
        cmd = [sys.executable, os.path.join(TOOLS, "check-functions.py")] + (["--ref", args.ref] if args.ref else [])
        print("\n[....] 5. Funções -> " + " ".join(os.path.relpath(c) if c.startswith("/") else c for c in cmd[1:]))
        rc = subprocess.run(cmd).returncode
        results.append(rc == 0)
        print(f"[{'PASS' if rc == 0 else 'FAIL'}] 5. Funções")

    total = 5 if not args.skip_functions else 4
    print(f"\nResultado: {sum(results)}/{total} verdes")
    return 0 if all(results) else 1


if __name__ == "__main__":
    sys.exit(main())
