class NotificationManager {
  constructor() {
    this.subscription = null;
    this.vapidPublicKey = 'REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY'; // Generate at https://web-push-codelab.glitch.me/
    this.init();
  }
  async init() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        this.subscription = await registration.pushManager.getSubscription();
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    }
  }
  async requestPermission() {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return false;
    }
    if (Notification.permission === 'granted') {
      await this.subscribe();
      return true;
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await this.subscribe();
        return true;
      }
    }
    alert('Notification permission denied');
    return false;
  }
  async subscribe() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push notifications are not supported in this browser');
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      const applicationServerKey = this.urlBase64ToUint8Array(this.vapidPublicKey);
      this.subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });
      console.log('Push subscription:', this.subscription);
      if (window.app) {
        window.app.showNotification('Push notifications enabled!', 'success');
      }
    } catch (error) {
      console.error('Error subscribing to push:', error);
      alert('Failed to enable push notifications');
    }
  }
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
export const notificationManager = new NotificationManager();

