// v251: NO fetch interception — browser handles all network requests natively.
// SW exists only for push notifications. This eliminates stale-cache issues.
self.addEventListener('install', function() { self.skipWaiting(); });

self.addEventListener('activate', function(e) {
  // Wipe every cache left over from old SW versions
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      return self.clients.matchAll({ type: 'window' });
    }).then(function(clients) {
      clients.forEach(function(c) { c.postMessage({ type: 'SW_RELOAD' }); });
    })
  );
});

// ── NO fetch handler ──────────────────────────────────────────────────────────
// Removing the fetch handler means the browser fetches all resources directly
// from the network, using its normal HTTP cache. Versioned URLs (?v=258) on
// app.js and style.css ensure those always bust the cache. This is the fix for
// the "stuck on old version" problem that plagued v246–v258.

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
