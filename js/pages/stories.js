/**
 * Saans — success stories page
 */
(function () {
  'use strict';

  var T = SaansTools;

  function renderStories() {
    var lang = getLang();
    var stories = SAANS_CONTENT.stories[lang];
    var userStories = LS.get('userStories', []);
    var list = T.el('stList');
    list.innerHTML = '';
    stories.concat(userStories).forEach(function (s) {
      var div = document.createElement('div');
      div.className = 'story-card';
      div.innerHTML = '<div style="font-weight:700;margin-bottom:4px;">' + s.name + ' · ' + s.days + ' ' + t('stories.days') + '</div><p style="font-size:var(--text-sm);color:var(--color-text-muted);">' + s.text + '</p>';
      list.appendChild(div);
    });
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.stories = function () {
    T.el('stSubmit').addEventListener('click', function () {
      var name = T.el('stName').value.trim();
      var days = parseInt(T.el('stDays').value, 10) || 0;
      var text = T.el('stText').value.trim();
      if (!name || !text) { SaansTools.toast(t('stories.fillAll')); return; }
      var arr = LS.get('userStories', []);
      arr.unshift({ name: name, days: days, text: text });
      LS.set('userStories', arr);
      T.el('stName').value = '';
      T.el('stDays').value = '';
      T.el('stText').value = '';
      SaansTools.toast(t('stories.thanks'));
      renderStories();
    });
    SaansTools.onLang(function () { applyI18nDOM(); renderStories(); });
  };
})();
