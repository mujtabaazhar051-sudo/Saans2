/**
 * Saans — health journey page
 */
(function () {
  'use strict';

  var T = SaansTools;
  var H = SAANS_CONTENT.health;

  function render() {
    var qd = LS.get('quitDate', '');
    if (!qd) {
      SaansTools.renderNoQuitDate('hlNoDate');
      T.el('hlMain').style.display = 'none';
      return;
    }
    SaansTools.hideNoQuitDate('hlNoDate');
    T.el('hlMain').style.display = 'block';

    var lang = getLang();
    var mins = T.minutesSinceQuit();
    var data = H[lang];
    T.el('hlDays').textContent = getDaysSinceQuit();

    var reached = -1;
    H.minutes.forEach(function (m, i) { if (mins >= m) reached = i; });

    if (reached >= 0) {
      T.el('hlLatest').style.display = 'block';
      T.el('hlLatestIcon').textContent = H.icons[reached];
      T.el('hlLatestTitle').textContent = data[reached].title;
      T.el('hlLatestDesc').textContent = data[reached].desc;
    } else {
      T.el('hlLatest').style.display = 'none';
    }

    var pct = Math.min(100, Math.round((mins / H.minutes[5]) * 100));
    T.el('hlProgressBar').style.width = pct + '%';
    T.el('hlProgressPct').textContent = pct + '%';

    var timeline = T.el('hlTimeline');
    timeline.innerHTML = '';
    H.minutes.forEach(function (m, i) {
      var item = data[i];
      var isReached = mins >= m;
      var isNext = !isReached && (i === 0 || mins >= H.minutes[i - 1]);
      var div = document.createElement('div');
      div.className = 'timeline-item' + (isReached ? ' is-reached' : (isNext ? ' is-next' : ' is-locked'));
      div.innerHTML =
        '<div class="timeline-item__icon">' + H.icons[i] + '</div>' +
        '<div><div class="timeline-item__time">' + item.time + '</div>' +
        '<div class="timeline-item__title">' + item.title + '</div>' +
        '<div class="timeline-item__desc">' + item.desc + '</div></div>';
      timeline.appendChild(div);
    });
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.health = function () {
    SaansTools.withAuth(function () {
      SaansTools.onLang(function () { applyI18nDOM(); render(); });
    });
  };
})();
