// Cache name - Nome do Cache // 
const CACHE_NAME = 'nails-v5'

// Only static files that exist in the React build - Só arquivos estaticos que existem no build React //
const FILES = [
    '/',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
 ]

 self.addEventListener('install', event => {
    self.skipWaiting()
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
        )
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    )
    self.clients.claim()
})
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return
    if (new URL(event.request.url).pathname.startsWith('/api')) return

    event.respondWith(
        fetch(event.request)
            .then(response =>{
                if (response.ok) {
                const cloned = response.clone()
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned))
                }
                return response
            })
            .catch(() => caches.match(event.request).then(res => res || caches.match('/')))
    )
})