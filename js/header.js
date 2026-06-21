/**
 * Saans — shared top header (logo, lang toggle, theme, settings)
 */
(function () {
  'use strict';

  var SETTINGS_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>' +
      '<circle cx="12" cy="12" r="3"/>' +
    '</svg>';

  function mountHeader(options) {
    options = options || {};
    var variant = options.variant || 'public';
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
          ? '<button type="button" class="saans-header__theme" id="saansThemeBtn" aria-label="" title="">' +
              '<span data-theme-icon>🌙</span>' +
            '</button>' +
            '<a class="saans-header__settings" href="' + saansHref('settings.html') + '" aria-label="">' +
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
      var themeBtn = header.querySelector('#saansThemeBtn');
      if (settingsEl) {
        settingsEl.setAttribute('aria-label', t('nav.settings'));
        onLangChange(function () {
          settingsEl.setAttribute('aria-label', t('nav.settings'));
        });
      }
      if (themeBtn) {
        themeBtn.setAttribute('aria-label', t('theme.toggle'));
        themeBtn.setAttribute('title', t('theme.toggle'));
        onLangChange(function () {
          themeBtn.setAttribute('aria-label', t('theme.toggle'));
          themeBtn.setAttribute('title', t('theme.toggle'));
        });
        if (typeof SaansTheme !== 'undefined') SaansTheme.bindToggle(themeBtn);
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
