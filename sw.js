// v271: path-independent — works on GitHub Pages (/life-manager/) and
// Cloudflare Pages (/) without hardcoded origins or paths.
// APP_URL is derived from self.location so it always points to the right host.

var CACHE = 'lm-v271';
var APP_URL = self.location.origin + (self.location.pathname.replace('sw.js', 'go.html'));

self.addEventListener('install', function(e) {
  self.skipWaiting();
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
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match(APP_URL).then(function(cached) {
        if (cached) return cached;
        return fetch(APP_URL, { cache: 'no-store' });
      })
    );
    return;
  }
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
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data
  }));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
