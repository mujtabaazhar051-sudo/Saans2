/* Saans — global config (edit once, used everywhere) */
(function () {
  'use strict';

  window.SAANS_CONFIG = {
    /** GitHub Pages subpath — no trailing slash */
    BASE_PATH: '/Saans2',

    /** Site metadata */
    SITE_NAME: 'سانس',
    SITE_NAME_EN: 'Saans',
    SITE_URL: 'https://mujtabaazhar051-sudo.github.io/Saans2/',

    /** Default language for first-time visitors */
    DEFAULT_LANG: 'ur',

    /** Google Analytics (from Firebase console) */
    GA_MEASUREMENT_ID: 'G-7HBVT7Y3P7',

    /** Firebase — same project as the original Saans site */
    FIREBASE: {
      apiKey:            'AIzaSyCle5cJcgH_uIZC4tOoD-wTqAfghLJIOFA',
      authDomain:        'saans-3206a.firebaseapp.com',
      projectId:         'saans-3206a',
      storageBucket:     'saans-3206a.firebasestorage.app',
      messagingSenderId: '203356336705',
      appId:             '1:203356336705:web:00c8ded21431df1c8cccc0',
      measurementId:     'G-7HBVT7Y3P7',
    },

    /** Anthropic — wired in Phase 5 */
    ANTHROPIC_MODEL: 'claude-sonnet-4-20250514',

    /** PWA / theme */
    THEME_COLOR: '#0D4F4F',

    /** localStorage key prefix (avoid collisions) */
    LS_PREFIX: 'saans2_',
  };

  /** Resolve asset paths for GitHub Pages subpath (relative when testing locally) */
  window.saansPath = function saansPath(relativePath) {
    const path = relativePath.replace(/^\//, '');
    const base = SAANS_CONFIG.BASE_PATH.replace(/^\//, '').replace(/\/$/, '');
    const onPages =
      location.protocol !== 'file:' &&
      (location.pathname.indexOf('/' + base + '/') >= 0 ||
        location.pathname.endsWith('/' + base));
    if (!onPages) return path;
    return '/' + base + '/' + path;
  };

  /** Resolve page links (same origin) */
  window.saansHref = function saansHref(page) {
    if (/^https?:\/\//.test(page)) return page;
    return saansPath(page);
  };
})();
