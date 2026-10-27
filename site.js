/* ============================================================
   NORVA — Intelligence Portal
   1. i18n (+ decoding transition)   6. Privacy columns
   2. Reveal on scroll               7. Row-level security
   3. Halftone north star            8. Audit log, versions, brand
   4. Live demo                      9. Pulso Comercial dashboard
   5. How-it-works loops            10. Contact form (HubSpot)
   ============================================================ */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function onVisible(el, cb, opts) {
    if (!el) return;
    if (!("IntersectionObserver" in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting); }); }, opts || { threshold: 0.25 }).observe(el);
  }

  /* ----------------------------------------------------------
     1. i18n
     ---------------------------------------------------------- */
  var EN = {
    "skip": "Skip to content",
    "nav.demo": "Demo", "nav.how": "How it works", "nav.gov": "Governance", "nav.pulse": "Example",
    "cta.demo": "Book a demo", "cta.demo2": "Book a demo", "cta.try": "Try the live demo",
    "hero.tag": "Norva Intelligence Portal",
    "hero.title": "Dashboards ready in minutes.",
    "hero.sub": "Describe the decision in plain language. The AI connects your data, protects what's sensitive and publishes a governed web dashboard to your company portal.",
    "hero.sources": "Connects to",
    "demo.label": "Live demo",
    "demo.title": "Ask in plain language.<br />Watch the dashboard appear.",
    "demo.sub": "Write the decision you need to make, or pick an example. The simulation uses the public sales_data_sample dataset.",
    "ask.label": "The decision, in one sentence", "ask.go": "Generate dashboard",
    "ask.e1": "Average ticket by territory", "ask.e2": "Sales seasonality", "ask.e3": "Orders by deal size",
    "demo.nav": "Web dashboards", "demo.nav2": "Studies", "demo.kind": "Web dashboard", "demo.locked": "7 protected columns",
    "demo.k0": "Sales (US$)", "demo.k1": "Units", "demo.k2": "Average price (US$)", "demo.k3": "Order lines",
    "demo.c0": "Sales by month", "demo.c1": "Sales by product line", "demo.c2": "Sales by territory", "demo.empty": "Ask the agent for another chart",
    "how.label": "How it works", "how.title": "Three steps. None of them is writing code.",
    "how.drop": "Drop a CSV or Excel file, or connect a database", "how.meta": "2,823 rows · 25 columns",
    "how.s1n": "Step 01", "how.s1": "Connect the data", "how.s1p": "A CSV or Excel spreadsheet, a PostgreSQL or MySQL database. The agent reads columns, types and volume in seconds.",
    "how.q": "Which decision will it help you make?", "how.sug1": "+ Compare SALES by PRODUCTLINE", "how.sug2": "+ Best and worst territory",
    "how.s2n": "Step 02", "how.s2": "Describe the decision", "how.s2p": "One or two sentences. The AI suggests indicators and charts from your own columns.",
    "how.pub": "Published · v1",
    "how.s3n": "Step 03", "how.s3": "Review and publish", "how.s3p": "The dashboard starts as a draft. You review it and publish to the portal, with your company's login and permissions.",
    "gov.label": "Security & governance", "gov.title": "Fast, without losing control.",
    "gov.sub": "Speed comes from the AI. The rules stay your company's. Click the components below: they work like in the portal.",
    "gov.privQ": "What can the AI see?", "gov.recv": "What the AI receives",
    "gov.b1": "The AI sees the summary, never the rows.", "gov.b1p": "It receives each column's profile. From personal or confidential columns, only the name and type. Click a column to protect it.",
    "gov.rlsT": "Visible revenue",
    "gov.b2": "Everyone sees only their own rows.", "gov.b2p": "Groups, per-user attributes and row-level security rules. Choose who is viewing: the same dashboard changes its slice.",
    "gov.b3": "Everything is audited", "gov.b3p": "Who published, edited with AI, restored or changed access. No spreadsheet data goes into the log.",
    "gov.v3": "Quarterly target on the KPI", "gov.v2": "Sales by territory", "gov.v1": "First publication", "gov.restore": "Restore",
    "gov.b4": "Changing is asking. Going back is one click.", "gov.b4p": "Changes requested in plain language become a new version. Any previous version can be restored.",
    "gov.b5": "With your company's brand", "gov.b5p": "Name, color and logo across the whole portal, login included, with no new build.",
    "pulse.label": "Real example", "pulse.title": "From one KPI to the whole sales cockpit.",
    "pulse.sub": "Pulso Comercial is a web dashboard built in the portal: four tabs, filters, twenty indicators on top of CRM and ERP. Change the region and browse the tabs.",
    "pulse.region": "Region", "pulse.all": "All regions",
    "pulse.t0": "Overview", "pulse.t1": "Channels", "pulse.t2": "Products & customers", "pulse.t3": "Sales team",
    "faq.title": "Questions before the demo.", "faq.more": "Still have a question?",
    "faq.q1": "Does the AI see my data?", "faq.a1": "It works with a summary of each column, never the rows. From columns marked as personal or confidential, it only gets the name and type. Handling follows Brazil's LGPD.",
    "faq.q2": "Where does the data come from?", "faq.a2": "CSV and Excel spreadsheets, PostgreSQL and MySQL databases and existing Power BI reports, in the same governed environment. Other sources are part of the rollout design.",
    "faq.q3": "Do I have to drop Power BI?", "faq.a3": "No. Power BI reports and web dashboards share one catalog, with the same login and the same access rules.",
    "faq.q4": "How does a dashboard change after it's published?", "faq.a4": "You describe the change in plain language, the AI applies it to a draft and the new version ships after review. Every version is audited and can be restored.",
    "faq.q5": "Who decides who sees what?", "faq.a5": "Your company. Corporate login, Microsoft included, groups, per-user attributes and row-level security.",
    "faq.q6": "What if the problem is bigger than a dashboard?", "faq.a6": "Norva has a data engineering and data science team to structure what comes before: pipelines, models and automations.",
    "d.label": "Demo", "d.title": "Bring a real decision.", "d.sub": "In 30 minutes we show the portal with a sample of your data, from upload to publication.",
    "d.l1": "Nothing to install", "d.l2": "With your data or a similar sample", "d.l3": "Reply within two business days",
    "form.name": "Name", "form.company": "Company", "form.email": "Work email", "form.msg": "Which decision do you want to support?",
    "form.ph": "E.g. margin by region and customer, done in spreadsheets today", "form.consent": "I agree that Norva may contact me about this request.",
    "form.send": "Book a demo", "form.ok": "Request received.", "form.okP": "We'll reply within two business days to schedule the demo.",
    "ft.tag": "Web dashboards built, protected and maintained with AI.", "ft.prod": "Product", "ft.contact": "Contact",
    "ft.cookies": "Cookie preferences", "ft.copy": "© 2026 Norva, a Kystone Group company", "ft.lgpd": "Data handled under Brazil's LGPD"
  };

  var STR = {
    pt: {
      langBtn: "EN", langAria: "Switch to English",
      a1: ["Agente de dados", "leu sales_data_sample", "2.823 linhas · 25 colunas · 2003 a 2005"],
      a2: ["Privacidade", "protegeu 7 colunas pessoais", "CUSTOMERNAME, PHONE, ADDRESSLINE1 e mais 4"],
      a3: ["Interface", "montou 4 indicadores e 2 gráficos", "vendas por mês · vendas por linha"],
      a4: ["Governança", "aplicou as regras de acesso", "grupo Comercial · login corporativo"],
      q2: "Adicione as vendas por território.",
      a5: ["Interface", "adicionou o gráfico por território", "rascunho v2 · mesmas regras de acesso"],
      done1: "Publicado no portal · v1", done2: "v2 publicada · registrada na auditoria",
      s0: "aguardando pedido", s1: "a IA está trabalhando", s2: "publicado",
      draft: "rascunho", v1: "v1 · publicado", v2: "v2 · publicado",
      goal: "Acompanhar vendas por linha de produto e achar os territórios mais fracos.",
      prot: "protegido", types: { int: "inteiro", dec: "decimal", txt: "texto", cat: "categoria", date: "data" }, nprot: " protegidas",
      vals: " valores",
      audit: [["ana.ribeiro", "abriu", "Pulso Comercial"], ["IA", "editou com IA", "Vendas · v3"], ["admin", "publicou", "Vendas · v3"], ["rui.costa", "exportou", "recorte Sul"], ["admin", "alterou acesso", "grupo Comercial Sul"], ["lia.melo", "perguntou aos dados", "margem por produto"], ["bruno.c", "enviou planilha", "metas_2027.xlsx"]],
      restored: "restaurou",
      err: "Não conseguimos enviar. Tente de novo ou escreva para hello@norva.cloud."
    },
    en: {
      langBtn: "PT", langAria: "Mudar para português",
      a1: ["Data agent", "read sales_data_sample", "2,823 rows · 25 columns · 2003 to 2005"],
      a2: ["Privacy", "protected 7 personal columns", "CUSTOMERNAME, PHONE, ADDRESSLINE1 and 4 more"],
      a3: ["Interface", "built 4 indicators and 2 charts", "sales by month · sales by line"],
      a4: ["Governance", "applied the access rules", "Sales group · corporate login"],
      q2: "Add sales by territory.",
      a5: ["Interface", "added the territory chart", "draft v2 · same access rules"],
      done1: "Published to the portal · v1", done2: "v2 published · logged in the audit trail",
      s0: "waiting for a request", s1: "the AI is working", s2: "published",
      draft: "draft", v1: "v1 · published", v2: "v2 · published",
      goal: "Track sales by product line and find the weakest territories.",
      prot: "protected", types: { int: "integer", dec: "decimal", txt: "text", cat: "category", date: "date" }, nprot: " protected",
      vals: " values",
      audit: [["ana.ribeiro", "opened", "Pulso Comercial"], ["AI", "edited with AI", "Sales · v3"], ["admin", "published", "Sales · v3"], ["rui.costa", "exported", "South slice"], ["admin", "changed access", "South Sales group"], ["lia.melo", "asked the data", "margin by product"], ["bruno.c", "uploaded", "targets_2027.xlsx"]],
      restored: "restored",
      err: "We couldn't send your message. Please try again or email hello@norva.cloud."
    }
  };

  var lang = "pt";
  var ptCache = new Map();
  var langListeners = [];
  function S() { return STR[lang]; }
  function num(v, d) { return v.toLocaleString(lang === "en" ? "en-US" : "pt-BR", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }

  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  function inView(el) { var r = el.getBoundingClientRect(); return r.bottom > -40 && r.top < innerHeight + 40 && r.width > 0; }
  function decode(el, html) {
    el.innerHTML = html;
    if (reduced || !inView(el)) return;
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [], n;
    while ((n = w.nextNode())) if (n.nodeValue.trim()) nodes.push({ node: n, text: n.nodeValue });
    var total = nodes.reduce(function (a, b) { return a + b.text.length; }, 0);
    if (!total) return;
    var dur = Math.min(850, 340 + total * 8), t0 = performance.now();
    el.__dec = t0;
    (function frame(now) {
      if (el.__dec !== t0) return;
      var p = Math.min(1, (now - t0) / dur), settled = Math.floor(p * p * total * 1.05), seen = 0;
      nodes.forEach(function (o) {
        var out = "";
        for (var i = 0; i < o.text.length; i++, seen++) {
          var c = o.text[i];
          out += seen < settled || /[\s.,:;!?()·\-–+]/.test(c) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        o.node.nodeValue = out;
      });
      if (p < 1) requestAnimationFrame(frame); else nodes.forEach(function (o) { o.node.nodeValue = o.text; });
    })(t0);
  }

  $$("[data-i18n], [data-q]").forEach(function (el) { ptCache.set(el, el.innerHTML); });
  function setLang(next, animate) {
    lang = next === "en" ? "en" : "pt";
    doc.lang = lang === "en" ? "en" : "pt-BR";
    $$("[data-i18n], [data-q]").forEach(function (el) {
      var key = el.getAttribute("data-i18n") || el.getAttribute("data-q");
      var html = lang === "en" && EN[key] != null ? EN[key] : ptCache.get(el);
      if (html === el.innerHTML) return;
      if (animate) decode(el, html); else el.innerHTML = html;
    });
    $$("[data-i18n-ph]").forEach(function (el) {
      if (!el.dataset.ptPh) el.dataset.ptPh = el.getAttribute("placeholder") || "";
      var key = el.getAttribute("data-i18n-ph");
      el.setAttribute("placeholder", lang === "en" && EN[key] ? EN[key] : el.dataset.ptPh);
    });
    var t = $("#langToggle");
    t.textContent = S().langBtn;
    t.setAttribute("aria-label", S().langAria);
    try { localStorage.setItem("kystone_lang", lang); } catch (e) {}
    langListeners.forEach(function (fn) { fn(); });
  }
  $("#langToggle").addEventListener("click", function () { setLang(lang === "pt" ? "en" : "pt", true); });
  var saved = "pt";
  try { saved = localStorage.getItem("kystone_lang") || "pt"; } catch (e) {}
  if (saved === "en") setLang("en", false);
  var prefs = $("#cookiePrefs");
  if (prefs) prefs.addEventListener("click", function () { if (window.NorvaConsent) window.NorvaConsent.open(); });

  /* ----------------------------------------------------------
     2. Reveal on scroll
     ---------------------------------------------------------- */
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".head > *, .ask, .examples, .sec .hatch, .step, .panel, .faq-list details, .cta-copy > *, .form").forEach(function (el) {
      var i = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty("--d", Math.min(i, 5) * 0.07 + "s");
      el.classList.add("rv");
      io.observe(el);
    });
  }

  /* ----------------------------------------------------------
     3. Halftone north star (the logo, drawn as a dot field)
     ---------------------------------------------------------- */
  (function () {
    var cv = $("#star");
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d");
    var STAR = [[12, 1.5], [14.3, 9.7], [22.5, 12], [14.3, 14.3], [12, 22.5], [9.7, 14.3], [1.5, 12], [9.7, 9.7]];
    var dots = [], W = 0, H = 0, dpr = 1, gap = 11, poly = [], cx = 0, cy = 0, visible = true, mouse = { x: -9999, y: -9999 }, t0 = performance.now();

    function inside(x, y) {
      var c = false;
      for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c;
      }
      return c;
    }
    function edgeDist(x, y) {
      var m = Infinity;
      for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        var ax = poly[j][0], ay = poly[j][1], bx = poly[i][0], by = poly[i][1];
        var dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
        var px = ax + t * dx - x, py = ay + t * dy - y;
        m = Math.min(m, Math.sqrt(px * px + py * py));
      }
      return m;
    }
    function build() {
      var r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      gap = Math.max(8, Math.round(W / 46));
      var s = W / 24 * 0.92, ox = (W - 24 * s) / 2, oy = (H - 24 * s) / 2;
      poly = STAR.map(function (p) { return [ox + p[0] * s, oy + p[1] * s]; });
      cx = W / 2; cy = H / 2;
      dots = [];
      for (var y = gap / 2; y < H; y += gap) for (var x = gap / 2; x < W; x += gap) {
        var inS = inside(x, y), d = edgeDist(x, y), dc = Math.hypot(x - cx, y - cy);
        dots.push({ x: x, y: y, inS: inS, d: d, dc: dc, core: dc < W * 0.09 });
      }
    }
    function draw(now) {
      var t = (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var maxR = gap * 0.46;
      for (var i = 0; i < dots.length; i++) {
        var p = dots[i], r, col;
        var md = Math.hypot(p.x - mouse.x, p.y - mouse.y), bump = md < 110 ? (1 - md / 110) : 0;
        if (p.inS) {
          var depth = Math.min(1, p.d / (gap * 3.2));
          var wave = reduced ? 1 : 0.78 + 0.22 * Math.sin(t * 1.6 - p.dc * 0.045);
          r = maxR * (0.35 + 0.65 * depth) * wave * (1 + bump * 0.35);
          col = p.core ? "#2f6bff" : "#1d2130";
        } else {
          var halo = Math.max(0, 1 - p.d / (gap * 4));
          r = halo > 0 ? maxR * 0.32 * halo * (reduced ? 1 : 0.7 + 0.3 * Math.sin(t * 2 - p.d * 0.1)) + bump * maxR * 0.5 : 0.75 + bump * maxR * 0.45;
          col = halo > 0 ? "#1d2130" : (bump > 0 ? "#2f6bff" : "rgba(29,33,48,.22)");
        }
        if (r < 0.4) continue;
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
      }
    }
    function loop(now) {
      if (visible) draw(now);
      if (!reduced) requestAnimationFrame(loop);
    }
    build();
    addEventListener("resize", function () { build(); if (reduced) draw(performance.now()); });
    cv.parentElement.addEventListener("pointermove", function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; if (reduced) draw(performance.now()); });
    cv.parentElement.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
    onVisible(cv, function (v) { visible = v; }, { threshold: 0 });
    if (reduced) draw(performance.now()); else requestAnimationFrame(loop);
  })();

  /* ----------------------------------------------------------
     4. Live demo
     ---------------------------------------------------------- */
  (function () {
    var app = $("#app");
    if (!app) return;
    var input = $("#askInput"), feed = $("#feed"), typingEl = $("#typing"), statusEl = $("#appStatus");
    var versionEl = $("#appVersion"), titleEl = $("#appTitle"), newItem = $("#appNew");
    var kpis = $$(".kpi", app), cLine = $(".c-line", app), cBars = $(".c-bars", app), cNew = $("#cardNew");
    var lineSvg = $("#lineChart"), barBox = $("#barChart"), colBox = $("#colChart");

    // sales_data_sample: monthly sales (US$ thousands) and totals
    var y03 = [129, 140, 175, 201, 192, 150, 141, 197, 264, 596, 1029, 452];
    var y04 = [316, 311, 205, 206, 273, 286, 327, 461, 320, 552, 1089, 372];
    var lines = [["Classic Cars", 3.92], ["Vintage Cars", 1.90], ["Motorcycles", 1.17], ["Trucks & Buses", 1.13], ["Planes", 0.98], ["Ships", 0.71]];
    var terr = [["EMEA", 4.98], ["NA", 3.85], ["APAC", 0.75], ["Japan", 0.46]];
    var MONTHS = { pt: "JFMAMJJASOND", en: "JFMAMJJASOND" };

    function smooth(pts) {
      var d = "M" + pts[0][0] + " " + pts[0][1];
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        d += " C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + " " +
             (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
      }
      return d;
    }
    var clipW = 0, clipRect;
    var LW = 520;
    function buildLine() {
      var box = lineSvg.getBoundingClientRect();
      var W = Math.max(280, Math.round(box.width || 520)), H = Math.max(160, Math.round(box.height || 200)), L = 34, R = 8, T = 14, B = 22, max = 1200;
      LW = W;
      lineSvg.setAttribute("viewBox", "0 0 " + W + " " + H);
      var X = function (i) { return L + i * (W - L - R) / 11; }, Y = function (v) { return T + (1 - v / max) * (H - T - B); };
      var g = "";
      [0, 400, 800, 1200].forEach(function (v) { g += '<line class="gl" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '"/><text class="ax" x="' + (L - 6) + '" y="' + (Y(v) + 3) + '" text-anchor="end">' + v + "</text>"; });
      MONTHS[lang].split("").forEach(function (m, i) { g += '<text class="ax" x="' + X(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + m + "</text>"; });
      var p3 = y03.map(function (v, i) { return [X(i), Y(v)]; }), p4 = y04.map(function (v, i) { return [X(i), Y(v)]; });
      var d4 = smooth(p4);
      var nx = X(10), ny = Y(1089);
      lineSvg.innerHTML = '<defs><clipPath id="lc"><rect id="lcRect" x="0" y="0" width="0" height="' + H + '"/></clipPath></defs>' + g +
        '<g clip-path="url(#lc)"><path class="a04" d="' + d4 + " L" + X(11) + " " + Y(0) + " L" + X(0) + " " + Y(0) + ' Z"/><path class="s03" d="' + smooth(p3) + '"/><path class="s04" d="' + d4 + '"/>' +
        '<circle cx="' + nx + '" cy="' + ny + '" r="4" fill="#2f6bff"/><text class="note" x="' + (nx - 8) + '" y="' + (ny + 2) + '" text-anchor="end">' + (lang === "en" ? "Nov peak" : "pico em nov") + "</text></g>";
      clipRect = $("#lcRect", lineSvg);
      clipRect.setAttribute("width", clipW);
    }
    function revealLine() {
      var t0 = performance.now(), dur = 1500;
      (function f(now) {
        var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        clipW = LW * e; clipRect.setAttribute("width", clipW);
        if (p < 1) requestAnimationFrame(f);
      })(t0);
    }
    function buildBars() {
      barBox.innerHTML = lines.map(function (l) {
        return '<div class="hb"><span>' + l[0] + '</span><span class="tr"><i data-w="' + (l[1] / 3.92 * 100).toFixed(0) + '%"></i></span><span class="v">' + num(l[1], 2) + "</span></div>";
      }).join("");
      colBox.innerHTML = terr.map(function (t) {
        return "<div><b>" + num(t[1], 2) + '</b><i data-h="' + (t[1] / 4.98 * 100).toFixed(0) + '%"></i><span>' + t[0] + "</span></div>";
      }).join("");
    }
    var FMT = {
      mi: function (v) { return num(v, 2) + (lang === "en" ? "M" : " mi"); },
      mil: function (v) { return num(v, 2) + (lang === "en" ? "K" : " mil"); },
      dec: function (v) { return num(v, 2); },
      int: function (v) { return num(Math.round(v)); }
    };

    var run = 0, started = false;
    function alive(id) { return id === run; }
    function setStatus(k) { statusEl.textContent = S()[k]; }
    function cap(q) { q = q.trim().replace(/[.!?]+$/, ""); return q.charAt(0).toUpperCase() + q.slice(1); }
    function scrollFeed() { feed.scrollTop = feed.scrollHeight; }
    function addUser(text) { var el = document.createElement("div"); el.className = "msg-u msg-in"; el.textContent = text; feed.appendChild(el); scrollFeed(); }
    function addAgent(parts, cls) {
      var el = document.createElement("div");
      el.className = "msg-a " + (cls || "run") + " msg-in";
      el.innerHTML = '<span class="ic"></span><span class="tx"><b></b> <span></span><small></small></span>';
      el.querySelector("b").textContent = parts[0];
      el.querySelector(".tx > span").textContent = parts[1];
      el.querySelector("small").textContent = parts[2];
      feed.appendChild(el); scrollFeed();
      return el;
    }
    function addDone(text) { var el = document.createElement("div"); el.className = "msg-done msg-in"; el.textContent = text; feed.appendChild(el); scrollFeed(); }
    function countUp(k, id) {
      var b = k.querySelector("b"), target = parseFloat(b.dataset.val), fmt = b.dataset.fmt, t0 = performance.now();
      k.classList.add("on");
      (function f(now) {
        if (!alive(id)) return;
        var p = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - p, 3);
        b.textContent = FMT[fmt](target * e);
        if (p < 1) requestAnimationFrame(f);
      })(t0);
    }
    async function typeInto(el, text, id) {
      el.textContent = "";
      for (var i = 1; i <= text.length; i++) {
        if (!alive(id)) return false;
        el.textContent = text.slice(0, i);
        await sleep(reduced ? 0 : 14 + Math.random() * 22);
      }
      return alive(id);
    }
    async function step(parts, ms, id, during) {
      var el = addAgent(parts, "run");
      if (during) during();
      await sleep(ms);
      if (!alive(id)) return false;
      el.className = "msg-a ok";
      return true;
    }
    function reset(q) {
      app.classList.remove("is-working", "is-done", "is-published", "s-priv");
      feed.innerHTML = ""; typingEl.textContent = "";
      versionEl.textContent = S().draft; titleEl.textContent = cap(q); newItem.textContent = "";
      kpis.forEach(function (k) { k.classList.remove("on"); k.querySelector("b").textContent = "—"; });
      [cLine, cBars, cNew].forEach(function (c) { c.classList.remove("on"); });
      $$(".hb .tr i", barBox).forEach(function (i) { i.style.width = "0"; });
      $$("i", colBox).forEach(function (i) { i.style.height = "0"; });
      clipW = 0; if (clipRect) clipRect.setAttribute("width", 0);
      setStatus("s0");
    }
    function charts(id) {
      kpis.forEach(function (k, i) { setTimeout(function () { if (alive(id)) countUp(k, id); }, i * 130); });
      setTimeout(function () { if (!alive(id)) return; cLine.classList.add("on"); revealLine(); }, 250);
      setTimeout(function () {
        if (!alive(id)) return;
        cBars.classList.add("on");
        $$(".hb .tr i", barBox).forEach(function (i, n) { setTimeout(function () { if (alive(id)) i.style.width = i.dataset.w; }, n * 70); });
      }, 500);
    }
    async function go() {
      var id = ++run, s = S();
      var q = input.value.trim() || input.defaultValue;
      started = true;
      reset(q);
      if (reduced) {
        addUser(q); [s.a1, s.a2, s.a3, s.a4].forEach(function (a) { addAgent(a, "ok"); }); addDone(s.done1);
        app.classList.add("is-done", "is-published", "s-priv"); versionEl.textContent = s.v1; newItem.textContent = cap(q); setStatus("s2");
        kpis.forEach(function (k) { k.classList.add("on"); var b = k.querySelector("b"); b.textContent = FMT[b.dataset.fmt](parseFloat(b.dataset.val)); });
        cLine.classList.add("on"); cBars.classList.add("on"); clipW = LW; clipRect.setAttribute("width", LW);
        $$(".hb .tr i", barBox).forEach(function (i) { i.style.width = i.dataset.w; });
        return;
      }
      await sleep(350); if (!alive(id)) return;
      if (!(await typeInto(typingEl, q, id))) return;
      await sleep(250); if (!alive(id)) return;
      typingEl.textContent = ""; addUser(q);
      app.classList.add("is-working"); setStatus("s1");
      await sleep(350); if (!alive(id)) return;
      if (!(await step(s.a1, 900, id))) return;
      if (!(await step(s.a2, 800, id, function () { app.classList.add("s-priv"); }))) return;
      if (!(await step(s.a3, 1500, id, function () { charts(id); }))) return;
      if (!(await step(s.a4, 700, id))) return;
      addDone(s.done1);
      app.classList.remove("is-working"); app.classList.add("is-done", "is-published");
      versionEl.textContent = s.v1; newItem.textContent = cap(q); setStatus("s2");
      await sleep(2400); if (!alive(id)) return;
      if (!(await typeInto(typingEl, s.q2, id))) return;
      await sleep(250); if (!alive(id)) return;
      typingEl.textContent = ""; addUser(s.q2);
      app.classList.remove("is-done"); app.classList.add("is-working"); setStatus("s1"); versionEl.textContent = s.draft;
      await sleep(300); if (!alive(id)) return;
      if (!(await step(s.a5, 1200, id, function () {
        setTimeout(function () {
          if (!alive(id)) return;
          cNew.classList.add("on");
          $$("i", colBox).forEach(function (i, n) { setTimeout(function () { if (alive(id)) i.style.height = i.dataset.h; }, n * 90); });
        }, 400);
      }))) return;
      addDone(s.done2);
      app.classList.remove("is-working"); app.classList.add("is-done");
      versionEl.textContent = s.v2; setStatus("s2");
    }

    buildLine(); buildBars(); reset(input.value);
    var rz;
    addEventListener("resize", function () {
      clearTimeout(rz);
      rz = setTimeout(function () { var full = clipW >= LW; buildLine(); if (full) { clipW = LW; clipRect.setAttribute("width", LW); } }, 150);
    });
    $("#askForm").addEventListener("submit", function (e) { e.preventDefault(); go(); });
    $$(".examples button").forEach(function (b) { b.addEventListener("click", function () { input.value = b.textContent.trim(); go(); }); });
    onVisible(app, function (v) { if (v && !started) go(); }, { threshold: 0.35 });
    var enDefault = "Sales by product line, without exposing customers";
    langListeners.push(function () {
      if (input.value === input.defaultValue || input.value === enDefault) input.value = lang === "en" ? enDefault : input.defaultValue;
      var full = clipW >= LW;
      buildLine(); buildBars();
      if (full) { clipW = LW; clipRect.setAttribute("width", LW); }
      if (started) go(); else reset(input.value);
    });
  })();

  /* ----------------------------------------------------------
     5. How-it-works loops
     ---------------------------------------------------------- */
  (function () {
    var src = $("#miniSrc"), goal = $("#miniGoal"), pub = $("#miniPub"), gt = $("#goalTyping");
    if (!src) return;
    var visible = false, looping = false;
    async function loop() {
      if (looping) return;
      looping = true;
      while (visible) {
        src.className = "mini mini-src"; goal.className = "mini mini-goal"; pub.className = "mini mini-pub"; gt.textContent = "";
        await sleep(600);
        src.classList.add("drag"); await sleep(700);
        src.classList.remove("drag"); src.classList.add("has"); await sleep(1500);
        src.classList.add("read"); await sleep(700);
        var g = S().goal;
        for (var i = 1; i <= g.length && visible; i++) { gt.textContent = g.slice(0, i); await sleep(26); }
        goal.classList.add("sugs"); await sleep(900);
        pub.classList.add("fill"); await sleep(1100);
        pub.classList.add("done"); await sleep(3600);
      }
      looping = false;
    }
    if (reduced) { src.classList.add("has", "read"); gt.textContent = S().goal; goal.classList.add("sugs"); pub.classList.add("fill", "done"); return; }
    onVisible($(".steps"), function (v) { visible = v; if (v) loop(); });
  })();

  /* ----------------------------------------------------------
     6. Privacy: what the AI can see
     ---------------------------------------------------------- */
  (function () {
    var pick = $("#colsPick"), rows = $("#recvRows"), count = $("#recvCount");
    if (!pick) return;
    var P = {
      ORDERNUMBER: ["int", "10.100 – 10.425"], SALES: ["dec", "482 – 14.083"], CUSTOMERNAME: ["txt", "92"], PRODUCTLINE: ["cat", "7"],
      PHONE: ["txt", "91"], TERRITORY: ["cat", "4"], ADDRESSLINE1: ["txt", "92"], DEALSIZE: ["cat", "3"], POSTALCODE: ["txt", "73"], ORDERDATE: ["date", "2003 – 2005"]
    };
    var order = ["SALES", "CUSTOMERNAME", "PRODUCTLINE", "PHONE"];
    function render(flash) {
      var s = S();
      rows.innerHTML = order.map(function (c) {
        var btn = $$(".col", pick).filter(function (b) { return b.textContent === c; })[0];
        var lk = btn.classList.contains("lk"), p = P[c];
        var val = lk ? s.prot : (p[0] === "txt" || p[0] === "cat" ? p[1] + s.vals : p[1]);
        return '<div class="recv-r' + (lk ? " lk" : "") + (c === flash ? " flash" : "") + '"><b>' + c + "</b><span>" + s.types[p[0]] + '</span><span class="p">' + val + "</span></div>";
      }).join("");
      count.textContent = $$(".col.lk", pick).length + s.nprot;
    }
    $$(".col", pick).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.classList.contains("lk")));
      b.addEventListener("click", function () {
        b.classList.toggle("lk");
        b.setAttribute("aria-pressed", String(b.classList.contains("lk")));
        var c = b.textContent;
        order = [c].concat(order.filter(function (o) { return o !== c; })).slice(0, 4);
        render(c);
      });
    });
    render();
    langListeners.push(function () { render(); });
  })();

  /* ----------------------------------------------------------
     7. Row-level security: view as
     ---------------------------------------------------------- */
  (function () {
    var box = $("#rlsBars"), total = $("#rlsTotal");
    if (!box) return;
    var R = [["se", "Sudeste", 2.54], ["s", "Sul", 1.50], ["ne", "Nordeste", 0.84], ["co", "Centro-Oeste", 0.49]];
    var user = "all";
    function money(v) { return lang === "en" ? "R$" + num(v, 2) + "M" : "R$ " + num(v, 2) + " mi"; }
    function render() {
      box.innerHTML = R.map(function (r) {
        var on = user === "all" || user === r[0];
        return '<div class="' + (on ? "" : "off") + '"><b>' + (on ? num(r[2], 2) : "—") + '</b><i style="height:' + (r[2] / 2.54 * 78).toFixed(0) + '%"></i><span>' + r[1] + "</span></div>";
      }).join("");
      var sum = R.reduce(function (a, r) { return a + (user === "all" || user === r[0] ? r[2] : 0); }, 0);
      total.textContent = money(user === "all" ? 5.37 : sum);
    }
    $$("#rls .rls-users button").forEach(function (b) {
      b.addEventListener("click", function () {
        user = b.dataset.u;
        $$("#rls .rls-users button").forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        render();
      });
    });
    render();
    langListeners.push(render);
  })();

  /* ----------------------------------------------------------
     8. Audit log, versions, brand
     ---------------------------------------------------------- */
  var pushAudit = function () {};
  (function () {
    var box = $("#audit");
    if (!box) return;
    var i = 0, visible = false, timer = null, clock = 9 * 60 + 41;
    function stamp() { clock += 3 + Math.floor(Math.random() * 6); var h = Math.floor(clock / 60) % 24, m = clock % 60; return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m; }
    function add(e) {
      var el = document.createElement("div");
      el.className = "log";
      el.innerHTML = "<time>" + stamp() + "</time><span><b></b> <span></span> <em></em></span>";
      el.querySelector("b").textContent = e[0];
      el.querySelector("span > span").textContent = e[1];
      el.querySelector("em").textContent = e[2];
      box.insertBefore(el, box.firstChild);
      while (box.children.length > 6) box.removeChild(box.lastChild);
    }
    pushAudit = add;
    function tick() { add(S().audit[i++ % S().audit.length]); }
    for (var k = 0; k < 5; k++) tick();
    if (reduced) return;
    onVisible(box, function (v) {
      visible = v;
      if (v && !timer) timer = setInterval(function () { if (visible) tick(); }, 2400);
      if (!v && timer) { clearInterval(timer); timer = null; }
    });
  })();

  (function () {
    var vers = $$("#vers .ver");
    if (!vers.length) return;
    function setCur(v) { vers.forEach(function (el) { el.classList.toggle("cur", el.dataset.v === v); }); }
    setCur("3");
    vers.forEach(function (el) {
      el.querySelector("button").addEventListener("click", function () {
        setCur(el.dataset.v);
        pushAudit(["admin", S().restored, "Vendas · v" + el.dataset.v]);
      });
    });
  })();

  (function () {
    var brand = $("#brand");
    if (!brand) return;
    $$(".brand-swatches button", brand).forEach(function (b) {
      b.addEventListener("click", function () {
        brand.style.setProperty("--bc", getComputedStyle(b).getPropertyValue("--c").trim());
        $$(".brand-swatches button", brand).forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      });
    });
  })();

  /* ----------------------------------------------------------
     9. Pulso Comercial: a live, filterable dashboard
     ---------------------------------------------------------- */
  (function () {
    var body = $("#pulseBody"), sel = $("#pulseRegion");
    if (!body) return;
    var tab = 0;
    var REG = {
      all: { name: "Total", rev: 5.37, meta: 5.27, mg: 31.8, yoy: 18.3, cli: 207, conv: 24.6 },
      se: { name: "Sudeste", rev: 2.54, meta: 2.48, mg: 33.1, yoy: 16.8, cli: 94, conv: 25.1 },
      s: { name: "Sul", rev: 1.50, meta: 1.48, mg: 32.4, yoy: 15.2, cli: 58, conv: 24.3 },
      ne: { name: "Nordeste", rev: 0.84, meta: 0.79, mg: 29.7, yoy: 31.4, cli: 36, conv: 26.0 },
      co: { name: "Centro-Oeste", rev: 0.49, meta: 0.53, mg: 27.9, yoy: 8.9, cli: 19, conv: 21.8 }
    };
    var REAL = [392, 418, 371, 402, 428, 447, 436, 459, 472, 488, 509, 548];
    var META = [410, 415, 405, 420, 430, 435, 440, 445, 455, 460, 470, 485];
    var FUN = [["Leads", 3420], ["MQL", 1980], ["SQL", 1140], ["Propostas", 612], ["Negociação", 318], ["Ganhos", 207]];
    var CH = [["Direto", 2658, "#2f6bff", 881, 412, 89, 29.1, 29.9, 2410], ["Parceiros", 1634, "#7fa2ff", 701, 298, 60, 22.5, 27.2, 1980], ["Digital", 860, "#12976f", 1568, 344, 45, 18.4, 19.1, 940], ["Eventos", 222, "#c27a0e", 232, 86, 13, 11.2, 17.1, 3120]];
    var PROD = [["Plano Enterprise", 1284], ["Módulo Analytics", 912], ["Plano Pro", 774], ["Integração ERP", 563], ["Consultoria BI", 498], ["Treinamento in company", 362], ["Módulo Previsão", 331], ["Plano Essencial", 287]];
    var ACC = [["Grupo Atlântico", "Varejo", "se", 412, 22, 0], ["Metalúrgica Paraná", "Indústria", "s", 338, 14, 0], ["Rede Bem Estar", "Saúde", "se", 291, 31, 0], ["Cooperativa Cerrado", "Agronegócio", "co", 247, -6, 1], ["Logística Nordeste", "Serviços", "ne", 226, 48, 0], ["Supermercados Serra", "Varejo", "s", 204, 9, 0], ["Têxtil Vale", "Indústria", "s", 188, -12, 2], ["Clínicas Horizonte", "Saúde", "ne", 173, 19, 0], ["Construtora Alicerce", "Serviços", "se", 161, 4, 1], ["Agro Sementes Sul", "Agronegócio", "s", 152, 27, 0]];
    var SELL = [["Juliana Prado", "se", 612, 478, 31, 41], ["Rafael Costa", "s", 498, 412, 27, 38], ["Camila Nunes", "se", 471, 402, 24, 37], ["Diego Martins", "ne", 389, 347, 22, 36], ["Larissa Melo", "s", 362, 335, 19, 34], ["Thiago Alves", "se", 344, 331, 18, 33], ["Patrícia Rocha", "co", 287, 284, 15, 32], ["Lucas Ferreira", "se", 302, 308, 17, 31], ["Beatriz Lima", "ne", 241, 256, 14, 29], ["Gustavo Reis", "s", 228, 256, 12, 27]];
    var RN = { se: "Sudeste", s: "Sul", ne: "Nordeste", co: "Centro-Oeste" };

    var T = {
      pt: { rev: "Receita 12 meses", mg: "Margem bruta", tk: "Ticket médio", cv: "Conversão", vsly: " vs ano anterior", meta: "Meta", real: "Realizado",
        line: "Receita realizada vs meta", lineS: "Mil R$ por mês, Nov/25 a Out/26", fun: "Funil comercial", funS: "Negócios por etapa, 12 meses",
        reg: "Metas por região", regS: "Acumulado de 12 meses", cols: ["Região", "Receita", "Meta", "Atingimento", "Margem", "Clientes"],
        leads: "Leads no mês", cac: "CAC médio", ltv: "LTV médio", ratio: "LTV / CAC", chRev: "Receita por canal", chRevS: "Mil R$ em 12 meses",
        chT: "Desempenho por canal", chCols: ["Canal", "Leads", "Ganhos", "Conversão", "Receita", "CAC"],
        mrr: "Receita recorrente", ret: "Retenção líquida", nps: "NPS", act: "Clientes ativos", top: "Top produtos por receita", topS: "Mil R$ em 12 meses",
        acc: "Maiores contas", accS: "Receita em 12 meses", accCols: ["Cliente", "Segmento", "Região", "Receita", "Variação", "Saúde"], health: ["Saudável", "Atenção", "Risco"],
        sel: "Vendedores", att: "Atingimento médio", win: "Win rate", wk: "Atividades por semana", rank: "Ranking de vendedores", rankS: "Acumulado de 12 meses",
        rankCols: ["#", "Vendedor", "Região", "Receita", "Meta", "Atingimento", "Win rate"], none: "Nenhum registro nesta região.",
        stages: ["Leads", "MQL", "SQL", "Propostas", "Negociação", "Ganhos"] },
      en: { rev: "12-month revenue", mg: "Gross margin", tk: "Average ticket", cv: "Conversion", vsly: " vs last year", meta: "Target", real: "Actual",
        line: "Actual revenue vs target", lineS: "R$ thousands per month, Nov/25 to Oct/26", fun: "Sales funnel", funS: "Deals by stage, 12 months",
        reg: "Targets by region", regS: "12-month total", cols: ["Region", "Revenue", "Target", "Attainment", "Margin", "Customers"],
        leads: "Leads this month", cac: "Average CAC", ltv: "Average LTV", ratio: "LTV / CAC", chRev: "Revenue by channel", chRevS: "R$ thousands, 12 months",
        chT: "Channel performance", chCols: ["Channel", "Leads", "Won", "Conversion", "Revenue", "CAC"],
        mrr: "Recurring revenue", ret: "Net retention", nps: "NPS", act: "Active customers", top: "Top products by revenue", topS: "R$ thousands, 12 months",
        acc: "Largest accounts", accS: "12-month revenue", accCols: ["Customer", "Segment", "Region", "Revenue", "Change", "Health"], health: ["Healthy", "Watch", "At risk"],
        sel: "Sales reps", att: "Average attainment", win: "Win rate", wk: "Activities per week", rank: "Sales rep ranking", rankS: "12-month total",
        rankCols: ["#", "Rep", "Region", "Revenue", "Target", "Attainment", "Win rate"], none: "No records in this region.",
        stages: ["Leads", "MQL", "SQL", "Proposals", "Negotiation", "Won"] }
    };
    function t() { return T[lang]; }
    function mi(v) { return lang === "en" ? "R$" + num(v, 2) + "M" : "R$ " + num(v, 2) + " mi"; }
    function mil(v) { return lang === "en" ? "R$" + num(v, 1) + "K" : "R$ " + num(v, 1) + " mil"; }
    function pct(v, d) { return num(v, d == null ? 1 : d) + "%"; }
    function sign(v, suf) { return (v > 0 ? "+" : "") + num(v, 1) + (suf || "%"); }
    function kpi(label, value, delta, up) { return "<div><p>" + label + "</p><b>" + value + "</b><small class=\"" + (up ? "up" : "down") + "\">" + delta + "</small></div>"; }
    function table(cols, rows, numCols) {
      return '<table class="ptable"><thead><tr>' + cols.map(function (c, i) { return '<th class="' + (numCols.indexOf(i) > -1 ? "n" : "") + (i > 2 && i < cols.length - 1 ? " hide-s" : "") + '">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
        rows.map(function (r) { return "<tr" + (r.hl ? ' class="hl"' : "") + ">" + r.cells.map(function (c, i) { return '<td class="' + (numCols.indexOf(i) > -1 ? "n" : "") + (i > 2 && i < r.cells.length - 1 ? " hide-s" : "") + '">' + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>";
    }
    function lineChart(k) {
      var W = 600, H = 220, L = 38, R = 10, Tp = 12, B = 24, max = 600 * k > 0 ? Math.ceil(600 * k / 100) * 100 : 600;
      var X = function (i) { return L + i * (W - L - R) / 11; }, Y = function (v) { return Tp + (1 - v / max) * (H - Tp - B); };
      var g = "";
      for (var v = 0; v <= max; v += max / 4) g += '<line class="gl" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '"/><text class="ax" x="' + (L - 6) + '" y="' + (Y(v) + 3) + '" text-anchor="end">' + Math.round(v) + "</text>";
      var ms = lang === "en" ? ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"] : ["Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out"];
      ms.forEach(function (m, i) { g += '<text class="ax" x="' + X(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + m + "</text>"; });
      var pr = REAL.map(function (v, i) { return [X(i), Y(v * k)]; }), pm = META.map(function (v, i) { return [X(i), Y(v * k)]; });
      var d = function (p) { return p.map(function (q, i) { return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(" "); };
      return '<svg viewBox="0 0 ' + W + " " + H + '">' + g +
        '<path d="' + d(pm) + '" fill="none" stroke="#9aa3b5" stroke-width="1.6" stroke-dasharray="5 4"/>' +
        '<path d="' + d(pr) + " L" + X(11) + " " + Y(0) + " L" + X(0) + " " + Y(0) + ' Z" fill="#2f6bff" opacity=".08"/>' +
        '<path d="' + d(pr) + '" fill="none" stroke="#2f6bff" stroke-width="2.4"/>' +
        pr.map(function (q) { return '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3" fill="#fff" stroke="#2f6bff" stroke-width="1.6"/>'; }).join("") + "</svg>" +
        '<p class="legend" style="margin-top:6px"><i class="l2"></i>' + t().real + ' <i style="background:#9aa3b5;margin-left:8px"></i>' + t().meta + "</p>";
    }
    function donut(items) {
      var tot = items.reduce(function (a, b) { return a + b[1]; }, 0), a0 = -Math.PI / 2, out = "";
      items.forEach(function (it) {
        var a1 = a0 + it[1] / tot * Math.PI * 2, la = a1 - a0 > Math.PI ? 1 : 0, r = 60, ri = 36;
        var p = function (a, rr) { return (75 + rr * Math.cos(a)).toFixed(2) + " " + (75 + rr * Math.sin(a)).toFixed(2); };
        out += '<path d="M' + p(a0, r) + " A" + r + " " + r + " 0 " + la + " 1 " + p(a1, r) + " L" + p(a1, ri) + " A" + ri + " " + ri + " 0 " + la + " 0 " + p(a0, ri) + ' Z" fill="' + it[2] + '"/>';
        a0 = a1;
      });
      return '<div class="donut-wrap"><svg viewBox="0 0 150 150" width="150">' + out + '<text x="75" y="80" text-anchor="middle" font-weight="700" font-size="17" fill="#121521">' + num(Math.round(tot)) + "</text></svg>" +
        '<div class="dl">' + items.map(function (it) { return '<div><i style="background:' + it[2] + '"></i><span>' + it[0] + "</span><b>" + num(Math.round(it[1])) + "</b></div>"; }).join("") + "</div></div>";
    }
    function hbars(items, max) {
      return '<div class="funnel">' + items.map(function (it, i) { return "<div><span>" + it[0] + '</span><i style="width:' + (it[1] / max * 100).toFixed(1) + "%;animation-delay:" + (i * 50) + 'ms"></i><b>' + num(Math.round(it[1])) + "</b></div>"; }).join("") + "</div>";
    }
    function card(h, s, inner) { return '<div class="pc"><h4>' + h + '</h4><p class="sub">' + s + "</p>" + inner + "</div>"; }

    function render() {
      var r = sel.value, R = REG[r], k = R.rev / REG.all.rev, L = t(), html = "";
      if (tab === 0) {
        html += '<div class="pk">' + kpi(L.rev, mi(R.rev), sign(R.yoy) + L.vsly, true) + kpi(L.mg, pct(R.mg), sign(+(R.mg - 29.9).toFixed(1), " p.p."), R.mg >= 29.9) +
          kpi(L.tk, mil(R.rev * 1000 / R.cli), sign(6.2), true) + kpi(L.cv, pct(R.conv), sign(+(R.conv - 25.4).toFixed(1), " p.p."), R.conv >= 25.4) + "</div>";
        html += '<div class="pg">' + card(L.line, L.lineS, lineChart(k)) + card(L.fun, L.funS, hbars(FUN.map(function (f, i) { return [L.stages[i], f[1] * R.cli / 207]; }), 3420 * R.cli / 207)) + "</div>";
        html += card(L.reg, L.regS, table(L.cols, ["se", "s", "ne", "co"].map(function (id) {
          var x = REG[id];
          return { hl: r === id, cells: [x.name, mi(x.rev), mi(x.meta), pct(x.rev / x.meta * 100), pct(x.mg), num(x.cli)] };
        }).concat([{ hl: r === "all", cells: ["Total", mi(5.37), mi(5.27), pct(101.9), pct(31.8), "207"] }]), [1, 2, 3, 4, 5]));
      } else if (tab === 1) {
        html += '<div class="pk">' + kpi(L.leads, num(Math.round(383 * k)), sign(9.1) + " m/m", true) + kpi(L.cac, "R$ " + num(1840), sign(-9.0), true) + kpi(L.ltv, mil(92.4), sign(7.5), true) + kpi(L.ratio, num(5.0, 1) + "x", "+0,8x", true) + "</div>";
        html += '<div class="pg">' + card(L.chRev, L.chRevS, donut(CH.map(function (c) { return [c[0], c[1] * k, c[2]]; }))) +
          card(L.chT, L.regS, table(L.chCols, CH.map(function (c) { return { cells: [c[0], num(Math.round(c[3] * k)), num(Math.round(c[5] * k)), pct(c[6]), mi(c[1] * k / 1000), "R$ " + num(c[8])] }; }), [1, 2, 3, 4, 5])) + "</div>";
      } else if (tab === 2) {
        html += '<div class="pk">' + kpi(L.mrr, mil(312 * k), sign(4.1) + " m/m", true) + kpi(L.ret, pct(112, 0), "+3 p.p.", true) + kpi(L.nps, "67", "+5", true) + kpi(L.act, num(Math.round(1184 * k)), sign(11.6), true) + "</div>";
        var acc = ACC.filter(function (a) { return r === "all" || a[2] === r; });
        html += '<div class="pg">' + card(L.top, L.topS, hbars(PROD.map(function (p) { return [p[0], p[1] * k]; }), 1284 * k)) +
          card(L.acc, L.accS, acc.length ? table(L.accCols, acc.slice(0, 7).map(function (a) {
            return { cells: [a[0], a[1], RN[a[2]], mil(a[3]), '<span class="' + (a[4] >= 0 ? "up" : "down") + '">' + sign(a[4]) + "</span>", L.health[a[5]]] };
          }), [3, 4]) : '<p class="sub">' + L.none + "</p>") + "</div>";
      } else {
        var sl = SELL.filter(function (x) { return r === "all" || x[1] === r; });
        var att = sl.reduce(function (a, x) { return a + x[2] / x[3]; }, 0) / sl.length * 100;
        var win = sl.reduce(function (a, x) { return a + x[5]; }, 0) / sl.length;
        html += '<div class="pk">' + kpi(L.sel, r === "all" ? "18" : num(sl.length), r === "all" ? "+2" : "", true) + kpi(L.att, pct(att), sign(4.8, " p.p."), true) + kpi(L.win, pct(win), sign(2.1, " p.p."), true) + kpi(L.wk, num(Math.round(1260 * k)), sign(-3.2), false) + "</div>";
        html += card(L.rank, L.rankS, table(L.rankCols, sl.map(function (x, i) {
          return { cells: [String(i + 1), x[0], RN[x[1]], mil(x[2]), mil(x[3]), '<span class="' + (x[2] >= x[3] ? "up" : "down") + '">' + pct(x[2] / x[3] * 100, 0) + "</span>", pct(x[5], 0)] };
        }), [3, 4, 5, 6]));
      }
      body.innerHTML = html;
      body.style.animation = "none"; void body.offsetWidth; body.style.animation = "";
    }
    $$("#pulse .pulse-tabs button").forEach(function (b) {
      b.addEventListener("click", function () {
        tab = +b.dataset.tab;
        $$("#pulse .pulse-tabs button").forEach(function (o) { o.setAttribute("aria-selected", String(o === b)); });
        render();
      });
    });
    sel.addEventListener("change", render);
    render();
    langListeners.push(render);
  })();

  /* ----------------------------------------------------------
     10. Contact form (HubSpot, same endpoint and fields)
     ---------------------------------------------------------- */
  var form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var data = new FormData(form);
      if (data.get("website")) return;
      var bad = false;
      $$("[required]", form).forEach(function (el) {
        var ok = el.type === "checkbox" ? el.checked : el.checkValidity();
        el.classList.toggle("invalid", !ok);
        if (!ok && !bad) { bad = true; el.focus(); }
      });
      if (bad) return;
      var name = (data.get("name") || "").trim().split(/\s+/);
      var button = $('button[type="submit"]', form);
      button.disabled = true;
      try {
        var res = await fetch("https://api.hsforms.com/submissions/v3/integration/submit/51846094/b42a3450-04db-45d6-abf7-0530c8ad8724", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [
              { name: "firstname", value: name.shift() || "" },
              { name: "lastname", value: name.join(" ") },
              { name: "email", value: data.get("email") || "" },
              { name: "company", value: data.get("company") || "" },
              { name: "servico", value: data.get("servico") || "" },
              { name: "mensagem", value: "[Demo Intelligence Portal] " + (data.get("mensagem") || "") }
            ],
            legalConsentOptions: { consent: { consentToProcess: true, text: "I agree that Norva may contact me about this request." } }
          })
        });
        if (!res.ok) throw new Error("HubSpot submission failed");
        form.hidden = true;
        $("#formSuccess").hidden = false;
      } catch (err) {
        button.disabled = false;
        alert(S().err);
      }
    });
    form.addEventListener("input", function (e) { e.target.classList.remove("invalid"); });
  }
})();
