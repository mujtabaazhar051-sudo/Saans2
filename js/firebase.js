/**
 * Saans — Firebase (CDN compat)
 */
(function () {
  'use strict';

  var _auth, _db, _functions;
  var _firebaseReady = false;
  var _firebaseFailed = false;
  var _callbacks = [];
  var _errorMsg = '';

  function getConfig() {
    return (window.SAANS_CONFIG && SAANS_CONFIG.FIREBASE) || null;
  }

  function markReady() {
    _firebaseReady = true;
    window._firebaseReady = true;
    _callbacks.splice(0).forEach(function (fn) { fn(); });
    window.dispatchEvent(new CustomEvent('saans:firebase-ready'));
  }

  function markFailed(msg) {
    if (_firebaseFailed) return;
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
      markFailed('Firebase SDK not loaded — check your internet connection');
      return;
    }
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(cfg);
      }
      _auth = firebase.auth();
      _db = firebase.firestore();
      if (typeof firebase.functions === 'function') {
        var region = (SAANS_CONFIG && SAANS_CONFIG.FUNCTIONS_REGION) || 'us-central1';
        _functions = firebase.app().functions(region);
      }
      markReady();
    } catch (e) {
      markFailed(e.message || 'Firebase init failed');
    }
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error(src)); };
      document.head.appendChild(s);
    });
  }

  function initFirebase() {
    var cfg = getConfig();
    if (!cfg) {
      markFailed('Firebase config missing in js/config.js');
      return;
    }

    if (typeof firebase !== 'undefined') {
      setupApp(cfg);
      return;
    }

    var urls = [
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-functions-compat.js',
    ];

    (async function () {
      try {
        for (var i = 0; i < urls.length; i++) {
          await loadScript(urls[i]);
        }
        setupApp(cfg);
      } catch (e) {
        markFailed('Could not load Firebase. Check internet and refresh.');
      }
    })();

    setTimeout(function () {
      if (!_firebaseReady && !_firebaseFailed) {
        markFailed('Firebase took too long. Please refresh the page.');
      }
    }, 12000);
  }

  window.getCurrentUser = function () {
    return _auth ? _auth.currentUser : null;
  };

  window.signInWithGoogle = function () {
    if (!_auth) return Promise.reject({ code: 'auth/not-ready' });
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
    return _auth ? _auth.signOut() : Promise.resolve();
  };

  window.onAuthChange = function (callback) {
    onFirebaseReady(function () {
      if (_auth) _auth.onAuthStateChanged(callback);
    });
  };

  window.syncToCloud = async function (user) {
    if (!user || !_db) return;
    try {
      var payload = {
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
        lang: getLang(),
        updatedAt: new Date().toISOString(),
      };
      if (LS.get('onboardingDone', false)) {
        payload.onboardingDone = true;
      }
      await _db.collection('users').doc(user.uid).set(payload, { merge: true });
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

  window.getSaansDb = function () { return _db; };

  window.getCoachCallable = function () {
    if (!_functions || typeof firebase === 'undefined') return null;
    return _functions.httpsCallable('coachChat');
  };

  initFirebase();
})();
