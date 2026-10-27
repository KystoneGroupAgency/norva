/* ============================================================
   NORVA — Cookie consent (LGPD)
   ------------------------------------------------------------
   Shows a bilingual (PT/EN) consent banner on first visit and
   stores the choice in localStorage under "norva_cookie_consent"
   as JSON: { value: "accepted" | "declined", version, timestamp }.
   The banner only appears when no valid choice is stored
   (or when CONSENT_VERSION changes).

   Essential storage (e.g. "kystone_lang", the language choice)
   is not affected. Anything non-essential must go through the gate:

   1) Declarative scripts — they stay inert until the visitor accepts:
        <script type="text/plain" data-consent="analytics"
                data-src="https://example.com/tag.js"></script>
      Inline code also works (omit data-src, put code in the body).

   2) JavaScript API:
        NorvaConsent.hasConsent()      -> true only after "Aceitar"
        NorvaConsent.getChoice()       -> "accepted" | "declined" | null
        NorvaConsent.onAccept(fn)      -> runs fn now if accepted, else on accept
        NorvaConsent.open()            -> reopens the banner (change choice)
        NorvaConsent.reset()           -> clears the stored choice

   Language follows the site toggle: the banner watches <html lang>,
   which site.js sets when PT/EN is chosen.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "norva_cookie_consent";
  var CONSENT_VERSION = 1;

  var TEXT = {
    pt: {
      label: "Aviso de cookies",
      title: "Sua privacidade",
      body: "Usamos apenas o armazenamento essencial para o site funcionar, como lembrar o idioma. Com a sua permissão, poderemos usar cookies de análise para entender o uso do site e melhorá-lo. Nada disso é ativado sem o seu consentimento, conforme a LGPD (Lei nº 13.709/2018).",
      accept: "Aceitar",
      decline: "Recusar",
      prefs: "Preferências de cookies"
    },
    en: {
      label: "Cookie notice",
      title: "Your privacy",
      body: "We only use essential storage to make the site work, such as remembering your language. With your permission, we may use analytics cookies to understand how the site is used and improve it. Nothing of that is enabled without your consent, in line with Brazil's LGPD (Law 13,709/2018).",
      accept: "Accept",
      decline: "Decline",
      prefs: "Cookie preferences"
    }
  };

  var acceptQueue = [];
  var banner = null;
  var prefsLink = null;
  var lastFocus = null;

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.version !== CONSENT_VERSION) return null;
      if (data.value !== "accepted" && data.value !== "declined") return null;
      return data;
    } catch (e) { return null; }
  }

  function write(value) {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        value: value, version: CONSENT_VERSION, timestamp: new Date().toISOString()
      }));
    } catch (e) {}
  }

  function getChoice() { var d = read(); return d ? d.value : null; }
  function hasConsent() { return getChoice() === "accepted"; }

  function lang() {
    return (document.documentElement.lang || "pt").toLowerCase().indexOf("en") === 0 ? "en" : "pt";
  }

  /* Activate <script type="text/plain" data-consent="..."> placeholders */
  function activateScripts() {
    var list = document.querySelectorAll('script[type="text/plain"][data-consent]');
    Array.prototype.forEach.call(list, function (old) {
      var s = document.createElement("script");
      Array.prototype.forEach.call(old.attributes, function (a) {
        if (a.name !== "type" && a.name !== "data-src") s.setAttribute(a.name, a.value);
      });
      if (old.getAttribute("data-src")) s.src = old.getAttribute("data-src");
      else s.text = old.text;
      s.setAttribute("data-consent-activated", "");
      old.parentNode.replaceChild(s, old);
    });
  }

  function runAccepted() {
    activateScripts();
    var q = acceptQueue; acceptQueue = [];
    q.forEach(function (fn) { try { fn(); } catch (e) { if (window.console) console.error(e); } });
  }

  function onAccept(fn) {
    if (typeof fn !== "function") return;
    if (hasConsent()) { try { fn(); } catch (e) { if (window.console) console.error(e); } }
    else acceptQueue.push(fn);
  }

  function applyText() {
    var t = TEXT[lang()];
    if (banner) {
      banner.setAttribute("aria-label", t.label);
      banner.querySelector(".ncc-title").textContent = t.title;
      banner.querySelector(".ncc-body").textContent = t.body;
      banner.querySelector('[data-ncc="accept"]').textContent = t.accept;
      banner.querySelector('[data-ncc="decline"]').textContent = t.decline;
    }
    if (prefsLink) prefsLink.textContent = t.prefs;
  }

  function build() {
    banner = document.createElement("section");
    banner.className = "ncc";
    banner.id = "norva-cookie-consent";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-labelledby", "ncc-title");
    banner.setAttribute("aria-describedby", "ncc-body");
    banner.setAttribute("aria-label", TEXT.pt.label);
    banner.hidden = true;
    // Default markup is Portuguese; English is applied by applyText() following the site i18n (<html lang>).
    banner.innerHTML =
      '<div class="ncc-inner">' +
        '<div class="ncc-copy">' +
          '<h2 class="ncc-title" id="ncc-title">' + TEXT.pt.title + '</h2>' +
          '<p class="ncc-body" id="ncc-body">' + TEXT.pt.body + '</p>' +
        '</div>' +
        '<div class="ncc-actions">' +
          '<button type="button" class="ncc-btn ncc-btn-ghost" data-ncc="decline">' + TEXT.pt.decline + '</button>' +
          '<button type="button" class="ncc-btn ncc-btn-primary" data-ncc="accept">' + TEXT.pt.accept + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector('[data-ncc="accept"]').addEventListener("click", function () { choose("accepted"); });
    banner.querySelector('[data-ncc="decline"]').addEventListener("click", function () { choose("declined"); });
    banner.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && getChoice()) hide();
    });

    // "Cookie preferences" link appended to the existing footer bar
    var bar = document.querySelector(".footer-bottom");
    if (bar) {
      prefsLink = document.createElement("button");
      prefsLink.type = "button";
      prefsLink.textContent = TEXT.pt.prefs;
      prefsLink.className = "ncc-prefs";
      prefsLink.setAttribute("aria-controls", "norva-cookie-consent");
      prefsLink.addEventListener("click", open);
      bar.appendChild(prefsLink);
    }
    applyText();
  }

  function show(focus) {
    if (!banner) return;
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add("is-in"); });
    if (focus) {
      lastFocus = document.activeElement;
      banner.querySelector('[data-ncc="accept"]').focus();
    }
  }

  function hide() {
    if (!banner) return;
    banner.classList.remove("is-in");
    banner.hidden = true;
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    lastFocus = null;
  }

  function choose(value) {
    var wasAccepted = hasConsent();
    write(value);
    hide();
    if (value === "accepted") runAccepted();
    else if (wasAccepted) {
      // Already-loaded scripts cannot be unloaded; reload so they are not active anymore.
      location.reload();
    }
    try { document.dispatchEvent(new CustomEvent("norva:consent", { detail: { value: value } })); } catch (e) {}
  }

  function open() { show(true); }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} show(false); }

  window.NorvaConsent = {
    hasConsent: hasConsent,
    getChoice: getChoice,
    onAccept: onAccept,
    open: open,
    reset: reset
  };

  function init() {
    build();
    new MutationObserver(applyText).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    if (hasConsent()) runAccepted();
    else if (!getChoice()) show(false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
