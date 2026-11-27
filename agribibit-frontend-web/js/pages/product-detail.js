/* DETAIL PRODUK */
Pages.productDetail = function (view, params) {
  const careGuide = [
    { icon: 'Droplets', title: 'Penyiraman', desc: 'Siram 2-3 kali seminggu, pastikan media tanam lembap namun tidak tergenang. Kurangi penyiraman di musim hujan.' },
    { icon: 'Sun', title: 'Pencahayaan', desc: 'Letakkan di tempat dengan cahaya tidak langsung (indirect light). Hindari sinar matahari langsung yang bisa membakar daun.' },
    { icon: 'Thermometer', title: 'Suhu & Kelembapan', desc: 'Suhu ideal 18-30°C dengan kelembapan 60-80%. Semprotkan air pada daun di pagi hari untuk menjaga kelembapan.' },
    { icon: 'Sprout', title: 'Aklimatisasi', desc: 'Setelah bibit tiba, letakkan di tempat teduh 3-5 hari sebelum dipindahkan ke lokasi tetap. Jangan langsung dipindah pot.' },
  ];
  const packagingSteps = [
    'Bibit dibungkus dengan tissue basah di area akar',
    'Daun dilindungi dengan bubble wrap berlubang aerasi',
    'Batang distabilkan dengan penopang bambu mini',
    'Pot/media ditutup plastik anti-tumpah',
    'Kotak kardus tebal dengan label "TANAMAN HIDUP - FRAGILE"',
    'Gel pendingin disertakan untuk pengiriman > 2 hari',
  ];
  const tabLabels = ['Deskripsi & Karakteristik', 'Panduan Perawatan & Aklimatisasi', 'Standar Pengemasan'];
  const advantages = [
    'Bibit sudah melewati masa aklimatisasi 2 minggu di greenhouse kami',
    'Akar sudah tumbuh kuat dan siap menyerap nutrisi dari media baru',
    'Daun sudah membuka sempurna, menandakan bibit sehat dan aktif fotosintesis',
    'Dikemas dengan media tanam cocopeat steril yang bebas hama',
    'Dilengkapi garansi hidup 14 hari sejak tanggal diterima',
  ];

  const product = products.find((p) => String(p.id) === String(params.id) || p.sku === params.id) || products[0];

  let selectedImage = 0;
  let selectedSize = 0;
  let selectedPot = 0;
  let quantity = 1;
  let activeTab = 0;
  let wishlisted = false;
  let reviewFilter = 'all';
  let showAllReviews = false;
  let writingInlineReview = false;
  let inlineRating = 5;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const tags = product.id === 4 ? ['Kelembapan 80%', 'Cahaya Teduh', 'Tinggi 30-40 cm'] : (product.tags || []);
  const images = product.images || [product.image];

  function findUnreviewedOrderForProduct() {
    if (typeof AuthUser === 'undefined' || !AuthUser.isLoggedIn()) return null;
    const orders = AuthUser.getOrders();
    return orders.find((o) => {
      if (o.status !== 'completed') return false;
      const cid = String(o.orderId || o.id || '').replace(/^#/, '');
      if (typeof ProductReviews !== 'undefined' && ProductReviews.hasReviewedOrder(cid)) return false;
      return (o.items || []).some((it) => (it.sku && it.sku === product.sku) || it.name === product.name);
    }) || null;
  }

  view.innerHTML = `
  <div class="pd-page">
    <div class="container">
      <nav class="pd-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html" class="pd-breadcrumb__link">Home</a>${icon('ChevronRight', { size: 14 })}
        <a href="shop.html" class="pd-breadcrumb__link">Shop</a>${icon('ChevronRight', { size: 14 })}
        <span class="pd-breadcrumb__link">${esc(product.category)}</span>${icon('ChevronRight', { size: 14 })}
        <span class="pd-breadcrumb__current">${esc(product.name)}</span>
      </nav>

      <div class="pd-grid">
        <div class="pd-gallery" id="pd-gallery"></div>
        <div class="pd-info" id="pd-info"></div>
      </div>

      <section class="pd-tabs-card reveal">
        <div id="pd-tabs"></div>
      </section>

      <section class="pd-panel reveal" id="ulasan">
        <div id="pd-reviews"></div>
      </section>
    </div>
  </div>`;

  const $ = (sel) => view.querySelector(sel);

  /* GALERI */
  function drawGallery() {
    setHTML($('#pd-gallery'), `
      <div class="pd-gallery__main">
        <img src="${images[selectedImage] || product.image}" alt="${esc(product.name)}" class="pd-gallery__img" />
        <div class="pd-gallery__badges">
          ${product.badge ? `<span class="badge badge-green">${esc(product.badge)}</span>` : ''}
          <span class="chip">${icon('ShieldCheck', { size: 14 })} Garansi Hidup 14 Hari</span>
        </div>
      </div>
      <div class="pd-thumbs">
        ${images.map((img, i) => `
          <button type="button" class="pd-thumb${selectedImage === i ? ' is-active' : ''}" data-act="thumb" data-val="${i}" aria-label="Lihat foto ${i + 1}">
            <img src="${img}" alt="${esc(product.name)} ${i + 1}" loading="lazy" />
          </button>`).join('')}
      </div>
      <div class="pd-tags">${tags.map((t) => `<span class="chip chip--soft">${esc(t)}</span>`).join('')}</div>`);
  }

  /* INFO & PEMBELIAN */
  function drawInfo() {
    const potExtra = selectedPot === 1 ? 25000 : 0;
    const subtotal = (product.price + potExtra) * quantity;
    const sizes = product.sizeOptions || [];
    const pots = product.potOptions || [];
    const out = product.stock === 0;

    setHTML($('#pd-info'), `
      <div class="pd-info__cat">
        <span class="chip chip--soft">${product.category === 'Tanaman Hias' ? 'Bibit Tanaman Hias' : esc(product.category)}</span>
      </div>
      <h1 class="pd-info__title">${esc(product.name)}</h1>
      ${product.id === 4 ? '<p class="pd-info__subtitle">(Usia Semai 4 Bulan)</p>' : ''}

      <div class="pd-info__rating">
        ${Stars(product.rating)}
        <strong>${product.rating}</strong>
        <span>(${product.reviews} ulasan)</span><span>·</span>
        <span>${product.sold} terjual</span><span>·</span>
        <span class="pd-info__ready">Siap kirim</span>
      </div>

      <div class="pd-price-row">
        <span class="pd-price-now">Rp ${formatPrice(product.price)}</span>
        ${product.originalPrice ? `<span class="pd-price-old">Rp ${formatPrice(product.originalPrice)}</span><span class="chip chip--accent">Hemat ${discount}%</span>` : ''}
      </div>

      ${sizes.length ? `
        <div class="pd-field-label">Ukuran Bibit</div>
        <div class="pd-options">
          ${sizes.map((s, i) => `<button type="button" class="pd-option${selectedSize === i ? ' is-active' : ''}" data-act="size" data-val="${i}">${esc(s)}${i === 0 && product.id === 4 ? ' (3-4 daun)' : ''}</button>`).join('')}
        </div>` : ''}

      ${pots.length ? `
        <div class="pd-field-label">Pilihan Pot</div>
        <div class="pd-options">
          ${pots.map((p, i) => `<button type="button" class="pd-option${selectedPot === i ? ' is-active' : ''}" data-act="pot" data-val="${i}">${esc(p)}${i === 1 ? ' (+ Rp 25.000)' : ''}</button>`).join('')}
        </div>` : ''}

      <div class="pd-meta-list">
        <div class="pd-meta-item">${icon('Package', { size: 15 })}<span>Stok tersedia: <strong>${product.stock} bibit</strong></span></div>
        ${product.origin ? `<div class="pd-meta-item">${icon('MapPin', { size: 15 })}<span>${esc(product.origin)}</span></div>` : ''}
      </div>

      <hr class="pd-divider" />

      <div class="pd-qty-row">
        <span class="pd-field-label">Jumlah</span>
        <div class="pd-stepper">
          <button type="button" class="pd-stepper__btn" data-act="qty-minus" aria-label="Kurangi jumlah">${icon('Minus', { size: 16 })}</button>
          <span class="pd-stepper__val">${quantity}</span>
          <button type="button" class="pd-stepper__btn" data-act="qty-plus" aria-label="Tambah jumlah">${icon('Plus', { size: 16 })}</button>
        </div>
      </div>

      <div class="pd-subtotal">
        <span class="pd-subtotal__label">Subtotal</span>
        <span class="pd-subtotal__val">Rp ${formatPrice(subtotal)}</span>
      </div>

      <div class="pd-actions">
        <button type="button" class="btn btn-primary" data-act="add-cart" ${out ? 'disabled' : ''}>${icon('ShoppingCart', { size: 18 })} Masukkan ke Keranjang</button>
        <button type="button" class="btn btn-inverted" data-act="buy-now" ${out ? 'disabled' : ''}>Beli Sekarang</button>
        <button type="button" class="icon-btn pd-wish-btn${wishlisted ? ' is-active' : ''}" data-act="wishlist" aria-label="Simpan ke wishlist">${icon('Heart', { size: 20, fill: wishlisted })}</button>
      </div>

      <div class="pd-ship-note">${icon('Truck', { size: 16 })}<span>Estimasi tiba <strong>2-3 hari kerja</strong> dengan packing aerasi</span></div>`);
  }

  /* TAB INFORMASI */
  function drawTabs() {
    let body = '';
    if (activeTab === 0) {
      body = `
        <p class="pd-desc">${esc(product.description)}</p>
        <table class="pd-specs"><tbody>
          ${Object.entries(product.specs || {}).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}
        </tbody></table>
        <h3 class="pd-adv-title">Keunggulan Seedling AgriBibit</h3>
        <ul class="pd-adv-list">
          ${advantages.map((a) => `<li class="pd-adv-item">${icon('Check', { size: 18 })}<span>${a}</span></li>`).join('')}
        </ul>`;
    } else if (activeTab === 1) {
      body = `<div class="pd-care-grid">
        ${careGuide.map((c) => `
          <div class="pd-care-card">
            <div class="pd-care-card__head"><span class="pd-care-card__icon">${icon(c.icon, { size: 16 })}</span><span>${esc(c.title)}</span></div>
            <p class="pd-care-card__desc">${c.desc}</p>
          </div>`).join('')}
      </div>`;
    } else {
      body = `
        <p class="pd-desc">Setiap bibit dikemas dengan standar pengiriman tanaman hidup untuk memastikan kondisi tetap segar saat tiba di tangan Anda:</p>
        <div class="pd-pack-list">
          ${packagingSteps.map((s, i) => `<div class="pd-pack-step"><span class="pd-pack-step__num">${i + 1}</span><span>${esc(s)}</span></div>`).join('')}
        </div>`;
    }
    $('#pd-tabs').innerHTML = `
      <div class="pd-tabs-nav" role="tablist">
        ${tabLabels.map((l, i) => `<button type="button" role="tab" aria-selected="${activeTab === i}" class="pd-tab-btn${activeTab === i ? ' is-active' : ''}" data-act="tab" data-val="${i}">${esc(l)}</button>`).join('')}
      </div>
      <div class="pd-tabs-body">${body}</div>`;
  }

  /* ULASAN PEMBELI TERVERIFIKASI */
  function drawReviews() {
    if (typeof ProductReviews !== 'undefined') ProductReviews.syncIntoCatalog();
    const allRevs = typeof ProductReviews !== 'undefined' ? ProductReviews.getForProduct(product) : testimonials;
    const eligibleOrder = findUnreviewedOrderForProduct();

    const filtered = allRevs.filter((r) => {
      if (reviewFilter === '5') return Number(r.rating) === 5;
      if (reviewFilter === 'photo') return Boolean(r.image);
      if (reviewFilter === 'mine') return Boolean(r.isUserReview);
      return true;
    });
    const visible = showAllReviews ? filtered : filtered.slice(0, 3);

    const writeCtaHTML = eligibleOrder
      ? `<button type="button" data-act="toggle-inline-rev" class="btn btn-primary btn-sm">${icon('Star', { size: 15, fill: true })} Tulis Ulasan Pesanan ${esc(eligibleOrder.id)}</button>`
      : `<span class="pd-rev-lock-note">${icon('ShieldCheck', { size: 15 })} Ulasan hanya dapat ditulis setelah pesanan diterima</span>`;

    const inlineFormHTML = (writingInlineReview && eligibleOrder) ? `
      <div class="pd-rev-composer">
        <div class="pd-rev-composer__head">
          <strong>Beri Ulasan untuk ${esc(product.name)} (${esc(eligibleOrder.id)})</strong>
          <button type="button" data-act="toggle-inline-rev" class="icon-btn icon-btn--sm" aria-label="Tutup">${icon('X', { size: 15 })}</button>
        </div>
        <div class="pd-rev-composer__stars">
          <span>Rating Anda:</span>
          <div>
            ${[1, 2, 3, 4, 5].map((n) => `
              <button type="button" data-act="inline-star" data-val="${n}" class="pd-inline-star${n <= inlineRating ? ' is-on' : ''}">
                ${icon('Star', { size: 22, fill: n <= inlineRating, sw: 1.7 })}
              </button>`).join('')}
          </div>
        </div>
        <textarea id="pd-inline-rev-text" rows="3" placeholder="Bagikan pengalaman kondisi daun, akar, dan pengiriman bibit ini..."></textarea>
        <div class="pd-rev-composer__foot">
          <button type="button" data-act="submit-inline-rev" class="btn btn-primary btn-sm">${icon('Send', { size: 14 })} Kirim Ulasan Sekarang</button>
        </div>
      </div>` : '';

    setHTML($('#pd-reviews'), `
      <div class="pd-reviews-top">
        <div>
          <span class="eyebrow">Ulasan Pembeli Terverifikasi</span>
          <h2 class="pd-panel__title">Pengalaman Menanam dari Pembeli</h2>
        </div>
        ${writeCtaHTML}
      </div>

      ${inlineFormHTML}

      <div class="pd-reviews-bar">
        <div class="pd-reviews-summary">
          <span class="pd-reviews-score">${product.rating}</span>
          <div>
            ${Stars(product.rating, 16)}
            <div class="pd-reviews-meta">Berdasarkan ${product.reviews} ulasan pembeli asli</div>
          </div>
        </div>
        <div class="pd-rev-filters">
          <button type="button" data-act="rev-filter" data-filter="all" class="pd-rev-chip${reviewFilter === 'all' ? ' is-active' : ''}">Semua (${allRevs.length})</button>
          <button type="button" data-act="rev-filter" data-filter="5" class="pd-rev-chip${reviewFilter === '5' ? ' is-active' : ''}">★ 5 Bintang</button>
          <button type="button" data-act="rev-filter" data-filter="photo" class="pd-rev-chip${reviewFilter === 'photo' ? ' is-active' : ''}">Dengan Foto</button>
          ${allRevs.some((r) => r.isUserReview) ? `<button type="button" data-act="rev-filter" data-filter="mine" class="pd-rev-chip${reviewFilter === 'mine' ? ' is-active' : ''}">Ulasan Baru (${allRevs.filter((r) => r.isUserReview).length})</button>` : ''}
        </div>
      </div>

      <div class="pd-reviews-grid">
        ${visible.length ? visible.map((r) => `
        <article class="pd-review-card${r.isUserReview ? ' pd-review-card--highlight' : ''}">
          <div class="pd-review-card__top">
            ${Stars(r.rating)}
            ${r.date ? `<span class="pd-review-card__date">${esc(r.date)}</span>` : ''}
          </div>
          ${r.tags && r.tags.length ? `
            <div class="pd-review-card__tags">
              ${r.tags.map((tg) => `<span>${esc(tg)}</span>`).join('')}
            </div>` : ''}
          <p class="pd-review-card__text">${esc(r.text)}</p>
          ${r.image ? `<img src="${r.image}" alt="Ulasan ${esc(r.name)}" class="pd-review-card__img" loading="lazy" />` : ''}
          <div class="pd-review-card__user">
            <div class="pd-review-card__avatar">${esc(r.avatar || 'AB')}</div>
            <div>
              <div class="pd-review-card__name">${esc(r.name)} ${r.isUserReview ? '<span class="pd-rev-new-pill">Baru</span>' : ''}</div>
              ${r.verified ? `<div class="pd-review-card__verified">${icon('Check', { size: 12 })} Pembeli Terverifikasi</div>` : ''}
              <div class="pd-review-card__variant">${esc(r.variant || '')}</div>
            </div>
          </div>
        </article>`).join('') : `<div class="pd-rev-empty">Belum ada ulasan pada filter ini.</div>`}
      </div>
      ${filtered.length > 3 ? `
        <div class="pd-reviews-cta">
          <button type="button" data-act="toggle-all-revs" class="btn btn-outline">${showAllReviews ? 'Ringkas Ulasan' : `Lihat Semua Ulasan (${filtered.length})`}</button>
        </div>` : ''}`);
  }

  /* AKSI */
  function addToCart() {
    Cart.add(product, quantity, {
      size: (product.sizeOptions || [])[selectedSize] || '',
      pot: (product.potOptions || [])[selectedPot] || '',
    });
  }

  view.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-act]');
    if (!t) return;
    const v = Number(t.dataset.val);
    switch (t.dataset.act) {
      case 'thumb': selectedImage = v; drawGallery(); break;
      case 'size': selectedSize = v; drawInfo(); break;
      case 'pot': selectedPot = v; drawInfo(); break;
      case 'qty-minus': quantity = Math.max(1, quantity - 1); drawInfo(); break;
      case 'qty-plus': quantity = Math.min(Math.max(1, product.stock), quantity + 1); drawInfo(); break;
      case 'wishlist': wishlisted = !wishlisted; drawInfo(); break;
      case 'add-cart': addToCart(); break;
      case 'buy-now': addToCart(); Router.go('/cart'); break;
      case 'tab': activeTab = v; drawTabs(); break;
      case 'rev-filter': reviewFilter = t.dataset.filter || 'all'; drawReviews(); break;
      case 'toggle-all-revs': showAllReviews = !showAllReviews; drawReviews(); break;
      case 'toggle-inline-rev': writingInlineReview = !writingInlineReview; drawReviews(); break;
      case 'inline-star': inlineRating = v || 5; drawReviews(); break;
      case 'submit-inline-rev': {
        const eligible = findUnreviewedOrderForProduct();
        if (!eligible || typeof ProductReviews === 'undefined') break;
        const txtEl = view.querySelector('#pd-inline-rev-text');
        const txt = (txtEl && txtEl.value.trim()) || 'Bibit segar berkualitas, packing aerasi rapi dan akar sehat!';
        const u = AuthUser.get() || {};
        const uName = u.name || 'Pembeli AgriBibit';
        const uInit = uName.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'AB';
        const d = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const cid = String(eligible.orderId || eligible.id || '').replace(/^#/, '');
        ProductReviews.addBatch([{
          id: `rev-${Date.now()}`,
          orderId: cid,
          sku: product.sku,
          productName: product.name,
          productImage: product.image,
          name: uName,
          avatar: uInit,
          verified: true,
          rating: inlineRating,
          tags: ['Bibit segar & sehat'],
          variant: `${product.name} • Pesanan #${cid}`,
          text: txt,
          image: '',
          date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
          createdAt: Date.now(),
        }]);
        writingInlineReview = false;
        reviewFilter = 'all';
        drawInfo();
        drawReviews();
        toast('Ulasan terkirim!', 'Terima kasih atas ulasan pembelian terverifikasi Anda.');
        break;
      }
      default: break;
    }
  });

  drawGallery();
  drawInfo();
  drawTabs();
  drawReviews();

  if (window.location.hash === '#ulasan') {
    setTimeout(() => {
      const el = view.querySelector('#ulasan');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
};
