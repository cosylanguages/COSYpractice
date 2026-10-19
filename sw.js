const CACHE_NAME = 'cosypractice-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './cognitive-immersion.html',
  './progress-dashboard.html',
  './manifest.json',
  './css/core.css',
  './css/practice-modern.css',
  './css/daily.css',
  './css/shell.css',
  './js/theme-init.js',
  './js/languages.js',
  './js/shared.js',
  './js/shell.js',
  './hub.js',
  './_engine/core.js',
  './_engine/renderers.js',
  './_engine/progress.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networked = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const cacheCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networked;
    })
  );
});
