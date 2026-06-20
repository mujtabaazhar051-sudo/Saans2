/**
 * Saans — savings page
 */
(function () {
  'use strict';

  var T = SaansTools;
  var PKR = SAANS_CONTENT.PKR_PER_USD;

  function calc() {
    var cpd = parseInt(T.el('svCpd').value, 10) || 20;
    var pp = parseInt(T.el('svPp').value, 10) || 600;
    var cpp = parseInt(T.el('svCpp').value, 10) || 20;
    var cpc = pp / cpp;
    var dpd = cpd * cpc;
    var days = getDaysSinceQuit();
    return { cpd: cpd, pp: pp, cpp: cpp, dpd: dpd, days: days, total: Math.round(days * dpd), cigs: days * cpd };
  }

  function render() {
    var qd = LS.get('quitDate', '');
    if (!qd) {
      SaansTools.renderNoQuitDate('svNoDate');
      T.el('svMain').style.display = 'none';
      return;
    }
    SaansTools.hideNoQuitDate('svNoDate');
    T.el('svMain').style.display = 'block';

    T.el('svCpd').value = LS.get('cigsPerDay', 20);
    T.el('svPp').value = LS.get('packPrice', 600);
    T.el('svCpp').value = LS.get('cigsPerPack', 20);

    var s = calc();
    LS.set('cigsPerDay', s.cpd);
    LS.set('packPrice', s.pp);
    LS.set('cigsPerPack', s.cpp);

    T.el('svTotal').textContent = s.total.toLocaleString();
    T.el('svUsd').textContent = '≈ $' + Math.round(s.total / PKR).toLocaleString();
    T.el('svMetaDays').textContent = s.days;
    T.el('svMetaCigs').textContent = s.cigs.toLocaleString();
    T.el('svMetaDaily').textContent = Math.round(s.dpd).toLocaleString();
    T.el('svCigsBanner').textContent = s.cigs.toLocaleString();

    var periods = [
      { key: 'day', val: Math.round(s.dpd) },
      { key: 'week', val: Math.round(s.dpd * 7) },
      { key: 'month', val: Math.round(s.dpd * 30) },
      { key: 'year', val: Math.round(s.dpd * 365) },
    ];
    var grid = T.el('svBreakdown');
    grid.innerHTML = '';
    periods.forEach(function (p, i) {
      var div = document.createElement('div');
      div.className = 'breakdown-card';
      div.innerHTML = '<div class="breakdown-card__period">' + t('savings.period.' + p.key) + '</div>' +
        '<div class="breakdown-card__amount">PKR ' + p.val.toLocaleString() + '</div>';
      grid.appendChild(div);
    });

    var lang = getLang();
    var buys = T.el('svBuys');
    buys.innerHTML = '';
    SAANS_CONTENT.savingsItems.forEach(function (item) {
      var ok = s.total >= item.pkr;
      var div = document.createElement('div');
      div.className = 'buy-card ' + (ok ? 'is-unlocked' : 'is-locked');
      div.innerHTML = '<span class="buy-card__icon">' + item.icon + '</span>' +
        '<div style="font-weight:600;font-size:var(--text-sm);">' + (lang === 'ur' ? item.ur : item.en) + '</div>' +
        '<div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:4px;">PKR ' + item.pkr.toLocaleString() + '</div>' +
        '<div style="font-size:var(--text-xs);margin-top:6px;color:' + (ok ? 'var(--color-success)' : 'var(--color-text-muted)') + ';">' +
        (ok ? t('savings.unlocked') : t('savings.locked')) + '</div>';
      buys.appendChild(div);
    });
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.savings = function () {
    SaansTools.withAuth(function () {
      T.el('svRecalc').addEventListener('click', function () {
        render();
        SaansTools.toast(t('savings.recalcDone'));
      });
      SaansTools.bindShare('svShareBtn', 'app');
      SaansTools.onLang(function () { applyI18nDOM(); render(); });
    });
  };
})();
