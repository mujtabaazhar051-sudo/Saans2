/**
 * Saans — quit stats helpers
 */
(function () {
  'use strict';

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function parseLocalDate(iso) {
    return new Date(iso + 'T00:00:00');
  }

  function daysBetween(a, b) {
    return Math.floor((b - a) / 86400000);
  }

  window.todayISO = todayISO;

  window.getDaysSinceQuit = function () {
    var qd = LS.get('quitDate', '');
    if (!qd) return 0;
    return Math.max(0, daysBetween(parseLocalDate(qd), new Date()));
  };

  window.getSavings = function () {
    var days = getDaysSinceQuit();
    var cpd = LS.get('cigsPerDay', 20);
    var pp = LS.get('packPrice', 600);
    var cpp = LS.get('cigsPerPack', 20);
    return Math.round(days * cpd * (pp / cpp));
  };

  window.getStreak = function () {
    var checkins = LS.get('checkins', {});
    var streak = 0;
    var cur = new Date();
    for (;;) {
      var iso = cur.toISOString().slice(0, 10);
      if (checkins[iso]) {
        streak++;
        cur.setDate(cur.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  window.getCigsAvoided = function () {
    return getDaysSinceQuit() * LS.get('cigsPerDay', 20);
  };

  window.formatPKR = function (amount) {
    if (amount >= 1000) return 'PKR ' + (amount / 1000).toFixed(1) + 'k';
    return 'PKR ' + amount.toLocaleString();
  };
})();
