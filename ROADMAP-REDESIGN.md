# Roadmap de redesign da Norva: do site atual ao nível Awwwards

> Documento de planejamento. Nenhum código do site foi alterado para escrever este roadmap.
> A base é a leitura do repositório (`index.html`, `portal.html`, os seis CSS e os três JS, no commit `04794f3`) e a análise do HTML e do CSS ao vivo de 12 sites premiados no Awwwards (lista completa em `norva-referencias-design.md`).
> A identidade da Norva fica como está: fundo claro, azul `#2f6bff` como cor principal, Space Grotesk, Manrope e Space Mono, e HTML, CSS e JS puros, sem framework e sem build.

---

## 0. Regras de implementação (obrigatórias)

### 0.1 Um commit por melhoria
- Cada melhoria que já funciona sozinha vira **um commit separado e lógico**. Nada de commit "redesign geral".
- A mensagem segue o padrão do histórico (`feat:`, `fix:`, …) com escopo e um corpo que explica **o que mudou e por quê**:
  ```
  refactor(css): unifica tokens de cor em um único :root

  O quê: move --ex-bg, --ex-ink e --ex-blue (exhibition.css) para o :root de
  styles.css e remove a redefinição duplicada.
  Por quê: hoje existem duas paletas concorrentes (#f6f7fb e #f1f3ef) e o
  visual depende da ordem de carga. A paridade visual foi conferida por
  captura de tela antes e depois.
  ```
- Um commit nunca mistura fase, página ou assunto. Cada um precisa poder ser revertido sozinho (`git revert`) sem quebrar o site.
- A lista de commits sugeridos aparece no fim de cada fase.

### 0.2 Preservar todo o conteúdo e todas as funções
O redesign é **visual e técnico**. É proibido:
- remover ou alterar textos, tanto em inglês (inline no HTML) quanto em português (dicionário `PT` em `app.js` e `portal-page.js`), além das chaves `data-i18n` e `data-i18n-ph`;
- mudar a estrutura de informação, ou seja, a ordem e os ids das seções (`#services`, `#approach`, `#impact`, `#portal`, `#journey`, `#engagement`, `#security`, `#team`, `#stack`, `#faq`, `#about`, `#contact`, além de `#overview`, `#problem`, `#how`, `#studio`, `#features`, `#beyond` e `#licensing` no portal);
- quebrar funções: seletor PT/EN (`setLang`, chave `kystone_lang` no localStorage), formulário HubSpot (mesmo endpoint e mesmos campos), escultura WebGL (`hero-sculpture.js`), marquee, contadores (`data-to`), barras (`data-bars`), FAQ com `<details>` e menu mobile (`.nav-toggle`);
- alterar SEO: os blocos JSON-LD (ProfessionalService, WebSite/WebPage e FAQPage), as metas, o canonical, o `robots.txt` e o `sitemap.xml`. **Adicionar** é permitido (por exemplo, `og:image`). Remover ou editar o que existe, não.
- Elementos que hoje estão escondidos por CSS continuam no DOM e escondidos. Isso vale para `.hero .panel`, os links do menu 5 e 6 (Security e FAQ), `.svc-ico`, `.pfeat-ico` e os demais. Mudar isso é decisão de conteúdo, não de design (veja a seção 4).

### 0.3 Verificação de preservação em todas as fases
A Fase 0 cria o script `tools/check-preservation` (Python ou shell, só para desenvolvimento e fora do site publicado). Ele compara o estado atual com um baseline salvo em `tools/baseline/`:
1. **Textos:** extrai o texto visível e todas as chaves `data-i18n` de `index.html` e `portal.html`, mais o objeto `PT` de `app.js` e `portal-page.js`. O diff com o baseline precisa ser **vazio**.
2. **Estrutura:** a lista ordenada de `section[id]`, `header`, `footer` e `h1`–`h4` precisa ser **idêntica**.
3. **Links:** a lista de todos os `href`, `src` e `action` precisa ser **idêntica**. Só entram novos assets de imagem, como as versões `.avif` e `.webp` da Fase 5.
4. **SEO:** os blocos `<script type="application/ld+json">`, as `<meta>` e o canonical precisam ser **idênticos**. Só valem adições listadas no commit. `robots.txt` e `sitemap.xml` só mudam no `lastmod`.
5. **Teste manual de funções:** PT para EN e de volta (recarregar mantém o idioma), menu mobile, FAQ, contadores, escultura e formulário. No formulário, confere-se o payload no DevTools sem enviar, ou com um envio de teste combinado com o time.

