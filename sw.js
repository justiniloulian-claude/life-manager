// v252: SW unregisters itself and forces a hard reload.
// This permanently kills any stuck old SW and lets the browser
// fetch directly from the network from now on.
// Push notifications remain handled here after the clean reload.
self.addEventListener('install', function() { self.skipWaiting(); });

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      // Unregister this SW so the browser fetches everything directly
      return self.registration.unregister();
    }).then(function() {
      return self.clients.matchAll({ type: 'window' });
    }).then(function(clients) {
      clients.forEach(function(c) {
        // Force a true hard-reload — no cache, no SW
        c.postMessage({ type: 'SW_HARDRELOAD' });
      });
    })
  );
});

// NO fetch handler — after unregister, the browser handles all requests natively

// Push notification handler
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
