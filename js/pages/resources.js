/**
 * Saans — resources page
 */
(function () {
  'use strict';

  var T = SaansTools;
  var activeTab = 'books';

  function renderTabs() {
    var wrap = T.el('rsTabs');
    wrap.innerHTML = '';
    ['books', 'websites', 'videos'].forEach(function (tab) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tool-tab' + (activeTab === tab ? ' is-active' : '');
      btn.textContent = t('resources.tab.' + tab);
      btn.addEventListener('click', function () { activeTab = tab; renderTabs(); renderList(); });
      wrap.appendChild(btn);
    });
  }

  function renderList() {
    var lang = getLang();
    var items = SAANS_CONTENT.resources[activeTab][lang];
    var list = T.el('rsList');
    list.innerHTML = '';
    items.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'resource-card';
      var link = item.url ? '<a href="' + item.url + '" target="_blank" rel="noopener" style="color:var(--color-primary);font-weight:600;">' + (item.title || item.name) + ' ↗</a>' : (item.title || item.name);
      var sub = item.author ? '<div style="font-size:var(--text-sm);color:var(--color-text-muted);">' + item.author + '</div>' : '';
      div.innerHTML = link + sub;
      list.appendChild(div);
    });
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.resources = function () {
    SaansTools.onLang(function () { applyI18nDOM(); renderTabs(); renderList(); });
  };
})();
