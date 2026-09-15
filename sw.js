// v265: cache-bust on install + direct serve (no redirect) + force-navigate on activate.
// This ensures even CDN edge caches are bypassed and pages reload automatically.
var CACHE = 'lm-v265';
var APP_URL = 'https://justiniloulian-claude.github.io/life-manager/';

self.addEventListener('install', function(e) {
  // Use a unique cache-busting timestamp so CDN edge caches are bypassed.
  // This guarantees we cache the very latest HTML from the origin server.
  var freshUrl = APP_URL + '?_sw=' + Date.now();
  e.waitUntil(
    fetch(freshUrl, { cache: 'no-store' })
      .then(function(res) {
        return caches.open(CACHE).then(function(cache) {
          // Store under the canonical APP_URL so fetch handler can match it.
          return cache.put(APP_URL, res);
        });
      })
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
      // Force all open app windows to reload so they get the fresh cached HTML
      // immediately — no manual refresh needed.
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(function(clients) {
          return Promise.all(clients.map(function(c) {
            return c.navigate(c.url).catch(function() {});
          }));
        });
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Only intercept navigation requests for the app HTML.
  if (e.request.mode !== 'navigate') return;
  var url = e.request.url;
  var isApp = url.startsWith(APP_URL) || url === APP_URL.slice(0, -1);
  if (!isApp) return;

  // Serve the cached fresh HTML directly — no redirect needed.
  e.respondWith(
    caches.match(APP_URL).then(function(cached) {
      return cached || fetch(APP_URL, { cache: 'no-store' });
    })
  );
});

// Push notifications
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(err) { data = { title: 'Esav', body: e.data ? e.data.text() : '' }; }
  var options = {
    body: data.body || '',
    icon: '/life-manager/icon-192.png',
    badge: '/life-manager/icon-192.png',
    data: data,
    requireInteraction: false
  };
  e.waitUntil(self.registration.showNotification(data.title || 'Esav', options));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/life-manager/'));
});
