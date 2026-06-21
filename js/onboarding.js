/**
 * Saans — onboarding wizard (reads language from storage, not DOM)
 */
(function () {
  'use strict';

  var TOTAL = 6;
  var step = 0;
  var quitVal = '';
  var motivVal = '';
  var triggers = [];
  var wired = false;
  var mounted = false;

  var QUIT_OPTS = [
    { val: 'decided', icon: '✅', key: 'onboarding.quit.decided' },
    { val: 'thinking', icon: '🤔', key: 'onboarding.quit.thinking' },
    { val: 'future', icon: '📅', key: 'onboarding.quit.future' },
    { val: 'exploring', icon: '👀', key: 'onboarding.quit.exploring' },
  ];

  var MOTIV_OPTS = [
    { val: 'health', icon: '❤️', key: 'onboarding.motiv.health' },
    { val: 'family', icon: '👨‍👩‍👧', key: 'onboarding.motiv.family' },
    { val: 'money', icon: '💰', key: 'onboarding.motiv.money' },
    { val: 'fitness', icon: '🏃', key: 'onboarding.motiv.fitness' },
    { val: 'pride', icon: '🌟', key: 'onboarding.motiv.pride' },
    { val: 'doctor', icon: '🩺', key: 'onboarding.motiv.doctor' },
  ];

  var TRIGGER_KEYS = [
    'onboarding.trigger.morning', 'onboarding.trigger.meals', 'onboarding.trigger.tea',
    'onboarding.trigger.stress', 'onboarding.trigger.friends', 'onboarding.trigger.bored',
    'onboarding.trigger.driving', 'onboarding.trigger.work', 'onboarding.trigger.happy',
    'onboarding.trigger.night',
  ];

  var STEP_HEADING_KEYS = [
    'onboarding.step0.heading', 'onboarding.step1.heading', 'onboarding.step2.heading',
    'onboarding.step3.heading', 'onboarding.step4.heading', 'onboarding.step5.heading',
  ];

  var STEP_SUB_KEYS = [
    'onboarding.step0.sub', 'onboarding.step1.sub', 'onboarding.step2.sub',
    'onboarding.step3.sub', 'onboarding.step4.sub', 'onboarding.step5.sub',
  ];

  function el(id) { return document.getElementById(id); }

  function mountOverlay() {
    if (el('obOverlay')) return true;
    var tpl = document.getElementById('obTemplate');
    if (!tpl || !tpl.content) return false;
    document.body.insertBefore(tpl.content.cloneNode(true), document.body.firstChild);
    mounted = true;
    wired = false;
    return true;
  }

  function unmountOverlay() {
    var overlay = el('obOverlay');
    if (overlay) overlay.remove();
    mounted = false;
    wired = false;
  }

  function hideOverlay() {
    var overlay = el('obOverlay');
    if (!overlay) return;
    overlay.classList.remove('is-visible', 'is-closing');
  }

  function showOverlay() {
    var overlay = el('obOverlay');
    if (!overlay) return;
    overlay.classList.add('is-visible');
  }

  function isOnboardingComplete() {
    if (LS.get('onboardingDone', false)) return true;
    if (LS.get('quitDate', '')) {
      LS.set('onboardingDone', true);
      return true;
    }
    var name = LS.get('userName', '');
    var checkins = LS.get('checkins', {});
    if (name && checkins && Object.keys(checkins).length > 0) {
      LS.set('onboardingDone', true);
      return true;
    }
    return false;
  }

  function updateHeader() {
    var lang = getLang();
    if (el('obStepLabel')) el('obStepLabel').textContent = (step + 1) + ' / ' + TOTAL;
    if (el('obHeading')) el('obHeading').textContent = t(STEP_HEADING_KEYS[step]);
    if (el('obSub')) el('obSub').textContent = t(STEP_SUB_KEYS[step]);
    if (el('obProgressBar')) el('obProgressBar').style.width = ((step / (TOTAL - 1)) * 100) + '%';

    var nextLbl = el('obNextLabel');
    var nextArr = el('obNextArrow');
    var backBtn = el('obBackBtn');
    var skipBtn = el('obSkipBtn');

    if (nextLbl) nextLbl.textContent = step === TOTAL - 1 ? t('onboarding.finish') : t('onboarding.next');
    if (nextArr) nextArr.textContent = step === TOTAL - 1 ? '' : (lang === 'ur' ? ' ←' : ' →');
    if (backBtn) backBtn.disabled = step === 0;
    if (skipBtn) {
      skipBtn.textContent = t('onboarding.skip');
      skipBtn.style.display = step === 0 ? 'none' : 'inline';
    }
    if (el('obNextBtn')) el('obNextBtn').classList.toggle('is-finish', step === TOTAL - 1);
  }

  function showStep(n) {
    document.querySelectorAll('.ob-step').forEach(function (node, i) {
      node.classList.toggle('is-active', i === n);
    });
    if (n === 2) buildOptions('obQuitOpts', QUIT_OPTS, quitVal, function (v) { quitVal = v; });
    if (n === 4) buildOptions('obMotivOpts', MOTIV_OPTS, motivVal, function (v) { motivVal = v; });
    if (n === 5) buildTriggers();
  }

  function buildOptions(containerId, opts, selected, onSelect) {
    var wrap = el(containerId);
    if (!wrap) return;
    wrap.innerHTML = '';
    opts.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ob-option' + (selected === opt.val ? ' is-selected' : '');
      btn.innerHTML = '<span class="ob-option__icon">' + opt.icon + '</span><span>' + t(opt.key) + '</span>';
      btn.addEventListener('click', function () {
        onSelect(opt.val);
        wrap.querySelectorAll('.ob-option').forEach(function (b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
      });
      wrap.appendChild(btn);
    });
  }

  function buildTriggers() {
    var wrap = el('obTriggerChips');
    if (!wrap) return;
    wrap.innerHTML = '';
    var note = document.createElement('p');
    note.className = 'ob-trigger-note';
    note.textContent = t('onboarding.triggerNote');
    wrap.appendChild(note);

    TRIGGER_KEYS.forEach(function (key) {
      var label = t(key);
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'ob-chip' + (triggers.indexOf(label) >= 0 ? ' is-selected' : '');
      chip.textContent = label;
      chip.addEventListener('click', function () {
        var idx = triggers.indexOf(label);
        if (idx >= 0) { triggers.splice(idx, 1); chip.classList.remove('is-selected'); }
        else { triggers.push(label); chip.classList.add('is-selected'); }
      });
      wrap.appendChild(chip);
    });
  }

  function finish() {
    var name = (el('obName') && el('obName').value.trim()) || '';
    var city = (el('obCity') && el('obCity').value.trim()) || '';
    var cpd = parseInt(el('obCpd') && el('obCpd').value, 10) || 20;
    var pp = parseInt(el('obPp') && el('obPp').value, 10) || 600;
    var yrs = parseInt(el('obYrs') && el('obYrs').value, 10) || 1;
    var qd = (el('obQuitDate') && el('obQuitDate').value) || todayISO();

    if (name) LS.set('userName', name);
    if (city) LS.set('userCity', city);
    LS.set('cigsPerDay', cpd);
    LS.set('packPrice', pp);
    LS.set('cigsPerPack', 20);
    LS.set('smokingYears', yrs);
    LS.set('quitDate', qd);
    if (quitVal) LS.set('quitDecision', quitVal);
    if (motivVal) LS.set('motivation', motivVal);
    if (triggers.length) LS.set('triggers', triggers);
    LS.set('onboardingDone', true);
    LS.set('onboardingSuccess', true);

    var overlay = el('obOverlay');
    if (overlay) {
      overlay.classList.add('is-closing');
      setTimeout(function () {
        hideOverlay();
        unmountOverlay();
      }, 400);
    }

    if (typeof window.showOnboardingSuccess === 'function') {
      setTimeout(window.showOnboardingSuccess, 450);
    }
    if (typeof window.refreshDashboard === 'function') refreshDashboard();
    var user = getCurrentUser && getCurrentUser();
    if (user && typeof syncToCloud === 'function') syncToCloud(user);
  }

  function next() {
    if (step < TOTAL - 1) {
      step++;
      showStep(step);
      updateHeader();
    } else {
      finish();
    }
  }

  function back() {
    if (step > 0) {
      step--;
      showStep(step);
      updateHeader();
    }
  }

  window.SaansOnboardingNext = next;
  window.SaansOnboardingBack = back;
  window.SaansOnboardingSkip = finish;

  function wireButtons() {
    if (wired) return;
    wired = true;
    if (el('obNextBtn')) el('obNextBtn').addEventListener('click', next);
    if (el('obBackBtn')) el('obBackBtn').addEventListener('click', back);
    if (el('obSkipBtn')) el('obSkipBtn').addEventListener('click', finish);
  }

  function applyStaticLabels() {
    if (typeof applyI18nDOM === 'function') applyI18nDOM();
    if (el('obWelcomeH')) el('obWelcomeH').textContent = t('onboarding.welcome.title');
    if (el('obWelcomeP')) el('obWelcomeP').textContent = t('onboarding.welcome.body');
    if (el('obNameLabel')) el('obNameLabel').textContent = t('onboarding.name');
    if (el('obName')) el('obName').placeholder = t('onboarding.namePh');
    if (el('obCityLabel')) el('obCityLabel').textContent = t('onboarding.city');
    if (el('obCity')) el('obCity').placeholder = t('onboarding.cityPh');
    if (el('obCpdLabel')) el('obCpdLabel').textContent = t('onboarding.cpd');
    if (el('obPpLabel')) el('obPpLabel').textContent = t('onboarding.packPrice');
    if (el('obYrsLabel')) el('obYrsLabel').textContent = t('onboarding.years');
    if (el('obQuitDateLabel')) el('obQuitDateLabel').textContent = t('onboarding.quitDate');
  }

  window.SaansOnboarding = {
    init: function () {
      if (isOnboardingComplete()) {
        return;
      }

      if (!mountOverlay()) return;

      wireButtons();
      if (el('obQuitDate')) el('obQuitDate').value = todayISO();
      applyStaticLabels();
      showStep(0);
      updateHeader();
      showOverlay();

      if (!window._obLangHook) {
        window._obLangHook = true;
        onLangChange(function () {
          if (!el('obOverlay')) return;
          applyStaticLabels();
          updateHeader();
          showStep(step);
        });
      }
    },
    restart: function () {
      LS.set('onboardingDone', false);
      step = 0;
      quitVal = '';
      motivVal = '';
      triggers = [];
      unmountOverlay();
      if (!mountOverlay()) return;
      wireButtons();
      showOverlay();
      if (el('obQuitDate')) el('obQuitDate').value = todayISO();
      applyStaticLabels();
      showStep(0);
      updateHeader();
    },
  };
})();
