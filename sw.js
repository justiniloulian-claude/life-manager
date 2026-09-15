// v266: bulletproof install — skipWaiting always fires, even if precache fails.
var CACHE = 'lm-v266';
var APP_URL = 'https://justiniloulian-claude.github.io/life-manager/';

self.addEventListener('install', function(e) {
  // Precache fresh HTML with cache-busting to bypass any CDN edge cache.
  // skipWaiting() is called regardless of whether the fetch succeeds,
  // so the SW always activates even if the network is slow or fails.
  var freshUrl = APP_URL + '?_sw=' + Date.now();
  e.waitUntil(
    fetch(freshUrl, { cache: 'no-store' })
      .then(function(res) {
        return caches.open(CACHE).then(function(cache) {
          return cache.put(APP_URL, res);
        });
      })
      .catch(function() { /* fetch failed — SW still activates, will fetch on demand */ })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
    .then(function() { return self.clients.claim(); })
    .then(function() {
      // Best-effort: force all open app windows to reload.
      // Works on iOS 15.4+ and all modern browsers.
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(function(list) {
          return Promise.all(list.map(function(c) {
            return c.navigate(c.url).catch(function() {});
          }));
        });
    })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.mode !== 'navigate') return;
  var url = e.request.url;
  var isApp = url.startsWith(APP_URL) || url === APP_URL.slice(0, -1);
  if (!isApp) return;

  // Serve cached HTML if available, otherwise fetch fresh with cache-busting.
  e.respondWith(
    caches.match(APP_URL).then(function(cached) {
      return cached || fetch(APP_URL + '?_r=' + Date.now(), { cache: 'no-store' });
    })
  );
});

self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(err) { data = { title: 'Esav', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(data.title || 'Esav', {
    body: data.body || '',
    icon: '/life-manager/icon-192.png',
    badge: '/life-manager/icon-192.png',
    data: data
  }));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/life-manager/'));
});
