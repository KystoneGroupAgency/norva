#!/usr/bin/env python3
"""Capturas de referência para a paridade visual (ROADMAP-REDESIGN.md, Fase 0).

Para index e portal, em 1440, 1024, 768 e 390px, em PT e EN:
  <page>-<lang>-<w>.png        página inteira, banner de cookies escondido
  <page>-<lang>-<w>-fold.png   primeira dobra com o banner de cookies visível

Para ficar determinístico: rola a página inteira (dispara .reveal, contadores
e barras), espera as animações, volta ao topo, congela os requestAnimationFrame (paralaxe, marquee) e
captura com animations="disabled". Os <canvas> (escultura WebGL e gráficos
do painel escondido) ficam invisíveis, porque mudam a cada quadro.

Uso:
  python3 tools/screenshots.py --out tools/out/shots              # árvore atual
  python3 tools/screenshots.py --out tools/baseline/shots --ref a6ffe89
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import CONSENT_DECLINED, PAGES, serve, site_root  # noqa: E402

VIEWPORTS = {1440: 900, 1024: 768, 768: 1024, 390: 844}
LANGS = ["pt", "en"]
FREEZE_CSS = (".marquee-track{transform:none!important;will-change:auto!important}"
              " canvas{visibility:hidden!important} *{caret-color:transparent!important}")


# Depois de "assentar" a página, congela os rAF (paralaxe, marquee, escultura):
# a captura de página inteira dispara resize e a paralaxe recalcularia em
# momento aleatório. Contadores e barras já terminaram antes do congelamento.
RAF_FREEZE_INIT = """(() => { const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => window.__norvaFreeze ? 0 : raf(cb); })();"""


def freeze(pg):
    pg.add_style_tag(content=FREEZE_CSS)
    pg.evaluate("new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))")
    pg.evaluate("window.__norvaFreeze = true")
    pg.wait_for_timeout(100)


def settle(pg):
    pg.evaluate("document.fonts.ready")
    h = pg.evaluate("document.documentElement.scrollHeight")
    y = 0
    while y < h:
        pg.evaluate(f"window.scrollTo({{top:{y},behavior:'instant'}})")
        pg.wait_for_timeout(50)
        y += 300
        h = pg.evaluate("document.documentElement.scrollHeight")
    pg.wait_for_timeout(1900)  # contadores: 1600 ms
    pg.evaluate("window.scrollTo({top:0,behavior:'instant'})")
    # paralaxe: elementos fora da faixa guardam o valor da rolagem anterior.
    # Zera e deixa o app.js recalcular a partir do topo (= estado de carga).
    pg.evaluate("""document.querySelectorAll('[data-parallax]').forEach(e => e.style.transform = '');
                   window.dispatchEvent(new Event('scroll'))""")
    pg.wait_for_timeout(700)   # transições de .reveal e da nav
    freeze(pg)


def capture(root, out, widths=None, langs=None, pages=None):
    from playwright.sync_api import sync_playwright
    os.makedirs(out, exist_ok=True)
    files = []
    with serve(root) as base, sync_playwright() as p:
        b = p.chromium.launch()
        for page in pages or PAGES:
            tag = page.split(".")[0]
            for lang in langs or LANGS:
                for w in widths or VIEWPORTS:
                    vp = {"width": w, "height": VIEWPORTS[w]}
                    mobile = w <= 390
                    for fold in (False, True):
                        ctx = b.new_context(viewport=vp, device_scale_factor=1, is_mobile=mobile, has_touch=mobile)
                        ctx.add_init_script(RAF_FREEZE_INIT)
                        ctx.add_init_script(f"try{{localStorage.setItem('kystone_lang','{lang}')}}catch(e){{}}")
                        if not fold:
                            ctx.add_init_script(CONSENT_DECLINED)
                        pg = ctx.new_page()
                        pg.goto(base + page, wait_until="networkidle")
                        if fold:
                            pg.evaluate("document.fonts.ready")
                            pg.wait_for_timeout(1500)
                            freeze(pg)
                        else:
                            settle(pg)
                        name = f"{tag}-{lang}-{w}{'-fold' if fold else ''}.png"
                        path = os.path.join(out, name)
                        pg.screenshot(path=path, full_page=not fold, animations="disabled", caret="hide")
                        files.append(path)
                        print("  ", name)
                        ctx.close()
        b.close()
    return files


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--ref")
    ap.add_argument("--widths", help="ex.: 1440,390")
    ap.add_argument("--pages", help="ex.: index.html")
    args = ap.parse_args()
    widths = [int(x) for x in args.widths.split(",")] if args.widths else None
    with site_root(args.ref) as root:
        capture(root, args.out, widths=widths, pages=args.pages.split(",") if args.pages else None)


if __name__ == "__main__":
    main()
