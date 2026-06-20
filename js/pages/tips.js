/**
 * Saans — tips page
 */
(function () {
  'use strict';

  var T = SaansTools;
  var activeCat = 'all';

  function renderChips() {
    var lang = getLang();
    var cats = SAANS_CONTENT.tips.cats[lang];
    var wrap = T.el('tpChips');
    wrap.innerHTML = '';
    Object.keys(cats).forEach(function (key) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-chip' + (activeCat === key ? ' is-active' : '');
      btn.textContent = cats[key];
      btn.addEventListener('click', function () { activeCat = key; renderChips(); renderTips(); });
      wrap.appendChild(btn);
    });
  }

  function renderTips() {
    var lang = getLang();
    var tips = SAANS_CONTENT.tips[lang];
    var list = T.el('tpList');
    list.innerHTML = '';
    tips.forEach(function (tip) {
      if (activeCat !== 'all' && tip.cat !== activeCat) return;
      var div = document.createElement('div');
      div.className = 'tip-card';
      div.innerHTML = '<div class="tip-card__cat">' + (SAANS_CONTENT.tips.cats[lang][tip.cat] || tip.cat) + '</div><p>' + tip.text + '</p>';
      list.appendChild(div);
    });
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.tips = function () {
    SaansTools.onLang(function () { applyI18nDOM(); renderChips(); renderTips(); });
  };
})();
