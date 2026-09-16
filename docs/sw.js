const APP_SHELL = [
  "./",
  "./index.html",
  "./index.js",
  "./styles.css",
  "./manifest.json",
  "./crokinole2.png",

  "./leaderboard/leaderboard.html",
  "./leaderboard/index_leaderboard.js",
  "./leaderboard/styles_leaderboard.css",

  "./penalty/penalty.html",
  "./penalty/index_penalty.js",
  "./penalty/styles_penalty.css"
];

const CACHE_NAME = "crokinele-v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});