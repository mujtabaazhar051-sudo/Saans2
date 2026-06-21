/**
 * Saans — settings page
 */
(function () {
  'use strict';

  var T = SaansTools;

  function maybeSync() {
    var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (user && typeof syncToCloud === 'function') syncToCloud(user);
  }

  function refreshStats() {
    if (typeof getDaysSinceQuit !== 'function') return;
    T.el('stDays').textContent = getDaysSinceQuit();
    T.el('stStreak').textContent = getStreak();
    T.el('stSaved').textContent = getSavings().toLocaleString();
  }

  function loadValues() {
    T.el('stName').value = LS.get('userName', '');
    T.el('stCity').value = LS.get('userCity', '');
    T.el('stQuitDate').value = LS.get('quitDate', '') || todayISO();
    T.el('stCpd').value = LS.get('cigsPerDay', 20);
    T.el('stPp').value = LS.get('packPrice', 600);
    T.el('stCpp').value = LS.get('cigsPerPack', 20);
    T.el('stYrs').value = LS.get('smokingYears', 1);
    var key = LS.get('anthropicApiKey', '');
    T.el('stApiKey').value = key ? '••••••••••••••••' : '';
    refreshStats();
    updateNotifUI();
  }

  function showAccount(user) {
    var box = T.el('stAccount');
    if (!user || !box) return;
    var profile = getUserProfile(user);
    box.style.display = 'block';
    var av = T.el('stAvatar');
    if (profile.photo) {
      av.innerHTML = '<img src="' + profile.photo + '" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
    } else {
      av.textContent = profile.name ? profile.name[0].toUpperCase() : '👤';
    }
    T.el('stAccName').textContent = profile.name || '—';
    T.el('stAccEmail').textContent = profile.email || '—';
  }

  function updateNotifUI() {
    var on = LS.get('notificationsEnabled', false);
    var btn = T.el('stNotifBtn');
    var status = T.el('stNotifStatus');
    if (btn) btn.textContent = on ? t('settings.notifOff') : t('settings.notifOn');
    if (status) status.style.display = on ? 'block' : 'none';
  }

  async function toggleNotifications() {
    var on = LS.get('notificationsEnabled', false);
    if (on) {
      LS.set('notificationsEnabled', false);
      updateNotifUI();
      SaansTools.toast(t('settings.notifDisabled'));
      return;
    }
    if (!('Notification' in window)) {
      SaansTools.toast(t('settings.notifUnsupported'));
      return;
    }
    var perm = await Notification.requestPermission();
    if (perm === 'granted') {
      LS.set('notificationsEnabled', true);
      updateNotifUI();
      SaansTools.toast(t('settings.notifEnabled'));
    } else {
      SaansTools.toast(t('settings.notifDenied'));
    }
  }

  window.SaansPages = window.SaansPages || {};

  function updateThemeUI() {
    var theme = typeof SaansTheme !== 'undefined' ? SaansTheme.get() : 'light';
    var lbl = T.el('stThemeLabel');
    if (lbl) lbl.textContent = theme === 'dark' ? t('theme.light') : t('theme.dark');
  }

  SaansPages.settings = function () {
    requireAuth(function (user) {
      showAccount(user);
      loadValues();
      updateThemeUI();

      var themeBtn = T.el('stThemeBtn');
      if (themeBtn && typeof SaansTheme !== 'undefined') {
        themeBtn.addEventListener('click', function () {
          SaansTheme.toggle();
          updateThemeUI();
        });
      }

      T.el('stSaveProfile').addEventListener('click', function () {
        LS.set('userName', T.el('stName').value.trim());
        LS.set('userCity', T.el('stCity').value.trim());
        maybeSync();
        SaansTools.toast(t('settings.toastProfile'));
      });

      T.el('stSaveQuit').addEventListener('click', function () {
        var val = T.el('stQuitDate').value;
        if (!val) return;
        LS.set('quitDate', val);
        loadValues();
        maybeSync();
        SaansTools.toast(t('settings.toastQuit'));
      });

      T.el('stSaveHabits').addEventListener('click', function () {
        LS.set('cigsPerDay', parseInt(T.el('stCpd').value, 10) || 20);
        LS.set('packPrice', parseInt(T.el('stPp').value, 10) || 600);
        LS.set('cigsPerPack', parseInt(T.el('stCpp').value, 10) || 20);
        LS.set('smokingYears', parseInt(T.el('stYrs').value, 10) || 1);
        loadValues();
        maybeSync();
        SaansTools.toast(t('settings.toastHabits'));
      });

      T.el('stSaveApiKey').addEventListener('click', function () {
        var raw = T.el('stApiKey').value.trim();
        if (!raw || raw.indexOf('•') === 0) {
          SaansTools.toast(t('settings.apiKeyUnchanged'));
          return;
        }
        if (raw) {
          LS.set('anthropicApiKey', raw);
          T.el('stApiKey').value = '••••••••••••••••';
          SaansTools.toast(t('settings.toastApiKey'));
        } else {
          LS.remove('anthropicApiKey');
          SaansTools.toast(t('settings.apiKeyRemoved'));
        }
      });

      T.el('stClearApiKey').addEventListener('click', function () {
        LS.remove('anthropicApiKey');
        T.el('stApiKey').value = '';
        SaansTools.toast(t('settings.apiKeyRemoved'));
      });

      T.el('stNotifBtn').addEventListener('click', toggleNotifications);

      T.el('stSignOut').addEventListener('click', async function () {
        await signOutUser();
        window.location.href = saansHref('login.html');
      });

      T.el('stRedoOb').addEventListener('click', function () {
        LS.set('onboardingDone', false);
        SaansTools.toast(t('settings.toastOb'));
        setTimeout(function () { window.location.href = saansHref('dashboard.html'); }, 600);
      });

      T.el('stClearCheckins').addEventListener('click', function () {
        if (!confirm(t('settings.confirmCheckins'))) return;
        LS.remove('checkins');
        loadValues();
        maybeSync();
        SaansTools.toast(t('settings.toastCheckins'));
      });

      T.el('stClearAll').addEventListener('click', function () {
        if (!confirm(t('settings.confirmAll'))) return;
        LS.clearAll();
        SaansTools.toast(t('settings.toastAll'));
        setTimeout(function () { window.location.href = saansHref('dashboard.html'); }, 800);
      });

      SaansTools.onLang(function () { applyI18nDOM(); loadValues(); updateThemeUI(); });
    });
  };
})();
