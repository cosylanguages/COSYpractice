/**
 * Interface strings for COSYpractice. Plain JSON per language in /i18n (only the keys these pages use).
 * Elements opt in with data-translate-key (HTML allowed) or data-i18n (text); aria labels via data-i18n-aria-label.
 * Missing keys leave the English text in place.
 */
(function () {
  'use strict';
  var script = document.currentScript;
  var ROOT = script ? new URL('../', script.src).href : './';
  var SUPPORTED = ['el', 'en', 'fr', 'it', 'ru'];
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


  /* Runtime strings produced by the engine (session headers, feedback, buttons) are matched against
     exact phrases and a few patterns from the language file, so engine code stays untouched. */
  var observer = null, pending = false;
  function translateText(raw) {
    var t = raw.trim();
    if (!t || !/[A-Za-z]/.test(t)) return null;
    var ph = dict._phrases || {};
    if (Object.prototype.hasOwnProperty.call(ph, t)) return ph[t];
    var pats = dict._patterns || [];
    for (var i = 0; i < pats.length; i++) {
      var re = new RegExp(pats[i][0]);
      if (re.test(t)) return t.replace(re, pats[i][1]);
    }
    var m = /^([A-Z]{2}) · ([a-z_-]+)(?: · ([a-z_]+))?$/.exec(t);
    if (m && dict._cats) return m[1] + ' · ' + (dict._cats[m[2]] || m[2]) + (m[3] ? ' · ' + ((dict._levels || {})[m[3]] || m[3]) : '');
    return null;
  }
  function walk(node) {
    if (node.nodeType === 3) {
      if (node.parentElement && node.parentElement.closest('.pe-card-word,.q-word,.q-target,.mc-opt,.mistake-item,.recent-item')) return;
      var out = translateText(node.nodeValue);
      if (out !== null) node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), out);
      return;
    }
    if (node.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(node.tagName)) return;
    for (var c = node.firstChild; c; c = c.nextSibling) walk(c);
  }
  function watch() {
    if (current === 'en' || !dict._phrases) return;
    walk(document.body);
    if (observer) return;
    var queue = [];
    observer = new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === 'characterData') queue.push(m.target);
        else m.addedNodes.forEach(function (n) { queue.push(n); });
      });
      if (pending) return; pending = true;
      requestAnimationFrame(function () {
        pending = false;
        var todo = queue; queue = [];
        todo.forEach(walk);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function load(lang, done) {
    fetch(ROOT + 'i18n/' + lang + '.json')
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (d) { dict = d; current = lang; document.documentElement.lang = lang; apply(); watch(); done && done(); });
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
