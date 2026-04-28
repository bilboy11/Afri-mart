# Offline-First E-Commerce PWA

A Progressive Web App (PWA) e-commerce store that works perfectly without an internet connection, featuring:

- **Service Workers** with Workbox for offline caching
- **Background Sync API** for handling purchases when offline
- **Push Notifications** for sales alerts even when the browser is closed
- **IndexedDB** for local data storage

## Features

### 🛒 Offline Shopping
- Browse products and add items to cart even when offline
- Purchase queue automatically syncs when connection is restored
- Visual connection status indicator

### 🔄 Background Sync
- Orders placed offline are queued in IndexedDB
- Automatic sync when internet connection is restored
- No data loss - all purchases are preserved

### 🔔 Push Notifications
- Enable push notifications to receive sale alerts
- Works even when the browser is closed
- Click notifications to open the store

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate VAPID Keys for Push Notifications

For push notifications to work, you need to generate VAPID keys:

1. Visit https://web-push-codelab.glitch.me/ or use the `web-push` npm package
2. Generate a key pair
3. Replace `REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY` in `notification-manager.js` with your public key

### 3. Start the Development Server

```bash
npm start
```

The app will be available at `http://localhost:8080`

### 4. Build Service Worker (Optional)

If you want to use Workbox's build process:

```bash
npm run build
```

## Testing Offline Functionality

1. Open the app in Chrome/Edge
2. Open DevTools (F12) → Application tab
3. Go to Service Workers and ensure it's registered
4. Go to Network tab → Check "Offline"
5. Try adding products to cart and purchasing
6. Uncheck "Offline" to see orders sync automatically

## Project Structure

```
E-commerce/
├── index.html              # Main HTML file
├── app.js                  # Main application logic
├── purchase-manager.js     # Handles offline purchases & Background Sync
├── notification-manager.js # Push notification management
├── sw.js                   # Service Worker with Workbox
├── styles.css              # Styling
├── manifest.json           # PWA manifest
├── workbox-config.js       # Workbox configuration
└── package.json            # Dependencies
```

## Key Technologies

- **Workbox**: Service worker library for caching strategies
- **Background Sync API**: Queues actions when offline
- **IndexedDB**: Client-side database for storing purchases
- **Push API**: Browser push notifications
- **Service Workers**: Enable offline functionality

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Limited (iOS 16.4+ for some features)

## Notes

- The `/api/purchases` endpoint is simulated. In production, replace with your actual API endpoint.
- Icon files referenced in `manifest.json` need to be created or the paths updated.
- For production, ensure HTTPS is enabled (required for service workers and push notifications).
