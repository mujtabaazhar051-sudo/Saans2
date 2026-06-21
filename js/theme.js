/**
 * Saans — light / dark theme
 */
(function () {
  'use strict';

  var KEY = 'theme';

  function getTheme() {
    var v = LS.get(KEY, 'light');
    return v === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a2e2e' : '#0D4F4F');
    document.querySelectorAll('[data-theme-icon]').forEach(function (el) {
      el.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  }

  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    LS.set(KEY, theme);
    applyTheme(theme);
    window.dispatchEvent(new CustomEvent('saans:themechange', { detail: { theme: theme } }));
  }

  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  function bindToggle(btn) {
    if (!btn || btn._themeBound) return;
    btn._themeBound = true;
    btn.addEventListener('click', toggleTheme);
  }

  window.SaansTheme = {
    get: getTheme,
    set: setTheme,
    toggle: toggleTheme,
    apply: applyTheme,
    bindToggle: bindToggle,
  };

  applyTheme(getTheme());
})();
