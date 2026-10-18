/**
 * Interface strings for COSYpractice. Plain JSON per language in /i18n (only the keys these pages use).
 * Elements opt in with data-translate-key (HTML allowed) or data-i18n (text); aria labels via data-i18n-aria-label.
 * Missing keys leave the English text in place.
 */
(function () {
  'use strict';
  var script = document.currentScript;
  var ROOT = script ? new URL('../', script.src).href : './';
  var SUPPORTED = ['ba', 'br', 'de', 'el', 'en', 'es', 'fr', 'hy', 'it', 'ka', 'pt', 'ru', 'tt'];
  var dict = {}, current = 'en';

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function detect() {
    var s = (store('cosy_ui_lang') || store('cosy_last_language') || document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(s) >= 0 ? s : 'en';
  }
  window.t = function (key) { return (key && dict[key]) || ''; };

  function apply() {
    document.querySelectorAll('[data-translate-key]').forEach(function (el) {
      var v = window.t(el.getAttribute('data-translate-key'));
      if (!v) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.setAttribute('placeholder', v);
      else if (el.tagName === 'META') el.setAttribute('content', v);
      else if (el.tagName === 'TITLE') document.title = v;
      else el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var v = window.t(el.getAttribute('data-i18n')); if (v) el.textContent = v; });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) { var v = window.t(el.getAttribute('data-i18n-aria-label')); if (v) el.setAttribute('aria-label', v); });
  }

  function load(lang, done) {
    fetch(ROOT + 'i18n/' + lang + '.json')
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (d) { dict = d; current = lang; apply(); done && done(); });
  }

  window.setLanguage = function (lang) {
    lang = (lang || '').slice(0, 2).toLowerCase();
    if (SUPPORTED.indexOf(lang) < 0) return;
    store('cosy_last_language', lang);
    load(lang, function () { document.dispatchEvent(new CustomEvent('cosyLanguageChanged', { detail: { lang: lang } })); });
  };
  window.COSY_I18N = { get currentLang() { return current; } };

  function init() { load(detect(), function () { document.dispatchEvent(new CustomEvent('cosyI18nReady', { detail: { lang: current } })); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
