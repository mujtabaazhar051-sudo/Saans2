/**
 * Saans — i18n system
 * Usage:
 *   t('nav.home')
 *   t('footer.copy', { year: 2026 })
 *   data-i18n="nav.home" on HTML elements
 */
(function () {
  'use strict';

  const LANG_KEY = 'lang';
  let _currentLang = null;
  const _listeners = [];

  function getStorageKey() {
    return (window.SAANS_CONFIG && SAANS_CONFIG.LS_PREFIX) + LANG_KEY;
  }

  /** Read persisted language — never infer from DOM */
  function getLang() {
    if (_currentLang) return _currentLang;
    try {
      const raw = localStorage.getItem(getStorageKey());
      if (raw === 'ur' || raw === 'en') {
        _currentLang = raw;
        return raw;
      }
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed === 'ur' || parsed === 'en') {
        _currentLang = parsed;
        return parsed;
      }
    } catch (_) { /* ignore */ }
    _currentLang = (SAANS_CONFIG && SAANS_CONFIG.DEFAULT_LANG) || 'ur';
    return _currentLang;
  }

  function setLang(lang) {
    if (lang !== 'ur' && lang !== 'en') return;
    _currentLang = lang;
    try {
      localStorage.setItem(getStorageKey(), lang);
    } catch (_) { /* ignore */ }
    applyDocumentLang(lang);
    applyI18nDOM(lang);
    _listeners.forEach(function (fn) { fn(lang); });
    window.dispatchEvent(new CustomEvent('saans:langchange', { detail: { lang: lang } }));
  }

  function applyDocumentLang(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
    document.body && document.body.classList.toggle('lang-en', lang === 'en');
    document.body && document.body.classList.toggle('lang-ur', lang === 'ur');
  }

  /**
   * Translate by stable string ID.
   * Missing keys show [key] and log a warning.
   */
  function t(key, vars) {
    const lang = getLang();
    const table = typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : {};
    let str = table[lang] && table[lang][key];
    if (str == null) {
      console.warn('[Saans i18n] Missing translation: ' + key + ' (' + lang + ')');
      str = '[' + key + ']';
    }
    if (vars && typeof str === 'string') {
      Object.keys(vars).forEach(function (k) {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), String(vars[k]));
      });
    }
    return str;
  }

  /** Fill all [data-i18n] elements */
  function applyI18nDOM(lang) {
    lang = lang || getLang();
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const attr = el.getAttribute('data-i18n-attr');
      const text = t(key);
      if (attr) {
        el.setAttribute(attr, text);
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });

    document.title = document.querySelector('meta[name="saans-title-key"]')
      ? t(document.querySelector('meta[name="saans-title-key"]').content)
      : document.title;
  }

  function onLangChange(fn) {
    _listeners.push(fn);
    return function unsubscribe() {
      const i = _listeners.indexOf(fn);
      if (i >= 0) _listeners.splice(i, 1);
    };
  }

  /** Apply saved language immediately (before DOMContentLoaded) */
  function initI18nEarly() {
    applyDocumentLang(getLang());
  }

  function initI18n() {
    applyDocumentLang(getLang());
    applyI18nDOM(getLang());

    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-lang-set'));
      });
    });
  }

  window.t = t;
  window.getLang = getLang;
  window.setLang = setLang;
  window.applyI18nDOM = applyI18nDOM;
  window.onLangChange = onLangChange;
  window.initI18n = initI18n;
  window.initI18nEarly = initI18nEarly;

  initI18nEarly();
})();
