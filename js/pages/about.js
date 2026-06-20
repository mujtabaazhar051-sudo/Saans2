/**
 * Saans — about page
 */
(function () {
  'use strict';

  var T = SaansTools;

  window.SaansPages = window.SaansPages || {};
  SaansPages.about = function () {
    T.el('abContactBtn').addEventListener('click', function () {
      var msg = T.el('abContactMsg').value.trim();
      if (!msg) { SaansTools.toast(t('about.fillMsg')); return; }
      var arr = LS.get('feedback', []);
      arr.push({ msg: msg, date: new Date().toISOString() });
      LS.set('feedback', arr);
      T.el('abContactMsg').value = '';
      SaansTools.toast(t('about.thanks'));
    });
    SaansTools.onLang(function () { applyI18nDOM(); });
  };
})();
