/**
 * Saans — nicotine / NRT page
 */
(function () {
  'use strict';

  var T = SaansTools;
  var step = 0;
  var answers = [];

  function renderCards() {
    var lang = getLang();
    var n = SAANS_CONTENT.nicotine[lang];
    T.el('nrGumTitle').textContent = n.gum.title;
    T.el('nrGumPros').textContent = n.gum.pros;
    T.el('nrGumCons').textContent = n.gum.cons;
    T.el('nrPatchTitle').textContent = n.patch.title;
    T.el('nrPatchPros').textContent = n.patch.pros;
    T.el('nrPatchCons').textContent = n.patch.cons;
  }

  function renderQuiz() {
    var lang = getLang();
    var quiz = SAANS_CONTENT.nicotine[lang].quiz;
    if (step >= quiz.length) {
      showResult();
      return;
    }
    var q = quiz[step];
    T.el('nrQuizQ').textContent = q.q;
    var opts = T.el('nrQuizOpts');
    opts.innerHTML = '';
    q.opts.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ui-btn ui-btn--secondary';
      btn.style.width = '100%';
      btn.textContent = opt;
      btn.addEventListener('click', function () {
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
    var n = SAANS_CONTENT.nicotine[lang];
    var gumScore = (answers[0] || 0) + (answers[1] || 0);
    T.el('nrResultText').textContent = gumScore >= 2 ? n.resultGum : n.resultPatch;
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.nicotine = function () {
    T.el('nrQuizStart').addEventListener('click', function () {
      step = 0;
      answers = [];
      T.el('nrQuiz').style.display = 'block';
      T.el('nrResult').style.display = 'none';
      renderQuiz();
    });
    T.el('nrQuizRestart').addEventListener('click', function () {
      T.el('nrResult').style.display = 'none';
      T.el('nrQuiz').style.display = 'block';
      step = 0;
      answers = [];
      renderQuiz();
    });
    SaansTools.onLang(function () { applyI18nDOM(); renderCards(); });
  };
})();
