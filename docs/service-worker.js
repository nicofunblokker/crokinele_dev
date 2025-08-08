// service-worker.js

// Cache name and list of assets to cache
const CACHE_NAME = 'crokinele-pwa-cache-v1';
const URLS_TO_CACHE = [
  '/crokinole.jpg',
  '/crokinole2.png',
  '/index.html',
  '/index.js',
  '/manifest.json',
  '/service-worker.js',
  '/styles.css',
  '/leaderboard/index_leaderboard.js',
  '/leaderboard/leaderboard.html',
  '/leaderboard/styles_leaderboard.css',
  '/penalty/index_penalty.js',
  '/penalty/penalty.html',
  '/penalty/styles_penalty.css',
];

// Install event - Caches the files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activate event - Cleans up old cache versions
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
