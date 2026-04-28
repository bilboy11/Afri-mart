// Service Worker with Workbox and Background Sync
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
  workbox.precaching.precacheAndRoute([{"revision":"7e1eb39c2c19f75ac565fbd4b9f0d913","url":"workbox-config.js"},{"revision":"1f7849d912a187d1c724bce439e36cfe","url":"sw-template.js"},{"revision":"8e008ee4b6c4774813a39124bd597287","url":"styles.css"},{"revision":"3a5316dbbb2fdaef5003ba4a16ab15c8","url":"purchase-manager.js"},{"revision":"d4a027376465e1a6c9e7b750cb273b7f","url":"products-data.js"},{"revision":"e27b09bb0373d34ad978d4a117f0538e","url":"package.json"},{"revision":"1e4c28d43115270e896244a8e4d3eccd","url":"package-lock.json"},{"revision":"dd99d8fb4727eb7890f1a7ed0ec8a76e","url":"notification-manager.js"},{"revision":"3f7a23ca0d0d97ef8e3ea06feec635e4","url":"manifest.json"},{"revision":"89a9b56af3bad95cddafc8b75d901d25","url":"index.html"},{"revision":"76e25ed43e52ff04117bf855267fc033","url":"app.js"},{"revision":"796b4956d4319d3b72bcc7a2ebfe94e2","url":"api-server.js"},{"revision":"8dc808bffcc96ab40f119684753da0b3","url":"africart.svg"},{"revision":"c0255300659e75e7c5c76e438b316114","url":"africart.png"}] || []);
  
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
