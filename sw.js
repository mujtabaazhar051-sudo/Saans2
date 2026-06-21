/**
 * Saans — service worker (Phase 6)
 * Cache-first for static assets; network-first for HTML pages.
 */
var CACHE_NAME = 'saans2-v10';
var BASE = self.location.pathname.replace(/sw\.js(\?.*)?$/, '');

function url(path) {
  return BASE + path.replace(/^\//, '');
}

var PRECACHE = [
  url('index.html'),
  url('dashboard.html'),
  url('login.html'),
  url('chat.html'),
  url('css/tokens.css'),
  url('css/base.css'),
  url('css/layout.css'),
  url('css/components.css'),
  url('css/pages/dashboard.css'),
  url('css/pages/onboarding.css'),
  url('css/pages/chat.css'),
  url('js/config.js'),
  url('js/translations.js'),
  url('js/i18n.js'),
  url('js/storage.js'),
  url('js/stats.js'),
  url('js/bootstrap.js'),
  url('js/shell.js'),
  url('assets/logo.svg'),
  url('manifest.json'),
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE).catch(function (err) {
        console.warn('[Saans SW] precache partial fail', err);
      });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) {
          return caches.delete(k);
        })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

function isHtmlRequest(req) {
  return req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') !== -1;
}

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  var req = event.request;

  if (isHtmlRequest(req)) {
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (cached) {
          return cached || caches.match(url('index.html'));
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res.ok && req.url.indexOf(self.location.origin) === 0) {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
