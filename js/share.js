/**
 * Saans — WhatsApp share
 */
(function () {
  'use strict';

  window.buildShareMessage = function (lang, context) {
    context = context || 'app';
    var name = LS.get('userName', '');
    var days = getDaysSinceQuit();
    var streak = getStreak();
    var savings = getSavings();
    var cigs = getCigsAvoided();
    var badges = (LS.get('earnedBadges', []) || []).length;
    var siteUrl = (SAANS_CONFIG && SAANS_CONFIG.SITE_URL) || window.location.origin;

    if (lang === 'ur') {
      var greeting = name ? 'میں ' + name + ' ہوں اور' : 'میں';
      var msgs = {
        app: '🌿 *سانس — میری پیش رفت*\n\n' + greeting + ' سگریٹ چھوڑنے کا سفر شروع کر چکا ہوں!\n\n📅 *' + days + ' دن* سگریٹ فری\n🔥 *' + streak + ' دن* کی سٹریک\n💰 *PKR ' + savings.toLocaleString() + '* بچائے\n🚬 *' + cigs.toLocaleString() + '* سگریٹ نہیں پیے\n🏅 *' + badges + '* بیجز\n\nآپ بھی شروع کریں 👇\n' + siteUrl,
        dashboard: '🌿 *سانس — میری پیش رفت*\n\n' + greeting + ' سگریٹ چھوڑنے کا سفر جاری ہے!\n\n📅 ' + days + ' دن\n🔥 ' + streak + ' دن سٹریک\n💰 PKR ' + savings.toLocaleString() + '\n\n' + siteUrl,
      };
      return msgs[context] || msgs.app;
    }

    var greetingEn = name ? "I'm " + name + " and I've" : "I've";
    var msgsEn = {
      app: '🌿 *Saans — My Progress*\n\n' + greetingEn + ' started my quit-smoking journey!\n\n📅 *' + days + ' days* smoke-free\n🔥 *' + streak + '-day* streak\n💰 *PKR ' + savings.toLocaleString() + '* saved\n🚬 *' + cigs.toLocaleString() + '* cigarettes avoided\n🏅 *' + badges + '* badges\n\nJoin me 👇\n' + siteUrl,
      dashboard: '🌿 *Saans — My Progress*\n\n' + greetingEn + ' on my quit journey!\n\n📅 ' + days + ' days\n🔥 ' + streak + '-day streak\n💰 PKR ' + savings.toLocaleString() + '\n\n' + siteUrl,
    };
    return msgsEn[context] || msgsEn.app;
  };

  window.shareOnWhatsApp = function (context) {
    var lang = getLang();
    var url = 'https://wa.me/?text=' + encodeURIComponent(buildShareMessage(lang, context));
    window.open(url, '_blank');
  };
})();
