/**
 * NEU: Service Worker für AppAnwendung
 * Ermöglicht Offline-Unterstützung und Caching
 * Verbessert Ladezeit und SEO-Score
 */

const CACHE_NAME = 'appanwendung-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/main.js',
    '/portfolio.js',
    '/modals.js',
    '/demos.js',
    '/animations.js',
    '/formvalidation.js',
    '/manifest.json'
];

// NEU: Installation des Service Workers
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// NEU: Aktivierung des Service Workers
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// NEU: Fetch Event Handler
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Nur GET requests cachen
    if (request.method !== 'GET') {
        return;
    }

    // NEU: Cache-First Strategy für statische Assets
    if (request.url.includes('.js') || 
        request.url.includes('.css') || 
        request.url.includes('.svg') ||
        request.url.includes('.png') ||
        request.url.includes('.jpg') ||
        request.url.includes('.jpeg') ||
        request.url.includes('.webp') ||
        request.url.includes('.woff') ||
        request.url.includes('.woff2')) {
        
        event.respondWith(
            caches.match(request).then((response) => {
                return response || fetch(request).then((fetchResponse) => {
                    // Cache bei erfolgreichem Fetch
                    if (fetchResponse && fetchResponse.status === 200) {
                        const responseToCache = fetchResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return fetchResponse;
                }).catch(() => {
                    // Fallback wenn offline
                    console.log('[Service Worker] Offline - using cache');
                    return caches.match(request);
                });
            })
        );
        return;
    }

    // NEU: Network-First Strategy für HTML
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cache bei erfolgreichem Fetch
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Fallback auf Cache bei Offline
                return caches.match(request).then((response) => {
                    if (response) {
                        return response;
                    }
                    // Fallback auf Offline-Seite
                    if (request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                    return new Response('Offline - Ressource nicht verfügbar', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});

// NEU: Background Sync für Formulare
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-forms') {
        event.waitUntil(syncForms());
    }
});

async function syncForms() {
    try {
        // Hier können Sie Formulareinträge synchronisieren
        console.log('[Service Worker] Syncing forms...');
        // Implementation je nach Anforderung
    } catch (error) {
        console.error('[Service Worker] Sync failed:', error);
    }
}

// NEU: Push Notifications (Optional)
self.addEventListener('push', (event) => {
    if (!event.data) {
        return;
    }

    const options = {
        body: event.data.text(),
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [100, 50, 100],
        tag: 'appanwendung-notification',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification('AppAnwendung', options)
    );
});

// NEU: Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Fokus auf bestehendes Fenster setzen
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].url === '/' && 'focus' in clientList[i]) {
                        return clientList[i].focus();
                    }
                }
                // Neues Fenster öffnen wenn kein existierendes gefunden
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

// NEU: Message Handler für Client-Kommunikation
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// NEU: Versioning für Cache Updates
function updateServiceWorker() {
    console.log('[Service Worker] Update available');
    // Clients benachrichtigen, dass Update verfügbar ist
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({
                type: 'SW_UPDATE_AVAILABLE'
            });
        });
    });
}

console.log('[Service Worker] Loaded and ready');
