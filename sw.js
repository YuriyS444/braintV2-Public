const CACHE_NAME = 'brain-t0-v5';
const STATIC_ASSETS = [
    '/braintV2-Public/',
    '/braintV2-Public/client/index.html',
    '/braintV2-Public/client/style.css',
    '/braintV2-Public/client/js/client.js'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)).catch(() => {})
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    // API запросы — только сеть
    if (e.request.url.includes('railway.app')) return;
    
    e.respondWith(
        fetch(e.request)
            .then(res => {
                const clone = res.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
