// v269: bypass CDN edge cache by fetching /index.html instead of /
//
// GitHub Pages' Fastly CDN ignores query parameters in cache keys — they
// all map to the same cached object. BUT /life-manager/ and
// /life-manager/index.html are DIFFERENT cache entries. Since traffic
// has always gone to /life-manager/, the CDN may have that stale.
// /life-manager/index.html is a fresh cache entry → always a MISS →
// always fetched from origin → always the latest version.

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

self.addEventListener('fetch', function(e) {
  var req = e.request;

  // For HTML navigation requests on our origin, fetch /index.html explicitly.
  // CDN caches /life-manager/ and /life-manager/index.html as separate entries.
  // /index.html path forces a fresh CDN miss → origin fetch → latest HTML.
  if (req.mode === 'navigate' && req.url.indexOf(self.location.origin) === 0) {
    e.respondWith(
      fetch(self.location.origin + '/life-manager/index.html', { cache: 'no-store' })
        .catch(function() { return fetch(req); })
    );
    return;
  }

  // All other requests: bypass browser cache.
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
