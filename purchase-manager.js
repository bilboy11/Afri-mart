// Purchase Manager - Handles offline purchases with Background Sync API

class PurchaseManager {
    constructor() {
        this.dbName = 'ECommerceDB';
        this.storeName = 'purchases';
        this.db = null;
        this.initDB();
    }

    // Initialize IndexedDB
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                    objectStore.createIndex('synced', 'synced', { unique: false });
                }
            };
        });
    }

    // Queue a purchase for background sync
    async queuePurchase(purchase) {
        // Ensure DB is initialized
        if (!this.db) {
            await this.initDB();
        }

        const purchaseData = {
            ...purchase,
            id: purchase.id || Date.now(),
            timestamp: purchase.timestamp || new Date().toISOString(),
            synced: false
        };

        // Store in IndexedDB
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(purchaseData);

            request.onsuccess = async () => {
                // Register background sync
                if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
                    try {
                        const registration = await navigator.serviceWorker.ready;
                        await registration.sync.register('sync-purchases');
                        console.log('Background sync registered for purchase:', purchaseData.id);
                    } catch (error) {
                        console.error('Background sync registration failed:', error);
                    }
                }
                resolve(purchaseData);
            };

            request.onerror = () => reject(request.error);
        });
    }

    // Get all pending purchases
    async getPendingPurchases() {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('synced');
            const request = index.getAll(false);

            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    // Mark purchase as synced
    async markAsSynced(purchaseId) {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const getRequest = store.get(purchaseId);

            getRequest.onsuccess = () => {
                const purchase = getRequest.result;
                if (purchase) {
                    purchase.synced = true;
                    const updateRequest = store.put(purchase);
                    updateRequest.onsuccess = () => resolve(purchase);
                    updateRequest.onerror = () => reject(updateRequest.error);
                } else {
                    resolve(null);
                }
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    // Delete synced purchase
    async deletePurchase(purchaseId) {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(purchaseId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Sync pending purchases (called when online)
    async syncPendingPurchases() {
        if (!navigator.onLine) {
            console.log('Offline - cannot sync purchases');
            return;
        }

        const pendingPurchases = await this.getPendingPurchases();
        console.log(`Syncing ${pendingPurchases.length} pending purchases...`);

        for (const purchase of pendingPurchases) {
            try {
                await this.syncPurchase(purchase);
            } catch (error) {
                console.error(`Failed to sync purchase ${purchase.id}:`, error);
            }
        }
    }

    // Sync a single purchase
    async syncPurchase(purchase) {
        try {
            // Simulate API call to server
            const response = await fetch('/api/purchases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(purchase)
            });

            if (response.ok) {
                await this.markAsSynced(purchase.id);
                console.log(`Purchase ${purchase.id} synced successfully`);
                
                // Notify the app
                if (window.app) {
                    window.app.showNotification(`Order #${purchase.id} synced successfully!`, 'success');
                    await window.app.loadPendingOrders();
                }
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            // If sync fails, it will be retried by background sync
            console.error(`Sync failed for purchase ${purchase.id}:`, error);
            throw error;
        }
    }
}

// Export singleton instance
export const purchaseManager = new PurchaseManager();
