/**
 * Saans — dashboard page logic
 */
(function () {
  'use strict';

  var RING_C = 302;
  var MILESTONES = [1, 3, 7, 14, 30, 90, 180, 365];

  var TOOLS = [
    { href: 'tracker.html', icon: '📅', key: 'tools.tracker' },
    { href: 'savings.html', icon: '💰', key: 'tools.savings' },
    { href: 'badges.html', icon: '🏅', key: 'tools.badges' },
    { href: 'health.html', icon: '❤️', key: 'tools.health' },
    { href: 'motivation.html', icon: '💬', key: 'tools.motivation' },
    { href: 'tips.html', icon: '💡', key: 'tools.tips' },
    { href: 'stories.html', icon: '⭐', key: 'tools.stories' },
    { href: 'nicotine.html', icon: '💊', key: 'tools.nrt' },
    { href: 'helplines.html', icon: '📞', key: 'tools.helplines' },
    { href: 'resources.html', icon: '🔗', key: 'tools.resources' },
    { href: 'leaderboard.html', icon: '🏆', key: 'tools.leaderboard' },
  ];

  var QUOTES = {
    ur: [
      'dashboard.quote.1', 'dashboard.quote.2', 'dashboard.quote.3',
      'dashboard.quote.4', 'dashboard.quote.5',
    ],
    en: [
      'dashboard.quote.1', 'dashboard.quote.2', 'dashboard.quote.3',
      'dashboard.quote.4', 'dashboard.quote.5',
    ],
  };

  var DAY_KEYS = [
    'dashboard.day.sun', 'dashboard.day.mon', 'dashboard.day.tue',
    'dashboard.day.wed', 'dashboard.day.thu', 'dashboard.day.fri', 'dashboard.day.sat',
  ];

  function $(id) { return document.getElementById(id); }

  function greetingTime(lang) {
    var h = new Date().getHours();
    if (lang === 'ur') {
      if (h < 12) return t('dashboard.greet.morning');
      if (h < 17) return t('dashboard.greet.afternoon');
      return t('dashboard.greet.evening');
    }
    if (h < 12) return t('dashboard.greet.morning');
    if (h < 17) return t('dashboard.greet.afternoon');
    return t('dashboard.greet.evening');
  }

  function buildToolsGrid() {
    var grid = $('dashToolsGrid');
    if (!grid || grid.childElementCount) return;
    TOOLS.forEach(function (tool) {
      var a = document.createElement('a');
      a.className = 'dt-card';
      a.href = saansHref(tool.href);
      a.innerHTML = '<span class="dt-card__icon">' + tool.icon + '</span><span class="dt-card__label" data-i18n="' + tool.key + '"></span>';
      grid.appendChild(a);
    });
    applyI18nDOM();
  }

  function showOnboardingSuccessBanner() {
    if (!LS.get('onboardingSuccess', false)) return;
    LS.set('onboardingSuccess', false);
    var banner = $('onboardingSuccessBanner');
    if (!banner) return;
    banner.hidden = false;
    applyI18nDOM();
    var btn = $('onboardingSuccessDismiss');
    if (btn && !btn._wired) {
      btn._wired = true;
      btn.addEventListener('click', function () {
        banner.hidden = true;
        LS.set('onboardingSuccess', false);
      });
    }
  }

  window.showOnboardingSuccess = showOnboardingSuccessBanner;

  function refreshSetupBar() {
    var saved = LS.get('quitDate', '');
    var setup = $('setupBar');
    var checkin = $('dashCheckin');
    var stats = $('dashStats');
    if (setup) setup.classList.toggle('is-visible', !saved);
    if (checkin) checkin.classList.toggle('is-visible', !!saved);
    if (stats) stats.style.display = saved ? 'flex' : 'none';
    if (saved && $('quitDateInput')) $('quitDateInput').value = saved;
  }

  function updateProgressRing(days) {
    var ring = $('dashRingFill');
    if (!ring) return;
    var progress = Math.min(days / 365, 1);
    var offset = RING_C - progress * RING_C;
    setTimeout(function () { ring.style.strokeDashoffset = offset; }, 200);
  }

  function updateNextMilestone(days, lang) {
    var el = $('dashNextMs');
    if (!el) return;
    var next = MILESTONES.find(function (m) { return m > days; });
    if (next) {
      var left = next - days;
      el.textContent = t('dashboard.nextMilestone', { days: next, left: left });
    } else {
      el.textContent = t('dashboard.milestoneYear');
    }
  }

  function buildWeeklySummary(lang) {
    var wrap = $('weeklySummary');
    if (!wrap) return;
    var qd = LS.get('quitDate', '');
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var dow = today.getDay();

    if (!qd || dow < 3) {
      wrap.classList.remove('is-visible');
      return;
    }
    wrap.classList.add('is-visible');

    var checkins = LS.get('checkins', {});
    var quitDate = new Date(qd + 'T00:00:00');
    var weekDays = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(today);
      d.setDate(today.getDate() - dow + i);
      weekDays.push({ date: d, iso: d.toISOString().slice(0, 10), dayIdx: i });
    }

    var cleanDays = 0;
    weekDays.forEach(function (wd) {
      if (wd.date >= quitDate && checkins[wd.iso] === true) cleanDays++;
    });

    var cpd = LS.get('cigsPerDay', 20);
    var cpc = LS.get('packPrice', 600) / LS.get('cigsPerPack', 20);
    var weekSaved = Math.round(cleanDays * cpd * cpc);
    var streak = getStreak();

    $('wsClean').textContent = cleanDays;
    $('wsSaved').textContent = weekSaved.toLocaleString();
    $('wsCigs').textContent = cleanDays * cpd;
    $('wsStreak').textContent = streak;

    var locale = lang === 'ur' ? 'ur-PK' : 'en-PK';
    $('wsWeek').textContent =
      weekDays[0].date.toLocaleDateString(locale, { month: 'short', day: 'numeric' }) +
      ' – ' +
      weekDays[6].date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });

    var row = $('wsDaysRow');
    row.innerHTML = '';
    var todayIso = today.toISOString().slice(0, 10);
    weekDays.forEach(function (wd) {
      var dot = document.createElement('div');
      var cls = 'ws-day ws-day--empty';
      if (wd.date >= quitDate) {
        if (checkins[wd.iso] === true) cls = 'ws-day ws-day--clean';
        if (checkins[wd.iso] === false) cls = 'ws-day ws-day--smoked';
      }
      if (wd.iso === todayIso) cls += ' ws-day--today';
      dot.className = cls;
      dot.textContent = t(DAY_KEYS[wd.dayIdx]);
      row.appendChild(dot);
    });

    var msgKey = 'dashboard.week.msg.' + Math.min(cleanDays, 7);
    $('wsMsg').textContent = t(msgKey);
  }

  function launchConfetti() {
    var wrap = $('dashConfetti');
    if (!wrap) return;
    var emojis = ['🎉', '✨', '💚', '⭐', '🌟', '💫', '🎊', '🫁'];
    wrap.innerHTML = '';
    wrap.classList.add('is-visible');
    for (var i = 0; i < 28; i++) {
      var p = document.createElement('div');
      p.className = 'dash-confetti__piece';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDelay = Math.random() * 0.8 + 's';
      wrap.appendChild(p);
    }
    setTimeout(function () { wrap.classList.remove('is-visible'); }, 3000);
  }

  window.logCheckin = function (smokeFree) {
    var lang = getLang();
    var checkins = LS.get('checkins', {});
    checkins[todayISO()] = smokeFree;
    LS.set('checkins', checkins);

    $('checkinBtns').style.display = 'none';
    var done = $('checkinDone');
    done.style.display = 'flex';
    $('checkinDoneText').textContent = smokeFree ? t('dashboard.checkin.doneYes') : t('dashboard.checkin.doneNo');

    showToast(smokeFree ? t('dashboard.checkin.toastYes') : t('dashboard.checkin.toastNo'));
    if (smokeFree) launchConfetti();
    refreshDashboard();

    var user = getCurrentUser && getCurrentUser();
    if (user) syncToCloud(user);
  };

  window.refreshDashboard = function () {
    var lang = getLang();
    var days = getDaysSinceQuit();
    var streak = getStreak();
    var savings = getSavings();
    var badges = (LS.get('earnedBadges', []) || []).length;
    var name = LS.get('userName', '');
    var checkins = LS.get('checkins', {});
    var todayLogged = Object.prototype.hasOwnProperty.call(checkins, todayISO());

    var greet = greetingTime(lang);
    $('dashGreeting').textContent = name ? greet + '، ' + name + ' 👋' : greet + ' 👋';
    $('dashDays').textContent = days;
    $('dashDaysLabel').textContent = t('dashboard.daysLabel');
    $('qsStreak').textContent = streak;
    $('qsSaved').textContent = formatPKR(savings);
    $('dashBadges').textContent = badges;

    if (todayLogged) {
      $('checkinBtns').style.display = 'none';
      $('checkinDone').style.display = 'flex';
      $('checkinDoneText').textContent = checkins[todayISO()] === true
        ? t('dashboard.checkin.alreadyYes')
        : t('dashboard.checkin.alreadyNo');
    } else {
      $('checkinBtns').style.display = 'flex';
      $('checkinDone').style.display = 'none';
    }

    var quoteKeys = QUOTES[lang] || QUOTES.en;
    $('dqText').textContent = t(quoteKeys[days % quoteKeys.length]);

    updateProgressRing(days);
    updateNextMilestone(days, lang);
    buildWeeklySummary(lang);
    refreshSetupBar();
    applyI18nDOM();
  };

  window.SaansPages = window.SaansPages || {};

  function finishDashboardBoot() {
    document.documentElement.classList.remove('saans-booting');
  }

  SaansPages.dashboard = function () {
    initAnalytics();
    buildToolsGrid();

    $('setupSaveBtn').addEventListener('click', function () {
      var val = $('quitDateInput').value;
      if (!val) return;
      LS.set('quitDate', val);
      refreshSetupBar();
      refreshDashboard();
      showToast(t('dashboard.quitDateSaved'));
      var user = getCurrentUser && getCurrentUser();
      if (user) syncToCloud(user);
    });

    $('waShareBtn').addEventListener('click', function () {
      shareOnWhatsApp('dashboard');
    });

    requireAuth(function (user) {
      syncFromCloud(user).finally(function () {
        SaansOnboarding.init();
        showOnboardingSuccessBanner();
        refreshDashboard();
        finishDashboardBoot();
        syncToCloud(user);
      });
    });

    onLangChange(function () {
      refreshDashboard();
    });
  };
})();
