import { purchaseManager } from './purchase-manager.js';
import { notificationManager } from './notification-manager.js';
import { getProductsPaginated, getCategories } from './products-data.js';

let cart = [];
let pendingOrders = [];
let currentPage = 1;
let itemsPerPage = 12;
let checkoutDetails = null;
let draftOrder = null;
let ordersHistory = [];
let currentFilters = {
    category: 'All',
    search: '',
    sort: '',
    minPrice: '',
    maxPrice: ''
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

function loadOrdersHistory() {
    try {
        const raw = localStorage.getItem('ordersHistory');
        const parsed = raw ? JSON.parse(raw) : [];
        ordersHistory = Array.isArray(parsed) ? parsed : [];
    } catch {
        ordersHistory = [];
    }
}

function saveOrdersHistory() {
    localStorage.setItem('ordersHistory', JSON.stringify(ordersHistory));
}

function upsertOrderHistory(order) {
    const idx = ordersHistory.findIndex(o => o.id === order.id);
    if (idx >= 0) {
        ordersHistory[idx] = order;
    } else {
        ordersHistory.unshift(order);
    }
    saveOrdersHistory();
}

function getTrackingState(order) {
    const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
    const ts = new Date(order.timestamp || Date.now()).getTime();
    const hours = Math.max(0, (Date.now() - ts) / (1000 * 60 * 60));

    // Simple time-based simulation; offline/pending orders stay early.
    let stepIndex = 0;
    if (order.status === 'pending') stepIndex = 0;
    else if (hours < 2) stepIndex = 1;
    else if (hours < 24) stepIndex = 2;
    else stepIndex = 3;

    return { steps, stepIndex };
}

function setActiveNav(page) {
    const ids = ['navStore', 'navCart', 'navOrders'];
    ids.forEach(id => document.getElementById(id)?.classList.remove('active'));
    if (page === 'orders') document.getElementById('navOrders')?.classList.add('active');
    else if (page === 'cart') document.getElementById('navCart')?.classList.add('active');
    else document.getElementById('navStore')?.classList.add('active');
}

function setPage(page) {
    const productsSection = document.getElementById('productsSection');
    const cartSection = document.getElementById('cartSection');
    const ordersHistorySection = document.getElementById('ordersHistorySection');
    const checkoutSection = document.getElementById('checkoutSection');
    const paymentSection = document.getElementById('paymentSection');
    const ordersSection = document.querySelector('.orders-section');

    const show = (el) => el && el.classList.remove('hidden');
    const hide = (el) => el && el.classList.add('hidden');

    switch (page) {
        case 'orders':
            hide(productsSection);
            hide(cartSection);
            hide(checkoutSection);
            hide(paymentSection);
            show(ordersHistorySection);
            show(ordersSection);
            setActiveNav('orders');
            renderOrdersHistory();
            break;
        case 'cart':
            hide(productsSection);
            show(cartSection);
            hide(checkoutSection);
            hide(paymentSection);
            hide(ordersHistorySection);
            show(ordersSection);
            setActiveNav('cart');
            break;
        case 'checkout':
            hide(productsSection);
            hide(cartSection);
            hide(paymentSection);
            hide(ordersHistorySection);
            show(checkoutSection);
            show(ordersSection);
            setActiveNav('store');
            break;
        case 'payment':
            hide(productsSection);
            hide(cartSection);
            hide(checkoutSection);
            hide(ordersHistorySection);
            show(paymentSection);
            show(ordersSection);
            setActiveNav('store');
            break;
        default:
            show(productsSection);
            show(cartSection);
            hide(checkoutSection);
            hide(paymentSection);
            hide(ordersHistorySection);
            show(ordersSection);
            setActiveNav('store');
            break;
    }
}

function buildOrderFromCart() {
    return {
        id: Date.now(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price, 0),
        timestamp: new Date().toISOString()
    };
}

function renderOrderSummary(order) {
    const el = document.getElementById('orderSummary');
    if (!el || !order) return;

    el.innerHTML = `
        <div><strong>Order summary</strong></div>
        <div>${order.items.length} item(s) • <strong>${formatCurrency(order.total)}</strong></div>
        ${order.customer?.fullName ? `<div>Customer: ${order.customer.fullName}</div>` : ''}
        ${order.shipping?.address ? `<div>Deliver to: ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state}</div>` : ''}
    `;
}

