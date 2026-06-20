/**
 * Saans — chat page (AI coach)
 */
(function () {
  'use strict';

  var history = [];
  var loading = false;
  var SUG_KEYS = ['chat.sug1', 'chat.sug2', 'chat.sug3', 'chat.sug4', 'chat.sug5'];

  function el(id) { return document.getElementById(id); }

  function loadHistory() {
    history = LS.get('chatHistory', []);
  }

  function saveHistory() {
    if (history.length > 40) history = history.slice(-40);
    LS.set('chatHistory', history);
  }

  function timeNow() {
    var d = new Date();
    return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
  }

  function scrollBottom() {
    var box = el('chatMessages');
    if (box) box.scrollTop = box.scrollHeight;
  }

  function appendBubble(role, text, persist) {
    var container = el('chatMessages');
    var isUser = role === 'user';
    var wrap = document.createElement('div');
    wrap.className = 'chat-msg ' + (isUser ? 'chat-msg--user' : 'chat-msg--coach');
    wrap.innerHTML =
      '<div class="chat-msg__avatar">' + (isUser ? '👤' : '🤖') + '</div>' +
      '<div><div class="chat-msg__bubble"></div><div class="chat-msg__time">' + timeNow() + '</div></div>';
    wrap.querySelector('.chat-msg__bubble').textContent = text;
    container.appendChild(wrap);

    if (persist !== false) {
      history.push({ role: isUser ? 'user' : 'assistant', content: text });
      saveHistory();
    }
    if (isUser) el('chatSuggestions').style.display = 'none';
    scrollBottom();
  }

  function showTyping() {
    var container = el('chatMessages');
    var wrap = document.createElement('div');
    wrap.className = 'chat-msg chat-msg--coach';
    wrap.id = 'chatTyping';
    wrap.innerHTML =
      '<div class="chat-msg__avatar">🤖</div>' +
      '<div class="chat-typing"><span></span><span></span><span></span></div>';
    container.appendChild(wrap);
    scrollBottom();
  }

  function hideTyping() {
    var node = el('chatTyping');
    if (node) node.remove();
  }

  function renderHistory() {
    el('chatMessages').querySelectorAll('.chat-msg').forEach(function (n) { n.remove(); });
    history.forEach(function (m) {
      appendBubble(m.role === 'user' ? 'user' : 'coach', m.content, false);
    });
    if (history.length) el('chatSuggestions').style.display = 'none';
  }

  function buildSuggestions() {
    var wrap = el('chatSuggestions');
    wrap.innerHTML = '';
    SUG_KEYS.forEach(function (key) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-sug';
      btn.textContent = t(key);
      btn.addEventListener('click', function () {
        el('chatInput').value = t(key);
        sendMessage();
      });
      wrap.appendChild(btn);
    });
  }

  function updateApiNotice() {
    var notice = el('chatApiNotice');
    if (!notice) return;
    notice.classList.toggle('is-visible', !hasCoachApiKey());
  }

  async function sendMessage() {
    var input = el('chatInput');
    var text = input.value.trim();
    if (!text || loading) return;

    if (!hasCoachApiKey()) {
      updateApiNotice();
      showToast(t('chat.noKey'));
      return;
    }

    input.value = '';
    input.style.height = 'auto';
    appendBubble('user', text);

    loading = true;
    el('chatSendBtn').disabled = true;
    showTyping();

    try {
      var prior = history.slice(0, -1);
      var result = await sendCoachMessage(text, prior, getLang());
      hideTyping();
      if (result.text) {
        appendBubble('coach', result.text);
      } else if (result.error === 'no_key') {
        updateApiNotice();
        appendBubble('coach', t('chat.noKeyReply'));
      } else {
        appendBubble('coach', t('chat.error') + (result.error && result.error !== 'unknown' ? ' (' + result.error + ')' : ''));
      }
    } catch (_) {
      hideTyping();
      appendBubble('coach', t('chat.error'));
    } finally {
      loading = false;
      el('chatSendBtn').disabled = false;
      input.focus();
    }
  }

  function clearChat() {
    if (!confirm(t('chat.clearConfirm'))) return;
    history = [];
    LS.remove('chatHistory');
    el('chatMessages').querySelectorAll('.chat-msg').forEach(function (n) { n.remove(); });
    el('chatSuggestions').style.display = 'flex';
    buildSuggestions();
  }

  function bindInput() {
    var input = el('chatInput');
    input.addEventListener('input', function () {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  window.SaansPages = window.SaansPages || {};

  SaansPages.chat = function () {
    try { LS.set('chatOpened', true); } catch (_) {}

    var settingsLink = el('chatSettingsLink');
    var apiLink = el('chatApiLink');
    if (settingsLink) settingsLink.href = saansHref('settings.html');
    if (apiLink) apiLink.href = saansHref('settings.html');

    el('chatSendBtn').addEventListener('click', sendMessage);
    el('chatClearBtn').addEventListener('click', clearChat);
    bindInput();

    loadHistory();
    buildSuggestions();
    renderHistory();
    updateApiNotice();
    el('chatInput').placeholder = t('chat.placeholder');

    onLangChange(function () {
      applyI18nDOM();
      el('chatInput').placeholder = t('chat.placeholder');
      buildSuggestions();
      updateApiNotice();
    });
  };
})();
