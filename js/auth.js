/**
 * Saans — auth guards & redirects
 */
(function () {
  'use strict';

  window.requireAuth = function (callback) {
    onFirebaseReady(function () {
      onAuthChange(function (user) {
        if (user) {
          callback(user);
        } else {
          window.location.href = saansHref('login.html');
        }
      });
    });
  };

  window.redirectIfAuthed = function (targetPage) {
    targetPage = targetPage || 'dashboard.html';
    onFirebaseReady(function () {
      onAuthChange(function (user) {
        if (!user) return;
        var go = function () {
          window.location.href = saansHref(targetPage);
        };
        if (typeof syncFromCloud === 'function') {
          syncFromCloud(user).finally(go);
        } else {
          go();
        }
      });
    });
  };
})();
