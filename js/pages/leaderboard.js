/**
 * Saans — leaderboard page
 */
(function () {
  'use strict';

  var T = SaansTools;
  var activeFilter = 'streak';

  function syncScore() {
    var days = getDaysSinceQuit();
    if (!days) return;
    var uid = LS.get('lbUid', '');
    if (!uid) {
      uid = 'anon_' + Math.random().toString(36).substr(2, 9);
      LS.set('lbUid', uid);
    }
    var name = LS.get('userName', '');
    var displayName = name ? name[0].toUpperCase() + '***' : (getLang() === 'ur' ? 'مجہول' : 'Anonymous');

    onFirebaseReady(function () {
      var db = getSaansDb();
      if (!db) return;
      db.collection('leaderboard').doc(uid).set({
        name: displayName,
        city: LS.get('userCity', '') || '—',
        days: days,
        streak: getStreak(),
        uid: uid,
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(function () {});
    });
  }

  function loadBoard() {
    var list = T.el('lbList');
    list.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);">' + t('leaderboard.loading') + '</p>';

    onFirebaseReady(function () {
      var db = getSaansDb();
      if (!db) {
        list.innerHTML = '<p class="tool-empty">' + t('leaderboard.empty') + '</p>';
        return;
      }
      var field = activeFilter === 'streak' ? 'streak' : 'days';
      db.collection('leaderboard').orderBy(field, 'desc').limit(50).get()
        .then(function (snap) {
          if (snap.empty) {
            list.innerHTML = '<p class="tool-empty">' + t('leaderboard.empty') + '</p>';
            return;
          }
          var myUid = LS.get('lbUid', '');
          list.innerHTML = '';
          snap.docs.forEach(function (doc, i) {
            var d = doc.data();
            var isMe = doc.id === myUid;
            var row = document.createElement('div');
            row.className = 'lb-row' + (isMe ? ' is-me' : '') + (i === 0 ? ' is-top1' : '');
            var score = activeFilter === 'streak' ? d.streak : d.days;
            row.innerHTML =
              '<div class="lb-pos">' + (i + 1) + '</div>' +
              '<div class="lb-avatar">' + (d.name || '?')[0] + '</div>' +
              '<div class="lb-info"><div class="lb-name">' + d.name + (isMe ? ' (' + t('leaderboard.you') + ')' : '') + '</div>' +
              '<div class="lb-city">' + (d.city || '') + '</div></div>' +
              '<div class="lb-score"><div class="lb-score__num">' + score + '</div>' +
              '<div class="lb-score__label">' + t('leaderboard.' + activeFilter) + '</div></div>';
            list.appendChild(row);
          });
        })
        .catch(function () {
          list.innerHTML = '<p class="tool-empty">' + t('leaderboard.empty') + '</p>';
        });
    });
  }

  function renderTabs() {
    var wrap = T.el('lbTabs');
    wrap.innerHTML = '';
    ['streak', 'days'].forEach(function (key) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tool-tab' + (activeFilter === key ? ' is-active' : '');
      btn.textContent = t('leaderboard.tab.' + key);
      btn.addEventListener('click', function () { activeFilter = key; renderTabs(); loadBoard(); });
      wrap.appendChild(btn);
    });
  }

  window.SaansPages = window.SaansPages || {};
  SaansPages.leaderboard = function () {
    SaansTools.withAuth(function () {
      syncScore();
      renderTabs();
      loadBoard();
      SaansTools.onLang(function () { applyI18nDOM(); renderTabs(); loadBoard(); });
    });
  };
})();
