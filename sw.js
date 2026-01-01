const CACHE_NAME = 'mixer';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './assets/fonts/vazirmatn.css',
  './assets/fonts/webfonts/Vazirmatn-Thin.woff2',
  './assets/fonts/webfonts/Vazirmatn-ExtraLight.woff2',
  './assets/fonts/webfonts/Vazirmatn-Light.woff2',
  './assets/fonts/webfonts/Vazirmatn-Regular.woff2',
  './assets/fonts/webfonts/Vazirmatn-Medium.woff2',
  './assets/fonts/webfonts/Vazirmatn-SemiBold.woff2',
  './assets/fonts/webfonts/Vazirmatn-Bold.woff2',
  './assets/fonts/webfonts/Vazirmatn-ExtraBold.woff2',
  './assets/fonts/webfonts/Vazirmatn-Black.woff2',
  './assets/css/style.css',
  './assets/js/app.js',
  './assets/i18n/fa.js',
  './assets/i18n/en.js',
  './assets/logos/icon-192.png',
  './assets/logos/icon-512.png',
  './assets/logos/icon-180.png',
  './assets/logos/dark-logo.png',
  './assets/logos/light-logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key)))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put('./index.html', response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match('./index.html');
    return cached || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    return cached || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/version.json')) {
    event.respondWith(fetch(request));
    return;
  }
  if (url.pathname.endsWith('/alert.json')) {
    event.respondWith(fetch(request));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(cacheFirst(request));
});
