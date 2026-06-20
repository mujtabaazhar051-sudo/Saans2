/**
 * Saans — badges page
 */
(function () {
  'use strict';

  var T = SaansTools;
  var B = SAANS_CONTENT.badges;

  function markEarned(id) {
    var earned = LS.get('earnedBadges', []);
    if (earned.indexOf(id) >= 0) return false;
    earned.push(id);
    LS.set('earnedBadges', earned);
    return true;
  }

  function evaluate() {
    var days = getDaysSinceQuit();
    var streak = getStreak();
    var cigs = getCigsAvoided();
    var savings = getSavings();
    var newOnes = [];
    B.time.forEach(function (b, i) {
      if (days >= b.days && markEarned(b.id)) newOnes.push(b.id);
    });
    B.milestone.forEach(function (b) {
      var val = b.type === 'cigs' ? cigs : savings;
      if (val >= b.threshold && markEarned(b.id)) newOnes.push(b.id);
    });
    B.streak.forEach(function (b) {
      if (streak >= b.streak && markEarned(b.id)) newOnes.push(b.id);
    });
    if (newOnes.length) SaansTools.toast(t('badges.newToast'));
    return newOnes;
  }

  function renderGrid(containerId, defs, labels, earned) {
    var grid = T.el(containerId);
    if (!grid) return;
    grid.innerHTML = '';
    defs.forEach(function (b, i) {
      var lbl = labels[i] || { name: '', desc: '' };
      var isEarned = earned.indexOf(b.id) >= 0;
      var div = document.createElement('div');
      div.className = 'badge-card ' + (isEarned ? 'is-earned' : 'is-locked');
      div.innerHTML =
        '<span class="badge-card__icon">' + b.icon + '</span>' +
        '<div class="badge-card__name">' + lbl.name + '</div>' +
        '<div class="badge-card__desc">' + lbl.desc + '</div>' +
        '<div class="badge-card__tag">' + (isEarned ? t('badges.earned') : t('badges.locked')) + '</div>';
      grid.appendChild(div);
    });
  }

  function render() {
    evaluate();
    var lang = getLang();
    var earned = LS.get('earnedBadges', []);
    var labels = B.labels[lang];
    var total = B.time.length + B.milestone.length + B.streak.length;

    T.el('bdEarned').textContent = earned.length;
    T.el('bdTotal').textContent = total;
    T.el('bdDays').textContent = getDaysSinceQuit();

    renderGrid('bdTimeGrid', B.time, labels.time, earned);
    renderGrid('bdMilestoneGrid', B.milestone, labels.milestone, earned);
    renderGrid('bdStreakGrid', B.streak, labels.streak, earned);
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.badges = function () {
    SaansTools.withAuth(function () {
      SaansTools.bindShare('bdShareBtn', 'app');
      SaansTools.onLang(function () { applyI18nDOM(); render(); });
    });
  };
})();
