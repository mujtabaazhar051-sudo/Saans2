/**
 * Saans — shared helpers for tool pages
 */
(function () {
  'use strict';

  var toastTimer;

  function el(id) { return document.getElementById(id); }

  window.SaansTools = {
    el: el,

    toast: function (msg) {
      var node = el('saansToast');
      if (!node) {
        node = document.createElement('div');
        node.id = 'saansToast';
        node.className = 'saans-toast';
        document.body.appendChild(node);
      }
      node.textContent = msg;
      node.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { node.classList.remove('is-visible'); }, 2600);
    },

    bindShare: function (btnId, context) {
      var btn = el(btnId);
      if (btn) btn.addEventListener('click', function () { shareOnWhatsApp(context || 'app'); });
    },

    renderNoQuitDate: function (containerId) {
      var box = el(containerId);
      if (!box) return;
      box.style.display = 'block';
      box.innerHTML =
        '<div class="tool-empty">' +
          '<div class="tool-empty__icon">📅</div>' +
          '<div class="tool-empty__title" data-i18n="tools.noQuitDate.title"></div>' +
          '<p data-i18n="tools.noQuitDate.desc"></p>' +
          '<a class="ui-btn ui-btn--primary" style="margin-top:var(--space-4);" href="' + saansHref('dashboard.html') + '" data-i18n="tools.noQuitDate.btn"></a>' +
        '</div>';
      applyI18nDOM();
    },

    hideNoQuitDate: function (containerId) {
      var box = el(containerId);
      if (box) box.style.display = 'none';
    },

    withAuth: function (fn) {
      if (typeof requireAuth === 'function') requireAuth(fn);
      else fn(null);
    },

    months: function (lang) {
      return lang === 'ur'
        ? ['جن', 'فر', 'مار', 'اپر', 'مئی', 'جون', 'جول', 'اگ', 'ست', 'اکت', 'نوم', 'دسم']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    },

    daysShort: function (lang) {
      return lang === 'ur'
        ? ['ات', 'پیر', 'من', 'بد', 'جمع', 'جم', 'ہف']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    },

    addDays: function (date, n) {
      var d = new Date(date);
      d.setDate(d.getDate() + n);
      return d;
    },

    dateISO: function (d) {
      return typeof localDateISO === 'function' ? localDateISO(d) : d.toISOString().slice(0, 10);
    },

    syncCloud: function () {
      var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
      if (user && typeof syncToCloud === 'function') syncToCloud(user);
    },

    saveCheckin: function (iso, smokeFree) {
      var c = LS.get('checkins', {});
      c[iso] = smokeFree;
      LS.set('checkins', c);
      SaansTools.syncCloud();
    },

    parseDate: function (iso) {
      return new Date(iso + 'T00:00:00');
    },

    minutesSinceQuit: function () {
      var qd = LS.get('quitDate', '');
      if (!qd) return 0;
      var start = new Date(qd + 'T00:00:00');
      return Math.max(0, Math.floor((Date.now() - start.getTime()) / 60000));
    },

    formatMinutes: function (mins, lang) {
      if (mins < 60) return mins + (lang === 'ur' ? ' منٹ' : ' min');
      if (mins < 1440) return Math.round(mins / 60) + (lang === 'ur' ? ' گھنٹے' : ' hrs');
      if (mins < 43200) return Math.round(mins / 1440) + (lang === 'ur' ? ' دن' : ' days');
      if (mins < 525600) return Math.round(mins / 43200) + (lang === 'ur' ? ' مہینے' : ' mo');
      return Math.round(mins / 525600) + (lang === 'ur' ? ' سال' : ' yr');
    },

    onLang: function (fn) {
      fn(getLang());
      onLangChange(fn);
    },
  };
})();
