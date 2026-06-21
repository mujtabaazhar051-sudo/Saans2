/**
 * Saans — quit stats helpers (local timezone dates)
 */
(function () {
  'use strict';

  function localDateISO(d) {
    d = d || new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function parseLocalDate(iso) {
    var p = iso.split('-');
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  }

  function daysBetween(a, b) {
    return Math.floor((b - a) / 86400000);
  }

  function todayStart() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  window.localDateISO = localDateISO;
  window.todayISO = function () { return localDateISO(new Date()); };

  window.getDaysSinceQuit = function () {
    var qd = LS.get('quitDate', '');
    if (!qd) return 0;
    return Math.max(0, daysBetween(parseLocalDate(qd), todayStart()));
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
    var cur = todayStart();
    for (;;) {
      var iso = localDateISO(cur);
      if (checkins[iso] === true) {
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
