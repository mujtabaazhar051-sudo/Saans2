/**
 * Saans — Firebase Cloud Functions
 * coachChat: shared Anthropic API key for all logged-in users
 */
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

const anthropicApiKey = defineSecret('ANTHROPIC_API_KEY');
const MODEL = 'claude-sonnet-4-20250514';
const MAX_HISTORY = 20;

function trimHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-MAX_HISTORY)
    .filter(function (m) {
      return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string';
    })
    .map(function (m) {
      return { role: m.role, content: m.content.slice(0, 4000) };
    });
}

exports.coachChat = onCall(
  {
    region: 'us-central1',
    secrets: [anthropicApiKey],
    timeoutSeconds: 60,
    memory: '256MiB',
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Login required');
    }

    const data = request.data || {};
    const message = typeof data.message === 'string' ? data.message.trim() : '';
    if (!message || message.length > 2000) {
      throw new HttpsError('invalid-argument', 'Message required (max 2000 chars)');
    }

    const system =
      typeof data.system === 'string' && data.system.trim()
        ? data.system.trim().slice(0, 8000)
        : 'You are Saans Coach, a supportive quit-smoking coach for Pakistanis.';

    const messages = trimHistory(data.history);
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey.value(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: system,
        messages: messages,
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      const msg =
        (body.error && body.error.message) || 'Anthropic request failed';
      console.error('[coachChat]', response.status, msg);
      throw new HttpsError('internal', msg);
    }

    const text =
      body.content &&
      body.content[0] &&
      typeof body.content[0].text === 'string'
        ? body.content[0].text
        : '';

    if (!text) {
      throw new HttpsError('internal', 'Empty response from coach');
    }

    return { text: text };
  }
);
