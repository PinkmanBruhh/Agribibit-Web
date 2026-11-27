/* KERANJANG */
Pages.cart = function (view) {
  const initialDemoItems = [
    { key: 'demo-1', id: 9, name: 'Alpukat Aligator Okulasi', subtitle: 'Okulasi cepat berbuah • Usia semai 7 bulan', specs: 'Size: Pot 35cm | Stok: Siap kirim', badge: 'Okulasi', unitPrice: 40000, quantity: 2, image: './assets/produk/alpukat-aligator.png' },
    { key: 'demo-2', id: 13, name: 'Monstera Variegata Seedling', subtitle: 'Akar rimbun siap pajang • Indoor friendly', specs: 'Size: Remaja (3–4 daun) | Media: Cocopeat mix', badge: 'Top Seller', unitPrice: 65000, quantity: 1, image: './assets/produk/monstera-variegata.png' },
    { key: 'demo-3', id: 8, name: 'Jeruk Santang Madu', subtitle: 'Rajin berbuah • Manis tanpa biji', specs: 'Ukuran: Pot 30cm | Varian: Siap Bunga', badge: 'Best Seller', unitPrice: 28000, quantity: 2, image: './assets/produk/jeruk-santang-madu.png' },
  ];

  let packingKayu = true;
  let quickMethod = 'va';
  let demoCart = [];

  const itemHTML = ({ key, image, name, badge, sub, specs, qty, unit }) => `
    <article class="cart-item">
      <img src="${image}" alt="${esc(name)}" class="cart-item__img" loading="lazy" />
      <div class="cart-item__body">
        <span class="badge badge-green">${esc(badge)}</span>
        <h3 class="cart-item__title">${esc(name)}</h3>
        <p class="cart-item__sub">${esc(sub)}</p>
        ${specs ? `<p class="cart-item__specs">${esc(specs)}</p>` : ''}
        <div class="cart-item__controls">
          <div class="cart-qty">
            <button type="button" class="cart-qty__btn" data-act="dec" data-key="${key}" aria-label="Kurangi jumlah">${icon('Minus', { size: 14 })}</button>
            <span class="cart-qty__val">${qty}</span>
            <button type="button" class="cart-qty__btn" data-act="inc" data-key="${key}" aria-label="Tambah jumlah">${icon('Plus', { size: 14 })}</button>
          </div>
          <button type="button" data-act="remove" data-key="${key}" class="icon-btn icon-btn--sm icon-btn--danger" aria-label="Hapus ${esc(name)}">${icon('Trash2', { size: 15 })}</button>
        </div>
      </div>
      <div class="cart-item__price-col">
        <div class="cart-item__total">Rp ${formatPrice(unit * qty)}</div>
        <div class="cart-item__unit">@ Rp ${formatPrice(unit)}</div>
      </div>
    </article>`;

  function draw() {
    const real = Cart.items.length > 0;
    const currentSubtotal = real ? Cart.subtotal : demoCart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const diskonKombo = currentSubtotal > 150000 ? 20000 : 0;
    const biayaPacking = packingKayu ? 15000 : 0;
    const total = Math.max(0, currentSubtotal - diskonKombo + biayaPacking);

    let list;
    if (real) {
      list = Cart.items.map((it) => itemHTML({
        key: it.key,
        image: it.product.image,
        name: it.product.name,
        badge: it.product.badge || it.product.category || 'Bibit Unggul',
        sub: `${it.options.size ? `Size: ${it.options.size}` : 'Siap tanam'} ${it.options.pot ? `• Pot: ${it.options.pot}` : ''}`.trim(),
        specs: '',
        qty: it.quantity,
        unit: it.product.price,
      })).join('');
    } else if (demoCart.length > 0) {
      list = demoCart.map((it) => itemHTML({
        key: it.key, image: it.image, name: it.name, badge: it.badge, sub: it.subtitle,
        specs: it.specs, qty: it.quantity, unit: it.unitPrice,
      })).join('');
    } else {
      list = `
      <div class="empty-state">
        <span class="empty-state__icon">${icon('ShoppingBag', { size: 30 })}</span>
        <h3 class="empty-state__title">Keranjang Belanja Anda Kosong</h3>
        <p class="empty-state__text">Yuk pilih bibit sayur, buah, atau tanaman hias terbaik dari katalog kami.</p>
        <a href="shop.html" class="btn btn-primary">Mulai Belanja Bibit</a>
      </div>`;
    }

    const method = (id, name, sub, extra = '') => `
      <button type="button" data-act="method" data-val="${id}" class="cart-method-btn${extra}${quickMethod === id ? ' is-active' : ''}">
        <div class="cart-method-btn__name">${name}</div>
        <div class="cart-method-btn__sub">${sub}</div>
      </button>`;

    view.innerHTML = `
    <div class="cart-page">
      <div class="container">
        <div class="cart-steps">
          <div class="cart-steps__labels">
            <div class="cart-step is-active"><span class="cart-step__num">1</span><span>Cart</span></div>
            <div class="cart-step"><span class="cart-step__num">2</span><span>Checkout</span></div>
            <div class="cart-step"><span class="cart-step__num">3</span><span>Payment</span></div>
          </div>
          <div class="progress"><div class="progress__bar cart-progress-fill"></div></div>
        </div>

        <h1 class="cart-title">Keranjang Belanja</h1>

        <div class="cart-grid">
          <div>
            <div class="cart-list">${list}</div>

            <div class="cart-addon">
              <div class="cart-addon__info">
                <span class="icon-btn icon-btn--primary">${icon('ShieldCheck', { size: 20 })}</span>
                <div>
                  <h4 class="cart-addon__title">Garansi Bibit Tumbuh Segar 14 Hari</h4>
                  <p class="cart-addon__desc">Bibit patah atau layu dalam perjalanan? Kami ganti 100% tanpa biaya tambahan.</p>
                </div>
              </div>
              <label class="cart-addon__check">
                <input type="checkbox" data-act="packing" ${packingKayu ? 'checked' : ''} />
                <span>Packing kayu berpori (+Rp 15.000)</span>
              </label>
            </div>
          </div>

          <div class="cart-side">
            <div class="cart-summary">
              <div class="cart-summary__head">
                <h2 class="cart-summary__title">Ringkasan Pesanan</h2>
                <span class="chip chip--soft">Daftar Item</span>
              </div>
              <div class="cart-summary__rows">
                <div class="cart-summary__row"><span>Sub total</span><strong>Rp ${formatPrice(currentSubtotal)}</strong></div>
                <div class="cart-summary__row cart-summary__row--accent"><span>Diskon bibit kombo</span><strong>− Rp ${formatPrice(diskonKombo)}</strong></div>
                <div class="cart-summary__row"><span>Biaya tambahan packing kayu</span><strong>Rp ${formatPrice(biayaPacking)}</strong></div>
                <div class="cart-summary__row"><span>Pajak (PPN 0%)</span><strong>Rp 0</strong></div>
                <div class="cart-summary__row cart-summary__row--accent"><span>Estimasi ongkir (JNE Botanical)</span><strong>Free subsidi</strong></div>
              </div>
              <div class="cart-summary__total"><span>Total</span><strong>Rp ${formatPrice(total)}</strong></div>
              <button type="button" data-act="checkout" class="btn btn-primary btn-block">Lanjut ke Checkout ${icon('ArrowRight', { size: 18 })}</button>
              <div class="cart-summary__eta">${icon('Truck', { size: 15 })}<span>Estimasi tiba: <strong>2–4 hari kerja</strong> (aman berpori)</span></div>
            </div>

            <div class="cart-methods">
              <h3 class="cart-methods__title">Pilihan Metode Cepat</h3>
              <div class="cart-methods__grid">
                ${method('va', 'Virtual Account', 'BCA, Mandiri, BRI')}
                ${method('qris', 'QRIS / E-Wallet', 'GoPay, OVO, Shopee')}
              </div>
              ${method('cod', 'COD Bibit Terjamin', 'Bisa bayar di tempat', ' cart-method-btn--center')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  view.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-act]');
    if (!t) return;
    const key = t.dataset.key;
    const real = Cart.items.length > 0;

    switch (t.dataset.act) {
      case 'inc':
      case 'dec': {
        const delta = t.dataset.act === 'inc' ? 1 : -1;
        if (real) {
          const it = Cart.items.find((i) => i.key === key);
          if (it) Cart.updateQuantity(key, it.quantity + delta);
        } else {
          demoCart = demoCart
            .map((i) => (i.key === key ? { ...i, quantity: i.quantity + delta } : i))
            .filter((i) => i.quantity > 0);
          draw();
        }
        break;
      }
      case 'remove':
        if (real) Cart.remove(key);
        else { demoCart = demoCart.filter((i) => i.key !== key); draw(); }
        break;
      case 'method': quickMethod = t.dataset.val; draw(); break;
      case 'checkout':
        if (Cart.items.length === 0 && demoCart.length === 0) {
          toast('Keranjang masih kosong', 'Pilih bibit tanaman terlebih dahulu sebelum checkout.', 'error');
          return;
        }
        if (!AuthUser.isLoggedIn()) {
          sessionStorage.setItem('agribibit.redirectAfterLogin', '/checkout');
          toast('Silakan masuk terlebih dahulu', 'Anda harus login untuk melanjutkan proses Checkout.', 'error');
          Router.go('/login');
          return;
        }
        Router.go('/checkout');
        break;
      default: break;
    }
  });

  view.addEventListener('change', (ev) => {
    if (ev.target.dataset.act === 'packing') { packingKayu = ev.target.checked; draw(); }
  });

  draw();
  return Cart.subscribe(draw);
};