**Toda fase só termina com os cinco checks verdes.**

### Fora do escopo
- **Banner de consentimento de cookies.** Já é acompanhado em outra frente.
- Qualquer mudança de texto, de oferta ou de estrutura. Essas decisões ficam com o dono, na seção 4.

---

## 1. O que faz os 12 sites serem nível Awwwards (observado, não suposto)

Fontes: CSS e HTML ao vivo baixados em 16/10/2026 (contagens tiradas dos arquivos) e as tags das páginas do Awwwards.

### 1.1 Tipografia
- **Par sans + mono com papéis fixos.** Inkwell (FK Grotesk + FK Grotesk Mono), Spire (Exo + Apercu Mono), Cleo (PP Neue Montreal + Simplon Mono), Collective[i] (Fragment Mono) e Cerebrium (`--font-sans`, `--font-secondary` e `--font-mono` como variáveis). A mono fica só para rótulos, dados e código, nunca para texto corrido.
- **Tracking negativo e consistente nos títulos, com poucos valores.** Collective[i] usa `-.02em` (47 vezes) e `-.04em` (16 vezes). Cleo usa `-.01em` como padrão. Inkwell, `-.01rem` e `-.012rem`. Os rótulos em caixa alta levam tracking positivo fixo: BrainBox usa `.15em` (7 vezes).
- **Entrelinha apertada nos títulos.** Cleo usa line-height de 1,04 a 1,08 em escala. NRG chega a `.8` e `.95`. Cerebrium usa `1` (45 vezes) e `1.05`/`1.07`.
- **Pesos contidos.** Cleo trabalha com variável 450/300, Inkwell com 200/300 e Cerebrium tem o 600 como dominante. Nenhum usa muitos pesos diferentes.
- **Quebra de linha cuidada.** Cleo tem `text-wrap: balance` 115 vezes e `pretty` 120 vezes. Cerebrium e Turn.io também usam.
- **Números tabulares em sites com dados.** Cerebrium, Attio, Collective[i] e Cleo usam `font-variant-numeric: tabular-nums`.

### 1.2 Movimento
- **Uma ou duas curvas de easing repetidas no site todo.** BrainBox usa `cubic-bezier(.4,0,0,1)` 46 vezes. NRG usa `(.55,.1,.26,.995)` 590 vezes e `(.215,.61,.355,1)` 340 vezes. Inkwell, `(.39,.575,.565,1)` 43 vezes. Heron usa `(0.22,1,0.36,1)`, **a mesma curva do `--ease` da Norva**, junto com `(0.16,1,0.3,1)`.
- **Narrativa conduzida pela rolagem.** NRG usa vídeo atrelado ao scroll (ScrollyVideo) em "five simple phases". Inkwell conta 26 etapas numeradas. Heron, Inkwell e Cerebrium têm as tags Awwwards "Scrolling" e "Storytelling". Lenis aparece em Cerebrium, Heron e NRG, e Barba (transição entre páginas) em Heron.
- **Respeito ao `prefers-reduced-motion`, com regras por componente.** Cleo tem 23 regras e Attio, 6. Cleo também prefere `@media (prefers-reduced-motion: no-preference)` para *ativar* animações, em vez de só desligá-las.
- **Microinterações como tag premiada.** Aparecem em Cerebrium, Inkwell, BrainBox, Attio e Spire. Exemplo concreto: o selo "new" com brilho animado na Turn.io (`.badge-new__pill::after`).

### 1.3 Cor
- **Base neutra com um acento único e disciplinado.** Attio usa `#266df0` (um azul quase igual ao da Norva) sobre `#eeeff1`/`#101112`. BrainBox usa `#e62b33` sobre branco e `#17171b`, Heron usa `#fa3600` sobre `#f5f5ed`, e Cerebrium usa `#ff488b` sobre `#f0f4f7`.
- **Paleta de dados separada da paleta de interface.** CLEVER°FRANKE tem escalas `gray1–12` e `blue1–12` em tokens, mais uma paleta categórica para gráficos.

