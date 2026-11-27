/* LAYOUT — HEADER & FOOTER */

const NAV_LINKS = [
  { label: 'Home', to: '/', href: 'index.html' },
  { label: 'Shop', to: '/shop', href: 'shop.html' },
  { label: 'About Us', to: '/about', href: 'tentang-kami.html' },
  { label: 'Blog', to: '/blog', href: 'blog.html' },
  { label: 'Contact Us', to: '/contact', href: 'hubungi-kami.html' },
];

const BOTTOM_NAV = [
  { label: 'Beranda', to: '/', href: 'index.html', icon: 'House', end: true },
  { label: 'Belanja', to: '/shop', href: 'shop.html', icon: 'Store' },
  { label: 'Blog', to: '/blog', href: 'blog.html', icon: 'BookOpen' },
  { label: 'Keranjang', to: '/cart', href: 'keranjang.html', icon: 'ShoppingCart', cart: true },
  { label: 'Akun', to: '/account/transactions', href: 'riwayat-pesanan.html', icon: 'User' },
];

function isActivePath(current, to, end) {
  if (end || to === '/') return current === to;
  return current === to || current.startsWith(to + '/');
}

const Header = (() => {
  let drawerRoot = null;
  let query = '';

  const logo = (closeAttr = '') => `
    <a href="index.html" class="hd-logo" ${closeAttr} aria-label="AgriBibit beranda">
      <img src="./assets/logo.png" alt="" class="hd-logo__img" onerror="this.classList.add('is-hidden')" />
      <span class="hd-logo__text">Agri<span>Bibit</span></span>
    </a>`;

  /* NAVBAR */
  const headerHTML = () => `
    <!-- NAVBAR -->
    <header class="hd" id="site-header">
      <div class="hd__inner">
        ${logo()}
        <nav class="hd__nav" aria-label="Navigasi utama">
          ${NAV_LINKS.map((l) => `<a href="${l.href}" data-nav="${l.to}" class="hd__link">${l.label}</a>`).join('')}
        </nav>
        <div class="hd__actions">
          <form class="search-field hd__search" data-search role="search">
            ${icon('Search', { size: 18 })}
            <label for="hd-search" class="sr-only">Cari tanaman</label>
            <input id="hd-search" type="search" placeholder="Cari bibit..." />
          </form>
          <a href="keranjang.html" class="icon-btn icon-btn--ghost hd__cart" aria-label="Keranjang, 0 item">
            ${icon('ShoppingCart', { size: 20 })}
          </a>
          <span id="hd-auth-slot" style="display:inline-flex;align-items:center"></span>
          <button class="icon-btn icon-btn--ghost hd__menu" data-act="open-menu" aria-label="Buka menu">
            ${icon('Menu', { size: 22 })}
          </button>
        </div>
      </div>
    </header>`;

  /* BOTTOM NAV MOBILE */
  const bnavHTML = () => `
    <!-- BOTTOM NAV MOBILE -->
    <nav class="bnav" aria-label="Navigasi cepat">
      ${BOTTOM_NAV.map((b) => `
        <a href="${b.href}" data-nav="${b.to}" ${b.end ? 'data-end="1"' : ''} ${b.to === '/account/transactions' ? 'data-bnav-account="1"' : ''} class="bnav__item" aria-label="${b.label}">
          <span class="bnav__icon">${icon(b.icon, { size: 20 })}${b.cart ? '<span data-bnav-badge></span>' : ''}</span>
        </a>`).join('')}
    </nav>`;

  const drawerHTML = () => `
    <div class="hd-drawer__overlay" data-act="close-menu"></div>
    <aside class="hd-drawer" aria-label="Menu">
      <div class="hd-drawer__top">
        ${logo('data-act="close-menu"')}
        <button class="icon-btn icon-btn--ghost" data-act="close-menu" aria-label="Tutup menu">${icon('X', { size: 22 })}</button>
      </div>
      <form class="search-field" data-search role="search">
        ${icon('Search', { size: 18 })}
        <input type="search" placeholder="Cari bibit..." aria-label="Cari tanaman" value="${esc(query)}" />
      </form>
      <nav class="hd-drawer__nav">
        ${NAV_LINKS.map((l) => `<a href="${l.href}" data-nav="${l.to}" data-act="close-menu" class="hd-drawer__link">${l.label}</a>`).join('')}
        <hr style="border:0;border-top:1px solid var(--border);margin:8px 0" />
        ${AuthUser.isLoggedIn()
          ? `<a href="riwayat-pesanan.html" data-act="close-menu" class="hd-drawer__link">Akun Saya (${esc(AuthUser.get().name)})</a>
             <a href="index.html" data-act="logout-drawer" class="hd-drawer__link" style="color:var(--error)">Keluar dari Akun</a>`
          : `<a href="login.html" data-act="close-menu" class="hd-drawer__link">Masuk</a>
             <a href="register.html" data-act="close-menu" class="hd-drawer__link">Daftar Akun</a>`}
      </nav>
    </aside>`;

  function openMenu() {
    drawerRoot.innerHTML = drawerHTML();
    document.body.classList.add('no-scroll');
    updateActive();
  }
  function closeMenu() {
    drawerRoot.innerHTML = '';
    document.body.classList.remove('no-scroll');
  }

  function updateBadges() {
    const n = Cart.totalItems;
    const cartLink = document.querySelector('.hd__cart');
    if (cartLink) {
      cartLink.setAttribute('aria-label', `Keranjang, ${n} item`);
      let b = cartLink.querySelector('.hd__badge');
      if (n > 0) {
        if (!b) { b = document.createElement('span'); b.className = 'hd__badge'; cartLink.appendChild(b); }
        b.textContent = n;
      } else if (b) b.remove();
    }
    const slot = document.querySelector('[data-bnav-badge]');
    if (slot) slot.outerHTML = n > 0 ? `<span class="bnav__badge" data-bnav-badge>${n}</span>` : '<span data-bnav-badge></span>';
  }

  function updateAuthUI() {
    const slot = document.getElementById('hd-auth-slot');
    const loggedIn = AuthUser.isLoggedIn();
    const user = AuthUser.get();
    if (slot) {
      if (loggedIn) {
        slot.innerHTML = `
          <a href="riwayat-pesanan.html" class="icon-btn icon-btn--primary hd__avatar" aria-label="Akun saya (${esc(user.name)})" title="${esc(user.name)}">
            ${icon('User', { size: 18 })}
          </a>`;
      } else {
        slot.innerHTML = `<a href="login.html" class="btn btn-primary btn-sm hd__login-btn">Masuk</a>`;
      }
    }
    const bnavAccount = document.querySelector('.bnav__item[data-bnav-account]');
    if (bnavAccount) {
      const target = loggedIn ? '/account/transactions' : '/login';
      const targetFile = loggedIn ? 'riwayat-pesanan.html' : 'login.html';
      bnavAccount.setAttribute('href', targetFile);
      bnavAccount.dataset.nav = target;
      bnavAccount.setAttribute('aria-label', loggedIn ? 'Akun' : 'Masuk');
    }
  }

  function updateActive() {
    updateAuthUI();
    const current = Router.path();
    document.querySelectorAll('[data-nav]').forEach((a) => {
      const active = isActivePath(current, a.dataset.nav, a.dataset.end === '1');
      a.classList.toggle('is-active', active);
    });
  }

  function mount() {
    document.body.insertAdjacentHTML('afterbegin', headerHTML() + bnavHTML());
    drawerRoot = document.createElement('div');
    document.body.appendChild(drawerRoot);

    /* SCROLL TO TOP */
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.type = 'button';
    scrollTopBtn.id = 'scroll-top-btn';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Kembali ke atas');
    scrollTopBtn.setAttribute('title', 'Kembali ke atas');
    scrollTopBtn.innerHTML = icon('ArrowUp', { size: 20, sw: 2.3 });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(scrollTopBtn);

    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const hd = document.getElementById('site-header');
      if (hd) hd.classList.toggle('hd--scrolled', y > 10);
      scrollTopBtn.classList.toggle('is-visible', y > 280);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    document.addEventListener('click', (ev) => {
      const t = ev.target.closest('[data-act]');
      if (!t) return;
      if (t.dataset.act === 'open-menu') openMenu();
      else if (t.dataset.act === 'close-menu') closeMenu();
      else if (t.dataset.act === 'logout-drawer') {
        ev.preventDefault();
        AuthUser.clear();
        closeMenu();
        toast('Berhasil keluar dari akun');
        Router.go('/');
      }
    });

    AuthUser.subscribe(updateAuthUI);

    document.addEventListener('input', (ev) => {
      if (ev.target.matches('[data-search] input')) query = ev.target.value;
    });
    document.addEventListener('submit', (ev) => {
      if (!ev.target.matches('[data-search]')) return;
      ev.preventDefault();
      closeMenu();
      Router.go('/shop');
    });

    Cart.subscribe(updateBadges);
    updateBadges();
    updateActive();
  }

  return { mount, updateActive, closeMenu };
})();

