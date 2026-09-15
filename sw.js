// v268: CDN cache-bust for HTML navigation requests.
// cache:'no-store' bypasses the browser cache, but NOT Fastly CDN edge cache.
// For HTML page loads (navigate mode), we append ?_cb=<minute> to the URL,
// which makes the CDN treat it as a brand-new URL → cache miss → fresh origin.
// This guarantees the browser always gets the latest index.html regardless of
// what Fastly has cached at the user's geographic edge node.

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

  // For HTML navigation requests on our own origin, bust the CDN edge cache.
  // Fastly caches by URL — a unique ?_cb= param forces a cache miss → fresh HTML.
  if (req.mode === 'navigate' && req.url.indexOf(self.location.origin) === 0) {
    var url = new URL(req.url);
    // Use seconds-precision timestamp so every page load gets a unique URL.
    // This guarantees a CDN cache miss every time.
    url.searchParams.set('_cb', Date.now());
    e.respondWith(
      fetch(url.toString(), { cache: 'no-store' })
        .catch(function() { return fetch(req); })
    );
    return;
  }

  // All other requests: bypass browser cache, let CDN serve normally.
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
