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
        if (user) {
          window.location.href = saansHref(targetPage);
        }
      });
    });
  };
})();
