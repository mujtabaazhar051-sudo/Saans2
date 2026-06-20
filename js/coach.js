/**
 * Saans — AI coach (Anthropic API)
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

  window.sendCoachMessage = async function (userText, history, lang) {
    var apiKey = LS.get('anthropicApiKey', '');
    if (!apiKey) {
      return { error: 'no_key' };
    }

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
    if (data.error && data.error.message) {
      return { error: data.error.message };
    }
    return { error: 'unknown' };
  };

  window.hasCoachApiKey = function () {
    return !!LS.get('anthropicApiKey', '');
  };
})();
