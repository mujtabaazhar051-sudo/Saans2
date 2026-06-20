/**
 * Saans — shared top header (logo, lang toggle, settings)
 */
(function () {
  'use strict';

  var SETTINGS_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';

  function mountHeader(options) {
    options = options || {};
    var variant = options.variant || 'public'; /* public | app | minimal */
    var showSettings = variant === 'app';
    var homeHref = saansHref(variant === 'app' ? 'dashboard.html' : 'index.html');
    var logoSrc = saansPath('assets/logo.svg');

    var header = document.createElement('header');
    header.className = 'saans-header';
    header.id = 'saansHeader';
    header.setAttribute('role', 'banner');

    header.innerHTML =
      '<a class="saans-header__brand" href="' + homeHref + '">' +
        '<img class="saans-header__logo" src="' + logoSrc + '" alt="" width="36" height="36">' +
        '<span class="saans-header__wordmark" data-i18n="site.name"></span>' +
      '</a>' +
      '<div class="saans-header__actions">' +
        '<div class="lang-toggle" role="group" aria-label="Language">' +
          '<button type="button" class="lang-toggle__btn" data-lang-set="ur" data-i18n="lang.ur"></button>' +
          '<button type="button" class="lang-toggle__btn" data-lang-set="en" data-i18n="lang.en"></button>' +
        '</div>' +
        (showSettings
          ? '<a class="saans-header__settings" href="' + saansHref('settings.html') + '" aria-label="">' +
              SETTINGS_ICON +
            '</a>'
          : '') +
      '</div>';

    var mount = document.getElementById('saans-header-mount');
    if (mount) {
      mount.replaceWith(header);
    } else {
      document.body.insertBefore(header, document.body.firstChild);
    }

    document.body.classList.add('has-header');

    if (showSettings) {
      var settingsEl = header.querySelector('.saans-header__settings');
      if (settingsEl) {
        settingsEl.setAttribute('aria-label', t('nav.settings'));
        onLangChange(function () {
          settingsEl.setAttribute('aria-label', t('nav.settings'));
        });
      }
    }

    syncLangButtons();
    onLangChange(syncLangButtons);

    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }, { passive: true });

    applyI18nDOM();
    return header;
  }

  function syncLangButtons() {
    var lang = getLang();
    document.querySelectorAll('.lang-toggle__btn').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang-set') === lang);
    });
  }

  window.SaansHeader = { mount: mountHeader };
})();