### 1.4 Layout e grid
- **Tamanhos fluidos.** Cerebrium tem 20 `clamp()` e 6 `@container`, com componentes que se adaptam ao próprio espaço. CLEVER°FRANKE usa `clamp()` com `vh`, Attio usa `svh` e Heron dimensiona em `vw`.

### 1.5 Produto e imagem
- **O produto real como prova.** O hero do Attio mostra transcrição, chat "@Attio" e log do agente ("● Ran 3 commands"), e é HTML, não imagem. Cerebrium traz um comparativo de desempenho ("Cerebrium (with snapshots)" × "Provider A" × "EKS/GKE") e casos ("Built with Cerebrium").

### 1.6 Conteúdo e CTAs
- **Resultados em números grandes.** BrainBox ("Our Impact" e "models 90% faster") e Turn.io ("Cut no-shows by 40%", 600k, 567%).
- **Navegação por capítulos ou setores.** Inkwell (Intro, Vision, Intelligence…) e Spire (Weather & Climate, Aviation, Government).
- **CTAs curtos e repetidos.** Cerebrium usa "Get started", Turn.io "Book a Call" e BrainBox "Let's talk". Attio separa dois níveis: "Start for free" e "Talk to sales".

### 1.7 Acabamento e acessibilidade
- **`:focus-visible` estilizado.** Attio (4), Cerebrium (2), CLEVER°FRANKE (3) e Cleo (5).
- **Vidro desfocado na navegação.** Cleo usa `backdrop-filter`.

---

## 2. Diagnóstico da Norva (evidência no código)

| Tema | O que existe hoje | Onde |
|---|---|---|
| Arquitetura de CSS | 6 arquivos que se sobrescrevem em cascata (`styles`, `mobile`, `refinement`, `exhibition` e, no portal, `portal-page` e `portal-exhibition`), com **52 `!important`** (3 + 17 + 19 + 13) | `index.html:142-145`, `portal.html:12-17` |
| Versões de cache | `styles.css?v=4` no index × `?v=3` no portal | idem |
| Paleta | **Duas paletas concorrentes**: `:root` de `styles.css` (`--bg #f6f7fb`, `--text #0e1422`) e `:root` de `exhibition.css` (`--ex-bg #f1f3ef`, `--ex-ink #151b17`). `.gradient-text` é anulado com `!important` | `styles.css:6`, `exhibition.css:7-30` |
| Título do hero | `.hero h1` declarado em **3 arquivos**, com pelo menos 6 tamanhos diferentes (`styles.css:286`, `refinement.css:110/270/348/413`, `exhibition.css:152/714`) e `letter-spacing: -0.078em` | — |
| Escala tipográfica | 121 `clamp()` soltos, sem tokens. Mais de 20 tamanhos em px entre 8 e 17px (`11px` 14 vezes, `10px` 10 vezes, `9.5px`, `15.5px`…). 12 valores de `letter-spacing` | todos os CSS |
| Raio de borda | 10 valores (16, 100, 11, 10, 8, 18, 20, 12, 7, 5px), e `exhibition.css` zera o raio em botões (`border-radius: 0`) | — |
| Fontes | Carrega 4 + 4 + 2 pesos (Space Grotesk e Manrope de 400 a 700, Space Mono 400 e 700) sem `preload`. Há regras com `700`, mas o grosso usa 500 e 600 | `index.html:141` |
| Movimento | Um único `--ease` (o mesmo da Heron, o que é bom), mas mais de 10 durações soltas (0.26s a 2.2s). O "in-view" depende de listener de `scroll` (o comentário diz que IntersectionObserver falha em iframes de preview) | `styles.css:46`, `app.js:387-421` |
| Desperdício | `.hero .panel` está escondido (`refinement.css:52`, `display:none !important`), mas `app.js` segue rodando o gráfico em `requestAnimationFrame` a cada quadro (`app.js:672-677`) e o `setInterval` dos KPIs a cada 2,2 s (`app.js:577`) | — |
| Movimento reduzido | Existe um bloco global em `styles.css:912` e regras em `exhibition.css:852` e nos JS (o que é bom). A escultura já pausa fora da tela via IntersectionObserver (`hero-sculpture.js:185`) | — |
| Acessibilidade | **0 `:focus-visible`**, 0 skip link, 0 `aria-pressed` nos botões PT/EN, 0 `aria-current` no menu. O foco do formulário usa `outline: none` | `styles.css:615` |
| Dados | **0 `tabular-nums`** num site cheio de números (`.kpi .val`, `.bignum .v`, `[data-to]`, `.vnum`) | — |
| Imagens | 7 capturas JPG de 2000px, 1,5 MB no total, sem AVIF/WebP e sem `srcset` | `assets/portal/` |
| SEO social | Sem `og:image` e com `twitter:card` = `summary` | `index.html`, `portal.html` |
| Estilos inline | Títulos com `style="font-family:…;font-size:clamp(…)"` | `index.html:509` (`#approach h2`), `portal.html:249` (`#beyond h2`), além do footer e do `#about` |

