/**
 * Saans — helplines page
 */
(function () {
  'use strict';

  var T = SaansTools;

  function render() {
    var lang = getLang();
    var data = SAANS_CONTENT.helplines[lang];
    var list = T.el('hpLines');
    list.innerHTML = '';
    data.forEach(function (h) {
      var div = document.createElement('div');
      div.className = 'ui-card--tool';
      div.innerHTML = '<div style="font-weight:700;">' + h.name + '</div>' +
        '<a href="tel:' + h.num.replace(/[^0-9+]/g, '') + '" class="ui-latin" style="font-size:var(--text-xl);color:var(--color-primary);font-weight:700;">' + h.num + '</a>' +
        '<div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:4px;">' + h.note + '</div>';
      list.appendChild(div);
    });

    var hospitals = SAANS_CONTENT.helplines.hospitals[lang];
    var hList = T.el('hpHospitals');
    hList.innerHTML = '';
    hospitals.forEach(function (h) {
      var div = document.createElement('div');
      div.className = 'ui-card--tool';
      div.innerHTML = '<div style="font-size:var(--text-xs);color:var(--color-primary);font-weight:600;">' + h.city + '</div>' +
        '<div style="font-weight:600;">' + h.name + '</div>' +
        '<a href="tel:' + h.phone + '" class="ui-latin">' + h.phone + '</a>';
      hList.appendChild(div);
    });
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.helplines = function () {
    SaansTools.onLang(function () { applyI18nDOM(); render(); });
  };
})();
