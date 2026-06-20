/**
 * Saans — shell orchestrator
 * Reads data-shell on <body>: public | auth | app
 */
(function () {
  'use strict';

  var SHELL = {
    public: { header: 'public', footer: true,  bottomNav: false, chat: false },
    auth:   { header: 'minimal', footer: false, bottomNav: false, chat: false },
    app:    { header: 'app',    footer: false, bottomNav: true,  chat: true  },
  };

  function getShellType() {
    var type = document.body.getAttribute('data-shell') || 'public';
    return SHELL[type] ? type : 'public';
  }

  function mountShell() {
    var type = getShellType();
    var cfg = SHELL[type];
    var shell = document.querySelector('.page-shell');

    if (shell && cfg.bottomNav) {
      shell.classList.add('page-shell--app');
    }

    if (cfg.header) {
      SaansHeader.mount({ variant: cfg.header === 'minimal' ? 'public' : cfg.header });
    }

    if (cfg.footer) {
      SaansFooter.mount();
    }

    if (cfg.bottomNav) {
      SaansBottomNav.mount();
    }

    if (cfg.chat) {
      SaansChatBubble.mount();
    }

    ensureToast();
  }

  function ensureToast() {
    if (!document.getElementById('saansToast')) {
      var el = document.createElement('div');
      el.id = 'saansToast';
      el.className = 'saans-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
  }

  function showToast(message, duration) {
    duration = duration || 2500;
    ensureToast();
    var el = document.getElementById('saansToast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(el._timer);
    el._timer = setTimeout(function () {
      el.classList.remove('is-visible');
    }, duration);
  }

  window.SaansShell = { mount: mountShell, getShellType: getShellType };
  window.showToast = showToast;
})();
