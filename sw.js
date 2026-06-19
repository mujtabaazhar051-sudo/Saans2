/**
 * Saans — service worker skeleton (Phase 6 will expand offline cache)
 */
const CACHE_NAME = 'saans2-v1';
const BASE = self.location.pathname.replace(/sw\.js$/, '');

const PRECACHE = [
  BASE,
  BASE + 'index.html',
  BASE + 'css/tokens.css',
  BASE + 'css/base.css',
  BASE + 'css/layout.css',
  BASE + 'css/components.css',
  BASE + 'js/config.js',
  BASE + 'js/translations.js',
  BASE + 'js/i18n.js',
  BASE + 'assets/logo.svg',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE).catch(function () { /* offline dev */ });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});
