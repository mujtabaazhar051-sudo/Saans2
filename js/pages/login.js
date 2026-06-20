/**
 * Saans — login page logic
 */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  function authErrorKey(code) {
    if (!code) return 'auth.error.default';
    return 'auth.error.' + String(code).replace(/\//g, '.');
  }

  function showMsg(text, type) {
    var el = $('authMsg');
    if (!el) return;
    el.textContent = text;
    el.className = 'auth-msg is-visible auth-msg--' + (type || 'error');
  }

  function hideMsg() {
    var el = $('authMsg');
    if (el) el.className = 'auth-msg';
  }

  function setLoading(btnId, spinnerId, loading) {
    var btn = $(btnId);
    var sp = $(spinnerId);
    if (btn) btn.disabled = loading;
    if (sp) sp.classList.toggle('is-visible', loading);
  }

  function setFirebaseBanner(loading, errorText) {
    var banner = $('firebaseLoading');
    if (banner) {
      banner.classList.toggle('is-visible', loading || !!errorText);
      if (errorText) banner.textContent = errorText;
      else banner.textContent = t('auth.firebaseLoading');
    }
  }

  function switchTab(tab) {
    $('panelLogin').classList.toggle('is-active', tab === 'login');
    $('panelSignup').classList.toggle('is-active', tab === 'signup');
    $('tabLogin').classList.toggle('is-active', tab === 'login');
    $('tabSignup').classList.toggle('is-active', tab === 'signup');
    hideMsg();
  }

  async function onLoginSuccess(user, isNew) {
    showMsg(isNew ? t('auth.welcomeNew') : t('auth.welcomeBack'), 'success');
    try {
      if (!isNew) await syncFromCloud(user);
      else {
        var name = user.displayName || LS.get('userName', '');
        if (name) LS.set('userName', name);
        await syncToCloud(user);
      }
    } catch (_) { /* local data still works */ }
    setTimeout(function () {
      window.location.href = saansHref('dashboard.html');
    }, 800);
  }

  function showLoggedIn(user) {
    var profile = getUserProfile(user);
    $('authView').style.display = 'none';
    $('loggedInView').style.display = 'block';
    var avatar = $('liAvatar');
    if (profile.photo) {
      avatar.innerHTML = '<img src="' + profile.photo + '" alt="">';
    } else {
      avatar.textContent = profile.name ? profile.name[0].toUpperCase() : '👤';
    }
    $('liName').textContent = profile.name || '—';
    $('liEmail').textContent = profile.email || '—';
    $('liContinueBtn').href = saansHref('dashboard.html');
  }

  async function waitForFirebase() {
    if (isFirebaseReady()) return true;
    if (getFirebaseError()) {
      showMsg(getFirebaseError(), 'error');
      return false;
    }
    return new Promise(function (resolve) {
      var done = false;
      function finish(ok) { if (!done) { done = true; resolve(ok); } }
      onFirebaseReady(function () { finish(true); });
      window.addEventListener('saans:firebase-error', function (ev) {
        showMsg((ev.detail && ev.detail.message) || t('auth.firebaseLoadError'), 'error');
        finish(false);
      }, { once: true });
      setTimeout(function () {
        if (!isFirebaseReady()) {
          showMsg(t('auth.firebaseLoadError'), 'error');
          finish(false);
        }
      }, 12000);
    });
  }

  window.SaansPages = window.SaansPages || {};

  SaansPages.login = function () {
    $('tabLogin').addEventListener('click', function () { switchTab('login'); });
    $('tabSignup').addEventListener('click', function () { switchTab('signup'); });

    $('loginBtn').addEventListener('click', async function () {
      var email = $('loginEmail').value.trim();
      var pw = $('loginPw').value;
      if (!email || !pw) { showMsg(t('auth.error.auth.invalid-email')); return; }
      if (!(await waitForFirebase())) return;
      setLoading('loginBtn', 'loginSpinner', true);
      hideMsg();
      try {
        var result = await signInWithEmail(email, pw);
        await onLoginSuccess(result.user, false);
      } catch (e) {
        showMsg(t(authErrorKey(e.code)));
      } finally {
        setLoading('loginBtn', 'loginSpinner', false);
      }
    });

    $('signupBtn').addEventListener('click', async function () {
      var name = $('signupName').value.trim();
      var email = $('signupEmail').value.trim();
      var pw = $('signupPw').value;
      if (!email) { showMsg(t('auth.error.auth.invalid-email')); return; }
      if (!pw || pw.length < 6) { showMsg(t('auth.error.auth.weak-password')); return; }
      if (!(await waitForFirebase())) return;
      setLoading('signupBtn', 'signupSpinner', true);
      hideMsg();
      try {
        var result = await signUpWithEmail(email, pw);
        if (name) {
          try { await result.user.updateProfile({ displayName: name }); } catch (_) {}
          LS.set('userName', name);
        }
        await onLoginSuccess(result.user, true);
      } catch (e) {
        showMsg(t(authErrorKey(e.code)));
      } finally {
        setLoading('signupBtn', 'signupSpinner', false);
      }
    });

    async function handleGoogle() {
      if (!(await waitForFirebase())) return;
      hideMsg();
      try {
        var result = await signInWithGoogle();
        await onLoginSuccess(result.user, result.additionalUserInfo && result.additionalUserInfo.isNewUser);
      } catch (e) {
        if (e.code !== 'auth/popup-closed-by-user') showMsg(t(authErrorKey(e.code)));
      }
    }

    $('googleLoginBtn').addEventListener('click', handleGoogle);
    $('googleSignupBtn').addEventListener('click', handleGoogle);

    $('forgotBtn').addEventListener('click', async function () {
      var email = $('loginEmail').value.trim();
      if (!email) { showMsg(t('auth.error.auth.invalid-email')); return; }
      if (!(await waitForFirebase())) return;
      try {
        await sendPasswordReset(email);
        showMsg(t('auth.forgotSent'), 'success');
      } catch (_) {
        showMsg(t('auth.forgotError'));
      }
    });

    $('liSignoutBtn').addEventListener('click', async function () {
      await signOutUser();
      $('loggedInView').style.display = 'none';
      $('authView').style.display = 'block';
    });

    $('loginPw').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') $('loginBtn').click();
    });
    $('signupPw').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') $('signupBtn').click();
    });

    setFirebaseBanner(true);
    onFirebaseReady(function () {
      setFirebaseBanner(false);
      onAuthChange(function (user) {
        if (user) showLoggedIn(user);
      });
    });
    window.addEventListener('saans:firebase-error', function (ev) {
      setFirebaseBanner(false, (ev.detail && ev.detail.message) || t('auth.firebaseLoadError'));
    });

    redirectIfAuthed('dashboard.html');
  };
})();
