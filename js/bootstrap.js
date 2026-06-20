/**
 * Saans — bootstrap (always load last)
 * Runs shell mount, i18n wiring, and optional page init hook.
 */
(function () {
  'use strict';

  function runPageInit() {
    var page = document.body.getAttribute('data-page');
    if (page && typeof window.SaansPages === 'object' && typeof window.SaansPages[page] === 'function') {
      window.SaansPages[page]();
    }
  }

  function boot() {
    SaansShell.mount();
    initI18n();
    runPageInit();

    if (SAANS_CONFIG.GA_MEASUREMENT_ID && typeof gtag === 'function') {
      gtag('config', SAANS_CONFIG.GA_MEASUREMENT_ID, { page_path: window.location.pathname });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.SaansBoot = { boot: boot };
})();
(function () {
  if (location.protocol === 'file:') return;
  var s = document.createElement('script');
  s.src = (typeof saansPath === 'function' ? saansPath('js/pwa.js') : 'js/pwa.js') + '?v=8';
  document.body.appendChild(s);
})();
