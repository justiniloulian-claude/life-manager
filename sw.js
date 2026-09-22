// v298: network-first offline shell.
//
// History matters here: an earlier cache-first service worker is what pinned
// this app on v256 for hours. So the rule is strict — always try the network
// first and only fall back to the cache when the request actually fails. When
// you have signal you are, by definition, getting the newest files.
//
// Only same-origin GETs are cached. Firestore, gstatic and hebcal always pass
// straight through, so live data is never served stale from a cache.

var SHELL = 'lm-shell-v298';
var SHELL_FILES = ['./', './index.html', './app.js', './style.css', './manifest.json'];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(SHELL).then(function(cache) {
      return cache.addAll(SHELL_FILES).catch(function() {
        // A single missing file must not abort the whole install
        return Promise.all(SHELL_FILES.map(function(f) {
          return cache.add(f).catch(function() {});
        }));
      });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== SHELL; })
                            .map(function(k) { return caches.delete(k); }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var sameOrigin = req.url.indexOf(self.location.origin) === 0;
  if (!sameOrigin) return; // Firestore / gstatic / hebcal — never touch these

  e.respondWith(
    fetch(req).then(function(resp) {
      if (resp && resp.status === 200 && resp.type === 'basic') {
        var copy = resp.clone();
        caches.open(SHELL).then(function(cache) { cache.put(req, copy); });
      }
      return resp;
    }).catch(function() {
      // Offline: ignoreSearch so app.js?v=298 still matches a cached app.js?v=297
      return caches.match(req, { ignoreSearch: true }).then(function(hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') {
          return caches.match('./index.html', { ignoreSearch: true });
        }
        return new Response('', { status: 504, statusText: 'Offline' });
      });
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
