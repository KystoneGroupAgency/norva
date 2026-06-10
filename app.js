/* ============================================================
   KYSTONE INTELLIGENCE — interactions
   ============================================================ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     1. i18n  (EN inline in HTML; PT supplied here)
     ---------------------------------------------------------- */
  var PT = {
    "nav.services": "Serviços",
    "nav.approach": "Método",
    "nav.engage": "Modelos",
    "nav.stack": "Stack",
    "nav.about": "Sobre",
    "nav.contact": "Contato",
    "nav.cta": "Iniciar projeto",

    "hero.eyebrow": "Estúdio de inteligência de dados",
    "hero.l1": "Dados que",
    "hero.l2": "viram",
    "hero.l3": "decisão.",
    "hero.sub": "A Norva entra na rotina do seu time para desenhar dashboards, construir pipelines e treinar modelos de machine learning em Power BI, Python e Tableau.",
    "hero.cta1": "Iniciar projeto",
    "hero.cta2": "Como trabalhamos",
    "hero.scroll": "Role para explorar",

    "panel.title": "Painel executivo",
    "panel.live": "Ao vivo",
    "kpi1.l": "Receita",
    "kpi2.l": "Conversão",
    "kpi3.l": "Acurácia",
    "chart.title": "Throughput do pipeline",
    "chart.s1": "Ingestão",
    "chart.s2": "Modelado",
    "bars.title": "Fontes de dados",
    "gauge.title": "Saúde dos dados",
    "gauge.sub": "qualidade",

    "marquee.0": "Power BI",
    "marquee.1": "Python",
    "marquee.2": "Tableau",
    "marquee.3": "Engenharia de dados",
    "marquee.4": "Machine Learning",
    "marquee.5": "Automação",

    "feat.eyebrow": "Stacks de destaque",
    "feat.title": "Construímos sobre as <span class=\"gradient-text\">melhores plataformas</span> do mercado.",
    "feat.sub": "Não amarramos você a uma ferramenta. Dominamos as plataformas líderes de dados e IA e integramos com o que faz sentido para o seu negócio.",
    "feat.s.ms": "Cloud & Fabric",
    "feat.s.pbi": "Dashboards",
    "feat.s.az": "Infra de dados",
    "feat.s.aws": "Infra de nuvem",
    "feat.s.db": "Lakehouse",
    "feat.s.sf": "Data Cloud",
    "feat.s.py": "Analytics & ML",
    "feat.s.spark": "Big data",
    "feat.s.claude": "IA generativa",

    "nav.results": "Resultados",
    "nav.security": "Segurança",
    "nav.faq": "FAQ",

    "why.eyebrow": "Por que a Norva",
    "why.title": "A diferença aparece depois que o dashboard é entregue.",
    "why.sub": "A maioria dos projetos de dados falha na adoção, não na entrega. Fomos feitos para fechar essa lacuna — e é exatamente aí que a comparação deve ser feita.",
    "why.a.h": "A consultoria comum",
    "why.a.tag": "Comum",
    "why.a.1": "Entrega o dashboard e desaparece.",
    "why.a.2": "Equipe júnior aprendendo no seu projeto.",
    "why.a.3": "Começa pela ferramenta, não pela decisão.",
    "why.a.4": "Amarra você a uma única stack.",
    "why.a.5": "Documentação inexistente.",
    "why.a.6": "Métricas que ninguém usa.",
    "why.b.h": "O jeito Norva",
    "why.b.tag": "Nosso padrão",
    "why.b.1": "Ficamos até a adoção realmente acontecer.",
    "why.b.2": "Profissionais experientes em cada etapa, do diagnóstico à produção.",
    "why.b.3": "Entendemos a decisão antes de tocar no dado.",
    "why.b.4": "Agnósticos de ferramenta — integramos com o que você tem.",
    "why.b.5": "Governança e documentação desde o dia 1.",
    "why.b.6": "Métricas que viram decisão.",

    "imp.eyebrow": "Impacto que geramos",
    "imp.title": "Menos trabalho manual. Decisões mais rápidas e confiáveis.",
    "imp.sub": "Resultados concretos de projetos reais — nomes de clientes preservados por confidencialidade.",
    "imp.flag": "Resultado destaque",
    "imp.claim.a": "De",
    "imp.claim.b": "6 horas de trabalho manual",
    "imp.claim.c": "a",
    "imp.claim.d": "5 minutos automatizados.",
    "imp.claim.sub": "Um processo recorrente que consumia uma manhã inteira agora roda sozinho — por meio de pipelines em Python implantados na nuvem, sem supervisão humana.",
    "imp.m1": "Pipelines",
    "imp.m2": "24/7 automatizado",
    "imp.m3": "retrabalho manual",
    "imp.before": "Antes · manual",
    "imp.after": "Depois · automatizado",
    "imp.cases.t": "Como isso se traduz em cada setor",
    "imp.cases.note": "Anonimizados a pedido dos clientes",
    "imp.c1.s": "Comercial",
    "imp.c1.t": "Relatórios de venda dispersos, uma fonte da verdade",
    "imp.c1.p": "Planilhas espalhadas por regiões consolidadas em um único modelo governado no Power BI em que o time confia.",
    "imp.c1.o": "Um dashboard confiável",
    "imp.c2.s": "Financeiro",
    "imp.c2.t": "Uma rotina de fechamento de 6 horas, automatizada",
    "imp.c2.p": "Uma conciliação manual que tomava uma manhã inteira agora roda em minutos via pipelines em Python na nuvem.",
    "imp.c2.o": "6h → 5min",
    "imp.c3.s": "Industrial",
    "imp.c3.t": "Visibilidade de produção em tempo real",
    "imp.c3.p": "Dados operacionais unificados em indicadores ao vivo, para que o chão de fábrica e a gestão olhem os mesmos números.",
    "imp.c3.o": "Operação ao vivo",
    "imp.c4.s": "Marketing",
    "imp.c4.t": "Canais unificados, investimento que retorna",
    "imp.c4.p": "Fontes de campanha desconectadas reunidas para ler o retorno real por canal — não métricas de vaidade.",
    "imp.c4.o": "ROI claro por canal",

    "jny.eyebrow": "Como começa um projeto",
    "jny.title": "Um caminho claro da primeira conversa ao contrato assinado.",
    "jny.sub": "Sem pressão e sem surpresas. Você vê valor antes de se comprometer — e sempre sabe qual é o próximo passo.",
    "jny.s1.d": "30 minutos",
    "jny.s1.t": "Primeira conversa",
    "jny.s1.p": "Entendemos seu contexto, objetivos e onde as decisões travam hoje.",
    "jny.s2.d": "1–2 semanas",
    "jny.s2.t": "Diagnóstico",
    "jny.s2.p": "Mapeamos dados, stakeholders e as decisões que realmente importam para o negócio.",
    "jny.s3.d": "Alinhado em conjunto",
    "jny.s3.t": "Proposta & escopo",
    "jny.s3.p": "Um plano claro com escopo, prazo e preço definidos. Sem letras miúdas.",
    "jny.s4.d": "Rápido",
    "jny.s4.t": "Prova de valor",
    "jny.s4.p": "Um primeiro resultado tangível logo no início, para você decidir com evidência — não promessas.",
    "jny.s5.d": "Em produção",
    "jny.s5.t": "Implementação",
    "jny.s5.p": "Colocamos em produção com governança, documentação e seu time a bordo.",
    "jny.s6.d": "Contínuo",
    "jny.s6.t": "Evolução contínua",
    "jny.s6.p": "Ficamos por perto, medimos a adoção e evoluímos a solução conforme você cresce.",
    "jny.foot": "<b>Você no controle o tempo todo.</b> Leve o tempo que precisar para comparar e alinhar internamente — andamos no ritmo de uma decisão segura, não apressada.",

    "sec.eyebrow": "Segurança & governança",
    "sec.title": "Seus dados são tratados como se fossem nossos para proteger.",
    "sec.sub": "Confiança não é um recurso que adicionamos no fim — é como construímos desde a primeira linha do pipeline.",
    "sec.1.t": "LGPD por padrão",
    "sec.1.p": "Dados pessoais tratados de acordo com a LGPD, da coleta ao acesso.",
    "sec.2.t": "Segurança em nível de linha",
    "sec.2.p": "Cada pessoa vê exatamente os dados que deve — e nada além da sua permissão.",
    "sec.3.t": "Controle de acesso & auditoria",
    "sec.3.p": "Permissões governadas com rastreabilidade — quem acessou o quê, e quando.",
    "sec.4.t": "Documentação completa",
    "sec.4.p": "Nada fica na cabeça de uma pessoa. Modelos, pipelines e regras documentados.",
    "sec.5.t": "Ambientes isolados",
    "sec.5.p": "Dev, homologação e produção separados, para que mudanças nunca toquem dados reais por acidente.",
    "sec.6.t": "Backup & rastreabilidade",
    "sec.6.p": "Dados recuperáveis e linhagem clara, para você sempre confiar no que um número significa.",
    "sec.b1": "Alinhado à LGPD",
    "sec.b2": "Acesso por perfil",
    "sec.b3": "Documentado & auditável",

    "team.eyebrow": "As pessoas por trás",
    "team.title": "As pessoas por trás. Cada disciplina que você precisa.",
    "team.sub": "Toda disciplina necessária para ir do dado bruto à decisão, sob o mesmo teto e responsável de ponta a ponta.",
    "team.st2": "disciplinas centrais",
    "team.d1.t": "Engenharia de Dados",
    "team.d1.p": "Pipelines, arquitetura e as camadas confiáveis sobre as quais tudo se apoia.",
    "team.d2.t": "Ciência de Dados & ML",
    "team.d2.p": "Modelos que transformam histórico em previsão, do protótipo à produção.",
    "team.d3.t": "BI & Visualização",
    "team.d3.p": "Dashboards em que as pessoas confiam e que de fato usam — sobre modelos limpos e governados.",
    "team.d4.t": "Arquitetura Cloud",
    "team.d4.p": "Infraestrutura escalável e segura no Azure e no stack de dados moderno.",
    "team.d5.t": "Design de Dados",
    "team.d5.p": "Clareza por design — transformando complexidade em algo que um líder lê em segundos.",
    "prt.badge.b": "Microsoft Partner",
    "prt.badge.s": "Parceria oficial",
    "prt.title": "Microsoft Partner reconhecida.",
    "prt.p": "Construímos dentro do ecossistema que a maioria das empresas já usa — Azure, Power BI e Microsoft Fabric — com o respaldo de uma parceria oficial. Além disso, trabalhamos com fluência em Databricks, Snowflake e no stack de dados moderno.",

    "faq.eyebrow": "Perguntas frequentes",
    "faq.title": "As perguntas que os times fazem antes de fechar.",
    "faq.q1": "Em quanto tempo vemos o primeiro resultado?",
    "faq.a1": "Desenhamos cada projeto em torno de uma prova de valor inicial, para você ver algo tangível rápido — normalmente nas primeiras semanas — antes de qualquer compromisso maior.",
    "faq.q2": "Vocês substituem nosso time ou trabalham junto?",
    "faq.a2": "Os dois. Podemos assumir toda a jornada de dados, co-construir com o seu pessoal ou entrar como especialistas para reforçar o time que você já tem.",
    "faq.q3": "Como vocês tratam a segurança dos nossos dados?",
    "faq.a3": "Governança em primeiro lugar: tratamento alinhado à LGPD, segurança em nível de linha, ambientes isolados, modelos documentados e rastreabilidade total de quem acessou o quê.",
    "faq.q4": "Vamos ficar presos a uma ferramenta específica?",
    "faq.a4": "Não. Somos agnósticos de ferramenta e integramos com o que você já usa. Recomendamos a tecnologia certa para o seu contexto — não a que está na moda.",
    "faq.q5": "Já temos dashboards. Vocês ainda ajudam?",
    "faq.a5": "Muitas vezes é onde mais agregamos — auditando o que existe, restaurando a confiança no dado e transformando relatórios ignorados em decisões em que se confia.",
    "faq.q6": "Como funciona a contratação?",
    "faq.a6": "Após o diagnóstico, apresentamos uma proposta clara com escopo, prazo e preço definidos. Você leva o tempo que precisar para comparar e alinhar internamente — sem pressão.",
    "faq.q7": "Que porte e setor de empresa vocês atendem?",
    "faq.a7": "Atuamos em operações comerciais, financeiras, de marketing e industriais — de times dando o primeiro passo estruturado a organizações escalando uma prática de dados madura.",
    "faq.q8": "O que acontece depois da entrega?",
    "faq.a8": "Não desaparecemos. Medimos a adoção, apoiamos seu time e evoluímos a solução conforme o negócio muda — esse é o ponto.",
    "faq.cta.p": "Ainda tem uma dúvida que não está aqui?",
    "faq.cta.btn": "Fale com a gente",

    "svc.eyebrow": "O que construímos",
    "svc.title": "Capacidades de ponta a ponta, da extração à decisão.",
    "svc.sub": "Escolha o conjunto completo ou apenas a peça que falta no seu time.",
    "svc1.t": "Dashboards em Power BI",
    "svc1.p": "Painéis prontos para a diretoria que as pessoas realmente usam, com modelos confiáveis, DAX limpo e governança de verdade.",
    "svc2.t": "Analytics & Automação em Python",
    "svc2.p": "Análises, ETL e automações que eliminam o trabalho manual e mantêm os dados fluindo sozinhos.",
    "svc3.t": "Visualização em Tableau",
    "svc3.p": "Histórias visuais que tornam padrões complexos óbvios em segundos.",
    "svc4.t": "Engenharia de Dados",
    "svc4.p": "Pipelines da extração à visualização: ingestão, modelagem e camadas confiáveis que escalam.",
    "svc5.t": "Ciência de Dados & ML",
    "svc5.p": "Modelos preditivos que transformam histórico em previsão, do protótipo à produção.",

    "appr.eyebrow": "Como trabalhamos",
    "appr.title": "Entramos no seu negócio antes de tocar nos dados.",
    "appr.sub": "Tecnologia é a parte fácil. Nós começamos pelas pessoas, pela cultura e pelas decisões que importam.",
    "appr.big": "MÉTODO",
    "appr.s1.t": "Imersão",
    "appr.s1.p": "Entramos na sua rotina e aprendemos a cultura, como as decisões são realmente tomadas hoje.",
    "appr.s2.t": "Escuta",
    "appr.s2.p": "Mapeamos os stakeholders e ouvimos quem está na operação. As melhores métricas vêm de quem faz o trabalho.",
    "appr.s3.t": "Estrutura",
    "appr.s3.p": "Desenhamos modelos de dados estruturados e confiáveis. Uma única fonte da verdade em que o time confia.",
    "appr.s4.t": "Construção",
    "appr.s4.p": "Entregamos dashboards e modelos que vão para produção, e capacitamos seu time para evoluí-los.",

    "st.eyebrow": "A peça-chave",
    "st.l1": "De dados dispersos",
    "st.l2": "a uma decisão clara.",
    "st.sub": "Cada pipeline que construímos e cada dashboard que entregamos existe por um único motivo: tornar a próxima decisão óbvia.",

    "nav.portal": "Portal",
    "portal.eyebrow": "Nosso produto · Portal de Inteligência",
    "portal.title": "Todos os dashboards em um só lugar — e as <span class=\"gradient-text\">respostas</span> por trás deles.",
    "portal.sub": "O Portal de Inteligência embute seus relatórios do Power BI em um único portal com a sua marca para toda a empresa e, sobre isso, entrega insights automáticos. A visualização é só o ponto de partida.",
    "portal.f1.t": "Power BI, embedado",
    "portal.f1.p": "Entregue dashboards para toda a organização através de uma única capacidade embedada, em vez de uma licença paga por usuário — e veja o custo de licenças de BI cair.",
    "portal.f2.t": "Respostas, não só gráficos",
    "portal.f2.p": "O portal lê cada relatório e escreve o insight para você: o que mudou, por que importa e o que olhar a seguir. Mais do que visualização.",
    "portal.f3.t": "Uma porta de entrada governada",
    "portal.f3.p": "Um único portal com a sua marca e segurança em nível de linha, para que cada pessoa veja exatamente os dados que deve — nada além disso.",
    "portal.cta": "Solicitar uma demo",
    "portal.more": "Explorar o portal",
    "portal.url": "portal.suaempresa.com",
    "portal.nav.reports": "Relatórios",
    "portal.nav.sales": "Vendas",
    "portal.nav.finance": "Financeiro",
    "portal.nav.ops": "Operações",
    "portal.nav.mkt": "Marketing",
    "portal.nav.intel": "Inteligência",
    "portal.nav.alerts": "Alertas",
    "portal.report.title": "Vendas · Visão geral",
    "portal.k1": "Receita",
    "portal.k2": "Meta",
    "portal.k3": "Margem",
    "portal.insight.h": "Insight automático",
    "portal.insight.p": "Receita <b>12% acima da meta</b>. A queda na região Sul vem de 2 contas — vale revisar o pipeline esta semana.",
    "portal.save.h": "Licenças de BI",
    "portal.save.before": "Por usuário",
    "portal.save.after": "Portal",
    "portal.save.note": "Menor custo ↓",

    "eng.eyebrow": "Modelos de atuação",
    "eng.title": "Assumimos tudo, ou reforçamos o time que você já tem.",
    "eng.sub": "Um espectro flexível, do projeto completo ao apoio pontual.",
    "eng.left": "Integração completa",
    "eng.right": "Reforço ao time",
    "tier1.cap": "Ponta a ponta",
    "tier1.t": "Integração completa",
    "tier1.p": "Assumimos toda a jornada de dados, da extração à visualização.",
    "tier1.f1": "Engenharia & arquitetura de dados",
    "tier1.f2": "Dashboards e modelos de ML",
    "tier1.f3": "Governança & documentação",
    "tier2.cap": "Co-construção",
    "tier2.t": "Construímos com você",
    "tier2.p": "Lado a lado com seu time, acelerando entregas e elevando o nível.",
    "tier2.f1": "Squads em conjunto",
    "tier2.f2": "Padrões & boas práticas",
    "tier2.f3": "Transferência de conhecimento",
    "tier3.cap": "Aumento de time",
    "tier3.t": "Reforçamos seu time",
    "tier3.p": "Plugamos no time de dados existente para destravar dashboards e automações.",
    "tier3.f1": "Especialistas sob demanda",
    "tier3.f2": "Automação de Power BI",
    "tier3.f3": "Revisão & otimização",

    "stack.eyebrow": "Stack de tecnologia",
    "stack.title": "As ferramentas certas, não as da moda.",
    "stack.sub": "Trabalhamos no seu ecossistema e integramos com o que você já usa.",

    "about.eyebrow": "Sobre a Norva",
    "about.statement": "Transformamos dado bruto na direção que o seu negócio segue.",
    "about.p": "Norva nasce de norte e valor — a jornada do dado bruto até a decisão certa. Não apenas processamos dados; orientamos organizações. Parte do <strong>Kystone Group</strong>, somos um time pequeno de engenheiros, cientistas de dados e designers que se importa tanto com a cultura quanto com o código.",
    "about.n1": "do dado bruto à decisão",
    "about.n2": "stacks principais dominados",
    "about.n3": "foco em adoção real",
    "about.n4": "imersos no seu time",

    "contact.eyebrow": "Vamos construir",
    "contact.title": "Pronto para tomar decisões melhores?",
    "contact.lead": "Conte o desafio. Respondemos com um plano claro em até dois dias úteis.",
    "contact.email": "Escreva para",
    "contact.based": "Atuação",
    "contact.based.v": "Remoto · Brasil & global",
    "form.name": "Nome",
    "form.company": "Empresa",
    "form.email": "E-mail de trabalho",
    "form.scope": "Como podemos ajudar?",
    "form.scope.0": "Integração completa de dados",
    "form.scope.1": "Dashboards em Power BI / Tableau",
    "form.scope.2": "Engenharia de dados & pipelines",
    "form.scope.3": "Ciência de dados & ML",
    "form.scope.4": "Reforço ao time existente",
    "form.msg": "Mensagem",
    "form.msg.ph": "Conte um pouco sobre o seu contexto de dados…",
    "form.submit": "Enviar mensagem",
    "form.note": "Sem spam. Sua mensagem vai direto para os fundadores.",
    "form.ok.t": "Mensagem enviada",
    "form.ok.p": "Obrigado, retornamos em até dois dias úteis.",

    "footer.tagline": "Inteligência que orienta. Dados que entregam.",
    "footer.c1": "Empresa",
    "footer.c2": "Serviços",
    "footer.c3": "Conecte-se",
    "foot.about": "Sobre",
    "foot.approach": "Método",
    "foot.engage": "Modelos",
    "foot.contact": "Contato",
    "foot.powerbi": "Power BI",
    "foot.python": "Python",
    "foot.tableau": "Tableau",
    "foot.ml": "Machine Learning",
    "footer.rights": "© 2026 Norva — uma empresa do Kystone Group. Todos os direitos reservados.",
    "footer.crafted": "Construído com dados, não palpites."
  };

  var nodes = document.querySelectorAll("[data-i18n]");
  var originalEN = {};
  nodes.forEach(function (n) { originalEN[n.getAttribute("data-i18n")] = n.innerHTML; });

  // placeholder/attr translations
  var attrNodes = document.querySelectorAll("[data-i18n-ph]");
  var originalPH = {};
  attrNodes.forEach(function (n) { originalPH[n.getAttribute("data-i18n-ph")] = n.getAttribute("placeholder"); });

  function setLang(lang) {
    var isPT = lang === "pt";
    document.documentElement.lang = isPT ? "pt-BR" : "en";
    nodes.forEach(function (n) {
      var k = n.getAttribute("data-i18n");
      n.innerHTML = isPT ? (PT[k] != null ? PT[k] : originalEN[k]) : originalEN[k];
    });
    attrNodes.forEach(function (n) {
      var k = n.getAttribute("data-i18n-ph");
      n.setAttribute("placeholder", isPT ? (PT[k] != null ? PT[k] : originalPH[k]) : originalPH[k]);
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

  /* ----------------------------------------------------------
     2. Nav scroll state + mobile toggle
     ---------------------------------------------------------- */
  var nav = document.querySelector(".nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* hero entrance */
  var hero = document.querySelector(".hero");
  requestAnimationFrame(function () { setTimeout(function () { hero.classList.add("is-in"); }, 80); });

  /* ----------------------------------------------------------
     3-4. Unified in-view watcher  (scroll-based — robust in every
          environment; IntersectionObserver is unreliable in some
          embedded preview frames)
     ---------------------------------------------------------- */
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function countUp(el, to, dur, decimals, prefix, suffix) {
    if (reduced) { el.textContent = (prefix || "") + to.toFixed(decimals) + (suffix || ""); return; }
    var start = performance.now();
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      el.textContent = (prefix || "") + (to * easeOut(p)).toFixed(decimals) + (suffix || "");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

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
  function onScrollCheck() { checkWatchers(); }
  window.addEventListener("scroll", onScrollCheck, { passive: true });
  window.addEventListener("resize", onScrollCheck);

  // reveals
  document.querySelectorAll(".reveal").forEach(function (el) {
    watch(el, 0.1, function (n) { n.classList.add("in"); });
  });
  // count-up numbers
  document.querySelectorAll("[data-to]").forEach(function (el) {
    watch(el, 0.3, function (n) {
      countUp(n, parseFloat(n.dataset.to), 1600, parseInt(n.dataset.dec || "0", 10), n.dataset.prefix || "", n.dataset.suffix || "");
    });
  });
  // bar / spectrum fills
  document.querySelectorAll("[data-bars]").forEach(function (el) {
    watch(el, 0.15, function (n) {
      n.querySelectorAll(".bar-fill, .engage-line .fill").forEach(function (f) { f.style.width = f.dataset.w + "%"; });
    });
  });

  /* ----------------------------------------------------------
     4b. Parallax engine (depth on scroll)
     ---------------------------------------------------------- */
  if (!reduced) {
    var pxItems = [].slice.call(document.querySelectorAll("[data-parallax]")).map(function (el) {
      return { el: el, speed: parseFloat(el.getAttribute("data-parallax")) || 0 };
    });
    var pxTicking = false;
    function applyParallax() {
      // Skip parallax on phones: cheaper scrolling, no transform jank.
      // Also clears any transform left over from a desktop->mobile resize.
      if (window.innerWidth <= 720) {
        for (var p = 0; p < pxItems.length; p++) pxItems[p].el.style.transform = "";
        pxTicking = false;
        return;
      }
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var mid = vh / 2;
      for (var i = 0; i < pxItems.length; i++) {
        var it = pxItems[i];
        var r = it.el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        var center = r.top + r.height / 2;
        var offset = (center - mid) * it.speed;
        it.el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      }
      pxTicking = false;
    }
    function onParallaxScroll() {
      if (!pxTicking) { pxTicking = true; requestAnimationFrame(applyParallax); }
    }
    window.addEventListener("scroll", onParallaxScroll, { passive: true });
    window.addEventListener("resize", onParallaxScroll);
    applyParallax();
  }

  /* ----------------------------------------------------------
     4c. Proof marquee (JS-driven continuous carousel)
     ---------------------------------------------------------- */
  (function () {
    var track = document.querySelector(".marquee-track");
    var marquee = document.querySelector(".marquee");
    if (!track || !marquee) return;
    var pos = 0;
    var half = 0;
    function measure() { half = track.scrollWidth / 2; }
    measure();
    window.addEventListener("resize", measure);
    var speed = 0.045; // px per ms  (~26s per full loop)
    var paused = false;
    marquee.addEventListener("pointerenter", function () { paused = true; });
    marquee.addEventListener("pointerleave", function () { paused = false; });
    var last = performance.now();
    function spin(now) {
      var dt = now - last; last = now;
      if (!paused && half > 0) {
        pos -= speed * dt;
        if (pos <= -half) pos += half;
        track.style.transform = "translate3d(" + pos.toFixed(2) + "px,0,0)";
      }
      requestAnimationFrame(spin);
    }
    requestAnimationFrame(spin);
  })();

  /* ----------------------------------------------------------
     5. Pointer spotlight (hero) + magnetic card glow
     ---------------------------------------------------------- */
  if (!reduced) {
    var spot = document.querySelector(".spotlight");
    var heroEl = document.querySelector(".hero");
    heroEl.addEventListener("pointermove", function (e) {
      var r = heroEl.getBoundingClientRect();
      spot.style.left = (e.clientX - r.left) + "px";
      spot.style.top = (e.clientY - r.top) + "px";
      spot.style.opacity = "1";
    });
    heroEl.addEventListener("pointerleave", function () { spot.style.opacity = "0"; });
  }
  document.querySelectorAll(".svc").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ----------------------------------------------------------
     6. Live KPI ticking
     ---------------------------------------------------------- */
  if (!reduced) {
    setInterval(function () {
      document.querySelectorAll("[data-tick]").forEach(function (el) {
        var base = parseFloat(el.dataset.base);
        var dec = parseInt(el.dataset.dec || "0", 10);
        var jit = parseFloat(el.dataset.jit || "1");
        var v = base + (Math.random() - 0.5) * 2 * jit;
        el.textContent = (el.dataset.prefix || "") + v.toFixed(dec) + (el.dataset.suffix || "");
      });
    }, 2200);
  }

  /* ----------------------------------------------------------
     7. Streaming line chart (hero panel)
     ---------------------------------------------------------- */
  function hidpi(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: r.width, h: r.height };
  }

  var lineCanvas = document.getElementById("lineChart");
  if (lineCanvas) {
    var N = 60;
    function seed(amp, base, ph) {
      var a = [];
      for (var i = 0; i < N; i++) {
        a.push(base + Math.sin(i * 0.28 + ph) * amp + Math.sin(i * 0.11) * amp * 0.5 + (Math.random() - 0.5) * amp * 0.5);
      }
      return a;
    }
    var s1 = seed(16, 60, 0);
    var s2 = seed(12, 40, 1.6);
    var dim;
    function resizeLine() { dim = hidpi(lineCanvas); }
    resizeLine();
    window.addEventListener("resize", resizeLine);

    function drawSeries(ctx, data, w, h, color, glow, fillTop) {
      var max = 100, min = 0;
      var stepX = w / (N - 1);
      function y(v) { return h - ((v - min) / (max - min)) * (h - 8) - 4; }
      // fill
      if (fillTop) {
        var g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, fillTop);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.moveTo(0, y(data[0]));
        for (var i = 1; i < N; i++) ctx.lineTo(i * stepX, y(data[i]));
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        ctx.fillStyle = g; ctx.fill();
      }
      ctx.beginPath();
      ctx.moveTo(0, y(data[0]));
      for (var j = 1; j < N; j++) ctx.lineTo(j * stepX, y(data[j]));
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = color;
      ctx.shadowColor = glow; ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
      // leading dot
      var lx = (N - 1) * stepX, ly = y(data[N - 1]);
      ctx.beginPath(); ctx.arc(lx, ly, 3, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
      ctx.beginPath(); ctx.arc(lx, ly, 6, 0, Math.PI * 2); ctx.strokeStyle = glow; ctx.lineWidth = 1; ctx.stroke();
    }

    var acc = 0;
    function renderLine(ts) {
      var ctx = dim.ctx, w = dim.w, h = dim.h;
      ctx.clearRect(0, 0, w, h);
      // gridlines
      ctx.strokeStyle = "rgba(18,28,54,0.06)";
      ctx.lineWidth = 1;
      for (var g = 0; g <= 3; g++) {
        var gy = (h / 3) * g;
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }
      drawSeries(ctx, s2, w, h, "#07b39b", "rgba(7,179,155,0.32)", null);
      drawSeries(ctx, s1, w, h, "#2f6bff", "rgba(47,107,255,0.38)", "rgba(47,107,255,0.16)");
    }
    function clamp(v) { return Math.max(8, Math.min(96, v)); }
    function step() {
      var last1 = s1[N - 1], last2 = s2[N - 1];
      s1.push(clamp(last1 + (Math.random() - 0.48) * 14 + Math.sin(performance.now() / 1400) * 3));
      s2.push(clamp(last2 + (Math.random() - 0.5) * 11));
      s1.shift(); s2.shift();
    }
    if (reduced) {
      renderLine();
    } else {
      var lastStep = 0;
      function loop(ts) {
        if (ts - lastStep > 900) { step(); lastStep = ts; }
        renderLine(ts);
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }
  }

  /* ----------------------------------------------------------
     8. Radial gauge (hero panel)
     ---------------------------------------------------------- */
  var gaugeCanvas = document.getElementById("gauge");
  if (gaugeCanvas) {
    var gd = hidpi(gaugeCanvas);
    window.addEventListener("resize", function () { gd = hidpi(gaugeCanvas); });
    var target = 0.943, cur = 0;
    function drawGauge(p) {
      var ctx = gd.ctx, w = gd.w, h = gd.h;
      ctx.clearRect(0, 0, w, h);
      var cx = w / 2, cy = h / 2 + 6, r = Math.min(w, h) / 2 - 8;
      var start = Math.PI * 0.8, end = Math.PI * 2.2;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(cx, cy, r, start, end); ctx.strokeStyle = "rgba(18,28,54,0.08)"; ctx.lineWidth = 7; ctx.stroke();
      var ang = start + (end - start) * p;
      var grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "#2f6bff"); grad.addColorStop(1, "#07b39b");
      ctx.beginPath(); ctx.arc(cx, cy, r, start, ang); ctx.strokeStyle = grad; ctx.lineWidth = 7;
      ctx.shadowColor = "rgba(47,107,255,0.4)"; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
    }
    watch(gaugeCanvas, 0.2, function () {
      if (reduced) { drawGauge(target); document.getElementById("gaugeVal").textContent = "94"; return; }
      var st = performance.now();
      (function anim(now) {
        var p = Math.min(1, (now - st) / 1500);
        cur = target * easeOut(p);
        drawGauge(cur);
        document.getElementById("gaugeVal").textContent = Math.round(cur * 100);
        if (p < 1) requestAnimationFrame(anim);
      })(performance.now());
    });
  }

  /* ----------------------------------------------------------
     9. Contact form (fake submit)
     ---------------------------------------------------------- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.style.display = "none";
      document.getElementById("formSuccess").classList.add("show");
    });
  }

  /* ----------------------------------------------------------
     10. Smooth anchor + mobile menu (simple)
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1) {
        var t = document.querySelector(id);
        if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" }); }
      }
    });
  });
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
    // close after picking a destination (nav link or the CTA inside the panel)
    nav.querySelectorAll(".nav-links a, .nav-right a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    // close on Escape, and whenever we grow back to desktop width
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 720) closeMenu(); });
  }

  /* ----------------------------------------------------------
     11. Kick off in-view checks (multiple passes cover font/layout shifts)
     ---------------------------------------------------------- */
  checkWatchers();
  requestAnimationFrame(checkWatchers);
  setTimeout(checkWatchers, 200);
  setTimeout(checkWatchers, 600);
  window.addEventListener("load", function () { checkWatchers(); setTimeout(checkWatchers, 300); });
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(checkWatchers); }
})();
