/**
 * Saans — localStorage wrapper with typed keys
 */
(function () {
  'use strict';

  function prefix(key) {
    return (window.SAANS_CONFIG && SAANS_CONFIG.LS_PREFIX || 'saans2_') + key;
  }

  const LS = {
    get(key, defaultVal) {
      if (defaultVal === undefined) defaultVal = null;
      try {
        const v = localStorage.getItem(prefix(key));
        if (v === null) return defaultVal;
        return JSON.parse(v);
      } catch (_) {
        return defaultVal;
      }
    },

    set(key, val) {
      try {
        localStorage.setItem(prefix(key), JSON.stringify(val));
      } catch (_) { /* quota / private mode */ }
    },

    remove(key) {
      try {
        localStorage.removeItem(prefix(key));
      } catch (_) { /* ignore */ }
    },

    /** Raw string (for lang key backward compat during migration) */
    getRaw(key) {
      try {
        return localStorage.getItem(prefix(key));
      } catch (_) {
        return null;
      }
    },
  };

  /** Known keys — document for Phase 2+ */
  LS.KEYS = {
    LANG: 'lang',
    QUIT_DATE: 'quitDate',
    CIGS_PER_DAY: 'cigsPerDay',
    PACK_PRICE: 'packPrice',
    CIGS_PER_PACK: 'cigsPerPack',
    CHECKINS: 'checkins',
    USER_NAME: 'userName',
    ONBOARDING_DONE: 'onboardingDone',
    ONBOARDING_DATA: 'onboardingData',
    EARNED_BADGES: 'earnedBadges',
    CHAT_HISTORY: 'chatHistory',
    NOTIFICATIONS_ENABLED: 'notificationsEnabled',
  };

  window.LS = LS;
})();
