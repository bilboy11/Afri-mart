// Service Worker with Workbox and Background Sync
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
  
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [{
        cacheKeyWillBeUsed: async ({request}) => request.url
      }]
    })
  );
  
  const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('sync-purchases', {
    maxRetentionTime: 24 * 60
  });
  
  workbox.routing.registerRoute(
    ({url}) => url.pathname === '/api/purchases',
    new workbox.strategies.NetworkOnly({
      plugins: [bgSyncPlugin]
    }),
    'POST'
  );
}

self.addEventListener('sync', event => {
  if (event.tag === 'sync-purchases') {
    event.waitUntil(syncPurchases());
  }
});

async function syncPurchases() {
  const db = await openDB();
  const tx = db.transaction(['purchases'], 'readonly');
  const store = tx.objectStore('purchases');
  const purchases = await store.getAll();
  
  for (const purchase of purchases.filter(p => !p.synced)) {
    try {
      await fetch('/api/purchases', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(purchase)
      });
      purchase.synced = true;
      const writeTx = db.transaction(['purchases'], 'readwrite');
      await writeTx.objectStore('purchases').put(purchase);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ECommerceDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('purchases')) {
        db.createObjectStore('purchases', {keyPath: 'id'});
      }
    };
  });
}

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {title: 'New Sale!', body: 'Check out our latest deals!'};
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/africart.svg',
      badge: '/africart.svg',
      tag: 'sale-notification',
      requireInteraction: true
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
