// Sahaaya Health Offline Service Worker — Production Offline-First Architecture
const CACHE_NAME = 'sahaaya-cache-v8';
const IMMUTABLE_ASSETS = [
  '/',
  '/index.html',
  '/logo.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/manifest.json',
  '/illustrations/home-banner.png',
  '/illustrations/home-feature-cards.png',
  '/illustrations/feature-card-ask.png',
  '/illustrations/feature-card-visits.png',
  '/illustrations/feature-card-households.png',
  '/illustrations/feature-card-guides.png',
  '/illustrations/hero-landscape-bg-2x.png',
  '/illustrations/hero-landscape-bg.png',
  '/illustrations/card-ask-tablet.png',
  '/illustrations/card-visits-checklist.png',
  '/illustrations/card-household-family.png',
  '/illustrations/card-guides-books.png',
  '/illustrations/asha-worker-hero.jpg',
  '/illustrations/asha-worker.svg',
  '/illustrations/household-family.jpg',
  '/illustrations/family.svg',
  '/illustrations/health-shield.svg',
  '/illustrations/empty-visits.svg',
  '/illustrations/avatars/lakshmi.jpg',
  '/illustrations/avatars/lakshmi.svg',
  '/illustrations/avatars/raju.jpg',
  '/illustrations/avatars/raju.svg',
  '/illustrations/avatars/saraswati.jpg',
  '/illustrations/avatars/saraswati.svg',
  '/illustrations/avatars/imran.jpg',
  '/illustrations/avatars/imran.svg',
  '/illustrations/avatars/ravi.jpg',
  '/illustrations/avatars/ravi.svg',
  '/illustrations/avatars/ananya.jpg',
  '/illustrations/avatars/ananya.svg',
  '/illustrations/categories/antenatal.jpg',
  '/illustrations/categories/antenatal.svg',
  '/illustrations/categories/immunisation.jpg',
  '/illustrations/categories/immunisation.svg',
  '/illustrations/categories/child-health.jpg',
  '/illustrations/categories/child-health.svg',
  '/illustrations/categories/chronic.jpg',
  '/illustrations/categories/chronic.svg',
  '/illustrations/categories/danger-signs.jpg',
  '/illustrations/categories/danger-signs.svg',
  '/illustrations/categories/job-aids.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(IMMUTABLE_ASSETS);
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

  const url = new URL(event.request.url);

  // 1. Navigation requests: Cache-first for instant cold-start in airplane mode
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((cachedIndex) => {
        if (cachedIndex) {
          // Serve cached shell immediately; revalidate in background if online
          fetch(event.request).then((networkIndex) => {
            if (networkIndex && networkIndex.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', networkIndex));
            }
          }).catch(() => {
            // Field offline mode
          });
          return cachedIndex;
        }
        return fetch(event.request).catch(() => caches.match('/index.html') || caches.match('/'));
      })
    );
    return;
  }

  // 2. Static application assets (scripts, stylesheets, fonts, illustrations): Cache-first
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-while-revalidate in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {
          // Silent offline handling
        });
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for image requests
        if (event.request.destination === 'image') {
          return caches.match('/logo.svg');
        }
        return new Response('Offline: Resource unavailable', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
