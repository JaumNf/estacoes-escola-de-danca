const CACHE_NAME = 'estacoes-cache-v1';

// Recursos mínimos para exibir a página offline
const urlsToCache = [
  '/',
  '/aulas-regulares',
  '/manifest.json',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('Alguns assets não puderam ser cacheados na instalação', err);
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia Stale-while-revalidate para uma experiência mais fluida
self.addEventListener('fetch', (event) => {
  // Ignorar requests de API, extensões ou POST
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Se falhar (offline) e não tivermos cache, mas for uma navegação de página
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });

        return cachedResponse || fetchPromise;
      })
  );
});
