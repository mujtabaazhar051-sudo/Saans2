/**
 * Saans — bottom navigation + More menu
 */
(function () {
  'use strict';

  var MORE_ITEMS = [
    { key: 'more.tips',         href: 'tips.html',         icon: '📚' },
    { key: 'more.motivation',   href: 'motivation.html',   icon: '💬' },
    { key: 'more.breathing',    href: 'breathing.html',    icon: '🫁' },
    { key: 'more.savings',      href: 'savings.html',      icon: '💰' },
    { key: 'more.badges',       href: 'badges.html',       icon: '🏅' },
    { key: 'more.health',       href: 'health.html',       icon: '❤️' },
    { key: 'more.stories',      href: 'stories.html',      icon: '⭐' },
    { key: 'more.nrt',          href: 'nicotine.html',     icon: '💊' },
    { key: 'more.leaderboard',  href: 'leaderboard.html',  icon: '🏆' },
    { key: 'more.resources',    href: 'resources.html',    icon: '🔗' },
    { key: 'more.helplines',    href: 'helplines.html',    icon: '📞' },
    { key: 'more.about',        href: 'about.html',        icon: 'ℹ️' },
  ];

  function currentPage() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    return path.replace(/^\//, '');
  }

  function mountBottomNav() {
    var page = currentPage();
    var backdrop = document.createElement('div');
    backdrop.className = 'saans-more-backdrop';
    backdrop.id = 'saansMoreBackdrop';

    var menu = document.createElement('div');
    menu.className = 'saans-more-menu';
    menu.id = 'saansMoreMenu';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-hidden', 'true');

    var itemsHtml = MORE_ITEMS.map(function (item) {
      return '<a class="saans-more-menu__item" href="' + saansHref(item.href) + '">' +
        '<span class="saans-more-menu__icon">' + item.icon + '</span>' +
        '<span data-i18n="' + item.key + '"></span>' +
      '</a>';
    }).join('');

    menu.innerHTML =
      '<div class="saans-more-menu__title" data-i18n="more.title"></div>' +
      '<div class="saans-more-menu__grid">' + itemsHtml + '</div>';

    var nav = document.createElement('nav');
    nav.className = 'saans-bottom-nav';
    nav.id = 'saansBottomNav';
    nav.setAttribute('aria-label', 'Main');

    var tabs = [
      { key: 'nav.home',  href: 'dashboard.html', icon: '🏠', match: ['dashboard.html', 'app.html'] },
      { key: 'nav.track', href: 'tracker.html',   icon: '📅', match: ['tracker.html'] },
      { key: 'nav.coach', href: 'chat.html',      icon: '🤖', match: ['chat.html'] },
      { key: 'nav.more',  action: 'more',          icon: '☰',  match: [] },
    ];

    tabs.forEach(function (tab) {
      var isActive = tab.match && tab.match.indexOf(page) >= 0;
      if (tab.action === 'more') {
        nav.innerHTML +=
          '<button type="button" class="saans-bottom-nav__tab" id="saansMoreBtn" aria-expanded="false">' +
            '<span class="saans-bottom-nav__icon">' + tab.icon + '</span>' +
            '<span data-i18n="' + tab.key + '"></span>' +
          '</button>';
      } else {
        nav.innerHTML +=
          '<a class="saans-bottom-nav__tab' + (isActive ? ' is-active' : '') + '" href="' + saansHref(tab.href) + '">' +
            '<span class="saans-bottom-nav__icon">' + tab.icon + '</span>' +
            '<span data-i18n="' + tab.key + '"></span>' +
          '</a>';
      }
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(menu);
    document.body.appendChild(nav);

    var moreBtn = document.getElementById('saansMoreBtn');

    function closeMore() {
      menu.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      if (moreBtn) moreBtn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }

    function openMore() {
      menu.classList.add('is-open');
      backdrop.classList.add('is-open');
      if (moreBtn) moreBtn.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      applyI18nDOM();
    }

    if (moreBtn) {
      moreBtn.addEventListener('click', function () {
        if (menu.classList.contains('is-open')) closeMore();
        else openMore();
      });
    }

    backdrop.addEventListener('click', closeMore);

    applyI18nDOM();
    onLangChange(function () { applyI18nDOM(); });

    return nav;
  }

  window.SaansBottomNav = { mount: mountBottomNav };
})();
