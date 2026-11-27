/* STORE — TOAST & CART */

/* TOAST */
const Toast = (() => {
  const DURATION = 3200;
  let items = [];
  let counter = 0;
  let stack = null;

  function mountStack() {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    stack.setAttribute('role', 'status');
    stack.setAttribute('aria-live', 'polite');
    stack.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-toast-close]');
      if (btn) dismiss(Number(btn.dataset.toastClose));
    });
    document.body.appendChild(stack);
  }

  function render() {
    if (!stack) return;
    stack.innerHTML = items.map((t) => `
      <div class="toast">
        <span class="toast__icon">${t.variant === 'error' ? icon('CircleAlert', { size: 18 }) : icon('Check', { size: 18, sw: 2.5 })}</span>
        <div class="toast__body">
          <div class="toast__title">${esc(t.title)}</div>
          ${t.text ? `<div class="toast__text">${esc(t.text)}</div>` : ''}
        </div>
        <button class="toast__close" data-toast-close="${t.id}" aria-label="Tutup notifikasi">${icon('X', { size: 16 })}</button>
      </div>`).join('');
  }

  function dismiss(id) {
    items = items.filter((t) => t.id !== id);
    render();
  }

  function show(title, text = '', variant = 'success') {
    const item = { id: ++counter, title, text, variant };
    items = [...items.slice(-2), item];
    render();
    setTimeout(() => dismiss(item.id), DURATION);
    return item.id;
  }

  return { mountStack, show };
})();

const toast = (title, text, variant) => Toast.show(title, text, variant);

/* CART */
const Cart = (() => {
  const CART_KEY = 'agribibit.cart';
  let items = [];
  let showModal = false;
  let lastAdded = null;
  const listeners = new Set();

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY));
      if (Array.isArray(saved)) items = saved;
    } catch (e) { items = []; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); }
    catch (e) {  }
  }
  loadCart();

  const emit = () => {
    saveCart();
    listeners.forEach((fn) => fn());
  };

  window.addEventListener('storage', (ev) => {
    if (ev.key === CART_KEY) {
      loadCart();
      listeners.forEach((fn) => fn());
    }
  });

  return {
    get items() { return items; },
    get showModal() { return showModal; },
    set showModal(v) { showModal = v; emit(); },
    get lastAdded() { return lastAdded; },
    get totalItems() { return items.reduce((s, i) => s + i.quantity, 0); },
    get subtotal() { return items.reduce((s, i) => s + i.product.price * i.quantity, 0); },

    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    add(product, quantity = 1, options = {}) {
      const key = `${product.id}-${options.size || ''}-${options.pot || ''}`;
      const existing = items.find((i) => i.key === key);
      if (existing) {
        items = items.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      } else {
        items = [...items, { key, product, quantity, options }];
      }
      lastAdded = { product, quantity, options };
      showModal = true;
      toast('Ditambahkan ke keranjang', `${quantity}× ${product.name}`);
      emit();
    },

    updateQuantity(key, quantity) {
      items = quantity <= 0
        ? items.filter((i) => i.key !== key)
        : items.map((i) => (i.key === key ? { ...i, quantity } : i));
      emit();
    },

    remove(key) { items = items.filter((i) => i.key !== key); emit(); },
    clear() { items = []; emit(); },
  };
})();