---

## 3. Roadmap em fases

> As estimativas são em dias de trabalho de uma pessoa de front-end. Total: **cerca de 13 a 18 dias**.
> A ordem importa: primeiro a fundação (sem mudança visual), depois o sistema visual e, por último, o movimento e o acabamento.

### Fase 0: Rede de segurança e baseline (0,5–1 dia)
**Objetivo:** garantir que nenhuma fase apague conteúdo ou quebre funções.
- Criar `tools/check-preservation` com os cinco checks da seção 0.3 e salvar o baseline do commit `04794f3`.
- Tirar capturas de tela de referência do index e do portal em 1440, 1024, 768 e 390px, nos dois idiomas, em `tools/baseline/shots/`.
- Rodar o Lighthouse (mobile e desktop) e guardar os números em `tools/baseline/lighthouse.md`.
- Garantir que `tools/` não seja publicado (verificar a configuração da Vercel ou usar `.vercelignore`).

**Aceite:** o script roda e dá diff vazio contra o próprio baseline, e as capturas e o Lighthouse estão registrados.
**Commits:**
1. `chore(tools): adiciona script de verificação de preservação de conteúdo`
2. `chore(tools): registra baseline de textos, estrutura, links e SEO`
3. `chore(tools): registra capturas e métricas Lighthouse de referência`

### Fase 1: Fundação de CSS e tokens, sem mudar o visual (2–3 dias)
**Objetivo:** acabar com a cascata de sobrescritas, mantendo **paridade visual**.
- Criar `tokens.css` com um único `:root` (cores, tipografia, espaços, raios, sombras, movimento) que reúne o que hoje está em `styles.css:6-47` e `exhibition.css:7-14`. Os valores atuais vencedores (os do `exhibition.css`) ficam como estão, para não mudar o visual nesta fase.
- Organizar os CSS com `@layer reset, tokens, base, components, sections, pages, overrides;`, que é CSS nativo e não precisa de build. `mobile`, `refinement` e `exhibition` entram nas camadas certas, o que permite tirar os `!important` um a um.
- Mover os estilos inline (`index.html:509`, `portal.html:249`, o footer e `#about`) para classes, mantendo o mesmo texto e a mesma marcação.
- Padronizar o carregamento: os mesmos arquivos e a mesma versão (`?v=`) nas duas páginas.

**Aceite:**
- As capturas nos 4 breakpoints e nos 2 idiomas batem com o baseline (diferença visual ≤ 1% por página).
- `!important` cai de 52 para 10 ou menos (só nos casos justificados, como o reduced-motion).
- Existe um único `:root`.
- A preservação dá 5/5 verde.

**Commits:**
1. `refactor(css): cria tokens.css e unifica as duas paletas em um único :root`
2. `refactor(css): organiza a cascata com @layer sem alterar o visual`
3. `refactor(css): remove !important redundantes após @layer`
4. `refactor(html): troca estilos inline de títulos por classes`
5. `fix(assets): alinha versões de cache do CSS entre index e portal`

