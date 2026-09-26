/* ============================================================
   INTELLIGENCE PORTAL — dedicated page interactions + i18n
   ============================================================ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- i18n (EN inline; PT here) ---------- */
  var PT = {
    "pp.tag": "Portal de Inteligência",
    "pp.nav.overview": "Visão geral",
    "pp.nav.how": "Como funciona",
    "pp.nav.features": "Recursos",
    "pp.nav.licensing": "Produto vivo",
    "pp.nav.back": "Voltar ao site",
    "pp.nav.cta": "Solicitar demo",
    "pp.nav.reports": "Relatórios",
    "pp.agent.live": "Agentes ativos",

    "pp.hero.eyebrow": "O produto da Norva",
    "pp.hero.h1": "Dashboards web. Criados por <span class=\"gradient-text\">agentes inteligentes.</span>",
    "pp.hero.sub": "O Intelligence Portal transforma dados, perguntas e processos de negócio em dashboards web sob medida. Agentes especializados constroem a experiência, acompanham as métricas e explicam o que merece atenção — continuamente.",
    "pp.hero.cta1": "Solicitar uma demo",
    "pp.hero.cta2": "Ver como funciona",
    "pp.url": "portal.suaempresa.com",

    "pp.r.sales": "Vendas",
    "pp.r.finance": "Financeiro",
    "pp.r.ops": "Operações",
    "pp.r.mkt": "Marketing",
    "pp.r.intel": "Inteligência",
    "pp.r.alerts": "Alertas",
    "pp.report.title": "Financeiro · Visão geral",
    "pp.k1": "Caixa",
    "pp.k2": "Burn",
    "pp.k3": "Runway",
    "pp.insight.h": "Agente de análise",
    "pp.insight.p": "O burn subiu <b>9% vs. o mês anterior</b>, puxado por gasto de cloud. Nesse ritmo, o runway encurta ~2 meses — sinalizado ao Financeiro.",

    "pp.v1.l": "Agentes especializados",
    "pp.v1.s": "Agentes de dados, design e análise trabalham juntos na criação de cada dashboard.",
    "pp.v2.l": "Web, não uma tela engessada",
    "pp.v2.s": "Cada experiência é responsiva, interativa e desenhada para a decisão que precisa acontecer.",
    "pp.v3.l": "Vivo por natureza",
    "pp.v3.s": "O produto monitora, explica e evolui conforme os dados e o negócio mudam.",

    "pp.prob.eyebrow": "O problema",
    "pp.prob.title": "Dashboards tradicionais nascem atrasados e envelhecem rápido.",
    "pp.prob.sub": "Entre a pergunta do negócio e uma resposta útil existe uma fila de especificação, desenvolvimento e manutenção. O Intelligence Portal encurta esse ciclo com agentes.",
    "pp.prob1.t": "Cada nova pergunta vira projeto",
    "pp.prob1.p": "Uma mudança simples costuma depender de briefing, backlog e várias rodadas entre negócio, dados e design. Quando o dashboard chega, a decisão já mudou.",
    "pp.prob2.t": "O painel para no gráfico",
    "pp.prob2.p": "Mesmo quando a visualização está correta, alguém ainda precisa interpretar o que mudou, investigar a causa e decidir o próximo passo.",

    "pp.how.eyebrow": "Como funciona",
    "pp.how.title": "Da pergunta ao dashboard web — com agentes em cada etapa.",
    "pp.how.sub": "O portal se conecta às suas fontes e coordena agentes especializados para transformar dados em uma experiência pronta para uso.",
    "pp.how1.t": "Conectar os dados",
    "pp.how1.p": "Integramos bancos, APIs, planilhas e também ferramentas como Power BI ao mesmo contexto governado.",
    "pp.how2.t": "Construir com agentes",
    "pp.how2.p": "Agentes de dados, análise e interface criam o dashboard web adequado à pergunta e ao perfil de cada público.",
    "pp.how3.t": "Analisar continuamente",
    "pp.how3.p": "Agentes acompanham as métricas, explicam mudanças, detectam anomalias e recomendam o próximo passo.",
    "pp.how4.t": "Governar",
    "pp.how4.p": "Segurança em nível de linha, SSO e um catálogo de relatórios controlam quem vê o quê — até o nível da linha.",

    "pp.feat.eyebrow": "O que tem dentro",
    "pp.feat.title": "Uma fábrica de produtos de dados, dentro do seu portal.",
    "pp.f1.t": "Dashboards web sob medida",
    "pp.f1.p": "Interfaces responsivas e interativas, desenhadas para cada fluxo de decisão — no desktop ou no celular.",
    "pp.f2.t": "Orquestra de agentes",
    "pp.f2.p": "Agentes especializados colaboram para modelar dados, criar visualizações, investigar mudanças e redigir respostas.",
    "pp.f3.t": "Alertas & anomalias",
    "pp.f3.p": "O portal monitora suas métricas e sinaliza o que foge do padrão — enviado automaticamente às pessoas certas.",
    "pp.f4.t": "Experiência white-label",
    "pp.f4.p": "Seu logo, suas cores, seu domínio. Para quem faz login, é simplesmente o produto de dados da sua empresa.",
    "pp.f5.t": "Segurança & SSO",
    "pp.f5.p": "Segurança em nível de linha, single sign-on e papéis granulares para que cada um veja exatamente os dados que deve.",
    "pp.f6.t": "Integrações abertas",
    "pp.f6.p": "Conecte bancos, APIs, planilhas e Power BI sem limitar o produto a uma única ferramenta ou fonte.",

    "pp.beyond.eyebrow": "Agentes em operação",
    "pp.beyond.title": "Eles não param quando o dashboard fica pronto.",
    "pp.beyond.sub": "Depois de construir a experiência, os agentes continuam trabalhando: monitoram métricas, investigam desvios e entregam tendências, anomalias e próximos passos em linguagem clara.",
    "pp.ic1.tag": "Em alta",
    "pp.ic1.time": "Vendas · hoje",
    "pp.ic1.p": "A receita está <b>12% acima da meta</b> no trimestre, puxada pelo segmento Enterprise. A região Sul é o único ponto fraco — duas contas para acompanhar.",
    "pp.ic2.tag": "Anomalia",
    "pp.ic2.time": "Financeiro · há 2h",
    "pp.ic2.p": "O gasto com cloud saltou <b>9% vs. o mês anterior</b> — fora da faixa normal. Nesse ritmo, o runway encurta cerca de 2 meses.",
    "pp.ic3.tag": "Previsão",
    "pp.ic3.time": "Operações · hoje",
    "pp.ic3.p": "A entrega no prazo tende a <b>96% no próximo mês</b> se a capacidade atual se mantiver. Um centro de distribuição é o gargalo.",

    "pp.lic.eyebrow": "Produto vivo",
    "pp.lic.title": "Pare de tratar cada dashboard como um projeto que termina.",
    "pp.lic.sub": "O modelo com agentes reduz o ciclo entre uma nova pergunta e uma resposta em produção — e mantém o produto evoluindo depois da entrega.",
    "pp.lic.cv": "Esforço conforme o produto evolui",
    "pp.lic.a.cap": "Dashboard tradicional",
    "pp.lic.a.t": "Projeto estático",
    "pp.lic.a.m": "Cada ajuste volta para a fila de especificação, desenvolvimento e publicação.",
    "pp.lic.a.f1": "Backlog cresce a cada nova pergunta",
    "pp.lic.a.f2": "Contexto se perde entre áreas",
    "pp.lic.a.f3": "Manutenção depende do time técnico",
    "pp.lic.b.cap": "Com o Intelligence Portal",
    "pp.lic.b.t": "Produto orientado por agentes",
    "pp.lic.b.m": "Agentes compartilham o contexto e aceleram criação, análise e evolução contínua.",
    "pp.lic.b.f1": "Novas perguntas viram experiências rapidamente",
    "pp.lic.b.f2": "O contexto do negócio permanece no produto",
    "pp.lic.b.f3": "Governança e acesso continuam centralizados",
    "pp.lic.note": "Cada implantação é desenhada para o contexto, as fontes e as regras de acesso da sua empresa.",

    "pp.cta.eyebrow": "Vamos construir",
    "pp.cta.title": "Dê uma pergunta aos agentes. Veja o dashboard nascer.",
    "pp.cta.sub": "Traga uma decisão importante e uma fonte de dados. Mostramos como o Intelligence Portal transforma esse contexto em uma experiência web inteligente.",
    "pp.cta.btn": "Solicitar uma demo",
    "pp.cta.btn2": "Conhecer nossos serviços",

    "pp.foot.tagline": "Intelligence Portal — dashboards web criados por agentes inteligentes.",
    "pp.foot.c1": "Produto",
    "pp.foot.c2": "Norva",
    "pp.foot.c3": "Conecte-se",
    "pp.foot.services": "Serviços",
    "pp.foot.approach": "Método",
    "pp.foot.about": "Sobre",
    "pp.foot.contact": "Contato",
    "pp.foot.rights": "© 2026 Norva — uma empresa do Kystone Group. Todos os direitos reservados.",
    "pp.foot.crafted": "Construído com dados, não palpites."
  };

  var nodes = document.querySelectorAll("[data-i18n]");
  var originalEN = {};
  nodes.forEach(function (n) { originalEN[n.getAttribute("data-i18n")] = n.innerHTML; });

  function setLang(lang) {
    var isPT = lang === "pt";
    document.documentElement.lang = isPT ? "pt-BR" : "en";
    nodes.forEach(function (n) {
      var k = n.getAttribute("data-i18n");
      n.innerHTML = isPT ? (PT[k] != null ? PT[k] : originalEN[k]) : originalEN[k];
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
    try { localStorage.setItem("kystone_lang", lang); } catch (e) {}
  }
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });
  var saved = "pt";
  try { saved = localStorage.getItem("kystone_lang") || "pt"; } catch (e) {}
  setLang(saved);

  /* ---------- nav scroll state ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- in-view watcher ---------- */
  var watchers = [];
  function watch(el, ratio, fire) { if (el) watchers.push({ el: el, ratio: ratio, fire: fire, done: false }); }
  function isInView(el, ratio) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.bottom <= 0 || r.top >= vh) return false;
    var vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    var need = Math.min(r.height || 1, vh) * (ratio || 0.12);
    return vis >= need;
  }
  function checkWatchers() {
    for (var i = 0; i < watchers.length; i++) {
      var w = watchers[i];
      if (!w.done && isInView(w.el, w.ratio)) { w.done = true; w.fire(w.el); }
    }
  }
  window.addEventListener("scroll", checkWatchers, { passive: true });
  window.addEventListener("resize", checkWatchers);

  document.querySelectorAll(".reveal").forEach(function (el) {
    watch(el, 0.1, function (n) { n.classList.add("in"); });
  });

  // cost comparison bars animate from 0 to data-h
  document.querySelectorAll(".cost-bars").forEach(function (group) {
    watch(group, 0.3, function (n) {
      n.querySelectorAll(".bar").forEach(function (b, i) {
        var h = b.getAttribute("data-h") || "0%";
        if (reduced) { b.style.height = h; return; }
        b.style.height = "0%";
        setTimeout(function () { b.style.height = h; }, 80 + i * 90);
      });
    });
  });

  /* ---------- parallax ---------- */
  if (!reduced) {
    var pxItems = [].slice.call(document.querySelectorAll("[data-parallax]")).map(function (el) {
      return { el: el, speed: parseFloat(el.getAttribute("data-parallax")) || 0 };
    });
    var ticking = false;
    function applyParallax() {
      // Skip parallax on phones: cheaper scrolling, no transform jank.
      if (window.innerWidth <= 720) {
        for (var p = 0; p < pxItems.length; p++) pxItems[p].el.style.transform = "";
        ticking = false;
        return;
      }
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var mid = vh / 2;
      for (var i = 0; i < pxItems.length; i++) {
        var it = pxItems[i];
        var r = it.el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        var center = r.top + r.height / 2;
        it.el.style.transform = "translate3d(0," + ((center - mid) * it.speed).toFixed(1) + "px,0)";
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(applyParallax); } }, { passive: true });
    window.addEventListener("resize", applyParallax);
    applyParallax();
  }

  /* ---------- card spotlight glow ---------- */
  document.querySelectorAll(".svc").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- smooth anchors (same-page only) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1) {
        var t = document.querySelector(id);
        if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" }); }
      }
    });
  });

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    var closeMenu = function () {
      nav.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-lock");
    };
    var openMenu = function () {
      nav.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-lock");
    };
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("menu-open")) closeMenu(); else openMenu();
    });
    nav.querySelectorAll(".nav-links a, .nav-right a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 720) closeMenu(); });
  }

  /* ---------- kick off ---------- */
  checkWatchers();
  requestAnimationFrame(checkWatchers);
  setTimeout(checkWatchers, 200);
  setTimeout(checkWatchers, 600);
  window.addEventListener("load", function () { checkWatchers(); setTimeout(checkWatchers, 300); });
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(checkWatchers); }
})();
