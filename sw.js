const CACHE_NAME = 'cosypractice-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './cognitive-immersion.html',
  './progress-dashboard.html',
  './manifest.json',
  './css/core.css',
  './css/practice-new.css',
  './css/practice-modern.css',
  './css/daily.css',
  './css/shell.css',
  './js/theme-init.js',
  './js/languages.js',
  './js/theme-data.js',
  './js/theme-aliases.js',
  './js/phonology_data.js',
  './js/shared.js',
  './js/cosy-core.js',
  './js/practice-i18n.js',
  './js/shell.js',
  './hub.js',
  './_engine/core.js',
  './_engine/renderers.js',
  './_engine/progress.js',
  './types/vocabulary/vocabulary.js',
  './types/writing/daily_data.js',
  './types/writing/daily_source.js',
  './types/writing/writing.js',
  './data/grammar_confusion_pairs.js',
  './data/french_grammar_confusion_pairs.js',
  './i18n/en.json',
  './i18n/fr.json',
  './i18n/it.json',
  './i18n/ru.json',
  './i18n/el.json'
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
