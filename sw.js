// v90: unregister service worker and stop caching entirely.
// Caching was causing stale code to persist. App loads fresh from network every time.
self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys()
      .then(function(keys) {
        return Promise.all(keys.map(function(k) { return caches.delete(k); }));
      })
      .then(function() {
        return self.registration.unregister();
      })
      .then(function() {
        return self.clients.matchAll({ includeUncontrolled: true });
      })
      .then(function(clients) {
        clients.forEach(function(c) { c.navigate(c.url); });
      })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(fetch(e.request));
});
