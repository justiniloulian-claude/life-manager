// v273: NO caching. Every navigation and every asset always fetched from network.
// Prior versions used cache-first for go.html which caused stale content to be
// served indefinitely. This version deletes every cache on activate and never
// writes to any cache, so there is no stuck-SW cache layer.

self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  // Delete every cache from every previous SW version without exception.
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

// Never cache anything. Pass every request straight to the network.
// cache:'no-store' tells the browser not to store the response in its HTTP cache.
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
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data
  }));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
