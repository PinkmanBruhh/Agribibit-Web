/* ROUTER — MULTI-PAGE HTML ROUTER */

const Pages = {};

const Router = (() => {
  const PAGE_TO_FILE = {
    home: 'index.html',
    shop: 'shop.html',
    productDetail: 'detail-produk.html',
    cart: 'keranjang.html',
    checkout: 'checkout.html',
    transactionSuccess: 'transaksi-berhasil.html',
    transactionHistory: 'riwayat-pesanan.html',
    about: 'tentang-kami.html',
    blog: 'blog.html',
    contact: 'hubungi-kami.html',
    login: 'login.html',
    register: 'register.html',
    registerSuccess: 'berhasil-daftar.html',
  };

  const ROUTE_MAP = [
    { re: /^\/$/, page: 'home', file: 'index.html' },
    { re: /^\/shop$/, page: 'shop', file: 'shop.html' },
    { re: /^\/product\/([^/?]+)$/, page: 'productDetail', file: 'detail-produk.html', paramKey: 'id' },
    { re: /^\/cart$/, page: 'cart', file: 'keranjang.html' },
    { re: /^\/checkout$/, page: 'checkout', file: 'checkout.html' },
    { re: /^\/transaction-success$/, page: 'transactionSuccess', file: 'transaksi-berhasil.html' },
    { re: /^\/account\/transactions$/, page: 'transactionHistory', file: 'riwayat-pesanan.html' },
    { re: /^\/about$/, page: 'about', file: 'tentang-kami.html' },
    { re: /^\/blog$/, page: 'blog', file: 'blog.html' },
    { re: /^\/contact$/, page: 'contact', file: 'hubungi-kami.html' },
    { re: /^\/login$/, page: 'login', file: 'login.html' },
    { re: /^\/register$/, page: 'register', file: 'register.html' },
    { re: /^\/register-success(?:\?(.*))?$/, page: 'registerSuccess', file: 'berhasil-daftar.html' },
  ];

  const PAGE_TO_PATH = {
    home: '/',
    shop: '/shop',
    productDetail: '/product',
    cart: '/cart',
    checkout: '/checkout',
    transactionSuccess: '/transaction-success',
    transactionHistory: '/account/transactions',
    about: '/about',
    blog: '/blog',
    contact: '/contact',
    login: '/login',
    register: '/register',
    registerSuccess: '/register-success',
  };

  let cleanup = null;
  const listeners = new Set();

  function activePageName() {
    const dp = document.body && document.body.dataset && document.body.dataset.page;
    if (dp && Pages[dp]) return dp;

    const rawHash = location.hash.replace(/^#/, '');
    if (rawHash.startsWith('/')) {
      for (const r of ROUTE_MAP) {
        if (r.re.test(rawHash)) return r.page;
      }
    }
    return 'home';
  }

  function path() {
    const pg = activePageName();
    if (pg === 'productDetail') {
      const id = new URLSearchParams(location.search).get('id') || '1';
      return '/product/' + id;
    }
    return PAGE_TO_PATH[pg] || '/';
  }

  function toHref(to) {
    if (!to) return 'index.html';
    if (to.endsWith('.html') || to.includes('.html?')) return to;
    const clean = to.replace(/^#/, '');
    const [pathname, query] = clean.split('?');
    for (const r of ROUTE_MAP) {
      const m = pathname.match(r.re);
      if (m) {
        if (r.paramKey) {
          return `${r.file}?${r.paramKey}=${encodeURIComponent(m[1])}${query ? '&' + query : ''}`;
        }
        return query ? `${r.file}?${query}` : r.file;
      }
    }
    return 'index.html';
  }

  function go(to) {
    const targetHref = toHref(to);
    const currentFile = location.pathname.split('/').pop() || 'index.html';
    const currentFull = currentFile + location.search;
    if (targetHref === currentFull || (targetHref === currentFile && !location.search)) {
      render();
    } else {
      location.href = targetHref;
    }
  }

  function render() {
    const app = document.getElementById('app');
    if (!app) return;

    if (location.hash.startsWith('#/')) {
      const target = toHref(location.hash.slice(1));
      location.replace(target);
      return;
    }

    const pageName = activePageName();
    const renderFn = Pages[pageName] || Pages.home;
    if (!renderFn) return;

    const searchParams = new URLSearchParams(location.search);
    const params = {};
    searchParams.forEach((v, k) => { params[k] = v; });

    if (typeof cleanup === 'function') cleanup();
    cleanup = null;

    const view = document.createElement('div');
    view.className = 'view';
    app.replaceChildren(view);
    cleanup = renderFn(view, params);

    window.scrollTo(0, 0);
    if (typeof Reveal !== 'undefined') Reveal.scan(view);
    listeners.forEach((fn) => fn(path()));
  }

  const onChange = (fn) => listeners.add(fn);
  const start = () => {
    window.addEventListener('hashchange', () => {
      if (location.hash.startsWith('#/')) {
        location.href = toHref(location.hash.slice(1));
      }
    });
    render();
  };

  return { path, go, toHref, start, onChange };
})();
