/**
 * COSYblog shell: top bar, footer, theme toggle and (on listing pages) the interface language.
 * Plain script, no dependencies. Preferences use the same localStorage keys as the other COSY sites
 * (they share the cosylanguages.github.io origin), so theme and language follow the reader around.
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var ROOT = script ? new URL('../', script.src).href : './';
  var HUB = 'https://cosylanguages.github.io/COSYlanguages/';
  var ECO = {
    hub: HUB,
    courses: HUB + 'courses/index.html',
    practice: ROOT,
    blog: 'https://cosylanguages.github.io/COSYblog/',
    tools: 'https://cosylanguages.github.io/COSYtools/',
    games: 'https://cosylanguages.github.io/COSYgames/',
    events: 'https://cosylanguages.github.io/COSYevents/',
    quiz: HUB + 'placement-quiz.html',
    privacy: HUB + 'privacy.html'
  };
  var LANGS = {
    en: 'English', fr: 'Français', it: 'Italiano', ru: 'Русский', el: 'Ελληνικά', es: 'Español', de: 'Deutsch',
    pt: 'Português', hy: 'Հայերեն', ka: 'ქართული', tt: 'Татарча', ba: 'Башҡортса', br: 'Brezhoneg'
  };

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  var root = document.documentElement;
  var isListing = false;

  function uiLang() {
    if (!isListing) return (root.lang || 'en').slice(0, 2);
    var s = (store('cosy_ui_lang') || store('cosy_last_language') || navigator.language || 'en').slice(0, 2).toLowerCase();
    return LANGS[s] ? s : 'en';
  }

  /* ── Translations ─────────────────────────────────────────────── */
  var dict = {};
  function flatten(o, prefix, out) {
    Object.keys(o).forEach(function (k) {
      var key = prefix ? prefix + '.' + k : k;
      if (o[k] && typeof o[k] === 'object') flatten(o[k], key, out); else out[key] = o[k];
    });
    return out;
  }
  window.t = function (key) { return dict[key] || ''; };

  function applyTranslations() {
    if (!isListing) return;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (!v) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.setAttribute('placeholder', v); else el.textContent = v;
    });
    root.lang = uiLang();
  }

  function loadDict(done) {
    var lang = uiLang();
    fetch('js/i18n/' + lang + '.json')
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (d) { dict = flatten(d, '', {}); done(); });
  }

  /* ── Theme ────────────────────────────────────────────────────── */
  function isDark() { return root.getAttribute('data-theme') === 'dark'; }
  function setTheme(dark) {
    if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    document.body.classList.toggle('theme-dark', dark);
    store('cosy.theme', dark ? 'dark' : 'light'); store('cosy_theme', dark ? 'dark' : 'light');
    var b = document.getElementById('bn-theme');
    if (b) { b.textContent = dark ? '☀️' : '🌙'; b.setAttribute('aria-pressed', String(dark)); }
  }

  /* ── Top bar ──────────────────────────────────────────────────── */
  function buildNav() {
    var host = document.getElementById('cosy-nav');
    if (!host) return;
    var cur = uiLang();
    var langSelect = isListing
      ? '<label class="visually-hidden" for="bn-lang">Interface language</label><select id="bn-lang" class="bn-select">' +
        Object.keys(LANGS).map(function (c) { return '<option value="' + c + '"' + (c === cur ? ' selected' : '') + '>' + LANGS[c] + '</option>'; }).join('') + '</select>'
      : '';
    host.className = 'bn';
    host.innerHTML =
      '<div class="bn-inner">' +
        '<a class="bn-brand" href="' + ECO.hub + '"><img src="' + ROOT + 'images/logo.png" alt="" width="30" height="30"><span>COSY<b>languages</b></span></a>' +
        '<nav class="bn-links" aria-label="COSY sites">' +
          '<a href="' + ECO.courses + '">Courses</a>' +
          '<a href="' + ECO.practice + '" aria-current="page">Practice</a>' +
          '<a href="' + ECO.blog + '">Magazine</a>' +
          '<a href="' + ECO.tools + '">Tools</a>' +
          '<a href="' + ECO.games + '">Games</a>' +
          '<a href="' + ECO.events + '">Events</a>' +
        '</nav>' +
        '<div class="bn-actions">' + langSelect +
          '<button type="button" id="bn-theme" class="bn-icon" aria-label="Toggle dark mode" aria-pressed="false">🌙</button>' +
        '</div>' +
      '</div>';
    var sel = document.getElementById('bn-lang');
    if (sel) sel.addEventListener('change', function () { store('cosy_ui_lang', sel.value); store('cosy_last_language', sel.value); loadDict(function () { applyTranslations(); document.dispatchEvent(new CustomEvent('cosy:langchange', { detail: sel.value })); }); });
    document.getElementById('bn-theme').addEventListener('click', function () { setTheme(!isDark()); });
    setTheme(isDark());
  }

  /* ── Footer ───────────────────────────────────────────────────── */
  function buildFooter() {
    var host = document.getElementById('cosy-footer');
    if (!host) return;
    host.className = 'bf';
    host.innerHTML =
      '<div class="bf-inner">' +
        '<div class="bf-brand"><a class="bn-brand" href="' + ECO.hub + '"><img src="' + ROOT + 'images/logo.png" alt="" width="30" height="30"><span>COSY<b>languages</b></span></a>' +
          '<p>Free, speaking-first practice: vocabulary, grammar and a daily challenge. No account needed.</p></div>' +
        '<nav class="bf-col" aria-label="Explore"><h2>Explore</h2>' +
          '<a href="' + ECO.practice + '">Free practice</a><a href="' + ECO.blog + '">Magazine</a>' +
          '<a href="' + ECO.tools + '">Reference tools</a><a href="' + ECO.games + '">Games</a></nav>' +
        '<nav class="bf-col" aria-label="COSYlanguages"><h2>COSYlanguages</h2>' +
          '<a href="' + ECO.courses + '">Courses</a><a href="' + ECO.quiz + '">Placement quiz</a>' +
          '<a href="' + ECO.events + '">Events</a></nav>' +
        '<nav class="bf-col" aria-label="Contact"><h2>Contact</h2>' +
          '<a href="https://wa.me/330766784195">WhatsApp</a><a href="https://t.me/cosylanguagesproject">Telegram</a>' +
          '<a href="mailto:cosylanguages@gmail.com">cosylanguages@gmail.com</a><a href="' + ECO.privacy + '">Privacy</a></nav>' +
      '</div>' +
      '<div class="bf-bottom">© 2020–2026 COSYlanguages. All rights reserved.</div>';
  }

  function init() {
    buildNav(); buildFooter();
    if (isListing) loadDict(function () { applyTranslations(); window.__cosyI18nReady = true; document.dispatchEvent(new Event('cosy:i18nready')); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
