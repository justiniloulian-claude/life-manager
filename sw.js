// v262: precache fresh index.html during install so stale HTTP cache is bypassed
var CACHE = 'lm-v262';

self.addEventListener('install', function(e) {
  // Fetch and store the latest HTML right now, bypassing any HTTP cache
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return fetch('/life-manager/', { cache: 'no-store' }).then(function(res) {
        return cache.put('/life-manager/', res);
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  // Delete all old caches
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      return self.clients.matchAll({ type: 'window' });
    }).then(function(clients) {
      // Force all open windows to reload — SW will serve fresh HTML from its cache
      clients.forEach(function(c) {
        try { c.navigate(c.url); } catch(err) {}
      });
    })
  );
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  var isHTML = url.includes('/life-manager/index.html') ||
               url.endsWith('/life-manager/') ||
               url.endsWith('/life-manager');
  if (isHTML) {
    // Serve the freshly precached HTML — not the stale browser HTTP cache
    e.respondWith(
      caches.open(CACHE).then(function(cache) {
        return cache.match('/life-manager/');
      }).then(function(cached) {
        if (cached) return cached;
        return fetch(e.request, { cache: 'no-store' });
      })
    );
    return;
  }
  // All other resources: browser handles normally (versioned URLs bust cache)
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
