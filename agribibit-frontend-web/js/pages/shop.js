/* SHOP */
Pages.shop = function (view) {
  const ITEMS_PER_PAGE = 9;
  const PRICE_MIN = 4000;
  const PRICE_MAX = 150000;
  const CAT_MAP = { sayur: 'Bibit Sayur', buah: 'Bibit Buah', hias: 'Tanaman Hias' };

  /* STATE FILTER */
  const draft = {
    category: 'all', stock: [], priceMin: PRICE_MIN, priceMax: PRICE_MAX,
    discountOnly: false, guarantee: false, certified: false,
  };
  /* FILTER YANG SUDAH DITERAPKAN */
  let applied = { ...draft, stock: [] };

  let viewMode = 'grid';
  let sortBy = 'popular';
  let currentPage = 1;
  let mobileFilterOpen = false;

  function getFiltered() {
    let result = [...products];
    const f = applied;
    if (f.category !== 'all' && CAT_MAP[f.category]) result = result.filter((p) => p.category === CAT_MAP[f.category]);
    if (f.stock.length > 0) {
      result = result.filter((p) => {
        if (f.stock.includes('available') && p.stock > 20) return true;
        if (f.stock.includes('low') && p.stock > 0 && p.stock <= 20) return true;
        if (f.stock.includes('out') && p.stock === 0) return true;
        return false;
      });
    }
    result = result.filter((p) => p.price >= f.priceMin && p.price <= f.priceMax);
    if (f.discountOnly) result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
    switch (sortBy) {
      case 'popular': result.sort((a, b) => b.reviews - a.reviews); break;
      case 'newest': result.sort((a, b) => b.id - a.id); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }

  /* TEMPLATE STATIS */
  view.innerHTML = `
  <div class="shop-page">
    <div class="container">
      <nav class="shop-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" class="shop-breadcrumb__link">Home</a>
        <span class="shop-breadcrumb__sep">/</span>
        <a href="shop.html" class="shop-breadcrumb__link">Shop</a>
        <span class="shop-breadcrumb__sep">/</span>
        <span class="shop-breadcrumb__current">Bibit &amp; Tanaman Hidup</span>
      </nav>

      <section class="shop-hero reveal">
        ${LeafDecor('shop-hero__leaf')}
        <div class="shop-hero__content">
          <span class="eyebrow">${icon('Leaf', { size: 14 })} Katalog Resmi Nursery</span>
          <h1 class="shop-hero__title">Koleksi Lengkap Bibit &amp; Tanaman Hijau</h1>
          <p class="shop-hero__desc">Temukan berbagai pilihan bibit tanaman berkualitas tinggi langsung dari kebun pembibitan kami. Setiap bibit melalui seleksi ketat untuk memastikan pertumbuhan optimal.</p>
          <div class="shop-hero__badges">
            <span class="chip chip--soft">${icon('ShieldCheck', { size: 14 })} Garansi Tumbuh 14 Hari</span>
            <span class="chip chip--soft">${icon('Package', { size: 14 })} Packing Aerasi Anti Layu</span>
          </div>
        </div>
        <div class="shop-hero__media">
          <img src="./assets/images/hero-plant.jpg" alt="Koleksi tanaman hijau AgriBibit dalam pot keramik" loading="lazy" />
        </div>
      </section>

      <div class="shop-layout">
        <div class="shop-sidebar-wrap" id="shop-sidebar-wrap"></div>

        <div class="shop-main">
          <div class="shop-mobile-bar">
            <button type="button" class="btn btn-primary btn-sm" data-act="open-filter">
              ${icon('SlidersHorizontal', { size: 15 })} Filter Bibit
            </button>
          </div>
          <div id="shop-results"></div>
        </div>
      </div>

      <section class="shop-guarantee reveal">
        <div>
          <div class="shop-guarantee__eyebrow">${icon('ShieldCheck', { size: 16 })} Jaminan AgriBibit</div>
          <h2 class="shop-guarantee__title">Setiap Bibit Dilindungi Garansi Tumbuh Segar 14 Hari</h2>
        </div>
        <div class="shop-guarantee__actions">
          <a href="tentang-kami.html" class="btn btn-accent">Pelajari Syarat Garansi ${icon('ArrowRight', { size: 16 })}</a>
          <a href="hubungi-kami.html" class="btn btn-secondary">${icon('MessageCircle', { size: 16 })} Hubungi Kami</a>
        </div>
      </section>
    </div>
  </div>`;

  const sidebarWrap = view.querySelector('#shop-sidebar-wrap');
  const results = view.querySelector('#shop-results');

  /* SIDEBAR */
  const checkbox = ({ checked, label, count, pill, pillVariant, act, val }) => `
    <button type="button" class="shop-check" data-act="${act}" data-val="${val ?? ''}" aria-pressed="${checked}">
      <span class="shop-check__box${checked ? ' is-checked' : ''}">${checked ? icon('Check', { size: 12, sw: 3 }) : ''}</span>
      <span>${label}</span>
      ${pill ? `<span class="shop-check__pill shop-check__pill--${pillVariant}">${pill}</span>` : ''}
      ${count !== undefined ? `<span class="shop-check__count">(${count})</span>` : ''}
    </button>`;

  function drawSidebar() {
    sidebarWrap.classList.toggle('is-open', mobileFilterOpen);
    sidebarWrap.innerHTML = `
    <aside class="shop-sidebar" aria-label="Filter produk">
      <div class="shop-sidebar__head">
        <div class="shop-sidebar__title">${icon('SlidersHorizontal', { size: 16 })} Filter Bibit</div>
        <div class="shop-views">
          <button type="button" class="shop-sidebar__reset" data-act="reset">Reset</button>
          <button type="button" class="icon-btn icon-btn--sm shop-sidebar__close" data-act="close-filter" aria-label="Tutup filter">${icon('X', { size: 16 })}</button>
        </div>
      </div>

      <div class="shop-filter-group">
        <span class="shop-filter-group__label">Kategori</span>
        ${categories.map((c) => checkbox({ checked: draft.category === c.id, label: c.name, count: c.count, act: 'category', val: c.id })).join('')}
      </div>

      <div class="shop-filter-group">
        <span class="shop-filter-group__label">Ketersediaan Stok</span>
        ${checkbox({ checked: draft.stock.includes('available'), label: 'Tersedia', pill: 'Aman', pillVariant: 'ok', act: 'stock', val: 'available' })}
        ${checkbox({ checked: draft.stock.includes('low'), label: 'Stok Menipis', pill: 'Menipis', pillVariant: 'low', act: 'stock', val: 'low' })}
        ${checkbox({ checked: draft.stock.includes('out'), label: 'Habis', pill: 'Habis', pillVariant: 'out', act: 'stock', val: 'out' })}
      </div>

      <div class="shop-filter-group">
        <span class="shop-filter-group__label">Rentang Harga (Rp)</span>
        <div class="shop-price-inputs">
          <input type="number" class="shop-price-input" id="price-min" placeholder="Min" aria-label="Harga minimum" value="${draft.priceMin}" />
          <span class="shop-price-sep">–</span>
          <input type="number" class="shop-price-input" id="price-max" placeholder="Max" aria-label="Harga maksimum" value="${draft.priceMax}" />
        </div>
        <input type="range" id="price-range" min="${PRICE_MIN}" max="${PRICE_MAX}" value="${draft.priceMax}" aria-label="Batas harga maksimum" class="shop-range" />
        <div class="shop-price-labels">
          <span>Rp ${formatPrice(PRICE_MIN)}</span>
          <span>Rp ${formatPrice(PRICE_MAX)}</span>
        </div>
      </div>

      <div class="shop-filter-group">
        <span class="shop-filter-group__label">Diskon</span>
        ${checkbox({ checked: draft.discountOnly, label: 'Hanya produk diskon', act: 'discount' })}
      </div>

      <div class="shop-filter-group shop-filter-group--last">
        <span class="shop-filter-group__label">Keunggulan</span>
        ${checkbox({ checked: draft.guarantee, label: 'Garansi Tumbuh 14 Hari', act: 'guarantee' })}
        ${checkbox({ checked: draft.certified, label: 'Bibit Bersertifikat', act: 'certified' })}
      </div>

      <button type="button" class="btn btn-primary btn-block" data-act="apply">Terapkan Filter</button>
    </aside>`;
  }

  /* HASIL PRODUK */
  function listCard(p) {
    const out = p.stock === 0;
    return `
    <article class="shop-list-card">
      <a href="detail-produk.html?id=${p.id}" class="shop-list-card__media">
        <img src="${p.image}" alt="Foto ${esc(p.name)}" loading="lazy" />
        ${p.badge ? `<span class="badge product-card__badge ${out ? 'badge-red' : 'badge-green'}">${esc(p.badge)}</span>` : ''}
      </a>
      <div class="shop-list-card__body">
        <div class="shop-list-card__tags">
          ${(p.tags || []).slice(0, 2).map((t) => `<span class="chip chip--soft">${esc(t)}</span>`).join('')}
        </div>
        <a href="detail-produk.html?id=${p.id}" class="shop-list-card__title">${esc(p.name)}</a>
        <div class="shop-list-card__meta">
          ${Stars(p.rating)}
          <strong>${p.rating}</strong>
          <span>(${p.reviews} ulasan)</span>
          ${p.sold ? `<span>· ${p.sold} terjual</span>` : ''}
        </div>
        <div class="shop-list-card__footer">
          <div class="shop-list-card__prices">
            ${p.originalPrice ? `<span class="price-old">Rp ${formatPrice(p.originalPrice)}</span>` : ''}
            <span class="price-new">Rp ${formatPrice(p.price)}</span>
          </div>
          <button type="button" class="btn btn-primary btn-sm" data-act="add" data-id="${p.id}" ${out ? 'disabled' : ''}>
            ${icon('ShoppingCart', { size: 15 })} ${out ? 'Stok Habis' : 'Tambah ke Keranjang'}
          </button>
        </div>
      </div>
    </article>`;
  }

  function drawResults() {
    const filtered = getFiltered();
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
    const pageItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const from = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const to = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

    let body;
    if (filtered.length === 0) {
      body = `
      <div class="empty-state">
        <span class="empty-state__icon">${icon('Sprout', { size: 32 })}</span>
        <h3 class="empty-state__title">Tidak Ada Bibit Ditemukan</h3>
        <p class="empty-state__text">Coba ubah filter atau reset untuk melihat semua koleksi bibit kami.</p>
        <button type="button" class="btn btn-primary btn-sm" data-act="reset">Reset Filter</button>
      </div>`;
    } else if (viewMode === 'grid') {
      body = `<div class="shop-grid">${pageItems.map((p) => ProductCard(p)).join('')}</div>`;
    } else {
      body = `<div class="shop-list">${pageItems.map(listCard).join('')}</div>`;
    }

    let pagination = '';
    if (filtered.length > 0 && totalPages > 1) {
      pagination = `
      <div class="shop-pagination">
        <button type="button" class="shop-page-btn" data-act="page-prev" ${currentPage === 1 ? 'disabled' : ''} aria-label="Halaman sebelumnya">${icon('ChevronLeft', { size: 16 })}</button>
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => `<button type="button" class="shop-page-btn${n === currentPage ? ' is-active' : ''}" data-act="page" data-val="${n}">${n}</button>`).join('')}
        <button type="button" class="shop-page-btn" data-act="page-next" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Halaman berikutnya">${icon('ChevronRight', { size: 16 })}</button>
      </div>
      <div class="shop-pagination-info">Menampilkan ${from} – ${to} dari ${filtered.length} bibit</div>`;
    }

    results.innerHTML = `
    <div class="shop-toolbar">
      <div class="shop-toolbar__count">Menampilkan <strong>${filtered.length}</strong> Bibit &amp; Tanaman Unggul Siap Tanam</div>
      <div class="shop-toolbar__controls">
        <select class="shop-sort" id="shop-sort" aria-label="Urutkan produk">
          <option value="popular">Urutkan: Paling Populer</option>
          <option value="newest">Terbaru</option>
          <option value="price-asc">Harga: Rendah ke Tinggi</option>
          <option value="price-desc">Harga: Tinggi ke Rendah</option>
          <option value="rating">Rating Tertinggi</option>
        </select>
        <div class="shop-views">
          <button type="button" class="shop-view-btn${viewMode === 'grid' ? ' is-active' : ''}" data-act="view-grid" aria-label="Tampilan grid">${icon('Grid3X3', { size: 16 })}</button>
          <button type="button" class="shop-view-btn${viewMode === 'list' ? ' is-active' : ''}" data-act="view-list" aria-label="Tampilan daftar">${icon('List', { size: 16 })}</button>
        </div>
      </div>
    </div>
    ${body}
    ${pagination}`;
    results.querySelector('#shop-sort').value = sortBy;
  }

  /* AKSI */
  function applyFilters() {
    applied = { ...draft, stock: [...draft.stock] };
    currentPage = 1;
    mobileFilterOpen = false;
    drawSidebar();
    drawResults();
  }

  function resetFilters() {
    Object.assign(draft, {
      category: 'all', stock: [], priceMin: PRICE_MIN, priceMax: PRICE_MAX,
      discountOnly: false, guarantee: false, certified: false,
    });
    applied = { ...draft, stock: [] };
    currentPage = 1;
    drawSidebar();
    drawResults();
  }

  const toggle = (key) => { draft[key] = !draft[key]; drawSidebar(); };

  view.addEventListener('click', (ev) => {

    if (ev.target === sidebarWrap) { mobileFilterOpen = false; drawSidebar(); return; }

    const t = ev.target.closest('[data-act]');
    if (!t || t.dataset.act === 'wish') return;
    const val = t.dataset.val;
    switch (t.dataset.act) {
      case 'category': draft.category = val; drawSidebar(); break;
      case 'stock':
        draft.stock = draft.stock.includes(val) ? draft.stock.filter((v) => v !== val) : [...draft.stock, val];
        drawSidebar();
        break;
      case 'discount': toggle('discountOnly'); break;
      case 'guarantee': toggle('guarantee'); break;
      case 'certified': toggle('certified'); break;
      case 'apply': applyFilters(); break;
      case 'reset': resetFilters(); break;
      case 'open-filter': mobileFilterOpen = true; drawSidebar(); break;
      case 'close-filter': mobileFilterOpen = false; drawSidebar(); break;
      case 'view-grid': viewMode = 'grid'; drawResults(); break;
      case 'view-list': viewMode = 'list'; drawResults(); break;
      case 'page': currentPage = Number(val); drawResults(); break;
      case 'page-prev': currentPage = Math.max(1, currentPage - 1); drawResults(); break;
      case 'page-next': currentPage += 1; drawResults(); break;
      default: break;
    }
  });

  view.addEventListener('input', (ev) => {
    const el = ev.target;
    if (el.id === 'price-min') draft.priceMin = Number(el.value);
    else if (el.id === 'price-max' || el.id === 'price-range') {
      draft.priceMax = Number(el.value);
      const range = view.querySelector('#price-range');
      const max = view.querySelector('#price-max');
      if (el.id === 'price-range' && max) max.value = el.value;
      if (el.id === 'price-max' && range) range.value = el.value;
    }
  });

  view.addEventListener('change', (ev) => {
    if (ev.target.id === 'shop-sort') {
      sortBy = ev.target.value;
      currentPage = 1;
      drawResults();
    }
  });

  drawSidebar();
  drawResults();
};
