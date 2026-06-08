/* ============================================================
   Wisnia Beauty Studio - interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- WhatsApp brand glyph (no Lucide brand icons) ---- */
  var WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width:1em;height:1em;display:block"><path d="M17.47 14.38c-.3-.15-1.74-.86-2-.95-.27-.1-.46-.15-.66.15-.2.3-.76.95-.93 1.14-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.19-.24-.57-.48-.5-.66-.51l-.56-.01c-.2 0-.52.07-.79.37s-1.04 1.01-1.04 2.47 1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.74-.71 1.99-1.4.24-.69.24-1.28.17-1.4-.07-.12-.27-.2-.57-.35z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.13c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.12.82.83-3.04-.2-.32a8.2 8.2 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23 4.54 0 8.23 3.69 8.23 8.23 0 4.54-3.69 8.23-8.23 8.23z"/></svg>';
  document.querySelectorAll(".ico-wa").forEach(function (el) {
    el.style.width = "1em"; el.style.height = "1em"; el.style.display = "inline-flex";
    el.innerHTML = WA;
  });

  /* ---- Lucide icons ---- */
  if (window.lucide) { window.lucide.createIcons(); }

  /* ---- i18n: PL is in the DOM; cache it, swap to RU on demand ---- */
  var nodes = document.querySelectorAll("[data-i18n]");
  var plCache = {};
  nodes.forEach(function (n) {
    var k = n.getAttribute("data-i18n");
    if (!(k in plCache)) plCache[k] = n.textContent;
  });

  function setLang(lang) {
    var dict = (window.I18N && window.I18N.ru) || {};
    nodes.forEach(function (n) {
      var k = n.getAttribute("data-i18n");
      if (lang === "ru") {
        if (k in dict) n.textContent = dict[k];
      } else {
        n.textContent = plCache[k];
      }
    });
    document.documentElement.lang = lang;
    var meta = window.I18N && window.I18N.meta && window.I18N.meta[lang];
    if (meta && meta.title) document.title = meta.title;
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem("wisnia-lang", lang); } catch (e) {}
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  var savedLang = "pl";
  try { savedLang = localStorage.getItem("wisnia-lang") || "pl"; } catch (e) {}
  if (savedLang === "ru") setLang("ru");

  /* ---- Sticky header shadow ---- */
  var header = document.getElementById("header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 12); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile drawer ---- */
  var drawer = document.getElementById("drawer");
  var burger = document.getElementById("burger");
  var drawerClose = document.getElementById("drawer-close");
  function openDrawer() { drawer.classList.add("is-open"); document.body.style.overflow = "hidden"; }
  function closeDrawer() { drawer.classList.remove("is-open"); document.body.style.overflow = ""; }
  if (burger) burger.addEventListener("click", openDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  drawer.querySelectorAll("nav a").forEach(function (a) { a.addEventListener("click", closeDrawer); });

  /* ---- Services tabs ---- */
  var tabs = document.querySelectorAll(".tab");
  function activateTab(name) {
    tabs.forEach(function (x) { x.classList.toggle("is-active", x.getAttribute("data-tab") === name); });
    document.querySelectorAll("[data-panel]").forEach(function (p) {
      p.hidden = p.getAttribute("data-panel") !== name;
    });
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { activateTab(t.getAttribute("data-tab")); });
  });

  /* ---- "Nasze kierunki" cards jump to a tab ---- */
  document.querySelectorAll("[data-goto]").forEach(function (el) {
    el.addEventListener("click", function () { activateTab(el.getAttribute("data-goto")); });
  });
  /* ---- open a pricing tab from URL hash (e.g. #pakiety) ---- */
  (function () {
    var h = (location.hash || "").replace("#", "");
    if (h && document.querySelector('[data-panel="' + h + '"]')) {
      activateTab(h);
      var sec = document.getElementById("cennik");
      if (sec) setTimeout(function () { sec.scrollIntoView({ behavior: "smooth" }); }, 60);
    }
  })();

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.toggle("is-open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
    });
  });

  /* ---- Scroll reveal ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Analytics hooks (GA4 / Meta Pixel ready) ---- */
  window.dataLayer = window.dataLayer || [];
  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      var channel = el.getAttribute("data-cta");
      var id = el.id || "";
      window.dataLayer.push({ event: "cta_click", cta_channel: channel, cta_id: id });
      if (typeof window.gtag === "function") {
        window.gtag("event", "cta_click", { cta_channel: channel, cta_id: id });
      }
      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", "CTAClick", { channel: channel, id: id });
      }
    });
  });
})();
