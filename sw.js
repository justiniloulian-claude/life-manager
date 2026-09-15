// v270: SW caches go.html at install time — CDN is bypassed entirely.
// go.html is a brand-new path the CDN has never seen → guaranteed fresh fetch
// from GitHub origin at install time. Every navigation is then served from
// the SW's own cache, so stale CDN content can NEVER reach the user again.

var CACHE = 'lm-v270';
var APP_URL = 'https://justiniloulian-claude.github.io/life-manager/go.html';

self.addEventListener('install', function(e) {
  self.skipWaiting();
  // Fetch go.html fresh from origin (CDN miss — never been cached) and store it.
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return fetch(APP_URL, { cache: 'no-store' }).then(function(resp) {
        return cache.put(APP_URL, resp);
      });
    }).catch(function() {})
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    // Delete all old caches except ours
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; })
        .map(function(k) { return caches.delete(k); }));
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    }).then(function(clients) {
      return Promise.all(clients.map(function(c) {
        return c.navigate(c.url).catch(function() {});
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  var req = e.request;

  // For any HTML page navigation: serve from SW cache (go.html).
  // This completely bypasses the CDN and browser HTTP cache.
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match(APP_URL).then(function(cached) {
        if (cached) return cached;
        // Fallback: fetch fresh if somehow cache is empty
        return fetch(APP_URL, { cache: 'no-store' });
      })
    );
    return;
  }

  // All other requests (JS, CSS, Firebase, etc): always network, no caching.
  e.respondWith(
    fetch(req, { cache: 'no-store' }).catch(function() {
      return fetch(req);
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
