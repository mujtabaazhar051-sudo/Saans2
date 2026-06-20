/**
 * Saans — breathing exercise page
 */
(function () {
  'use strict';

  var T = SaansTools;
  var running = false;
  var timer;
  var technique = '478';
  var phaseIdx = 0;
  var cycles = 0;

  var TECHS = {
    '478': { phases: [{ name: 'inhale', sec: 4 }, { name: 'hold', sec: 7 }, { name: 'exhale', sec: 8 }] },
    box: { phases: [{ name: 'inhale', sec: 4 }, { name: 'hold', sec: 4 }, { name: 'exhale', sec: 4 }, { name: 'hold', sec: 4 }] },
  };

  function setTechnique(key) {
    technique = key;
    document.querySelectorAll('.br-tech').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.tech === key);
    });
    resetSession();
  }

  function updateUI(phase, secLeft) {
    T.el('brRing').className = 'breath-ring is-' + phase.name;
    T.el('brPhase').textContent = t('breathing.phase.' + phase.name);
    T.el('brCount').textContent = secLeft + 's';
    T.el('brCycles').textContent = cycles;
  }

  function runPhase() {
    if (!running) return;
    var phases = TECHS[technique].phases;
    var phase = phases[phaseIdx % phases.length];
    var sec = phase.sec;
    updateUI(phase, sec);
    timer = setInterval(function () {
      sec--;
      updateUI(phase, sec);
      if (sec <= 0) {
        clearInterval(timer);
        phaseIdx++;
        if (phaseIdx % phases.length === 0) cycles++;
        runPhase();
      }
    }, 1000);
  }

  function resetSession() {
    running = false;
    clearInterval(timer);
    phaseIdx = 0;
    cycles = 0;
    T.el('brRing').className = 'breath-ring';
    T.el('brPhase').textContent = t('breathing.ready');
    T.el('brCount').textContent = '';
    T.el('brToggle').textContent = t('breathing.start');
    T.el('brCycles').textContent = '0';
  }

  function toggleSession() {
    running = !running;
    T.el('brToggle').textContent = running ? t('breathing.pause') : t('breathing.start');
    if (running) runPhase();
    else clearInterval(timer);
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.breathing = function () {
    document.querySelectorAll('.br-tech').forEach(function (btn) {
      btn.addEventListener('click', function () { setTechnique(btn.dataset.tech); });
    });
    T.el('brToggle').addEventListener('click', toggleSession);
    T.el('brReset').addEventListener('click', resetSession);
    SaansTools.onLang(function () { applyI18nDOM(); });
  };
})();
