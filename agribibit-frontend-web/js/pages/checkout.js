/* CHECKOUT */
Pages.checkout = function (view) {

  if (!AuthUser.isLoggedIn()) {
    sessionStorage.setItem('agribibit.redirectAfterLogin', '/checkout');
    toast('Akses dibatasi', 'Silakan login terlebih dahulu untuk melakukan Checkout.', 'error');
    Router.go('/login');
    return;
  }

  const user = AuthUser.get() || {};
  let savedAddr = AuthUser.getAddress();
  let editingAddr = !savedAddr || !savedAddr.alamat;

  let addr = savedAddr || {
    nama: user.name || '',
    hp: '',
    kota: '',
    label: 'Rumah / Kebun',
    alamat: '',
  };

  const vaNumbers = {
    bca: '8277 0812 3456 7890',
    mandiri: '8890 0812 3456 7890',
    bri: '1029 0812 3456 7890',
    bni: '9881 0812 3456 7890',
  };
  const banks = [
    { id: 'bca', name: 'BCA', sub: 'Dipilih' },
    { id: 'mandiri', name: 'Mandiri', sub: 'VA Mandiri' },
    { id: 'bri', name: 'BRI', sub: 'BRIVA' },
    { id: 'bni', name: 'BNI', sub: 'BNI VA' },
  ];

  let paymentMethod = 'va';
  let selectedBank = 'bca';
  let copied = false;
  let timeLeft = 23 * 3600 + 58 * 60 + 41;
  let qrisTimer = 14 * 60 + 59;
  let copyTimeout = null;

  const pad = (n) => String(n).padStart(2, '0');
  const formatTimer = (s) => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  const formatMinutes = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

  const cartItems = Cart.items.length > 0
    ? Cart.items.map((it) => ({
        sku: it.product.sku,
        kat: it.product.category === 'Bibit Sayur' ? 'sayur' : it.product.category === 'Bibit Buah' ? 'buah' : 'hias',
        name: it.product.name,
        image: it.product.image,
        qty: it.quantity,
        price: it.product.price,
        meta: `${it.options && it.options.size ? it.options.size + ' • ' : ''}Jumlah: ${it.quantity} bibit`,
      }))
    : [
        { sku: 'BH-003', kat: 'buah', name: 'Alpukat Aligator', image: './assets/produk/alpukat-aligator.png', qty: 2, price: 40000, meta: 'Tinggi 50–60 cm (x2)' },
        { sku: 'TH-001', kat: 'hias', name: 'Monstera Variegata', image: './assets/produk/monstera-variegata.png', qty: 1, price: 65000, meta: 'Bibit 3 daun segar (x1)' },
        { sku: 'BH-002', kat: 'buah', name: 'Jeruk Santang Madu', image: './assets/produk/jeruk-santang-madu.png', qty: 1, price: 28000, meta: 'Pohon Siap Bunga (x1)' },
      ];

  const subtotalProduk = cartItems.reduce((s, it) => s + it.price * it.qty, 0);
  const voucherDiskon = subtotalProduk > 150000 ? 20000 : 0;
  const biayaAerasi = 15000;
  const totalTagihan = Math.max(0, subtotalProduk - voucherDiskon + biayaAerasi);

  function addressSection() {
    if (editingAddr) {
      return `
        <div class="co-card__head">
          <h2 class="co-card__title">Isi Alamat Pengiriman Bibit</h2>
          ${savedAddr && savedAddr.alamat ? `<button type="button" data-act="cancel-addr" class="co-edit-btn">Batal</button>` : '<span class="chip chip--soft">Wajib diisi</span>'}
        </div>
        <div class="co-addr-form">
          <div class="co-addr-field">
            <label for="addr-nama">Nama Penerima *</label>
            <input id="addr-nama" type="text" placeholder="Contoh: Budi Santoso" value="${esc(addr.nama)}" required />
          </div>
          <div class="co-addr-field">
            <label for="addr-hp">No. WhatsApp / Telepon *</label>
            <input id="addr-hp" type="tel" placeholder="Contoh: 0812-3456-7890" value="${esc(addr.hp)}" required />
          </div>
          <div class="co-addr-field">
            <label for="addr-kota">Kota / Kabupaten *</label>
            <input id="addr-kota" type="text" placeholder="Contoh: Malang, Surabaya, Bandung" value="${esc(addr.kota)}" required />
          </div>
          <div class="co-addr-field">
            <label for="addr-label">Label Tempat</label>
            <input id="addr-label" type="text" placeholder="Rumah / Kebun / Kantor" value="${esc(addr.label || 'Rumah / Kebun')}" />
          </div>
          <div class="co-addr-field co-addr-form__full">
            <label for="addr-detail">Alamat Lengkap &amp; Patokan *</label>
            <textarea id="addr-detail" rows="3" placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kode pos, dan patokan...">${esc(addr.alamat)}</textarea>
          </div>
          <div class="co-addr-actions">
            <button type="button" data-act="save-addr" class="btn btn-primary btn-sm">${icon('Check', { size: 14 })} Simpan Alamat Pengiriman</button>
          </div>
        </div>`;
    }

    return `
      <div class="co-card__head">
        <h2 class="co-card__title">Alamat Pengiriman Bibit</h2>
        <button type="button" data-act="edit-addr" class="co-edit-btn">${icon('Edit3', { size: 14 })} Ubah Alamat</button>
      </div>
      <div class="co-addr-recipient">${esc(addr.nama)} <span>${esc(addr.label || 'Rumah / Kebun')} • ${esc(addr.hp)}</span></div>
      <p class="co-addr-text">${esc(addr.alamat)} — <strong>${esc(addr.kota)}</strong></p>
      <label class="co-check-box" for="aerasi-check">
        <input type="checkbox" checked id="aerasi-check" />
        <span><strong>Packing Aerasi Hidup Aktif:</strong> kotak khusus berventilasi disiapkan agar bibit tetap bernapas selama transit.</span>
      </label>`;
  }

  const payHead = (id, title, sub, chip = '') => `
    <div role="button" tabindex="0" data-pay="${id}" class="co-pay-head">
      <div class="co-pay-head__left">
        <input type="radio" name="pay" ${paymentMethod === id ? 'checked' : ''} aria-label="${esc(title)}" />
        <div>
          <div class="co-pay-head__title">${esc(title)}</div>
          <div class="co-pay-head__sub">${esc(sub)}</div>
        </div>
      </div>
      ${chip}
    </div>`;

  function paySection() {
    const bank = selectedBank.toUpperCase();
    const vaBody = `
      <div class="co-pay-body">
        <div class="co-banks">
          ${banks.map((b) => `
            <button type="button" data-bank="${b.id}" class="co-bank-chip${selectedBank === b.id ? ' is-active' : ''}">
              <div class="co-bank-chip__name">${b.name}</div>
              <div class="co-bank-chip__sub">${b.sub}</div>
            </button>`).join('')}
        </div>
        <div class="co-va-box">
          <div>
            <div class="co-va-box__label">Nomor Virtual Account ${bank}:</div>
            <div class="co-va-box__num">${vaNumbers[selectedBank]}</div>
          </div>
          <button type="button" data-act="copy-va" class="btn btn-outline btn-sm">${icon('Copy', { size: 14 })} ${copied ? 'Tersalin!' : 'Salin Nomor'}</button>
        </div>
        <div class="co-guide">
          <strong>Petunjuk transfer m-${bank}:</strong>
          <ol>
            <li>Buka aplikasi m-${bank}, pilih menu Transfer &gt; Virtual Account.</li>
            <li>Masukkan nomor VA di atas lalu tekan Kirim.</li>
            <li>Pastikan nama tagihan AgriBibit dan total Rp ${formatPrice(totalTagihan)} sudah sesuai.</li>
            <li>Masukkan PIN. Verifikasi transaksi otomatis dalam 10 detik.</li>
          </ol>
        </div>
      </div>`;

    const qrisBody = `
      <div class="co-pay-body">
        <div class="co-qris-grid">
          <div class="co-qris-card">
            <div class="co-qris-card__title">QRIS</div>
            <div class="co-qris-card__frame">${icon('QrCode', { size: 88 })}</div>
            <div class="co-qris-card__exp">Kode QR berlaku: <span id="co-qris-timer">${formatMinutes(qrisTimer)}</span></div>
          </div>
          <div>
            <div class="co-va-box__label">Total nominal QRIS:</div>
            <div class="co-qris-amount">Rp ${formatPrice(totalTagihan)}</div>
            <p class="co-item__meta">Nominal otomatis masuk saat QRIS dipindai, tidak perlu input manual.</p>
            <div class="co-guide">
              <strong>Mendukung pembayaran:</strong>
              <div>GoPay • OVO • ShopeePay • Dana • LinkAja • BCA Mobile • Livin Mandiri</div>
            </div>
            <div class="co-qris-actions">
              <button type="button" class="btn btn-outline btn-sm">Unduh QR Code</button>
              <button type="button" class="btn btn-outline btn-sm">Salin Kode Transaksi</button>
            </div>
          </div>
        </div>
        <div class="co-guide">
          <strong>Panduan pembayaran QRIS:</strong>
          <ol>
            <li>Buka e-wallet atau mobile banking favorit Anda.</li>
            <li>Arahkan scanner ke QR code di atas, atau unggah hasil unduhan QR.</li>
            <li>Periksa nominal tagihan lalu selesaikan pembayaran. Verifikasi langsung otomatis.</li>
          </ol>
        </div>
      </div>`;

    const opt = (id, head, body = '') => `<div class="co-pay-option${paymentMethod === id ? ' is-active' : ''}">${head}${paymentMethod === id ? body : ''}</div>`;

    return `
      <div class="co-card__head">
        <h2 class="co-card__title">Metode Pembayaran</h2>
        <span class="co-item__meta">Pilih salah satu metode</span>
      </div>
      <div class="co-pay-list">
        ${opt('va', payHead('va', 'Transfer Virtual Account (Verifikasi Otomatis)', 'BCA, Mandiri, BRI, BNI tanpa upload bukti transfer.', '<span class="chip chip--soft">Rekomendasi</span>'), vaBody)}
        ${opt('qris', payHead('qris', 'QRIS Instan & E-Wallet (Otomatis terverifikasi)', 'GoPay, ShopeePay, OVO, Dana, LinkAja & semua mobile banking.'), qrisBody)}
        ${opt('card', payHead('card', 'Kartu Kredit / Debit Online', 'Visa, Mastercard, JCB dengan 3D Secure.'))}
        ${opt('cod', payHead('cod', 'Cash on Delivery (COD) Khusus Pulau Jawa', 'Bayar tunai kepada kurir saat bibit tiba di pekarangan Anda.'))}
      </div>`;
  }

  const summaryItem = (it) => `
    <div class="co-item">
      <div class="co-item__left">
        <img src="${esc(it.image)}" alt="${esc(it.name)}" class="co-item__img" loading="lazy" />
        <div><div class="co-item__name">${esc(it.name)}</div><div class="co-item__meta">${esc(it.meta)}</div></div>
      </div>
      <span class="co-item__price">Rp ${formatPrice(it.price * it.qty)}</span>
    </div>`;

  view.innerHTML = `
  <div class="co-page">
    <div class="container">
      <div class="co-steps">
        <div class="co-steps__labels">
          <div class="co-step is-done"><span class="co-step__dot">${icon('Check', { size: 14, sw: 3 })}</span><span>1. Keranjang</span></div>
          <div class="co-step is-done"><span class="co-step__dot">${icon('Check', { size: 14, sw: 3 })}</span><span>2. Pengiriman</span></div>
          <div class="co-step is-current"><span class="co-step__dot">${icon('CreditCard', { size: 14 })}</span><span>3. Pembayaran</span></div>
          <div class="co-step"><span class="co-step__dot">4</span><span>4. Selesai</span></div>
        </div>
        <div class="progress"><div class="progress__bar progress__bar--secondary co-progress-fill"></div></div>
      </div>

      <div class="co-deadline">
        <div class="co-deadline__left">
          <span class="co-deadline__icon">${icon('Clock', { size: 18 })}</span>
          <div>
            <div class="co-deadline__title">Batas waktu pembayaran</div>
            <div class="co-deadline__sub">Selesaikan transfer agar bibit tanaman Anda segera dipreservasi.</div>
          </div>
        </div>
        <div class="co-deadline__timer" id="co-timer">${formatTimer(timeLeft)}</div>
      </div>

      <div class="co-grid">
        <div class="co-main">
          <section class="co-card" id="co-addr-section">${addressSection()}</section>

          <section class="co-card">
            <div class="co-card__head">
              <h2 class="co-card__title">Ekspedisi Khusus Tanaman</h2>
              <span class="chip chip--soft">Prioritas hortikultura</span>
            </div>
            <div class="co-courier">
              <div class="co-courier__left">
                <span class="co-courier__radio"></span>
                <div>
                  <div class="co-courier__name">JNE Botanical Express <span>1–2 hari sampai</span></div>
                  <div class="co-courier__sub">Penanganan khusus ruang sejuk, kelembapan akar terjaga.</div>
                </div>
              </div>
              <div class="co-courier__price">
                <div class="price-old">Rp 28.000</div>
                <div class="co-courier__free">GRATIS</div>
              </div>
            </div>
            <div class="co-insure">
              <label class="co-insure__left" for="protection-check">
                <input type="checkbox" checked id="protection-check" />
                <div>
                  <div class="co-insure__title">Asuransi Bibit Hidup Selamat (Plant Protection)</div>
                  <div class="co-insure__desc">Klaim ganti 100% jika daun layu atau bibit menguning selama perjalanan.</div>
                </div>
              </label>
              <span class="chip chip--soft">Termasuk</span>
            </div>
          </section>

          <section class="co-card" id="co-pay-section">${paySection()}</section>
        </div>

        <aside class="co-side">
          <div class="co-card">
            <div class="co-card__head">
              <h3 class="co-card__title">Ringkasan Pesanan</h3>
              <span class="chip chip--soft">${cartItems.length} jenis item</span>
            </div>
            <div class="co-items">
              ${cartItems.map(summaryItem).join('')}
            </div>
            <div class="co-breakdown">
              <div class="co-breakdown__row"><span>Subtotal produk</span><strong>Rp ${formatPrice(subtotalProduk)}</strong></div>
              <div class="co-breakdown__row co-breakdown__row--accent"><span>Voucher Bibit Subur</span><strong>− Rp ${formatPrice(voucherDiskon)}</strong></div>
              <div class="co-breakdown__row"><span>Proteksi packing kayu aerasi</span><strong>+ Rp ${formatPrice(biayaAerasi)}</strong></div>
              <div class="co-breakdown__row co-breakdown__row--accent"><span>Ongkos kirim JNE (1–2 hari)</span><strong>GRATIS</strong></div>
            </div>
            <div class="co-total">
              <div class="co-total__label">Total Pembayaran</div>
              <div class="co-total__val">Rp ${formatPrice(totalTagihan)}</div>
              <div class="co-total__note">Termasuk PPN &amp; biaya penanganan</div>
            </div>
            <button type="button" data-act="pay" class="btn btn-primary btn-block">${icon('Lock', { size: 16 })} Bayar Sekarang (Rp ${formatPrice(totalTagihan)})</button>
            <div class="co-trust-grid">
              <div class="co-trust-box"><strong>Enkripsi SSL 256-Bit</strong><span>Data transaksi terlindungi</span></div>
              <div class="co-trust-box"><strong>Garansi Tumbuh 14 Hari</strong><span>Ganti baru jika bibit mati</span></div>
            </div>
            <div class="co-wa-cta">
              <span class="co-wa-cta__icon">${icon('MessageCircle', { size: 16 })}</span>
              <div>
                <div class="co-wa-cta__title">Butuh Panduan Menanam?</div>
                <div class="co-wa-cta__sub">Tim agronomis kami siap membimbing penanaman via WhatsApp.</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>`;

  const paySectionEl = view.querySelector('#co-pay-section');
  const addrSectionEl = view.querySelector('#co-addr-section');
  const redrawPay = () => { paySectionEl.innerHTML = paySection(); };
  const redrawAddr = () => { addrSectionEl.innerHTML = addressSection(); };

  function selectMethod(id) { paymentMethod = id; redrawPay(); }

  function saveAddressFromForm() {
    const namaEl = view.querySelector('#addr-nama');
    const hpEl = view.querySelector('#addr-hp');
    const kotaEl = view.querySelector('#addr-kota');
    const labelEl = view.querySelector('#addr-label');
    const detailEl = view.querySelector('#addr-detail');
    if (!namaEl) return true;

    const nama = namaEl.value.trim();
    const hp = hpEl.value.trim();
    const kota = kotaEl.value.trim();
    const label = (labelEl && labelEl.value.trim()) || 'Rumah / Kebun';
    const alamat = detailEl.value.trim();

    if (!nama || !hp || !kota || !alamat) {
      toast('Alamat belum lengkap', 'Mohon lengkapi Nama Penerima, No. WhatsApp, Kota, dan Alamat Lengkap.', 'error');
      return false;
    }

    addr = { nama, hp, kota, label, alamat };
    savedAddr = addr;
    AuthUser.setAddress(addr);
    editingAddr = false;
    redrawAddr();
    toast('Alamat disimpan', `Pengiriman ke ${nama} (${kota})`);
    return true;
  }

  view.addEventListener('click', (ev) => {
    const head = ev.target.closest('[data-pay]');
    if (head) { selectMethod(head.dataset.pay); return; }

    const bank = ev.target.closest('[data-bank]');
    if (bank) { selectedBank = bank.dataset.bank; redrawPay(); return; }

    const act = ev.target.closest('[data-act]');
    if (!act) return;

    if (act.dataset.act === 'edit-addr') {
      editingAddr = true;
      redrawAddr();
      return;
    }
    if (act.dataset.act === 'cancel-addr') {
      editingAddr = false;
      redrawAddr();
      return;
    }
    if (act.dataset.act === 'save-addr') {
      saveAddressFromForm();
      return;
    }

    if (act.dataset.act === 'pay') {
      if (editingAddr) {
        if (!saveAddressFromForm()) return;
      } else if (!addr || !addr.alamat || !addr.nama || !addr.hp || !addr.kota) {
        editingAddr = true;
        redrawAddr();
        toast('Isi alamat pengiriman', 'Mohon isi alamat pengiriman terlebih dahulu sebelum membayar.', 'error');
        return;
      }

      if (typeof AuthUser !== 'undefined' && AuthUser.isLoggedIn()) {
        const now = new Date();
        const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
        const isoNow = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}T${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
        const timeStr = `${pad2(now.getHours())}:${pad2(now.getMinutes())} WIB`;
        const orderId = 'PS-' + String(Math.floor(1000 + Math.random() * 9000));
        const resiCode = 'JNE-' + String(Math.floor(10000000 + Math.random() * 90000000));
        const payLabels = {
          va: `Virtual Account ${selectedBank.toUpperCase()} (Lunas)`,
          qris: 'QRIS Instan (Lunas)',
          card: 'Kartu Kredit / Debit (Lunas)',
          cod: 'COD — Bayar di Tempat',
        };
        const payLabel = payLabels[paymentMethod] || 'QRIS Instan (Lunas)';

        try {
          sessionStorage.setItem('agribibit.lastTx', JSON.stringify({
            id: '#' + orderId,
            orderId,
            dateTime: `${dateStr}, ${timeStr}`,
            payLabel,
            total: totalTagihan,
            penerima: addr.nama,
            kota: addr.kota,
            resi: resiCode,
            items: cartItems,
          }));
        } catch (err) {  }

        AuthUser.addOrder({
          id: '#' + orderId,
          orderId,
          status: 'packing',
          statusLabel: 'Pesanan Baru (Menunggu Kemas)',
          stage: 0,
          tahapProses: 0,
          tahapKirim: null,
          simSeen: false,
          date: dateStr,
          time: timeStr,
          payLabel,
          penerima: addr.nama,
          hp: addr.hp,
          kota: addr.kota,
          alamat: addr.alamat,
          kurir: 'JNE Botanical Express',
          resi: resiCode,
          items: cartItems,
          total: totalTagihan,
        });

        try {
          const adminOrders = JSON.parse(localStorage.getItem('agribibit.db.orders')) || [];
          const adminCat = JSON.parse(localStorage.getItem('agribibit.db.catalog'));
          const adminMoves = JSON.parse(localStorage.getItem('agribibit.db.moves')) || [];

          adminOrders.push({
            id: orderId,
            t: isoNow,
            nama: addr.nama,
            hp: addr.hp,
            kota: addr.kota,
            alamat: `${addr.alamat}, ${addr.kota}`,
            kurir: 'JNE Botanical Express',
            resi: resiCode,
            ongkir: 0,
            items: cartItems.map((it) => ({
              sku: it.sku || 'SY-001',
              nama: it.name,
              kat: it.kat || 'hias',
              qty: it.qty,
              harga: it.price,
            })),
            status: 'Proses',
            tahapProses: 0,
            tahapKirim: 'Di perjalanan',
            tepat: null,
          });
          localStorage.setItem('agribibit.db.orders', JSON.stringify(adminOrders));

          if (adminCat) {
            cartItems.forEach((it) => {
              ['sayur', 'buah', 'hias'].forEach((k) => {
                if (Array.isArray(adminCat[k])) {
                  adminCat[k].forEach((p) => {
                    if (p.sku === it.sku || p.nama === it.name) {
                      p.stok = Math.max(0, Number(p.stok) - Number(it.qty));
                    }
                  });
                }
              });
              adminMoves.push({
                id: 'MV-' + Date.now() + '-' + (it.sku || 'SY'),
                t: isoNow,
                sku: it.sku || 'SY-001',
                qty: it.qty,
                type: 'keluar',
                src: 'order',
                ref: orderId,
                pembeli: addr.nama,
                petugas: 'Sistem Toko Online',
              });
            });
            localStorage.setItem('agribibit.db.catalog', JSON.stringify(adminCat));
            localStorage.setItem('agribibit.db.moves', JSON.stringify(adminMoves));
            if (typeof syncProductsFromAdmin === 'function') syncProductsFromAdmin();
          }
        } catch (err) {  }
      }
      Cart.clear();
      Router.go('/transaction-success');
    }
    if (act.dataset.act === 'copy-va') {
      if (navigator.clipboard) navigator.clipboard.writeText(vaNumbers[selectedBank].replace(/\s/g, '')).catch(() => {});
      copied = true;
      redrawPay();
      toast('Nomor VA disalin', vaNumbers[selectedBank]);
      clearTimeout(copyTimeout);
      copyTimeout = setTimeout(() => { copied = false; redrawPay(); }, 2000);
    }
  });

  view.addEventListener('keydown', (ev) => {
    const head = ev.target.closest && ev.target.closest('[data-pay]');
    if (head && ev.key === 'Enter') selectMethod(head.dataset.pay);
  });

  const interval = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - 1);
    qrisTimer = Math.max(0, qrisTimer - 1);
    const t1 = document.getElementById('co-timer');
    const t2 = document.getElementById('co-qris-timer');
    if (t1) t1.textContent = formatTimer(timeLeft);
    if (t2) t2.textContent = formatMinutes(qrisTimer);
  }, 1000);

  return () => { clearInterval(interval); clearTimeout(copyTimeout); };
};