/* FOOTER */
const Footer = (() => {
  const social = {
    Instagram: '<rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />',
    Facebook: '<path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15V3Z" />',
    YouTube: '<rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="m10 9 5 3-5 3V9Z" />',
    TikTok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 3c.5 2.8 2.4 4.6 5 5" />',
  };
  const socialSvg = (body) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

  const gallery = [
    { src: './assets/produk/monstera-variegata.png', alt: 'Monstera variegata dalam pot' },
    { src: './assets/produk/aglaonema-suksom.png', alt: 'Aglaonema suksom merah' },
    { src: './assets/produk/sansevieria.png', alt: 'Sansevieria lidah mertua' },
    { src: './assets/produk/anggrek-bulan.png', alt: 'Anggrek bulan putih' },
    { src: './assets/produk/philodendron-birkin.png', alt: 'Philodendron birkin' },
    { src: './assets/produk/kaktus.png', alt: 'Kaktus mini dalam pot' },
  ];

  const html = () => `
  <!-- FOOTER -->
  <footer class="ft">
    <div class="ft__inner">
      <div class="ft__brand">
        <a href="index.html" class="ft__logo">
          <img src="./assets/logo.png" alt="" onerror="this.classList.add('is-hidden')" />
          <span>Agri<span>Bibit</span></span>
        </a>
        <p class="ft__desc">Bibit tanaman bersertifikat dari nursery kami langsung ke rumah Anda, lengkap dengan packing aerasi dan pendampingan agronomis.</p>
        <ul class="ft__contact">
          <li>${icon('MapPin', { size: 16 })} Jl. Flora Hijau No. 12, Malang, Jawa Timur</li>
          <li>${icon('Phone', { size: 16 })} +62 812-3456-7890</li>
          <li>${icon('Mail', { size: 16 })} info@agribibit.id</li>
          <li>${icon('Clock', { size: 16 })} Senin – Sabtu, 08.00 – 17.00 WIB</li>
        </ul>
        <div class="ft__socials">
          ${Object.entries(social).map(([name, body]) => `<a href="#" class="icon-btn icon-btn--sm ft__social" aria-label="${name}">${socialSvg(body)}</a>`).join('')}
        </div>
      </div>

      <div class="ft__col">
        <h4 class="ft__title">Ikuti di Instagram</h4>
        <div class="ft__gallery">
          ${gallery.map((g) => `<a href="#" class="ft__shot" aria-label="${g.alt}"><img src="${g.src}" alt="${g.alt}" loading="lazy" /><span class="ft__shot-ov">${socialSvg(social.Instagram)}</span></a>`).join('')}
        </div>
        <a href="#" class="ft__ig-handle">@agribibit.id &rarr;</a>
      </div>

      <div class="ft__col">
        <h4 class="ft__title">Belanja</h4>
        <ul class="ft__list">
          <li><a href="shop.html">Bibit Buah</a></li>
          <li><a href="shop.html">Bibit Sayur</a></li>
          <li><a href="shop.html">Tanaman Hias</a></li>
          <li><a href="keranjang.html">Keranjang Belanja</a></li>
          <li><a href="riwayat-pesanan.html">Lacak Pesanan</a></li>
          <li><a href="login.html">Masuk / Daftar</a></li>
        </ul>
      </div>

      <div class="ft__col">
        <h4 class="ft__title">Informasi</h4>
        <ul class="ft__list">
          <li><a href="tentang-kami.html">Tentang Kami</a></li>
          <li><a href="blog.html">Blog &amp; Panduan</a></li>
          <li><a href="hubungi-kami.html">Hubungi Kami</a></li>
          <li><a href="tentang-kami.html">Garansi Tumbuh 14 Hari</a></li>
          <li><a href="hubungi-kami.html">Kebijakan Privasi</a></li>
        </ul>
      </div>
    </div>

    <div class="ft__bottom">
      <div class="ft__bottom-inner">
        <span>© 2026 AgriBibit (Bibit Nusantara). Seluruh hak cipta dilindungi.</span>
        <div class="ft__pay" aria-label="Metode pembayaran">
          ${['QRIS', 'BCA', 'Mandiri', 'BRI', 'BNI'].map((p) => `<span class="ft__pay-badge">${p}</span>`).join('')}
        </div>
      </div>
    </div>
  </footer>`;

  function mount() {
    document.getElementById('app').insertAdjacentHTML('afterend', html());
  }
  return { mount };
})();