function renderPaymentDetails(method) {
    const container = document.getElementById('paymentDetails');
    const payNowBtn = document.getElementById('payNowBtn');
    if (!container) return;

    const field = (id, label, type = 'text', placeholder = '', full = false) => `
        <div class="form-field ${full ? 'form-field-full' : ''}">
            <label for="${id}">${label}</label>
            <input id="${id}" name="${id}" type="${type}" placeholder="${placeholder}" ${method === 'card' ? 'required' : ''} />
        </div>
    `;

    if (method === 'card') {
        container.innerHTML = `
            ${field('cardName', 'Name on card', 'text', 'e.g. Chinedu Okafor', true)}
            ${field('cardNumber', 'Card number', 'text', '1234 5678 9012 3456', true)}
            ${field('cardExp', 'Expiry (MM/YY)', 'text', 'MM/YY')}
            ${field('cardCvv', 'CVV', 'password', '***')}
        `;
        if (payNowBtn) payNowBtn.textContent = 'Pay Now';
        return;
    }

    if (method === 'transfer') {
        container.innerHTML = `
            <div class="form-field form-field-full">
                <label>Bank transfer details</label>
                <div class="order-summary">
                    Transfer <strong>${draftOrder ? formatCurrency(draftOrder.total) : ''}</strong> to:<br/>
                    <strong>JR Store</strong><br/>
                    Bank: <strong>Demo Bank</strong><br/>
                    Account No: <strong>1234567890</strong><br/>
                    Narration: <strong>ORDER-${draftOrder?.id || ''}</strong>
                </div>
            </div>
        `;
        if (payNowBtn) payNowBtn.textContent = 'I have transferred';
        return;
    }

    if (method === 'ussd') {
        container.innerHTML = `
            <div class="form-field form-field-full">
                <label>USSD</label>
                <div class="order-summary">
                    Dial: <strong>*123*000*${draftOrder?.id || ''}#</strong><br/>
                    Amount: <strong>${draftOrder ? formatCurrency(draftOrder.total) : ''}</strong>
                </div>
            </div>
        `;
        if (payNowBtn) payNowBtn.textContent = 'I have paid';
        return;
    }

    // Pay on delivery
    container.innerHTML = `
        <div class="form-field form-field-full">
            <label>Pay on delivery</label>
            <div class="order-summary">
                You will pay <strong>${draftOrder ? formatCurrency(draftOrder.total) : ''}</strong> when your order arrives.
            </div>
        </div>
    `;
    if (payNowBtn) payNowBtn.textContent = 'Place Order';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadOrdersHistory();
    initializeServiceWorker();
    initializeFilters();
    renderProducts();
    updateConnectionStatus();
    setupEventListeners();
    loadPendingOrders();
    setPage('store');
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection status periodically
    setInterval(updateConnectionStatus, 1000);
});

// Initialize Service Worker
async function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered', registration);

            // If a new SW is waiting to activate, prompt the user.
            if (registration.waiting) {
                showNotification('New version available! Please refresh.', 'success');
            }

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            showNotification('New version available! Please refresh.', 'success');
                        } else {
                            console.log('Service Worker installed');
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}

