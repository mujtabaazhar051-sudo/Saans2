/**
 * Saans — tracker page
 */
(function () {
  'use strict';

  var T = SaansTools;

  function refreshStats() {
    T.el('trStreak').textContent = getStreak();
    T.el('trDays').textContent = getDaysSinceQuit();
    var checkins = LS.get('checkins', {});
    var clean = 0;
    Object.keys(checkins).forEach(function (k) { if (checkins[k]) clean++; });
    T.el('trClean').textContent = clean;
  }

  function refreshTodayCheckin() {
    var iso = todayISO();
    var checkins = LS.get('checkins', {});
    var done = checkins.hasOwnProperty(iso);
    T.el('trCheckToday').checked = done && checkins[iso];
    T.el('trCheckSaved').style.display = done ? 'inline' : 'none';
    T.el('trCheckBtn').style.display = done ? 'none' : 'inline-flex';
  }

  function saveToday() {
    var checkins = LS.get('checkins', {});
    checkins[todayISO()] = T.el('trCheckToday').checked;
    LS.set('checkins', checkins);
    SaansTools.toast(t('tracker.saved'));
    refreshTodayCheckin();
    refreshStats();
    buildHeatmap();
    buildRecent();
  }

  function buildHeatmap() {
    var grid = T.el('trHeatmap');
    if (!grid) return;
    grid.innerHTML = '';
    var checkins = LS.get('checkins', {});
    var qd = LS.get('quitDate', '');
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var start = T.addDays(today, -112);
    var cur = new Date(start);

    for (var col = 0; col < 16; col++) {
      var colEl = document.createElement('div');
      colEl.className = 'heatmap-col';
      for (var row = 0; row < 7; row++) {
        var cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        var iso = T.dateISO(cur);
        if (cur > today) cell.classList.add('is-future');
        else if (!qd || cur < T.parseDate(qd)) cell.classList.add('is-none');
        else if (checkins.hasOwnProperty(iso)) cell.classList.add(checkins[iso] ? 'is-free' : 'is-smoked');
        else cell.classList.add('is-none');
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
        '<label style="display:flex;align-items:center;gap:6px;font-size:var(--text-sm);">' +
          '<input type="checkbox" class="tr-day-cb" data-iso="' + iso + '" ' + (logged && checkins[iso] ? 'checked' : '') + '>' +
          '<button type="button" class="ui-btn ui-btn--secondary tr-day-save" data-iso="' + iso + '">' + t('tracker.saveDay') + '</button>' +
        '</label>';
      list.appendChild(row);
    }

    list.querySelectorAll('.tr-day-save').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var iso = btn.getAttribute('data-iso');
        var cb = list.querySelector('.tr-day-cb[data-iso="' + iso + '"]');
        var c = LS.get('checkins', {});
        c[iso] = cb.checked;
        LS.set('checkins', c);
        SaansTools.toast(t('tracker.saved'));
        refreshStats();
        buildHeatmap();
        buildRecent();
      });
    });
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
    buildHeatmap();
    buildRecent();
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.tracker = function () {
    SaansTools.withAuth(function () {
      T.el('trCheckBtn').addEventListener('click', saveToday);
      T.el('trRelapseBtn').addEventListener('click', function () {
        var c = LS.get('checkins', {});
        c[todayISO()] = false;
        LS.set('checkins', c);
        SaansTools.toast(t('tracker.relapseLogged'));
        render();
      });
      SaansTools.bindShare('trShareBtn', 'app');
      SaansTools.onLang(function () { applyI18nDOM(); render(); });
    });
  };
})();
