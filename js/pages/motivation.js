/**
 * Saans — motivation / quotes page
 */
(function () {
  'use strict';

  var T = SaansTools;

  function todayQuoteIdx() {
    var quotes = SAANS_CONTENT.quotes[getLang()];
    var start = new Date(new Date().getFullYear(), 0, 0);
    var day = Math.floor((Date.now() - start.getTime()) / 86400000);
    return day % quotes.length;
  }

  function renderQuote() {
    var lang = getLang();
    var quotes = SAANS_CONTENT.quotes[lang];
    var idx = todayQuoteIdx();
    T.el('mqText').textContent = '"' + quotes[idx] + '"';
    T.el('mqFavBtn').dataset.idx = idx;
    var favs = LS.get('favQuotes', []);
    T.el('mqFavBtn').textContent = favs.indexOf(idx) >= 0 ? t('motivation.unfav') : t('motivation.fav');
  }

  function renderPersonal() {
    var motiv = LS.get('motivation', '');
    var name = LS.get('userName', '');
    var box = T.el('mqPersonal');
    if (!motiv && !name) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    var map = {
      health: t('onboarding.motiv.health'), family: t('onboarding.motiv.family'),
      money: t('onboarding.motiv.money'), fitness: t('onboarding.motiv.fitness'),
      pride: t('onboarding.motiv.pride'), doctor: t('onboarding.motiv.doctor'),
    };
    T.el('mqPersonalText').textContent = (name ? name + ' — ' : '') + (map[motiv] || motiv);
  }

  function renderFavs() {
    var lang = getLang();
    var quotes = SAANS_CONTENT.quotes[lang];
    var favs = LS.get('favQuotes', []);
    var list = T.el('mqFavs');
    list.innerHTML = '';
    if (!favs.length) {
      list.innerHTML = '<p style="color:var(--color-text-muted);font-size:var(--text-sm);">' + t('motivation.noFavs') + '</p>';
      return;
    }
    favs.forEach(function (idx) {
      var div = document.createElement('div');
      div.className = 'ui-card--tool';
      div.textContent = '"' + quotes[idx] + '"';
      list.appendChild(div);
    });
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.motivation = function () {
    SaansTools.withAuth(function () {
      T.el('mqFavBtn').addEventListener('click', function () {
        var idx = parseInt(T.el('mqFavBtn').dataset.idx, 10);
        var favs = LS.get('favQuotes', []);
        var pos = favs.indexOf(idx);
        if (pos >= 0) favs.splice(pos, 1);
        else favs.push(idx);
        LS.set('favQuotes', favs);
        renderQuote();
        renderFavs();
      });
      T.el('mqShareBtn').addEventListener('click', function () {
        var text = T.el('mqText').textContent + '\n\n' + (SAANS_CONFIG.SITE_URL || '');
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
      });
      SaansTools.onLang(function () { applyI18nDOM(); renderQuote(); renderPersonal(); renderFavs(); });
    });
  };
})();
