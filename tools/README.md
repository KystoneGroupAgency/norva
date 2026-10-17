# tools/ — rede de segurança do redesign (só desenvolvimento)

Nada desta pasta é carregado pelas páginas, e o `.vercelignore` a exclui do
deploy. Ela implementa a seção 0.3 e a Fase 0 do `ROADMAP-REDESIGN.md`.

## Requisitos
- Python 3.10+ com `playwright` (e `python -m playwright install chromium`),
  `beautifulsoup4`, `pillow` e `numpy`
- Node 18+ (para ler os dicionários PT/EN dos JS)
- Lighthouse só para `lighthouse.py` (`npx lighthouse` ou `LIGHTHOUSE=/caminho/bin`)

```bash
python3 -m venv .venv && .venv/bin/pip install playwright beautifulsoup4 pillow numpy
.venv/bin/python -m playwright install chromium
export PYTHON=.venv/bin/python   # usado pelos scripts .sh
```

## Baseline
O baseline é o commit **`a6ffe89`** (`main` depois do banner de cookies, do
HTML em português e do LinkedIn). O roadmap citava `04794f3`, mas esse commit
é anterior às decisões de conteúdo já aprovadas e publicadas; comparar com ele
acusaria essas mudanças como regressão.

| Arquivo | Conteúdo |
|---|---|
| `baseline/preservation.json` | textos, estrutura, links e SEO de `a6ffe89` |
| `baseline/shots/` | capturas de `a6ffe89`: index e portal, 1440/1024/768/390px, PT e EN, página inteira e primeira dobra com o banner |
| `baseline/lighthouse.md` | métricas Lighthouse de referência |

## Os cinco checks (toda fase termina com 5/5 verdes)
```bash
$PYTHON tools/check-preservation.py          # checks 1-4 + roda o 5 (check-functions.py)
$PYTHON tools/check-preservation.py -v       # diff completo quando algo falha
```
1. **Textos** — texto do HTML cru, texto renderizado em PT e EN, chaves
   `data-i18n`/`data-i18n-ph`, `alt`/`aria-label`/`title`/`placeholder` e os
   dicionários `PT`/`EN` de `app.js` e `portal-page.js`.
2. **Estrutura** — ordem de `section[id]`, `header`, `footer`, `h1`–`h4`; todos os ids.
3. **Links** — todos os `href`/`src`/`srcset`/`action` e as URLs dentro dos JS
   (endpoint do HubSpot incluído). O `?v=` de cache é ignorado; folhas de
   estilo locais aparecem como informação (a Fase 1 reorganiza o CSS).
   Só imagens novas são aceitas (Fase 5).
4. **SEO** — `<title>`, `lang`, todas as `<meta>`, canonical, JSON-LD,
   `robots.txt`, `sitemap.xml` (sem `<lastmod>`). Adições aprovadas: `--allow-seo-additions`.
5. **Funções** — `check-functions.py`: PT→EN→recarregar→PT, menu mobile, FAQ,
   contadores, barras, `.reveal`, marquee, escultura, formulário HubSpot
   (requisição **interceptada**, nada é enviado), banner de cookies.

## Paridade visual
```bash
tools/screenshots-all.sh tools/out/shots                     # capturas da árvore atual (paralelo)
$PYTHON tools/visual-diff.py tools/baseline/shots tools/out/shots --diff-out tools/out/diff
tools/style-diff-all.sh a6ffe89                              # estilos computados: commit x árvore
```
- `visual-diff.py` conta pixels diferentes por captura e grava a imagem do diff.
  Por padrão ignora anti-aliasing/subpixel (tolerância de 32 por canal) e só
  acusa capturas com mais de 0,05% de pixels diferentes, ou seja, mudança
  visível. Ruído conhecido entre duas execuções do mesmo commit: ~20 px na
  borda do seletor PT/EN (`.lang`) e até ~0,012% de deslocamento de subpixel
  nos cards de stack com paralaxe (768/1024px).
- `style-diff.py` compara `getComputedStyle` de todos os elementos e
  pseudo-elementos nos estados normal, hover, focus, active, menu mobile aberto
  e reduced-motion. É a prova de que uma refatoração de CSS não muda nada.

## Lighthouse
```bash
$PYTHON tools/lighthouse.py --out tools/out/lh                 # árvore atual, servida localmente
$PYTHON tools/lighthouse.py --out tools/out/lh --ref a6ffe89   # um commit
$PYTHON tools/lighthouse.py --out tools/out/lh-prod --url https://www.norva.cloud/
```
