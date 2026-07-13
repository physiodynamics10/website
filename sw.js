const CACHE_NAME = 'physio-dynamics-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/contact.html',
  '/blogs/',
  '/blogs/index.html',
  '/blogs/best-exercises-for-knee-pain',
  '/blogs/lower-back-pain-physiotherapy-exercises',
  '/blogs/sports-injury-recovery-physiotherapy',
  '/blogs/frozen-shoulder-physiotherapy-treatment',
  '/css/style.css',
  '/css/bootstrap.min.css',
  '/js/main.js',
  '/js/bootstrap.bundle.min.js',
  '/logo.webp',
  '/clinic-interior.webp',
  '/site.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
  );
});