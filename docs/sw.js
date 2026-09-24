const CACHE_NAME = 'fachteil-luchs-v2.6.0-ios-1';
const APP_FILES = ["./.nojekyll","./analysis-v12.js","./analysis-v121-mobile.js","./bindemittel-trainer-v20.js","./cards-v22.js","./cards-v23.js","./exam-analysis-v14.js","./exam-v13.js","./farbenlehre-trainer-v24.js","./home-redesign-v17.js","./icons/apple-touch-icon-180.png","./icons/icon-192.png","./icons/icon-512.png","./index.html","./manifest.webmanifest","./readiness-v15.js","./stilkunde-trainer-v25.js","./untergrund-trainer-v21.js"];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(APP_FILES); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(key) {
        return key !== CACHE_NAME;
      }).map(function(key) {
        return caches.delete(key);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200) return response;
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, copy);
        });
        return response;
      }).catch(function() {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        throw new Error('offline');
      });
    })
  );
});
