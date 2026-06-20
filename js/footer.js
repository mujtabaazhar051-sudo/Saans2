/**
 * Saans — shared footer
 */
(function () {
  'use strict';

  function mountFooter() {
    var footer = document.createElement('footer');
    footer.className = 'saans-footer';
    footer.id = 'saansFooter';
    footer.innerHTML =
      '<div class="saans-footer__brand" data-i18n="site.name"></div>' +
      '<p class="saans-footer__tagline" data-i18n="footer.tagline"></p>' +
      '<nav class="saans-footer__links" aria-label="Footer">' +
        '<a href="' + saansHref('about.html') + '" data-i18n="footer.about"></a>' +
        '<a href="' + saansHref('helplines.html') + '" data-i18n="footer.helplines"></a>' +
        '<a href="' + saansHref('resources.html') + '" data-i18n="footer.resources"></a>' +
      '</nav>' +
      '<p class="saans-footer__copy" data-i18n="footer.copy" data-i18n-vars="year"></p>';

    var mount = document.getElementById('saans-footer-mount');
    if (mount) {
      mount.replaceWith(footer);
    } else {
      var shell = document.querySelector('.page-shell') || document.body;
      shell.appendChild(footer);
    }

    function updateYear() {
      var copyEl = footer.querySelector('.saans-footer__copy');
      if (copyEl) copyEl.textContent = t('footer.copy', { year: new Date().getFullYear() });
    }

    updateYear();
    onLangChange(updateYear);
    applyI18nDOM();

    return footer;
  }

  window.SaansFooter = { mount: mountFooter };
})();