### Fase 2: Sistema tipográfico (1,5–2 dias)
**Objetivo:** escala, tracking e pesos com poucos valores e papéis claros, como em Collective[i], Cleo e Inkwell.
- Criar uma escala fluida de 8 passos em tokens (`--step--2` … `--step-6`, com `clamp()`) e trocar os 121 `clamp()` soltos e os tamanhos de 8 a 17px pelos tokens. Rótulos mono ficam com no mínimo 11px.
- Definir papéis:
  - **Space Grotesk:** só display e títulos, com 500 e 600.
  - **Manrope:** corpo com 400 e 600.
  - **Space Mono:** rótulos e dados (`.eyebrow`, `.hero-meta`, `.hero-wordmark`, `.case-sector`, `.dur`, `.cap`) com 400.
- Reduzir o tracking a 4 tokens: `--track-tight -0.04em` (display), `--track-snug -0.02em` (h2/h3), `0` (corpo) e `--track-label 0.12em` (mono em caixa alta). Revisar o `-0.078em` do `.hero h1` para `-0.05`/`-0.06em`, sem perder o desenho em duas linhas.
- Aplicar `font-variant-numeric: tabular-nums` em `.kpi .val`, `.bignum .v`, `[data-to]`, `.vnum`, `.bar-row span` e `.hero-proof strong`.
- Aplicar `text-wrap: balance` em h1–h3 e `pretty` em `p` (onde ainda falta).
- Carregar as fontes só nos pesos usados e adicionar `preload` da Space Grotesk do hero.

**Aceite:**
- Até 8 tamanhos de fonte distintos no CSS (fora os tokens) e até 4 valores de tracking.
- Os números não "dançam" quando os contadores rodam.
- O CLS de fonte fica abaixo de 0,05.
- O texto não muda (preservação 5/5).

**Commits:**
1. `feat(type): adiciona escala tipográfica fluida em tokens`
2. `refactor(type): substitui tamanhos soltos pelos tokens da escala`
3. `feat(type): define papéis de Space Grotesk, Manrope e Space Mono`
4. `feat(type): normaliza tracking em quatro tokens`
5. `feat(type): números tabulares em KPIs, contadores e métricas`
6. `perf(fonts): carrega apenas pesos usados e pré-carrega a fonte do hero`

### Fase 3: Cor, superfícies e forma (1,5–2 dias)
**Objetivo:** base clara neutra com o `#2f6bff` como único acento de interface (padrão de Attio, BrainBox e Heron) e o verde-água e o roxo reservados aos dados (padrão da CLEVER°FRANKE).
- Escolher **uma** base clara. Hoje são `#f6f7fb` (fria) e `#f1f3ef` (esverdeada). A sugestão é ficar com a fria e azulada, que combina com o azul. Escalas `--gray-1…12` e `--blue-1…12`.
- Criar uma paleta de dados `--data-1…6` a partir de `#2f6bff`, `#07b39b` e `#7c5cff` e usá-la nos gráficos do canvas (`app.js:648-670`, cores hoje fixas no código), nas barras (`.bar-fill`) e no `.engage-line`.
- Revisar as seções escuras (`--ex-ink`: `.approach`, `.marquee`, `#about`, `.about-stats .cell`, `#how` no portal) e as azuis (`.why-col.kystone`, `.tier.featured`, `.cpanel.win`) quanto a contraste AA. Elas viram tokens `--surface-inverse` e `--surface-accent`.
- Unificar os raios em 3 tokens (`--radius-s 8px`, `--radius-m 16px`, `--radius-pill 999px`) e decidir entre botões retos (o padrão "exhibition") ou em pílula. Uma única regra para `.btn`.

**Aceite:**
- 100% das cores vêm de tokens (nenhum hex solto fora de `tokens.css`, exceto os logos SVG de terceiros em `#stacks-featured`).
- Texto e fundo AA ≥ 4,5:1 em todas as seções.
- No máximo 3 raios.
- Preservação 5/5.

**Commits:**
1. `feat(color): define base clara única e escalas neutras e azuis`
2. `feat(color): cria paleta de dados e aplica em gráficos e barras`
3. `fix(a11y): garante contraste AA nas seções escuras e azuis`
4. `refactor(ui): unifica raios de borda e estilo de botões`

