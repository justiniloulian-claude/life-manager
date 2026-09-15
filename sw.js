// v267: back to basics — no caching, always fetch fresh from network.
// This was the strategy that worked (v247-v248). All requests go to
// the real network with cache:'no-store', bypassing any CDN edge cache.
// skipWaiting is called immediately (not in a promise chain) so it ALWAYS fires.

self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
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

// Never serve cached content — always fetch from the network fresh.
// cache:'no-store' bypasses both the browser cache and CDN edge caches.
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(function() {
      return fetch(e.request);
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
