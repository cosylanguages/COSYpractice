const CACHE_NAME = 'cosypractice-v5';
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

const NETWORK_FIRST_DESTINATIONS = new Set(['document', 'script', 'style', 'worker']);

function isNetworkFirst(request) {
  if (request.mode === 'navigate') return true;
  if (NETWORK_FIRST_DESTINATIONS.has(request.destination)) return true;
  try {
    return /\.(?:html|js|css|json)$/.test(new URL(request.url).pathname);
  } catch (error) {
    return false;
  }
}

function offlineResponse() {
  return new Response('Offline', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain' } });
}

function cacheResponse(request, response) {
  if (!response || response.status !== 200 || response.type === 'opaque') return response;
  const copy = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  return response;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const request = event.request;

  if (isNetworkFirst(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(() => caches.match(request).then((cached) => {
          if (cached) return cached;
          if (request.mode === 'navigate') return caches.match('./index.html').then((shell) => shell || offlineResponse());
          return offlineResponse();
        }))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networked = fetch(request)
        .then((response) => cacheResponse(request, response))
        .catch(() => cached || offlineResponse());
      return cached || networked;
    })
  );
});