/* AUTHUSER */
const AuthUser = (() => {
  const KEY = 'agribibit.user';
  const ORDERS_KEY = 'agribibit.user.orders';
  const listeners = new Set();
  const emit = () => listeners.forEach((fn) => fn());

  return {
    get() {
      try { return JSON.parse(localStorage.getItem(KEY)); }
      catch (e) { return null; }
    },
    isLoggedIn() {
      return Boolean(this.get());
    },
    set(u) {
      try {
        localStorage.setItem(KEY, JSON.stringify(u));

        if (!localStorage.getItem(ORDERS_KEY)) {
          localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
        }
      } catch (e) {  }
      emit();
    },
    clear() {
      try {
        localStorage.removeItem(KEY);
        localStorage.removeItem(ORDERS_KEY);
      } catch (e) {  }
      emit();
    },
    getOrders() {
      try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }
      catch (e) { return []; }
    },
    addOrder(order) {
      try {
        const list = this.getOrders();
        list.unshift(order);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
      } catch (e) {  }
      emit();
    },
    saveOrders(list) {
      try {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
      } catch (e) {  }
      emit();
    },
    getAddress() {
      try { return JSON.parse(localStorage.getItem('agribibit.user.address')); }
      catch (e) { return null; }
    },
    setAddress(addr) {
      try { localStorage.setItem('agribibit.user.address', JSON.stringify(addr)); }
      catch (e) {  }
      emit();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
})();

/* PRODUCTREVIEWS */
const ProductReviews = (() => {
  const KEY = 'agribibit.reviews';
  const BASE_COUNTS = new Map();
  const BASE_RATINGS = new Map();

  if (typeof products !== 'undefined' && Array.isArray(products)) {
    products.forEach((p) => {
      BASE_COUNTS.set(p.sku, Number(p.reviews) || 20);
      BASE_RATINGS.set(p.sku, Number(p.rating) || 4.8);
    });
  }
  const INITIAL_TESTIMONIALS = (typeof testimonials !== 'undefined' && Array.isArray(testimonials))
    ? [...testimonials]
    : [];

  function loadAll() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(saved) ? saved : [];
    } catch (e) {
      return [];
    }
  }

  function saveAll(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  function syncIntoCatalog() {
    const all = loadAll();
    if (typeof products !== 'undefined' && Array.isArray(products)) {
      products.forEach((p) => {
        if (!BASE_COUNTS.has(p.sku)) {
          BASE_COUNTS.set(p.sku, Number(p.reviews) || 20);
          BASE_RATINGS.set(p.sku, Number(p.rating) || 4.8);
        }
        const mine = all.filter((r) => r.sku === p.sku || r.productName === p.name);
        const baseCount = BASE_COUNTS.get(p.sku);
        const baseRating = BASE_RATINGS.get(p.sku);
        if (mine.length > 0) {
          const sumUser = mine.reduce((s, r) => s + (Number(r.rating) || 5), 0);
          const totalCount = baseCount + mine.length;
          const weighted = ((baseRating * baseCount) + sumUser) / totalCount;
          p.reviews = totalCount;
          p.rating = Math.round(weighted * 10) / 10;
        } else {
          p.reviews = baseCount;
          p.rating = baseRating;
        }
      });
    }

    if (typeof testimonials !== 'undefined' && Array.isArray(testimonials)) {
      const topUser = all.filter((r) => Number(r.rating) >= 4).map((r) => ({
        id: r.id,
        name: r.name,
        avatar: r.avatar,
        verified: true,
        rating: r.rating,
        variant: r.variant || `Pembelian ${r.productName}`,
        text: r.text,
        image: r.image || r.productImage || '',
        date: r.date,
        tags: r.tags || [],
        isUserReview: true,
      }));
      testimonials.length = 0;
      [...topUser, ...INITIAL_TESTIMONIALS].forEach((t) => testimonials.push(t));
    }
  }

  syncIntoCatalog();

  window.addEventListener('storage', (ev) => {
    if (ev.key === KEY) syncIntoCatalog();
  });

  return {
    getAll: loadAll,
    getByOrder(cleanOrderId) {
      const cid = String(cleanOrderId || '').replace(/^#/, '');
      return loadAll().filter((r) => String(r.orderId || '').replace(/^#/, '') === cid);
    },
    hasReviewedOrder(cleanOrderId) {
      return this.getByOrder(cleanOrderId).length > 0;
    },
    getForProduct(product) {
      if (!product) return [...INITIAL_TESTIMONIALS];
      const all = loadAll();
      const matching = all
        .filter((r) => (product.sku && r.sku === product.sku) || r.productName === product.name)
        .map((r) => ({ ...r, isUserReview: true }));
      return [...matching, ...INITIAL_TESTIMONIALS];
    },
    addBatch(entries) {
      const current = loadAll();
      const updated = [...entries, ...current];
      const ok = saveAll(updated);
      syncIntoCatalog();
      return ok;
    },
    syncIntoCatalog,
  };
})();

/* FOTO HERO */
const DEFAULT_HERO_IMG = './assets/images/hero-plant.jpg';
function getHeroImage() {
  try {
    localStorage.removeItem('agribibit.heroMode');
    return localStorage.getItem('agribibit.heroImg') || DEFAULT_HERO_IMG;
  } catch (err) {
    return DEFAULT_HERO_IMG;
  }
}
