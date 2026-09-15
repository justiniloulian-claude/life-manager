// v263: bootstrap-redirect approach — no clients.navigate(), works on Safari.
// On any refresh, SW returns a tiny redirect page → browser follows to ?app=1
// SW then serves fresh precached HTML at ?app=1. No browser action needed beyond a normal refresh.
var CACHE = 'lm-v263';
var APP_URL = 'https://justiniloulian-claude.github.io/life-manager/';

self.addEventListener('install', function(e) {
  // Fetch and cache the very latest HTML right now, bypassing all HTTP caches
  e.waitUntil(
    fetch(APP_URL, { cache: 'no-store' })
      .then(function(res) {
        return caches.open(CACHE).then(function(cache) {
          return cache.put(APP_URL, res);
        });
      })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  // Only handle navigation requests for the app HTML
  if (e.request.mode !== 'navigate') return;

  var isApp = url.startsWith(APP_URL) || url === APP_URL.slice(0, -1);
  if (!isApp) return;

  // If URL already has ?app=1, serve the fresh precached HTML
  if (url.includes('?app=1')) {
    e.respondWith(
      caches.open(CACHE).then(function(cache) {
        return cache.match(APP_URL);
      }).then(function(cached) {
        return cached || fetch(APP_URL, { cache: 'no-store' });
      })
    );
    return;
  }

  // Otherwise: serve a tiny bootstrap page that instantly redirects to ?app=1
  // This works on Safari without needing clients.navigate()
  e.respondWith(new Response(
    '<!DOCTYPE html><html><head><title>Loading…</title>' +
    '<script>location.replace("' + APP_URL + '?app=1")<\/script>' +
    '</head><body></body></html>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  ));
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
