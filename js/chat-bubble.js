/**
 * Saans — floating AI coach chat bubble
 */
(function () {
  'use strict';

  function mountChatBubble() {
    var wrap = document.createElement('div');
    wrap.className = 'saans-chat-bubble';
    wrap.id = 'saansChatBubble';

    wrap.innerHTML =
      '<span class="saans-chat-bubble__tooltip" data-i18n="chat.tooltip"></span>' +
      '<a class="saans-chat-bubble__btn" href="' + saansHref('chat.html') + '" aria-label="">' +
        '🤖' +
      '</a>';

    document.body.appendChild(wrap);

    var btn = wrap.querySelector('.saans-chat-bubble__btn');
    function updateLabel() {
      if (btn) btn.setAttribute('aria-label', t('chat.tooltip'));
    }
    updateLabel();
    onLangChange(updateLabel);
    applyI18nDOM();

    setTimeout(function () {
      wrap.classList.add('is-tip-visible');
      setTimeout(function () { wrap.classList.remove('is-tip-visible'); }, 4000);
    }, 2000);

    return wrap;
  }

  window.SaansChatBubble = { mount: mountChatBubble };
})();
