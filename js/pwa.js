/**
 * Saans — PWA install prompt & service worker registration
 */
(function () {
  'use strict';

  var deferredPrompt = null;

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(saansPath('sw.js')).catch(function (err) {
        console.warn('[Saans PWA] SW registration failed', err);
      });
    });
  }

  function createInstallBanner() {
    if (document.getElementById('saansInstallBanner')) return;
    var banner = document.createElement('div');
    banner.id = 'saansInstallBanner';
    banner.className = 'saans-install-banner';
    banner.hidden = true;
    banner.innerHTML =
      '<div class="saans-install-banner__text">' +
        '<strong data-i18n="pwa.installTitle"></strong>' +
        '<span data-i18n="pwa.installSub"></span>' +
      '</div>' +
      '<div class="saans-install-banner__actions">' +
        '<button type="button" class="ui-btn ui-btn--primary ui-btn--sm" id="saansInstallBtn" data-i18n="pwa.installBtn"></button>' +
        '<button type="button" class="ui-btn ui-btn--ghost ui-btn--sm" id="saansInstallDismiss" data-i18n="pwa.installDismiss"></button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('saansInstallBtn').addEventListener('click', function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () {
        deferredPrompt = null;
        banner.hidden = true;
        try { LS.set('pwaInstallDismissed', true); } catch (_) {}
      });
    });

    document.getElementById('saansInstallDismiss').addEventListener('click', function () {
      banner.hidden = true;
      try { LS.set('pwaInstallDismissed', true); } catch (_) {}
    });
  }

  function maybeShowInstallBanner() {
    if (LS.get('pwaInstallDismissed', false)) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    var banner = document.getElementById('saansInstallBanner');
    if (banner && deferredPrompt) {
      banner.hidden = false;
      if (typeof applyI18nDOM === 'function') applyI18nDOM();
    }
  }

  function initInstallPrompt() {
    createInstallBanner();
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
      maybeShowInstallBanner();
    });
    if (typeof onLangChange === 'function') {
      onLangChange(function () {
        if (typeof applyI18nDOM === 'function') applyI18nDOM();
      });
    }
  }

  window.SaansPWA = {
    register: registerServiceWorker,
    initInstall: initInstallPrompt,
  };

  registerServiceWorker();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstallPrompt);
  } else {
    initInstallPrompt();
  }
})();
