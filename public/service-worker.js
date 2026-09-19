 const CACHE_NAME = 'nails-v4';
 const FILES = [
    '/',
    '/login.html',
    '/js/login.js',
    '/register.html',
    '/js/register.js',
    '/finances.html',
    '/js/finances.js',
    '/storage.html', 
    '/js/storage.js',
    '/style.css',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
 ];

 self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
        );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
})
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response =>{
                const cloned = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});