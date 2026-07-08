// v149: push notification support added (Esav assistant)
self.addEventListener('install', function() { self.skipWaiting(); });

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(fetch(e.request));
});

// Push notification handler
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(err) { data = { title: 'Esav', body: e.data ? e.data.text() : '' }; }
  var title = data.title || 'Esav';
  var options = {
    body: data.body || '',
    icon: '/life-manager/icon-192.png',
    badge: '/life-manager/icon-192.png',
    data: data,
    requireInteraction: false
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/life-manager/'));
});
