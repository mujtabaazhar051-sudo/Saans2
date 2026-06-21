/**
 * Saans — auth guards & redirects
 */
(function () {
  'use strict';

  window.requireAuth = function (callback, opts) {
    opts = opts || {};
    var finished = false;

    function finish(user) {
      if (finished) return;
      finished = true;
      callback(user);
    }

    function redirectLogin() {
      window.location.href = saansHref('login.html');
    }

    if (typeof onFirebaseReady !== 'function') {
      if (opts.offlineOk) finish(null);
      else redirectLogin();
      return;
    }

    if (typeof getFirebaseError === 'function' && getFirebaseError()) {
      if (opts.offlineOk) finish(null);
      else redirectLogin();
      return;
    }

    onFirebaseReady(function () {
      onAuthChange(function (user) {
        if (user) {
          finish(user);
        } else if (!opts.offlineOk) {
          redirectLogin();
        } else {
          finish(null);
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
