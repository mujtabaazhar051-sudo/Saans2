/**
 * Saans — Firebase (CDN compat, no npm)
 */
(function () {
  'use strict';

  var _app, _auth, _db;
  var _firebaseReady = false;
  var _callbacks = [];

  function getConfig() {
    return (window.SAANS_CONFIG && SAANS_CONFIG.FIREBASE) || null;
  }

  window.onFirebaseReady = function onFirebaseReady(cb) {
    if (_firebaseReady) { cb(); return; }
    _callbacks.push(cb);
  };

  window.isFirebaseReady = function () { return _firebaseReady; };

  function initFirebase() {
    var cfg = getConfig();
    if (!cfg) {
      console.warn('[Saans] Firebase config missing in config.js');
      return;
    }

    var scripts = [
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
    ];

    var loaded = 0;
    scripts.forEach(function (src) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () {
        loaded++;
        if (loaded === scripts.length) {
          _app = firebase.initializeApp(cfg);
          _auth = firebase.auth();
          _db = firebase.firestore();
          _firebaseReady = true;
          window._firebaseReady = true;
          _callbacks.forEach(function (fn) { fn(); });
          _callbacks = [];
          window.dispatchEvent(new CustomEvent('saans:firebase-ready'));
        }
      };
      s.onerror = function () {
        console.error('[Saans] Failed to load Firebase SDK:', src);
      };
      document.head.appendChild(s);
    });
  }

  window.getCurrentUser = function () {
    return _auth ? _auth.currentUser : null;
  };

  window.signInWithGoogle = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    return _auth.signInWithPopup(provider);
  };

  window.signInWithEmail = function (email, password) {
    return _auth.signInWithEmailAndPassword(email, password);
  };

  window.signUpWithEmail = function (email, password) {
    return _auth.createUserWithEmailAndPassword(email, password);
  };

  window.sendPasswordReset = function (email) {
    return _auth.sendPasswordResetEmail(email);
  };

  window.signOutUser = function () {
    return _auth.signOut();
  };

  window.onAuthChange = function (callback) {
    onFirebaseReady(function () {
      _auth.onAuthStateChanged(callback);
    });
  };

  /** Optional cloud backup (Firebase free tier) */
  window.syncToCloud = async function (user) {
    if (!user || !_db) return;
    var data = {
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
    };
    try {
      await _db.collection('users').doc(user.uid).set(data, { merge: true });
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
      var keys = ['quitDate', 'cigsPerDay', 'packPrice', 'cigsPerPack', 'smokingYears',
        'userName', 'userCity', 'motivation', 'quitDecision', 'triggers',
        'checkins', 'earnedBadges', 'onboardingDone'];
      keys.forEach(function (k) {
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