### Fase 4: Movimento coreografado e econômico (2–3 dias)
**Objetivo:** movimento com assinatura (uma curva e três durações), contado pela rolagem, como em NRG, Inkwell e Heron, e sem gastar CPU à toa.
- Criar tokens de movimento: `--ease-out` (a curva atual `0.22,1,0.36,1`, que a Heron também usa), `--ease-in-out` (`0.65,0,0.35,1`) e `--dur-1 .2s`, `--dur-2 .45s` e `--dur-3 .9s`. Substituir as mais de 10 durações soltas.
- Detectar elementos na tela com **IntersectionObserver e fallback**: usar IO quando disponível e manter o watcher de scroll atual (`app.js:387-421`) como fallback. O comentário do código explica por que ele existe.
- **Pausar o que não aparece.** Parar o `loop` do gráfico (`app.js:672`) e o `setInterval` dos KPIs (`app.js:577`) quando `.hero .panel` não estiver visível (`offsetParent === null`) ou estiver fora da tela, e pausar o marquee (`app.js:522-548`) fora da tela. A função fica igual. Só deixa de rodar escondida.
- Usar scroll-driven animations em CSS como melhoria progressiva (`@supports (animation-timeline: view())`):
  - progresso da linha do tempo em `.jt` / `.jt-rail` no `#journey` (o mesmo padrão das "phases" da NRG);
  - destaque passo a passo em `#studio .studio-gallery .studio-shot` no portal (padrão Inkwell).
  - Navegadores sem suporte continuam com o `.reveal` atual.
- Transição entre index e portal com `@view-transition { navigation: auto; }`, desligada em reduced-motion.
- Escrever as regras de reduced-motion por componente, preferindo `@media (prefers-reduced-motion: no-preference)` para ativar (como faz a Cleo). Manter o bloco global de `styles.css:912`.

**Aceite:**
- Com a aba parada no hero, o uso de CPU em repouso cai (medido no Performance do DevTools, sem rAF contínuo para o painel escondido).
- Nenhuma animação passa de `--dur-3`, exceto as contínuas (escultura, marquee).
- Com reduced-motion ligado, nada se move e todo o conteúdo fica visível.
- Escultura, contadores e barras continuam funcionando.
- Preservação 5/5.

**Commits:**
1. `feat(motion): adiciona tokens de easing e duração`
2. `refactor(motion): aplica tokens de movimento em todas as transições`
3. `perf(js): usa IntersectionObserver com fallback para o watcher de scroll`
4. `perf(js): pausa gráfico, KPIs e marquee quando invisíveis`
5. `feat(motion): linha do tempo da jornada guiada pela rolagem`
6. `feat(motion): tour do Studio com destaque guiado pela rolagem`
7. `feat(motion): transição entre páginas com View Transitions`
8. `fix(a11y): reduced-motion por componente`

### Fase 5: Produto real e imagem (2–3 dias)
**Objetivo:** usar as capturas reais do Norva Studio como protagonistas, como Attio e Cerebrium fazem com o próprio produto, sem trocar nem remover conteúdo.
- Gerar AVIF e WebP de `assets/portal/*.jpg` em 800, 1200 e 2000px. Usar `<picture>` com `srcset`/`sizes`, mantendo os JPG atuais como fallback e o mesmo `alt`, `width` e `height`.
- Criar uma moldura única de "janela do produto" (`.product-frame`: barra superior, raio `--radius-m`, sombra de token) aplicada a `.real-product-shot` (`#portal` no index), `.phero` e `.studio-shot` (portal). É só CSS sobre as imagens que já existem.
- No `#studio` do portal: em desktop, um layout sticky com texto à esquerda e captura fixa à direita, que troca a cada passo (combinado com a Fase 4). Em mobile, mantém a galeria atual.
- Escultura do hero: manter. Ajustar só a composição (tamanho, sombra, `norvaFloat` com os tokens) para dividir o espaço com o título.

**Aceite:**
- O peso total das imagens do portal cai pelo menos 60% (hoje 1,5 MB).
- LCP do portal no mobile abaixo de 2,5 s.
- O mesmo `alt` em todas as imagens.
- A lista de `src` muda só com as variantes novas.
- Preservação 5/5.

