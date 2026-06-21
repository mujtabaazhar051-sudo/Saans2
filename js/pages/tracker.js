/**
 * Saans — tracker page
 */
(function () {
  'use strict';

  var T = SaansTools;

  function weekCleanCount() {
    var checkins = LS.get('checkins', {});
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var dow = today.getDay();
    var qd = LS.get('quitDate', '');
    if (!qd) return 0;
    var quitDate = T.parseDate(qd);
    var count = 0;
    for (var i = 0; i < 7; i++) {
      var d = new Date(today);
      d.setDate(today.getDate() - dow + i);
      if (d > today) continue;
      if (d < quitDate) continue;
      if (checkins[T.dateISO(d)] === true) count++;
    }
    return count;
  }

  function refreshStats() {
    T.el('trStreak').textContent = getStreak();
    T.el('trDays').textContent = getDaysSinceQuit();
    var checkins = LS.get('checkins', {});
    var clean = 0;
    Object.keys(checkins).forEach(function (k) { if (checkins[k]) clean++; });
    T.el('trClean').textContent = clean;
    var wc = T.el('trWeekClean');
    if (wc) wc.textContent = weekCleanCount();
  }

  function refreshTodayCheckin() {
    var iso = todayISO();
    var checkins = LS.get('checkins', {});
    var done = checkins.hasOwnProperty(iso);
    var yesBtn = T.el('trYesBtn');
    var noBtn = T.el('trNoBtn');
    var doneBox = T.el('trTodayDone');
    if (done) {
      if (yesBtn) yesBtn.style.display = 'none';
      if (noBtn) noBtn.style.display = 'none';
      if (doneBox) {
        doneBox.style.display = 'flex';
        doneBox.textContent = checkins[iso]
          ? t('tracker.todayDoneYes')
          : t('tracker.todayDoneNo');
      }
    } else {
      if (yesBtn) yesBtn.style.display = 'inline-flex';
      if (noBtn) noBtn.style.display = 'inline-flex';
      if (doneBox) doneBox.style.display = 'none';
    }
  }

  function logToday(smokeFree) {
    SaansTools.saveCheckin(todayISO(), smokeFree);
    SaansTools.toast(smokeFree ? t('tracker.savedYes') : t('tracker.savedNo'));
    render();
  }

  function buildHeatmap() {
    var grid = T.el('trHeatmap');
    if (!grid) return;
    grid.innerHTML = '';
    var checkins = LS.get('checkins', {});
    var qd = LS.get('quitDate', '');
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var start = T.addDays(today, -111);
    var cur = new Date(start);
    var lastMonth = -1;

    for (var col = 0; col < 16; col++) {
      var colEl = document.createElement('div');
      colEl.className = 'heatmap-col';
      if (cur.getMonth() !== lastMonth) {
        var lbl = document.createElement('div');
        lbl.className = 'heatmap-month-label';
        lbl.textContent = T.months(getLang())[cur.getMonth()];
        colEl.appendChild(lbl);
        lastMonth = cur.getMonth();
      }
      for (var row = 0; row < 7; row++) {
        var cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'heatmap-cell';
        var iso = T.dateISO(cur);
        cell.title = iso;
        if (cur > today) cell.classList.add('is-future');
        else if (!qd || cur < T.parseDate(qd)) cell.classList.add('is-none');
        else if (checkins.hasOwnProperty(iso)) cell.classList.add(checkins[iso] ? 'is-free' : 'is-smoked');
        else cell.classList.add('is-none');
        if (!cell.classList.contains('is-future') && qd && cur >= T.parseDate(qd)) {
          cell.addEventListener('click', (function (dateIso, dateObj) {
            return function () {
              var c = LS.get('checkins', {});
              if (c[dateIso] === true) c[dateIso] = false;
              else c[dateIso] = true;
              LS.set('checkins', c);
              SaansTools.syncCloud();
              SaansTools.toast(t('tracker.saved'));
              render();
            };
          })(iso, cur));
        }
        colEl.appendChild(cell);
        cur = T.addDays(cur, 1);
      }
      grid.appendChild(colEl);
    }
  }

  function buildRecent() {
    var list = T.el('trRecent');
    if (!list) return;
    list.innerHTML = '';
    var lang = getLang();
    var qd = LS.get('quitDate', '');
    if (!qd) return;
    var checkins = LS.get('checkins', {});
    var months = T.months(lang);
    var days = T.daysShort(lang);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    for (var i = 0; i < 14; i++) {
      var d = T.addDays(today, -i);
      if (d < T.parseDate(qd)) break;
      var iso = T.dateISO(d);
      var logged = checkins.hasOwnProperty(iso);
      var row = document.createElement('div');
      row.className = 'day-row';
      var dotClass = logged ? (checkins[iso] ? 'is-free' : 'is-smoked') : 'is-none';
      var status = logged
        ? (checkins[iso] ? t('tracker.statusFree') : t('tracker.statusSmoked'))
        : t('tracker.statusNone');
      row.innerHTML =
        '<div class="day-dot ' + dotClass + '"></div>' +
        '<div class="day-row__date">' + d.getDate() + ' ' + months[d.getMonth()] + ' · ' + days[d.getDay()] + '</div>' +
        '<span class="day-row__status">' + status + '</span>' +
        '<div class="day-row__actions">' +
          '<button type="button" class="ui-btn ui-btn--primary ui-btn--sm tr-day-yes" data-iso="' + iso + '">' + t('dashboard.checkin.yes') + '</button>' +
          '<button type="button" class="ui-btn ui-btn--secondary ui-btn--sm tr-day-no" data-iso="' + iso + '">' + t('dashboard.checkin.no') + '</button>' +
        '</div>';
      list.appendChild(row);
    }

    list.querySelectorAll('.tr-day-yes').forEach(function (btn) {
      btn.addEventListener('click', function () {
        SaansTools.saveCheckin(btn.getAttribute('data-iso'), true);
        SaansTools.toast(t('tracker.saved'));
        render();
      });
    });
    list.querySelectorAll('.tr-day-no').forEach(function (btn) {
      btn.addEventListener('click', function () {
        SaansTools.saveCheckin(btn.getAttribute('data-iso'), false);
        SaansTools.toast(t('tracker.savedNo'));
        render();
      });
    });
  }

  function buildWeekRow() {
    var row = T.el('trWeekRow');
    if (!row) return;
    row.innerHTML = '';
    var qd = LS.get('quitDate', '');
    if (!qd) return;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var dow = today.getDay();
    var checkins = LS.get('checkins', {});
    var quitDate = T.parseDate(qd);
    var todayIso = todayISO();
    var dayKeys = [
      'dashboard.day.sun', 'dashboard.day.mon', 'dashboard.day.tue',
      'dashboard.day.wed', 'dashboard.day.thu', 'dashboard.day.fri', 'dashboard.day.sat',
    ];
    for (var i = 0; i < 7; i++) {
      var d = new Date(today);
      d.setDate(today.getDate() - dow + i);
      var iso = T.dateISO(d);
      var dot = document.createElement('div');
      var cls = 'tracker-wday tracker-wday--empty';
      if (d >= quitDate) {
        if (checkins[iso] === true) cls = 'tracker-wday tracker-wday--clean';
        if (checkins[iso] === false) cls = 'tracker-wday tracker-wday--smoked';
      }
      if (iso === todayIso) cls += ' tracker-wday--today';
      dot.className = cls;
      dot.innerHTML = '<span class="tracker-wday__label">' + t(dayKeys[i]) + '</span>';
      row.appendChild(dot);
    }
  }

  function render() {
    var qd = LS.get('quitDate', '');
    if (!qd) {
      SaansTools.renderNoQuitDate('trNoDate');
      T.el('trMain').style.display = 'none';
      return;
    }
    SaansTools.hideNoQuitDate('trNoDate');
    T.el('trMain').style.display = 'block';
    refreshStats();
    refreshTodayCheckin();
    buildWeekRow();
    buildHeatmap();
    buildRecent();
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.tracker = function () {
    SaansTools.withAuth(function () {
      T.el('trYesBtn').addEventListener('click', function () { logToday(true); });
      T.el('trNoBtn').addEventListener('click', function () { logToday(false); });
      T.el('trRelapseBtn').addEventListener('click', function () {
        SaansTools.saveCheckin(todayISO(), false);
        SaansTools.toast(t('tracker.relapseLogged'));
        render();
      });
      SaansTools.bindShare('trShareBtn', 'app');
      SaansTools.onLang(function () { applyI18nDOM(); render(); });
      render();
    });
  };
})();
