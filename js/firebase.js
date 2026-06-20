/**
 * Saans — Firebase (CDN compat, sequential load — fixes auth race bug)
 */
(function () {
  'use strict';

  var _app, _auth, _db;
  var _firebaseReady = false;
  var _firebaseFailed = false;
  var _callbacks = [];
  var _errorMsg = '';

  var SDK = [
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
  ];

  function getConfig() {
    return (window.SAANS_CONFIG && SAANS_CONFIG.FIREBASE) || null;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.getAttribute('data-loaded') === '1') { resolve(); return; }
        existing.addEventListener('load', resolve);
        existing.addEventListener('error', reject);
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () { s.setAttribute('data-loaded', '1'); resolve(); };
      s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  function markReady() {
    _firebaseReady = true;
    window._firebaseReady = true;
    _callbacks.forEach(function (fn) { fn(); });
    _callbacks = [];
    window.dispatchEvent(new CustomEvent('saans:firebase-ready'));
  }

  function markFailed(msg) {
    _firebaseFailed = true;
    _errorMsg = msg || 'Firebase failed to load';
    console.error('[Saans Firebase]', _errorMsg);
    window.dispatchEvent(new CustomEvent('saans:firebase-error', { detail: { message: _errorMsg } }));
  }

  window.onFirebaseReady = function onFirebaseReady(cb) {
    if (_firebaseReady) { cb(); return; }
    if (_firebaseFailed) return;
    _callbacks.push(cb);
  };

  window.isFirebaseReady = function () { return _firebaseReady; };
  window.getFirebaseError = function () { return _firebaseFailed ? _errorMsg : ''; };

  function setupApp(cfg) {
    if (typeof firebase === 'undefined') {
      markFailed('Firebase SDK not available');
      return;
    }
    try {
      if (!firebase.apps.length) {
        _app = firebase.initializeApp(cfg);
      } else {
        _app = firebase.app();
      }
      _auth = firebase.auth();
      _db = firebase.firestore();
      markReady();
    } catch (e) {
      markFailed(e.message || 'Firebase init failed');
    }
  }

  function initFirebase() {
    var cfg = getConfig();
    if (!cfg) {
      markFailed('Firebase config missing in js/config.js');
      return;
    }

    /* Scripts may already be in HTML <head> */
    if (typeof firebase !== 'undefined' && firebase.apps) {
      setupApp(cfg);
      return;
    }

    /* Load SDKs one-by-one (parallel load caused login to break) */
    (async function () {
      try {
        for (var i = 0; i < SDK.length; i++) {
          await loadScript(SDK[i]);
        }
        setupApp(cfg);
      } catch (e) {
        markFailed(e.message || 'Firebase SDK load failed');
      }
    })();

    /* Safety timeout — never leave buttons disabled forever */
    setTimeout(function () {
      if (!_firebaseReady && !_firebaseFailed) {
        markFailed('Firebase took too long to load. Check your internet and refresh.');
      }
    }, 15000);
  }

  window.getCurrentUser = function () {
    return _auth ? _auth.currentUser : null;
  };

  window.signInWithGoogle = function () {
    if (!_auth) return Promise.reject({ code: 'auth/not-ready', message: 'Firebase not ready' });
    return _auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  };

  window.signInWithEmail = function (email, password) {
    if (!_auth) return Promise.reject({ code: 'auth/not-ready' });
    return _auth.signInWithEmailAndPassword(email, password);
  };

  window.signUpWithEmail = function (email, password) {
    if (!_auth) return Promise.reject({ code: 'auth/not-ready' });
    return _auth.createUserWithEmailAndPassword(email, password);
  };

  window.sendPasswordReset = function (email) {
    if (!_auth) return Promise.reject({ code: 'auth/not-ready' });
    return _auth.sendPasswordResetEmail(email);
  };

  window.signOutUser = function () {
    if (!_auth) return Promise.resolve();
    return _auth.signOut();
  };

  window.onAuthChange = function (callback) {
    onFirebaseReady(function () {
      if (_auth) _auth.onAuthStateChanged(callback);
    });
  };

  window.syncToCloud = async function (user) {
    if (!user || !_db) return;
    try {
      await _db.collection('users').doc(user.uid).set({
        quitDate: LS.get('quitDate', ''),
        cigsPerDay: LS.get('cigsPerDay', 20),
        packPrice: LS.get('packPrice', 600),
        cigsPerPack: LS.get('cigsPerPack', 20),
        smokingYears: LS.get('smokingYears', 1),
        userName: LS.get('userName', ''),
        userCity: LS.get('userCity', ''),
        motivation: LS.get('motivation', ''),
        quitDecision: LS.get('quitDecision', ''),
        triggers: LS.get('triggers', []),
        checkins: LS.get('checkins', {}),
        earnedBadges: LS.get('earnedBadges', []),
        onboardingDone: LS.get('onboardingDone', false),
        lang: getLang(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('[Saans] Cloud sync failed:', e.message);
    }
  };

  window.syncFromCloud = async function (user) {
    if (!user || !_db) return false;
    try {
      var doc = await _db.collection('users').doc(user.uid).get();
      if (!doc.exists) return false;
      var data = doc.data();
      ['quitDate', 'cigsPerDay', 'packPrice', 'cigsPerPack', 'smokingYears',
        'userName', 'userCity', 'motivation', 'quitDecision', 'triggers',
        'checkins', 'earnedBadges', 'onboardingDone'].forEach(function (k) {
        if (data[k] !== undefined) LS.set(k, data[k]);
      });
      return true;
    } catch (e) {
      console.warn('[Saans] Cloud load failed:', e.message);
    }
    return false;
  };

  window.getUserProfile = function (user) {
    if (!user) return null;
    return {
      uid: user.uid,
      name: user.displayName || LS.get('userName', ''),
      email: user.email || '',
      photo: user.photoURL || '',
    };
  };

  initFirebase();
})();