**Commits:**
1. `perf(img): adiciona variantes AVIF/WebP e srcset das capturas do portal`
2. `feat(ui): moldura de produto unificada para capturas reais`
3. `feat(portal): tour do Studio com captura sticky em desktop`
4. `refactor(hero): ajusta composição da escultura com tokens`

### Fase 6: Microinterações, acessibilidade e acabamento (1,5–2 dias)
**Objetivo:** o nível de acabamento que os jurados notam.
- Aplicar `:focus-visible` com anel azul por token em links, botões, `summary` e campos. Trocar o `outline: none` de `styles.css:615` por um foco visível.
- Seletor de idioma: adicionar `aria-pressed` em `.lang button` (atualizado dentro de `setLang`, sem mudar a lógica).
- Menu: adicionar `aria-current="true"` no link da seção visível (scrollspy, só atributo e estilo).
- Hovers unificados em `.btn`, `.svc`, `.case`, `.tier`, `.sec` e `.disc`: as mesmas propriedades e o mesmo token de movimento. Seta do `.btn-ghost` desliza 3px.
- Navegação com `backdrop-filter` já existe em `.nav.scrolled`. Revisar só a borda e o contraste.
- FAQ: animar a altura do `<details>` (com `interpolate-size` onde houver suporte) e manter `faqIn` como fallback.
- Formulário: estados de foco, erro e sucesso com tokens. Os campos e os textos ficam iguais.
- Skip link: **opcional**, porque cria um texto novo nos dois idiomas. Só com aprovação (seção 4).

**Aceite:**
- Navegação completa por teclado com foco sempre visível.
- Axe sem erros críticos.
- Lighthouse Acessibilidade ≥ 95.
- PT/EN continua funcionando e o idioma persiste.
- Preservação 5/5.

**Commits:**
1. `fix(a11y): foco visível em todos os elementos interativos`
2. `feat(a11y): aria-pressed no seletor PT/EN`
3. `feat(nav): indica a seção ativa no menu (aria-current)`
4. `feat(ui): hovers e microinterações unificados por token`
5. `feat(ui): animação de abertura do FAQ`
6. `feat(form): estados de foco, erro e sucesso com tokens`

### Fase 7: Performance, SEO aditivo e QA final (1–1,5 dia)
- Adicionar `og:image` e `twitter:image` (1200×630, gerada a partir de uma captura real) e mudar `twitter:card` para `summary_large_image`. Isso é **adição**. As metas existentes ficam.
- Atualizar `lastmod` no `sitemap.xml`. A estrutura não muda.
- Rodar o QA cross-browser (Chrome, Safari e Firefox; iOS e Android) nos 4 breakpoints e nos 2 idiomas.
- Rodar o Lighthouse final e comparar com o baseline da Fase 0.

**Aceite:**
- Lighthouse mobile com Performance ≥ 90, Acessibilidade ≥ 95, Boas práticas ≥ 95, SEO = 100 e CLS < 0,05.
- JSON-LD idêntico ao baseline.
- Preservação 5/5.

**Commits:**
1. `feat(seo): adiciona og:image e twitter card grande`
2. `chore(seo): atualiza lastmod do sitemap`
3. `docs: registra métricas finais do redesign`

---

## 4. Decisões de conteúdo para o dono (fora do redesign visual)
As regras da seção 0.2 impedem mudar estes pontos, mas vale decidir sobre eles à parte:
1. **Idioma inicial:** o HTML declara `lang="pt-BR"`, mas o texto inline está em inglês e o português chega via JS (`app.js:9`, padrão `"pt"`). Robôs de busca e quem está sem JS veem inglês.
2. **Links vazios:** há 5 `href="#"` (LinkedIn, GitHub e "Based" no footer e no contato).
3. **Conteúdo escondido por CSS:** o painel "Executive overview" do hero (KPIs ilustrativos), os links Security e FAQ no menu e os ícones de serviços e do portal. A dúvida é se continuam no DOM ou se devem voltar a aparecer.
4. **Repetição de stack:** o marquee, o `#stacks-featured` e o `#stack` listam ferramentas parecidas.
5. **Skip link** (Fase 6), que traz um texto novo em PT e EN.
6. **Banner de cookies:** acompanhado em outra frente.