// Initialize filters
function initializeFilters() {
    const categories = getCategories();
    const categoryFilter = document.getElementById('categoryFilter');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Render products on the page
function renderProducts() {
    const result = getProductsPaginated(currentPage, itemsPerPage, currentFilters);
    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');
    
    // Update count
    productsCount.textContent = `Showing ${result.products.length} of ${result.total} products`;
    
    if (result.products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <p>No products found. Try adjusting your filters.</p>
            </div>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    productsGrid.innerHTML = result.products.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%236676ea%22 width=%22400%22 height=%22400%22/%3E%3Ctext fill=%22%23fff%22 font-family=%22Arial%22 font-size=%2240%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${product.name.charAt(0)}%3C/text%3E%3C/svg%3E'">
                ${product.rating ? `<div class="product-rating">⭐ ${product.rating}</div>` : ''}
            </div>
            <div class="product-title">${product.name}</div>
            <div class="product-category">${product.category}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <button class="btn-buy" data-product-id="${product.id}">
                Add to Cart
            </button>
        </div>
    `).join('');
    
    // Add event listeners to buy buttons
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.addEventListener('click', handleBuyClick);
    });
    
    // Render pagination
    renderPagination(result);
}

// Render pagination
function renderPagination(result) {
    const pagination = document.getElementById('pagination');
    
    if (result.totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination-controls">';
    
    // Previous button
    if (result.page > 1) {
        paginationHTML += `<button class="pagination-btn" data-page="${result.page - 1}">← Previous</button>`;
    }
    
    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, result.page - Math.floor(maxVisible / 2));
    let endPage = Math.min(result.totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="pagination-btn ${i === result.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    if (endPage < result.totalPages) {
        if (endPage < result.totalPages - 1) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" data-page="${result.totalPages}">${result.totalPages}</button>`;
    }
    
    // Next button
    if (result.page < result.totalPages) {
        paginationHTML += `<button class="pagination-btn" data-page="${result.page + 1}">Next →</button>`;
    }
    
    paginationHTML += '</div>';
    pagination.innerHTML = paginationHTML;
    
    // Add event listeners
    pagination.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentPage = parseInt(e.target.dataset.page);
            renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Handle buy button click
async function handleBuyClick(event) {
    const productId = parseInt(event.target.dataset.productId);
    const { products } = getProductsPaginated(1, 1000, {}); // Get all products
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Add to cart
    cart.push(product);
    updateCart();
    showNotification(`${product.name} added to cart!`, 'success');
    
    // If offline, the purchase will be queued via Background Sync
    if (navigator.onLine) {
        console.log('Processing purchase online:', product);
    } else {
        await purchaseManager.queuePurchase(product);
        showNotification('Purchase queued! Will sync when online.', 'success');
    }
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = formatCurrency(0);
        return;
    }
    
    const cartMap = new Map();
    cart.forEach(item => {
        const count = cartMap.get(item.id) || 0;
        cartMap.set(item.id, count + 1);
    });
    
    cartItems.innerHTML = Array.from(cartMap.entries()).map(([id, count]) => {
        const { products } = getProductsPaginated(1, 1000, {});
        const product = products.find(p => p.id === id);
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">${product.name}</span>
                    <span class="cart-item-quantity">x${count}</span>
                </div>
                <span class="cart-item-price">${formatCurrency(product.price * count)}</span>
            </div>
        `;
    }).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = formatCurrency(total);
}

// Process order (simulate API call)
async function processOrder(order) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.1) {
                resolve(order);
            } else {
                reject(new Error('Order processing failed'));
            }
        }, 1000);
    });
}

// Update connection status
function updateConnectionStatus() {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    if (navigator.onLine) {
        statusIndicator.className = 'status-indicator online';
        statusText.textContent = 'Online';
    } else {
        statusIndicator.className = 'status-indicator offline';
        statusText.textContent = 'Offline';
    }
}

// Handle online event
function handleOnline() {
    updateConnectionStatus();
    showNotification('Connection restored! Syncing orders...', 'success');
    purchaseManager.syncPendingPurchases();
}

// Handle offline event
function handleOffline() {
    updateConnectionStatus();
    showNotification('You are offline. Orders will sync when connection is restored.', 'error');
}

// Load pending orders from IndexedDB
async function loadPendingOrders() {
    pendingOrders = await purchaseManager.getPendingPurchases();
    updatePendingOrders();
}

// Update pending orders display
function updatePendingOrders() {
    const pendingOrdersDiv = document.getElementById('pendingOrders');
    
    if (pendingOrders.length === 0) {
        pendingOrdersDiv.innerHTML = '<p class="empty-orders">No pending orders</p>';
        return;
    }
    
    pendingOrdersDiv.innerHTML = pendingOrders.map(order => `
        <div class="pending-order">
            <div class="pending-order-info">
                <div class="pending-order-title">Order #${order.id}</div>
                <div class="pending-order-details">
                    ${order.items?.length || 0} items • ${formatCurrency(order.total || order.price || 0)} • 
                    ${new Date(order.timestamp || Date.now()).toLocaleString()}
                </div>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Enable notifications button
    document.getElementById('enableNotifications')?.addEventListener('click', () => {
        notificationManager.requestPermission();
    });
    
    // Search input
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentFilters.search = e.target.value;
            currentPage = 1;
            renderProducts();
        }, 300);
    });
    
    // Category filter
    document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        currentPage = 1;
        renderProducts();
    });
    
    // Sort filter
    document.getElementById('sortFilter')?.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        currentPage = 1;
        renderProducts();
    });
    
    // Price filters
    document.getElementById('minPrice')?.addEventListener('input', (e) => {
        currentFilters.minPrice = e.target.value ? parseFloat(e.target.value) : '';
        currentPage = 1;
        renderProducts();
    });
    
    document.getElementById('maxPrice')?.addEventListener('input', (e) => {
        currentFilters.maxPrice = e.target.value ? parseFloat(e.target.value) : '';
        currentPage = 1;
        renderProducts();
    });

    // Top nav
    document.getElementById('navStore')?.addEventListener('click', () => {
        setPage('store');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('navCart')?.addEventListener('click', () => {
        setPage('cart');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('navOrders')?.addEventListener('click', () => {
        setPage('orders');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Checkout navigation
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        draftOrder = buildOrderFromCart();
        checkoutDetails = null;
        setPage('checkout');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('backToCartBtn')?.addEventListener('click', () => {
        setPage('cart');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!draftOrder) {
            showNotification('Your cart is empty!', 'error');
            setPage('store');
            return;
        }

        const fullName = document.getElementById('fullName')?.value?.trim();
        const phone = document.getElementById('phone')?.value?.trim();
        const email = document.getElementById('email')?.value?.trim();
        const address = document.getElementById('address')?.value?.trim();
        const city = document.getElementById('city')?.value?.trim();
        const state = document.getElementById('state')?.value?.trim();

        if (!fullName || !phone || !address || !city || !state) {
            showNotification('Please fill in your delivery details.', 'error');
            return;
        }

        checkoutDetails = {
            customer: { fullName, phone, email: email || '' },
            shipping: { address, city, state }
        };

        draftOrder = {
            ...draftOrder,
            ...checkoutDetails
        };

        renderOrderSummary(draftOrder);
        setPage('payment');

        const currentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'card';
        renderPaymentDetails(currentMethod);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('backToCheckoutBtn')?.addEventListener('click', () => {
        setPage('checkout');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
            renderPaymentDetails(e.target.value);
        });
    });

    document.getElementById('paymentForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!draftOrder || draftOrder.items?.length === 0) {
            showNotification('Your cart is empty!', 'error');
            setPage('store');
            return;
        }

        const method = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'card';

        let paymentMeta = {};
        if (method === 'card') {
            const cardName = document.getElementById('cardName')?.value?.trim();
            const cardNumberRaw = document.getElementById('cardNumber')?.value?.trim() || '';
            const cardNumber = cardNumberRaw.replace(/\s+/g, '');
            const cardExp = document.getElementById('cardExp')?.value?.trim();
            const cardCvv = document.getElementById('cardCvv')?.value?.trim();

            if (!cardName || cardNumber.length < 12 || !cardExp || !cardCvv) {
                showNotification('Please enter valid card details.', 'error');
                return;
            }

            paymentMeta = {
                cardLast4: cardNumber.slice(-4),
                cardExp
            };
        } else if (method === 'transfer') {
            paymentMeta = { reference: `ORDER-${draftOrder.id}` };
        } else if (method === 'ussd') {
            paymentMeta = { ussdCode: `*123*000*${draftOrder.id}#` };
        } else {
            paymentMeta = {};
        }

        const paymentStatus = method === 'card' ? 'paid' : 'pending';
        const order = {
            ...draftOrder,
            payment: {
                method,
                status: paymentStatus,
                meta: paymentMeta
            }
        };

        try {
            if (navigator.onLine) {
                await processOrder(order);
                upsertOrderHistory({ ...order, status: 'confirmed' });
                showNotification('Order placed successfully!', 'success');
            } else {
                await purchaseManager.queuePurchase(order);
                pendingOrders.push(order);
                updatePendingOrders();
                upsertOrderHistory({ ...order, status: 'pending' });
                showNotification('Order queued! Will sync when online.', 'success');
            }
        } catch (error) {
            await purchaseManager.queuePurchase(order);
            upsertOrderHistory({ ...order, status: 'pending' });
            showNotification('Order queued for sync!', 'success');
        }

        cart = [];
        draftOrder = null;
        checkoutDetails = null;
        updateCart();

        document.getElementById('checkoutForm')?.reset();
        document.getElementById('paymentForm')?.reset();

        // Reset payment details UI after form reset (radio defaults to first option in markup)
        renderPaymentDetails('card');

        setPage('store');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function renderOrdersHistory() {
    const list = document.getElementById('ordersList');
    if (!list) return;

    if (!ordersHistory.length) {
        list.innerHTML = `<div class="order-card"><strong>No orders yet.</strong><div class="order-meta">Place an order to see it here.</div></div>`;
        return;
    }

    list.innerHTML = ordersHistory.map((order) => {
        const status = order.status || 'pending';
        const trackingId = order.trackingId || `JR-${String(order.id).slice(-6)}`;
        const { steps, stepIndex } = getTrackingState(order);
        const pillClass = status === 'pending' ? 'pending' : (stepIndex >= 3 ? 'delivered' : '');

        return `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-card-header">
                    <div>
                        <div><strong>Order #${order.id}</strong> <span class="order-pill ${pillClass}">${status === 'pending' ? 'Pending sync' : (stepIndex >= 3 ? 'Delivered' : steps[stepIndex])}</span></div>
                        <div class="order-meta">${new Date(order.timestamp || Date.now()).toLocaleString()} • ${order.items?.length || 0} item(s) • <strong>${formatCurrency(order.total || 0)}</strong></div>
                        <div class="order-meta">Tracking ID: <strong>${trackingId}</strong></div>
                    </div>
                    <div class="order-actions">
                        <button class="btn-secondary" type="button" data-action="toggle-details">Track</button>
                    </div>
                </div>
                <div class="order-details hidden">
                    <div><strong>Delivery</strong></div>
                    <div class="order-meta">${order.shipping?.address ? `${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state}` : '—'}</div>
                    <div class="tracking-steps">
                        ${steps.map((s, i) => `<div class="tracking-step ${i <= stepIndex ? 'active' : ''}">${s}</div>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    list.querySelectorAll('[data-action="toggle-details"]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.order-card');
            const details = card?.querySelector('.order-details');
            if (!details) return;
            details.classList.toggle('hidden');
        });
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Export for use in service worker
if (typeof window !== 'undefined') {
    window.app = {
        showNotification,
        updatePendingOrders,
        loadPendingOrders
    };
}
