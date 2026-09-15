// v261: intercept only index.html — serve it fresh from network always.
// All other assets use the browser's normal cache (versioned URLs handle busting).
self.addEventListener('install', function() { self.skipWaiting(); });

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      // Force all open windows to reload so they pick up fresh index.html
      return self.clients.matchAll({ type: 'window' });
    }).then(function(clients) {
      clients.forEach(function(c) {
        try { c.navigate(c.url); } catch(err) {}
      });
    })
  );
});

// Only intercept the HTML page itself — always fetch it fresh, never from cache
self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  var isHTML = url.includes('/life-manager/index.html') ||
               url.endsWith('/life-manager/') ||
               url.endsWith('/life-manager');
  if (isHTML) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
  }
  // Everything else: fall through to browser's normal cache handling
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
