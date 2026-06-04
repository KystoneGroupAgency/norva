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
    "pp.nav.licensing": "Licenciamento",
    "pp.nav.back": "Voltar ao site",
    "pp.nav.cta": "Solicitar demo",
    "pp.nav.reports": "Relatórios",

    "pp.hero.eyebrow": "O produto da Norva",
    "pp.hero.h1": "Power BI para a empresa inteira. <span class=\"gradient-text\">Respostas</span> para o negócio.",
    "pp.hero.sub": "O Portal de Inteligência embute todos os relatórios do Power BI em um único portal com a sua marca, troca a licença por usuário por capacidade embedada e transforma cada dashboard em um insight escrito. O produto de dados em que a sua organização inteira realmente faz login.",
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
    "pp.insight.h": "Insight automático",
    "pp.insight.p": "O burn subiu <b>9% vs. o mês anterior</b>, puxado por gasto de cloud. Nesse ritmo, o runway encurta ~2 meses — sinalizado ao Financeiro.",

    "pp.v1.l": "Capacidade, não licenças",
    "pp.v1.s": "Uma capacidade embedada atende a empresa inteira — sem licença paga de Power BI por usuário.",
    "pp.v2.l": "Insights, não só gráficos",
    "pp.v2.s": "Cada relatório vem com uma leitura escrita do que mudou e do que fazer a respeito.",
    "pp.v3.l": "Sua marca, seu domínio",
    "pp.v3.s": "Um portal white-label com a sua identidade — parece e funciona como um produto seu.",

    "pp.prob.eyebrow": "Por que um portal",
    "pp.prob.title": "Ótimos dashboards que ninguém abre — e uma conta de licença que só cresce.",
    "pp.prob.sub": "Dois problemas limitam silenciosamente o valor do BI na maioria das empresas. O Portal de Inteligência foi feito para remover os dois.",
    "pp.prob1.t": "Licença por usuário não escala",
    "pp.prob1.p": "Cada pessoa que vê um relatório precisa de uma licença paga de Power BI. Leve o BI para toda a empresa e a conta cresce a cada contratação — então o acesso é racionado para poucos, e os dados ficam trancados longe de quem precisa.",
    "pp.prob2.t": "Dashboards mostram, mas não contam",
    "pp.prob2.p": "As pessoas abrem o relatório, encaram os gráficos e ainda perguntam \"afinal, o que mudou?\". Interpretar o dado fica totalmente por conta de quem olha — e a maioria nunca passa do visual para a decisão.",

    "pp.how.eyebrow": "Como funciona",
    "pp.how.title": "Do seu workspace do Power BI a um portal que qualquer um usa.",
    "pp.how.sub": "Conectamos ao que você já tem. Sem migração, sem reconstrução — seus relatórios, em uma casca mais inteligente.",
    "pp.how1.t": "Conectar",
    "pp.how1.p": "Ligamos seus workspaces e datasets do Power BI ao portal por meio de capacidade embedada.",
    "pp.how2.t": "Embutir",
    "pp.how2.p": "Seus relatórios aparecem dentro de um único portal com a sua marca e domínio — sem login de Power BI por usuário.",
    "pp.how3.t": "Enriquecer",
    "pp.how3.p": "Uma camada de inteligência lê cada relatório e escreve o que mudou, por que importa e o que fazer a seguir.",
    "pp.how4.t": "Governar",
    "pp.how4.p": "Segurança em nível de linha, SSO e um catálogo de relatórios controlam quem vê o quê — até o nível da linha.",

    "pp.feat.eyebrow": "O que tem dentro",
    "pp.feat.title": "Tudo que um produto de dados precisa — em um só portal.",
    "pp.f1.t": "Power BI embedado",
    "pp.f1.p": "Relatórios interativos em alta fidelidade, embedados com licenciamento por capacidade — o Power BI de verdade, sem o custo por usuário.",
    "pp.f2.t": "Insights automáticos",
    "pp.f2.p": "Resumos em linguagem simples gerados a partir de cada relatório: o que se moveu, por quê e o que olhar a seguir.",
    "pp.f3.t": "Alertas & anomalias",
    "pp.f3.p": "O portal monitora suas métricas e sinaliza o que foge do padrão — enviado automaticamente às pessoas certas.",
    "pp.f4.t": "Experiência white-label",
    "pp.f4.p": "Seu logo, suas cores, seu domínio. Para quem faz login, é simplesmente o produto de dados da sua empresa.",
    "pp.f5.t": "Segurança & SSO",
    "pp.f5.p": "Segurança em nível de linha, single sign-on e papéis granulares para que cada um veja exatamente os dados que deve.",
    "pp.f6.t": "Catálogo de relatórios",
    "pp.f6.p": "Uma casa pesquisável para cada dashboard, para as pessoas acharem a resposta sem pedir ao time de dados.",

    "pp.beyond.eyebrow": "Mais que visualização",
    "pp.beyond.title": "O portal entrega o insight às pessoas — não só o gráfico.",
    "pp.beyond.sub": "Por trás de cada relatório embedado, uma camada de inteligência lê os números e escreve a história: tendências, anomalias e próximos passos recomendados, em uma linguagem em que qualquer um pode agir.",
    "pp.ic1.tag": "Em alta",
    "pp.ic1.time": "Vendas · hoje",
    "pp.ic1.p": "A receita está <b>12% acima da meta</b> no trimestre, puxada pelo segmento Enterprise. A região Sul é o único ponto fraco — duas contas para acompanhar.",
    "pp.ic2.tag": "Anomalia",
    "pp.ic2.time": "Financeiro · há 2h",
    "pp.ic2.p": "O gasto com cloud saltou <b>9% vs. o mês anterior</b> — fora da faixa normal. Nesse ritmo, o runway encurta cerca de 2 meses.",
    "pp.ic3.tag": "Previsão",
    "pp.ic3.time": "Operações · hoje",
    "pp.ic3.p": "A entrega no prazo tende a <b>96% no próximo mês</b> se a capacidade atual se mantiver. Um centro de distribuição é o gargalo.",

    "pp.lic.eyebrow": "Licenciamento",
    "pp.lic.title": "Pague por capacidade, não por cada usuário.",
    "pp.lic.sub": "Quanto mais pessoas você dá acesso, mais o modelo embedado economiza. Veja a diferença.",
    "pp.lic.cv": "Custo conforme adiciona usuários",
    "pp.lic.a.cap": "O jeito de sempre",
    "pp.lic.a.t": "Licença por usuário",
    "pp.lic.a.m": "Uma licença paga para cada pessoa que precisa ver um relatório.",
    "pp.lic.a.f1": "O custo sobe a cada novo usuário",
    "pp.lic.a.f2": "Acesso racionado a poucos usuários-chave",
    "pp.lic.a.f3": "Cada pessoa gerencia um login separado",
    "pp.lic.b.cap": "Com o Portal de Inteligência",
    "pp.lic.b.t": "Capacidade embedada",
    "pp.lic.b.m": "Uma capacidade fixa atende usuários internos ilimitados pelo portal.",
    "pp.lic.b.f1": "Custo fixo, não importa quantos usuários",
    "pp.lic.b.f2": "Abra o BI para a organização inteira",
    "pp.lic.b.f3": "Um login único no portal, com SSO",
    "pp.lic.note": "Ilustrativo — a economia exata depende do número de usuários e do seu licenciamento atual. Modelamos com os seus números.",

    "pp.cta.eyebrow": "Vamos construir",
    "pp.cta.title": "Veja rodando nos seus próprios dados.",
    "pp.cta.sub": "Traga um workspace e alguns relatórios — mostramos o portal, os insights e a conta de licenciamento nos seus números em até dois dias úteis.",
    "pp.cta.btn": "Solicitar uma demo",
    "pp.cta.btn2": "Conhecer nossos serviços",

    "pp.foot.tagline": "Portal de Inteligência — Power BI para todos, insights para o negócio.",
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
  var saved = "en";
  try { saved = localStorage.getItem("kystone_lang") || "en"; } catch (e) {}
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
