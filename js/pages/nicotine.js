/**
 * Saans — nicotine / NRT page
 */
(function () {
  'use strict';

  var T = SaansTools;
  var step = 0;
  var answers = [];
  var warned = false;

  function getNrt(lang) {
    var en = SAANS_CONTENT.nicotine.en;
    var local = SAANS_CONTENT.nicotine[lang] || {};
    return {
      warning: local.warning || en.warning,
      gum: Object.assign({}, en.gum, local.gum),
      patch: Object.assign({}, en.patch, local.patch),
      lozenge: Object.assign({}, en.lozenge, local.lozenge),
      medsTitle: local.medsTitle || en.medsTitle,
      meds: local.meds || en.meds,
      quiz: (local.quiz && local.quiz.length >= 5) ? local.quiz : en.quiz,
      resultGum: local.resultGum || en.resultGum,
      resultPatch: local.resultPatch || en.resultPatch,
      resultLozenge: local.resultLozenge || en.resultLozenge,
      resultMed: local.resultMed || en.resultMed,
      resultWarn: local.resultWarn || en.resultWarn,
    };
  }

  function renderCards() {
    var lang = getLang();
    var n = getNrt(lang);
    T.el('nrWarning').textContent = n.warning;
    T.el('nrGumTitle').textContent = n.gum.title;
    T.el('nrGumPros').textContent = n.gum.pros;
    T.el('nrGumCons').textContent = n.gum.cons;
    T.el('nrPatchTitle').textContent = n.patch.title;
    T.el('nrPatchPros').textContent = n.patch.pros;
    T.el('nrPatchCons').textContent = n.patch.cons;
    T.el('nrLozTitle').textContent = n.lozenge.title;
    T.el('nrLozPros').textContent = n.lozenge.pros;
    T.el('nrLozCons').textContent = n.lozenge.cons;
    T.el('nrMedsTitle').textContent = n.medsTitle || t('nicotine.medsTitle');

    var list = T.el('nrMedsList');
    list.innerHTML = '';
    (n.meds || []).forEach(function (m) {
      var card = document.createElement('div');
      card.className = 'nrt-med-card';
      card.innerHTML =
        '<div class="nrt-med-card__name">' + m.name + ' <span class="nrt-rx-badge">' + t('nicotine.rxOnly') + '</span></div>' +
        '<div class="nrt-med-card__desc">' + m.desc + '</div>';
      list.appendChild(card);
    });
  }

  function renderQuiz() {
    var lang = getLang();
    var quiz = getNrt(lang).quiz;
    if (step >= quiz.length) {
      showResult();
      return;
    }
    var q = quiz[step];
    T.el('nrQuizStep').textContent = (step + 1) + ' / ' + quiz.length;
    T.el('nrQuizQ').textContent = q.q;
    T.el('nrQuizQ').classList.toggle('is-warning', !!q.warning);
    var opts = T.el('nrQuizOpts');
    opts.innerHTML = '';
    q.opts.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ui-btn ui-btn--secondary';
      btn.style.width = '100%';
      btn.textContent = opt;
      btn.addEventListener('click', function () {
        if (q.warning && i === 1) {
          T.el('nrResultText').textContent = getNrt(lang).resultWarn;
          T.el('nrQuiz').style.display = 'none';
          T.el('nrResult').style.display = 'block';
          return;
        }
        if (q.warning) warned = true;
        answers[step] = i;
        step++;
        renderQuiz();
      });
      opts.appendChild(btn);
    });
  }

  function showResult() {
    T.el('nrQuiz').style.display = 'none';
    T.el('nrResult').style.display = 'block';
    var lang = getLang();
    var n = getNrt(lang);
    if (!warned) {
      T.el('nrResultText').textContent = n.resultWarn;
      return;
    }
    var cpd = answers[1] || 0;
    var morning = answers[2] || 0;
    var doctor = answers[4] || 0;
    var score = cpd + morning;

    if (doctor === 0) {
      T.el('nrResultText').textContent = n.resultWarn;
    } else if (cpd >= 2 || (cpd >= 1 && morning >= 1)) {
      T.el('nrResultText').textContent = n.resultMed;
    } else if (score >= 2 || morning === 0) {
      T.el('nrResultText').textContent = n.resultGum;
    } else if (morning >= 1) {
      T.el('nrResultText').textContent = n.resultPatch;
    } else {
      T.el('nrResultText').textContent = n.resultLozenge || n.resultPatch;
    }
    T.el('nrResultWarn').textContent = n.resultWarn;
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.nicotine = function () {
    T.el('nrQuizStart').addEventListener('click', function () {
      step = 0;
      answers = [];
      warned = false;
      T.el('nrQuiz').style.display = 'block';
      T.el('nrResult').style.display = 'none';
      renderQuiz();
    });
    T.el('nrQuizRestart').addEventListener('click', function () {
      T.el('nrResult').style.display = 'none';
      T.el('nrQuiz').style.display = 'block';
      step = 0;
      answers = [];
      warned = false;
      renderQuiz();
    });
    SaansTools.onLang(function () { applyI18nDOM(); renderCards(); });
    renderCards();
  };
})();
