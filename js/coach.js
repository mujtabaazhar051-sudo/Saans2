/**
 * Saans — AI coach (Anthropic via Cloud Function or local key)
 */
(function () {
  'use strict';

  var MOTIV_MAP = {
    health: 'improving health',
    family: 'their family',
    money: 'saving money',
    fitness: 'fitness and energy',
    pride: 'personal pride',
    doctor: "doctor's advice",
  };

  window.buildCoachSystemPrompt = function (lang) {
    var name = LS.get('userName', '');
    var days = typeof getDaysSinceQuit === 'function' ? getDaysSinceQuit() : 0;
    var streak = typeof getStreak === 'function' ? getStreak() : 0;
    var savings = typeof getSavings === 'function' ? getSavings() : 0;
    var cigs = days * LS.get('cigsPerDay', 20);
    var motiv = MOTIV_MAP[LS.get('motivation', '')] || 'quitting smoking';
    var decision = LS.get('quitDecision', '');
    var triggers = (LS.get('triggers', []) || []).join(', ');
    var years = LS.get('smokingYears', '');

    if (lang === 'ur') {
      return 'آپ "سانس کوچ" ہیں — ایک گرم جوش، حوصلہ افزا AI کوچ جو پاکستانیوں کو سگریٹ چھوڑنے میں مدد دیتا ہے۔\n\n' +
        'صارف:\n- نام: ' + (name || 'صارف') + '\n- سگریٹ چھوڑے: ' + days + ' دن\n- سٹریک: ' + streak +
        ' دن\n- بچت: PKR ' + savings.toLocaleString() + '\n- بچائے سگریٹ: ' + cigs +
        '\n- سال: ' + (years || '—') + '\n- مقصد: ' + motiv + '\n- فیصلہ: ' + (decision || '—') +
        '\n- محرکات: ' + (triggers || '—') + '\n\n' +
        'ہدایات: اردو میں جواب دیں (جب تک صارف انگریزی میں نہ لکھے)۔ مختصر، مثبت، حوصلہ افزا۔ ' +
        'طبی ایمرجنسی میں 1122/ڈاکٹر۔ کبھی سگریٹ کی ترغیب نہ دیں۔';
    }

    return 'You are "Saans Coach" — a warm, motivational AI coach helping Pakistanis quit smoking.\n\n' +
      'User:\n- Name: ' + (name || 'User') + '\n- Days smoke-free: ' + days + '\n- Streak: ' + streak +
      ' days\n- Saved: PKR ' + savings.toLocaleString() + '\n- Cigs avoided: ' + cigs +
      '\n- Years smoked: ' + (years || 'unknown') + '\n- Motivation: ' + motiv +
      '\n- Decision: ' + (decision || 'unknown') + '\n- Triggers: ' + (triggers || 'unknown') + '\n\n' +
      'Instructions: Match user language. Be concise, positive, encouraging. ' +
      'For medical emergencies recommend 1122 or a doctor. Never encourage smoking.';
  };

  function coachMode() {
    return (SAANS_CONFIG && SAANS_CONFIG.COACH_MODE) || 'auto';
  }

  function sendViaCloud(userText, history, lang) {
    return new Promise(function (resolve) {
      if (typeof onFirebaseReady !== 'function' || typeof getCoachCallable !== 'function') {
        resolve({ error: 'cloud_unavailable' });
        return;
      }
      onFirebaseReady(function () {
        var callable = getCoachCallable();
        if (!callable) {
          resolve({ error: 'cloud_unavailable' });
          return;
        }
        var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        if (!user) {
          resolve({ error: 'login_required' });
          return;
        }
        callable({
          message: userText,
          history: history || [],
          lang: lang,
          system: buildCoachSystemPrompt(lang),
        }).then(function (res) {
          if (res.data && res.data.text) resolve({ text: res.data.text });
          else resolve({ error: 'unknown' });
        }).catch(function (err) {
          resolve({ error: (err && err.message) || 'cloud_failed' });
        });
      });
    });
  }

  async function sendViaLocalKey(userText, history, lang) {
    var apiKey = LS.get('anthropicApiKey', '');
    if (!apiKey) return { error: 'no_key' };

    var model = (SAANS_CONFIG && SAANS_CONFIG.ANTHROPIC_MODEL) || 'claude-sonnet-4-20250514';
    var messages = (history || []).map(function (m) {
      return { role: m.role, content: m.content };
    });
    messages.push({ role: 'user', content: userText });

    var response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 1024,
        system: buildCoachSystemPrompt(lang),
        messages: messages,
      }),
    });

    var data = await response.json();
    if (data.content && data.content[0] && data.content[0].text) {
      return { text: data.content[0].text };
    }
    if (data.error && data.error.message) return { error: data.error.message };
    return { error: 'unknown' };
  }

  window.sendCoachMessage = async function (userText, history, lang) {
    var mode = coachMode();

    if (mode === 'cloud' || mode === 'auto') {
      var cloud = await sendViaCloud(userText, history, lang);
      if (cloud.text) return cloud;
      if (mode === 'cloud') return cloud;
      if (cloud.error === 'login_required') return cloud;
    }

    return sendViaLocalKey(userText, history, lang);
  };

  window.hasCoachApiKey = function () {
    var mode = coachMode();
    if (mode === 'cloud') {
      return typeof getCurrentUser === 'function' && !!getCurrentUser();
    }
    if (mode === 'auto') {
      return !!LS.get('anthropicApiKey', '') || (typeof getCurrentUser === 'function' && !!getCurrentUser());
    }
    return !!LS.get('anthropicApiKey', '');
  };

  window.coachNeedsLogin = function () {
    var mode = coachMode();
    return (mode === 'cloud' || mode === 'auto') && !(getCurrentUser && getCurrentUser());
  };
})();
