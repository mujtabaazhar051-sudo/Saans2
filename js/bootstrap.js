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

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register(saansPath('sw.js')).catch(function () { /* offline dev */ });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.SaansBoot = { boot: boot };
})();
