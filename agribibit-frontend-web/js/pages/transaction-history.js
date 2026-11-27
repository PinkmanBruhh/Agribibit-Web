Pages.transactionHistory = function (view) {

  if (!AuthUser.isLoggedIn()) {
    toast('Silakan masuk terlebih dahulu', 'Masuk ke akun Anda untuk melihat profil dan pesanan.');
    Router.go('/login');
    return;
  }

  const user = AuthUser.get();
  const userName = (user && user.name) || 'Pengguna AgriBibit';
  const initials = userName.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'AB';

  const QUICK_TAGS = [
    'Bibit segar & sehat',
    'Packing aerasi aman',
    'Akar kuat & aktif',
    'Pengiriman cepat',
    'Sesuai deskripsi',
  ];
  const RATING_LABELS = {
    5: 'Sangat Memuaskan (5/5)',
    4: 'Segar & Bagus (4/5)',
    3: 'Cukup Baik (3/5)',
    2: 'Kurang Memuaskan (2/5)',
    1: 'Bermasalah (1/5)',
  };

  const periods = ['30 Hari Terakhir', '3 Bulan', 'Semua Waktu'];
  let activeTab = 'all';
  let activePeriod = periods[0];
  let searchQuery = '';
  let confirmOrderId = null;
  let reviewOrderId = null;
  let justCompletedId = null;

  let reviewDraft = {
    rating: 5,
    tags: ['Bibit segar & sehat', 'Packing aerasi aman'],
    text: '',
    photo: '',
  };

  const simTimers = new Map();
  const liveStates = new Map();

  function clearAllTimers() {
    simTimers.forEach((arr) => arr.forEach((id) => clearTimeout(id)));
    simTimers.clear();
  }

  function clearOrderTimers(cleanId) {
    const arr = simTimers.get(cleanId);
    if (arr) arr.forEach((id) => clearTimeout(id));
    simTimers.delete(cleanId);
  }

  const nowTimeWIB = () => {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${p(d.getHours())}:${p(d.getMinutes())} WIB`;
  };

  const todayDateStr = () => {
    const d = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  function syncOrdersWithAdmin() {
    try {
      const adminOrders = JSON.parse(localStorage.getItem('agribibit.db.orders')) || [];
      const bOrders = AuthUser.getOrders();
      if (!bOrders.length || !adminOrders.length) return bOrders;
      let changed = false;

      bOrders.forEach((bo) => {
        const cleanId = String(bo.orderId || bo.id || '').replace(/^#/, '');
        const ao = adminOrders.find((x) => x.id === cleanId);
        if (!ao) return;

        if (bo.status === 'completed' && ao.status !== 'Selesai') {
          ao.status = 'Selesai';
          ao.tahapKirim = 'Terkirim';
          ao.tepat = true;
          ao.confirmedBy = 'Pembeli';
          localStorage.setItem('agribibit.db.orders', JSON.stringify(adminOrders));
          return;
        }

        if (ao.status === 'Proses') {
          const tp = typeof ao.tahapProses === 'number' ? ao.tahapProses : 0;
          const lbl = tp === 0
            ? 'Pesanan Baru (Menunggu Kemas)'
            : tp === 1
              ? 'Sedang Dikemas & Aerasi'
              : 'Siap Diserahkan ke Kurir';
          if (bo.status !== 'packing' || bo.tahapProses !== tp || bo.statusLabel !== lbl) {
            bo.status = 'packing';
            bo.tahapProses = tp;
            bo.tahapKirim = null;
            bo.stage = tp === 0 ? 0 : 1;
            bo.statusLabel = lbl;
            bo.simSeen = false;
            changed = true;
          }
        } else if (ao.status === 'Dikirim') {
          const tk = ao.tahapKirim || 'Di perjalanan';
          const newShip = ao.shippedAt || null;
          if (newShip && bo.shippedAt !== newShip) {
            bo.shippedAt = newShip;
            bo.simSeen = false;
            changed = true;
          }
          const lbl = tk === 'Sampai di tujuan'
            ? 'Paket Tiba • Konfirmasi Pesanan Sampai'
            : tk === 'Tiba di hub'
              ? 'Transit di Hub Kota Tujuan'
              : 'Dalam Perjalanan Kurir';
          const stg = tk === 'Sampai di tujuan' ? 3 : tk === 'Tiba di hub' ? 2.5 : 2;
          if (bo.status !== 'shipping' || bo.tahapKirim !== tk || bo.statusLabel !== lbl) {
            bo.status = 'shipping';
            bo.tahapKirim = tk;
            bo.stage = stg;
            bo.statusLabel = lbl;
            changed = true;
          }
        } else if (ao.status === 'Selesai') {
          const lbl = 'Pesanan Diterima • Garansi Tumbuh Aktif';
          if (bo.status !== 'completed' || bo.stage !== 4 || bo.statusLabel !== lbl) {
            bo.status = 'completed';
            bo.tahapKirim = 'Terkirim';
            bo.stage = 4;
            bo.simSeen = true;
            bo.statusLabel = lbl;
            changed = true;
          }
        }
      });

      if (changed) AuthUser.saveOrders(bOrders);
      return bOrders;
    } catch (e) {
      return AuthUser.getOrders();
    }
  }

  function persistCourierStage(cleanId, tahapKirim, markSimSeen = false) {
    try {
      const adminOrders = JSON.parse(localStorage.getItem('agribibit.db.orders')) || [];
      const ao = adminOrders.find((x) => x.id === cleanId);
      if (ao && ao.status !== 'Selesai') {
        ao.status = 'Dikirim';
        ao.tahapKirim = tahapKirim;
        if (!ao.shippedAt) ao.shippedAt = Date.now();
        localStorage.setItem('agribibit.db.orders', JSON.stringify(adminOrders));
      }

      const bOrders = AuthUser.getOrders();
      const bo = bOrders.find((x) => String(x.orderId || x.id || '').replace(/^#/, '') === cleanId);
      if (bo && bo.status !== 'completed') {
        bo.status = 'shipping';
        bo.tahapKirim = tahapKirim;
        if (markSimSeen) bo.simSeen = true;
        bo.statusLabel = tahapKirim === 'Sampai di tujuan'
          ? 'Paket Tiba • Konfirmasi Pesanan Sampai'
          : tahapKirim === 'Tiba di hub'
            ? 'Transit di Hub Kota Tujuan'
            : 'Dalam Perjalanan Kurir';
        localStorage.setItem('agribibit.user.orders', JSON.stringify(bOrders));
      }
    } catch (e) {  }
  }

  function computeVisualState(o) {
    const cleanId = String(o.orderId || o.id || '').replace(/^#/, '');
    if (liveStates.has(cleanId)) return liveStates.get(cleanId);

    const kota = o.kota || 'Kota Tujuan';
    const kurir = o.kurir || 'JNE Botanical Express';

    if (o.status === 'completed') {
      return {
        pct: 100,
        stepDone: 4,
        stepActive: 4,
        moving: false,
        arrivedWaiting: false,
        completed: true,
        badge: 'Pesanan Diterima • Garansi Tumbuh Aktif',
        chipCls: 'chip--accent',
        liveTag: 'SELESAI DITERIMA',
        logTitle: `Dikonfirmasi diterima oleh Pembeli${o.confirmedAt ? ' (' + o.confirmedAt + ')' : ''}`,
        logDesc: 'Bibit telah diterima dengan baik. Garansi Tumbuh 14 Hari resmi aktif.',
      };
    }

    if (o.status === 'shipping') {
      const tk = o.tahapKirim || 'Di perjalanan';
      if (tk === 'Sampai di tujuan') {
        return {
          pct: 88,
          stepDone: 3,
          stepActive: 4,
          moving: false,
          arrivedWaiting: true,
          completed: false,
          badge: 'Paket Tiba • Konfirmasi Pesanan Sampai',
          chipCls: 'chip--arrive',
          liveTag: 'TIBA DI ALAMAT',
          logTitle: `Kurir ${kurir} tiba di alamat tujuan (${kota})`,
          logDesc: 'Paket bibit sudah diantar ke lokasi Anda. Silakan cek kondisi bibit lalu klik Konfirmasi Pesanan Sampai.',
        };
      }
      if (tk === 'Tiba di hub') {
        return {
          pct: 66,
          stepDone: 2,
          stepActive: 3,
          moving: true,
          arrivedWaiting: false,
          completed: false,
          badge: 'Transit di Hub Kota Tujuan',
          chipCls: 'chip--soft',
          liveTag: 'LIVE TRANSIT HUB',
          logTitle: `Paket tiba di Hub Sortir ${kota}`,
          logDesc: 'Suhu & kelembapan media aerasi diperiksa sebelum diantar kurir ke rumah Anda.',
        };
      }
      return {
        pct: 42,
        stepDone: 1,
        stepActive: 2,
        moving: true,
        arrivedWaiting: false,
        completed: false,
        badge: 'Dalam Perjalanan Kurir',
        chipCls: 'chip--soft',
        liveTag: 'KURIR BERANGKAT',
        logTitle: `Diserahkan ke armada ${kurir}`,
        logDesc: `Paket bibit sedang dalam perjalanan dari Kebun AgriBibit menuju ${kota}.`,
      };
    }

    const tp = typeof o.tahapProses === 'number' ? o.tahapProses : 0;
    if (tp >= 2) {
      return {
        pct: 28,
        stepDone: 1,
        stepActive: 2,
        moving: false,
        arrivedWaiting: false,
        completed: false,
        badge: 'Siap Diserahkan ke Kurir',
        chipCls: 'chip--soft',
        liveTag: 'MENUNGGU PICKUP KURIR',
        logTitle: 'Packing kayu & aerasi selesai di Kebun AgriBibit',
        logDesc: `Menunggu Admin menyerahkan paket ke kurir ${kurir}.`,
      };
    }
    if (tp === 1) {
      return {
        pct: 20,
        stepDone: 0,
        stepActive: 1,
        moving: false,
        arrivedWaiting: false,
        completed: false,
        badge: 'Sedang Dikemas & Aerasi',
        chipCls: 'chip--soft',
        liveTag: 'PROSES KEBUN',
        logTitle: 'Bibit sedang diberi hidrogel akar & kotak aerasi',
        logDesc: 'Tim kebun sedang menyiapkan ventilasi agar bibit tetap segar selama pengiriman.',
      };
    }
    return {
      pct: 10,
      stepDone: 0,
      stepActive: 1,
      moving: false,
      arrivedWaiting: false,
      completed: false,
      badge: 'Pesanan Baru (Menunggu Kemas)',
      chipCls: 'chip--soft',
      liveTag: 'PESANAN MASUK',
      logTitle: 'Pesanan diterima oleh Kebun AgriBibit',
      logDesc: 'Menunggu Admin memproses pengemasan dan pengiriman pesanan Anda.',
    };
  }

  function renderFootActions(o, vs, cleanId) {
    const reviewed = typeof ProductReviews !== 'undefined' && ProductReviews.hasReviewedOrder(cleanId);
    const firstProd = findProductForItem((o.items || [])[0]);

    if (vs.completed) {
      return `
        ${reviewed
          ? `<a href="detail-produk.html?id=${firstProd ? firstProd.id : 1}#ulasan" class="btn btn-outline btn-sm">${icon('Star', { size: 15, fill: true })} Lihat Ulasan Anda</a>`
          : `<button type="button" data-act="open-review" data-id="${esc(cleanId)}" class="btn btn-review btn-sm">${icon('Star', { size: 15, fill: true })} Beri Ulasan Bibit</button>`}
        <a href="shop.html" class="btn btn-primary btn-sm">${icon('ShoppingBag', { size: 15 })} Beli Lagi</a>`;
    }
    if (o.status === 'shipping' || vs.arrivedWaiting || vs.moving) {
      return `
        <a href="hubungi-kami.html" class="btn btn-outline btn-sm">Bantuan Pesanan</a>
        <button type="button" data-act="open-confirm" data-id="${esc(cleanId)}" class="btn btn-primary btn-sm${vs.arrivedWaiting ? ' txh-confirm-pulse' : ''}">
          ${icon('Check', { size: 15, sw: 2.6 })} Pesanan Sudah Sampai
        </button>`;
    }
    return `
      <button type="button" class="btn btn-outline btn-sm" disabled title="Pesanan belum dikirim oleh Admin">
        ${icon('Clock', { size: 15 })} Menunggu Dikirim Kebun
      </button>`;
  }

  function patchCardDOM(cleanId, o) {
    const card = view.querySelector(`[data-order-card="${cleanId}"]`);
    if (!card) return;
    const vs = computeVisualState(o);

    const chipEl = card.querySelector('[data-el="chip"]');
    if (chipEl) {
      chipEl.className = `chip ${vs.chipCls}`;
      chipEl.textContent = vs.badge;
    }

    const tagEl = card.querySelector('[data-el="livetag"]');
    if (tagEl) {
      tagEl.innerHTML = `<span class="txh-live-dot${vs.moving ? ' is-pulsing' : vs.arrivedWaiting ? ' is-arrived' : vs.completed ? ' is-done' : ''}"></span>${esc(vs.liveTag)}`;
    }

    const fillEl = card.querySelector('[data-el="bar-fill"]');
    if (fillEl) fillEl.style.width = `${vs.pct}%`;

    const truckEl = card.querySelector('[data-el="truck"]');
    if (truckEl) {
      truckEl.style.left = `${vs.pct}%`;
      truckEl.classList.toggle('is-moving', Boolean(vs.moving));
      truckEl.classList.toggle('is-arrived', Boolean(vs.arrivedWaiting));
      truckEl.classList.toggle('is-done', Boolean(vs.completed));
      truckEl.innerHTML = vs.completed
        ? icon('Check', { size: 15, sw: 3 })
        : vs.pct <= 28 && !vs.moving
          ? icon('Sprout', { size: 15 })
          : icon('Truck', { size: 15 });
    }

    card.querySelectorAll('[data-step-idx]').forEach((stepEl) => {
      const idx = Number(stepEl.dataset.stepIdx);
      const isDone = idx <= vs.stepDone || vs.completed;
      const isCur = !vs.completed && idx === vs.stepActive;
      stepEl.classList.toggle('is-done', isDone);
      stepEl.classList.toggle('is-current', isCur);
      const dotEl = stepEl.querySelector('.txh-track__dot');
      if (dotEl) {
        dotEl.innerHTML = isDone ? icon('Check', { size: 12, sw: 3 }) : String(idx);
      }
    });

    const logBox = card.querySelector('[data-el="log-box"]');
    if (logBox) {
      logBox.classList.remove('is-flash');
      void logBox.offsetWidth;
      logBox.classList.add('is-flash');
      logBox.innerHTML = `
        <div class="txh-log__time">${nowTimeWIB()}</div>
        <div class="txh-log__body">
          <strong>${esc(vs.logTitle)}</strong>
          <span>${esc(vs.logDesc)}</span>
        </div>`;
    }

    const bannerWrap = card.querySelector('[data-el="arrive-banner"]');
    if (bannerWrap) {
      if (vs.arrivedWaiting) {
        bannerWrap.innerHTML = `
          <div class="txh-arrive-callout">
            <div class="txh-arrive-callout__left">
              <span class="txh-arrive-callout__icon">${icon('CheckCircle2', { size: 20 })}</span>
              <div>
                <strong>Paket Bibit Sudah Sampai di Alamat Anda!</strong>
                <span>Hanya Pembeli yang dapat menyelesaikan pesanan. Pastikan bibit diterima segar lalu klik konfirmasi.</span>
              </div>
            </div>
            <button type="button" data-act="open-confirm" data-id="${esc(cleanId)}" class="btn btn-primary btn-sm txh-confirm-pulse">
              ${icon('Check', { size: 16, sw: 2.6 })} Konfirmasi Pesanan Sampai
            </button>
          </div>`;
      } else if (vs.completed) {
        bannerWrap.innerHTML = `
          <div class="txh-done-callout">
            <span class="txh-done-callout__icon">${icon('ShieldCheck', { size: 18 })}</span>
            <span><strong>Pesanan Selesai Diterima Pembeli</strong> • Garansi Tumbuh 14 Hari aktif melindungi bibit Anda.</span>
          </div>`;
      } else {
        bannerWrap.innerHTML = '';
      }
    }

    const actionWrap = card.querySelector('[data-el="foot-actions"]');
    if (actionWrap) {
      actionWrap.innerHTML = renderFootActions(o, vs, cleanId);
    }
  }

  function runLiveCourierSimulation(o, fromPacking = false) {
    const cleanId = String(o.orderId || o.id || '').replace(/^#/, '');
    clearOrderTimers(cleanId);

    const kota = o.kota || 'Kota Tujuan';
    const kurir = o.kurir || 'JNE Botanical Express';
    const timers = [];
    let delay = 0;

    if (fromPacking) {
      liveStates.set(cleanId, {
        pct: 24,
        stepDone: 1,
        stepActive: 1,
        moving: true,
        arrivedWaiting: false,
        completed: false,
        badge: 'Sedang Dikemas & Aerasi',
        chipCls: 'chip--soft',
        liveTag: 'SIMULASI • KEBUN',
        logTitle: 'Bibit segar dikemas kotak aerasi di Kebun AgriBibit',
        logDesc: `Menyiapkan penyerahan paket ke kurir ${kurir}...`,
      });
      patchCardDOM(cleanId, o);
      delay += 1300;
    }

    timers.push(setTimeout(() => {
      o.status = 'shipping';
      o.tahapKirim = 'Di perjalanan';
      persistCourierStage(cleanId, 'Di perjalanan', false);
      liveStates.set(cleanId, {
        pct: 44,
        stepDone: 1,
        stepActive: 2,
        moving: true,
        arrivedWaiting: false,
        completed: false,
        badge: 'Dalam Perjalanan Kurir',
        chipCls: 'chip--soft',
        liveTag: 'LIVE • KURIR JALAN',
        logTitle: `Kurir ${kurir} membawa paket dari Kebun AgriBibit`,
        logDesc: `Armada ekspedisi sedang melaju menuju ${kota}...`,
      });
      patchCardDOM(cleanId, o);
    }, delay + 80));

    timers.push(setTimeout(() => {
      o.tahapKirim = 'Tiba di hub';
      persistCourierStage(cleanId, 'Tiba di hub', false);
      liveStates.set(cleanId, {
        pct: 68,
        stepDone: 2,
        stepActive: 3,
        moving: true,
        arrivedWaiting: false,
        completed: false,
        badge: 'Transit di Hub Kota Tujuan',
        chipCls: 'chip--soft',
        liveTag: 'LIVE • TRANSIT HUB',
        logTitle: `Paket tiba di Hub Sortir ${kota}`,
        logDesc: 'Kurir pengantar lokal sedang menuju ke alamat rumah Anda...',
      });
      patchCardDOM(cleanId, o);
    }, delay + 2300));

    timers.push(setTimeout(() => {
      o.tahapKirim = 'Sampai di tujuan';
      o.simSeen = true;
      persistCourierStage(cleanId, 'Sampai di tujuan', true);
      liveStates.delete(cleanId);
      simTimers.delete(cleanId);
      patchCardDOM(cleanId, o);
      toast('Paket tiba di alamat!', `Pesanan #${cleanId} sudah sampai. Silakan klik "Pesanan Sudah Sampai".`);
    }, delay + 4600));

    simTimers.set(cleanId, timers);
  }

  function autoStartPendingSimulations(orders) {
    if (document.visibilityState === 'hidden') return;
    orders.forEach((o) => {
      const cleanId = String(o.orderId || o.id || '').replace(/^#/, '');
      if (o.status === 'shipping' && !o.simSeen && !simTimers.has(cleanId)) {
        runLiveCourierSimulation(o, false);
      }
    });
  }

  function findProductForItem(it) {
    if (!it || typeof products === 'undefined') return null;
    return products.find((p) => (it.sku && p.sku === it.sku) || p.name === it.name) || products[0] || null;
  }

  function confirmOrderReceived(cleanId) {
    clearOrderTimers(cleanId);
    liveStates.delete(cleanId);
    const timeStr = nowTimeWIB();

    const bOrders = AuthUser.getOrders();
    bOrders.forEach((bo) => {
      const id = String(bo.orderId || bo.id || '').replace(/^#/, '');
      if (id === cleanId) {
        bo.status = 'completed';
        bo.stage = 4;
        bo.tahapKirim = 'Terkirim';
        bo.simSeen = true;
        bo.confirmedAt = timeStr;
        bo.statusLabel = 'Pesanan Diterima • Garansi Tumbuh Aktif';
      }
    });
    AuthUser.saveOrders(bOrders);

    try {
      const adminOrders = JSON.parse(localStorage.getItem('agribibit.db.orders')) || [];
      adminOrders.forEach((ao) => {
        if (ao.id === cleanId) {
          ao.status = 'Selesai';
          ao.tahapKirim = 'Terkirim';
          ao.tepat = true;
          ao.confirmedBy = 'Pembeli';
          ao.confirmedAt = timeStr;
        }
      });
      localStorage.setItem('agribibit.db.orders', JSON.stringify(adminOrders));
    } catch (e) {  }

    justCompletedId = cleanId;
    confirmOrderId = null;

    if (typeof ProductReviews !== 'undefined' && !ProductReviews.hasReviewedOrder(cleanId)) {
      reviewDraft = {
        rating: 5,
        tags: ['Bibit segar & sehat', 'Packing aerasi aman'],
        text: '',
        photo: '',
      };
      reviewOrderId = cleanId;
    }

    drawPage();
    toast('Pesanan Selesai Diterima!', `Garansi Tumbuh 14 Hari untuk #${cleanId} aktif. Yuk beri ulasan bibit Anda!`);
    setTimeout(() => { justCompletedId = null; }, 2200);
  }

  function submitOrderReview(cleanId) {
    const orders = syncOrdersWithAdmin();
    const ord = orders.find((o) => String(o.orderId || o.id || '').replace(/^#/, '') === cleanId);
    if (!ord) return;

    const textInput = view.querySelector('#txh-rev-text');
    const typedText = textInput ? textInput.value.trim() : reviewDraft.text.trim();
    const tagSentence = reviewDraft.tags.length ? reviewDraft.tags.join(', ') + '.' : '';
    const finalText = typedText || (tagSentence ? `${tagSentence} Bibit diterima segar dan memuaskan!` : 'Bibit diterima dalam kondisi sehat dan segar, terima kasih AgriBibit!');

    const dateStr = todayDateStr();
    const items = (ord.items && ord.items.length) ? ord.items : [{ sku: 'TH-001', name: 'Bibit Tanaman AgriBibit', image: '' }];

    const entries = items.map((it, idx) => ({
      id: `rev-${Date.now()}-${idx}`,
      orderId: cleanId,
      sku: it.sku || '',
      productName: it.name || 'Bibit Tanaman',
      productImage: it.image || '',
      name: userName,
      avatar: initials,
      verified: true,
      rating: reviewDraft.rating,
      tags: [...reviewDraft.tags],
      variant: `${it.name}${it.meta ? ' • ' + it.meta : ''}`,
      text: finalText,
      image: reviewDraft.photo || '',
      date: dateStr,
      createdAt: Date.now(),
    }));

    if (typeof ProductReviews !== 'undefined') {
      ProductReviews.addBatch(entries);
    }

    reviewOrderId = null;
    drawPage();
    toast('Ulasan berhasil dikirim!', 'Terima kasih! Ulasan Anda sudah tampil di halaman Detail Produk & Beranda.');
  }

  const itemHTML = (it) => `
    <div class="txh-item">
      <div class="txh-item__left">
        <img src="${esc(it.image)}" alt="${esc(it.name)}" class="txh-item__img" loading="lazy" />
        <div><div class="txh-item__name">${esc(it.name)}</div><div class="txh-item__meta">${esc(it.meta || `Jumlah: ${it.qty} bibit`)}</div></div>
      </div>
      <div class="txh-item__price">Rp ${formatPrice(it.price * (it.qty || 1))}</div>
    </div>`;

  function renderSubmittedReviewBox(o, cleanId) {
    if (typeof ProductReviews === 'undefined') return '';
    const revs = ProductReviews.getByOrder(cleanId);
    if (!revs.length) return '';
    const r = revs[0];
    const prod = findProductForItem((o.items || [])[0]);
    return `
      <div class="txh-my-review">
        <div class="txh-my-review__head">
          <div class="txh-my-review__left">
            <span class="txh-my-review__badge">${icon('Check', { size: 12, sw: 3 })} Ulasan Anda Terkirim</span>
            ${Stars(r.rating, 14)}
            <strong>${r.rating}.0 / 5</strong>
          </div>
          <a href="detail-produk.html?id=${prod ? prod.id : 1}#ulasan" class="txh-my-review__link">
            Lihat di Halaman Produk ${icon('ArrowUpRight', { size: 14 })}
          </a>
        </div>
        ${r.tags && r.tags.length ? `
          <div class="txh-my-review__tags">
            ${r.tags.map((t) => `<span>${esc(t)}</span>`).join('')}
          </div>` : ''}
        <p class="txh-my-review__text">"${esc(r.text)}"</p>
        ${r.image ? `<img src="${r.image}" alt="Foto ulasan Anda" class="txh-my-review__photo" />` : ''}
      </div>`;
  }

  function renderConfirmModal(orders) {
    if (!confirmOrderId) return '';
    const ord = orders.find((o) => String(o.orderId || o.id || '').replace(/^#/, '') === confirmOrderId);
    if (!ord) return '';
    const itemSummary = (ord.items || []).map((it) => `${it.name} (×${it.qty || 1})`).join(', ');
    return `
      <div class="txh-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="txh-modal-title">
        <div class="txh-modal">
          <div class="txh-modal__icon">${icon('Package', { size: 28 })}</div>
          <h3 id="txh-modal-title" class="txh-modal__title">Konfirmasi Pesanan Sudah Sampai?</h3>
          <p class="txh-modal__desc">
            Pastikan paket <strong>${esc(ord.id)}</strong> (${esc(itemSummary)}) telah Anda terima di alamat tujuan dalam kondisi baik dan segar.
          </p>
          <div class="txh-modal__perks">
            ${icon('ShieldCheck', { size: 18 })}
            <span><strong>Garansi Tumbuh 14 Hari</strong> otomatis aktif &amp; Anda dapat langsung memberi ulasan produk.</span>
          </div>
          <div class="txh-modal__actions">
            <button type="button" data-act="close-confirm" class="btn btn-outline">Cek Kembali</button>
            <button type="button" data-act="do-confirm" data-id="${esc(confirmOrderId)}" class="btn btn-primary">
              ${icon('Check', { size: 16, sw: 2.6 })} Ya, Bibit Sudah Diterima
            </button>
          </div>
        </div>
      </div>`;
  }

  function renderReviewModal(orders) {
    if (!reviewOrderId) return '';
    const ord = orders.find((o) => String(o.orderId || o.id || '').replace(/^#/, '') === reviewOrderId);
    if (!ord) return '';

    return `
      <div class="txh-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="txh-rev-title">
        <div class="txh-modal txh-modal--review">
          <div class="txh-rev-head">
            <div>
              <span class="chip chip--soft">Pesanan ${esc(ord.id)} Selesai</span>
              <h3 id="txh-rev-title" class="txh-modal__title" style="margin-top:8px">Beri Nilai &amp; Ulasan Bibit</h3>
            </div>
            <button type="button" data-act="close-review" class="icon-btn icon-btn--sm" aria-label="Tutup">${icon('X', { size: 16 })}</button>
          </div>

          <div class="txh-rev-products">
            ${(ord.items || []).map((it) => `
              <div class="txh-rev-prod">
                <img src="${esc(it.image)}" alt="${esc(it.name)}" />
                <div>
                  <strong>${esc(it.name)}</strong>
                  <span>${esc(it.meta || `Jumlah: ${it.qty || 1} bibit`)}</span>
                </div>
              </div>`).join('')}
          </div>

          <div class="txh-rev-stars-box">
            <div class="txh-rev-stars-label">Kualitas Bibit &amp; Pengemasan</div>
            <div class="txh-rev-stars" role="radiogroup" aria-label="Pilih bintang 1 sampai 5">
              ${[1, 2, 3, 4, 5].map((n) => `
                <button type="button" data-act="set-star" data-star="${n}" class="txh-star-btn${n <= reviewDraft.rating ? ' is-on' : ''}" aria-label="${n} bintang">
                  ${icon('Star', { size: 28, fill: n <= reviewDraft.rating, sw: 1.7 })}
                </button>`).join('')}
            </div>
            <div class="txh-rev-rating-text" id="txh-rev-rating-text">${esc(RATING_LABELS[reviewDraft.rating])}</div>
          </div>

          <div class="txh-rev-field">
            <label class="txh-rev-label">Pilih Tag Cepat</label>
            <div class="txh-rev-tags">
              ${QUICK_TAGS.map((tg) => {
                const on = reviewDraft.tags.includes(tg);
                return `<button type="button" data-act="toggle-tag" data-tag="${esc(tg)}" class="txh-tag-chip${on ? ' is-on' : ''}">${on ? icon('Check', { size: 12, sw: 3 }) : '+'} ${esc(tg)}</button>`;
              }).join('')}
            </div>
          </div>

          <div class="txh-rev-field">
            <label class="txh-rev-label" for="txh-rev-text">Ceritakan Pengalaman Anda</label>
            <textarea id="txh-rev-text" rows="3" placeholder="Bagaimana kesegaran daun, akar, dan kerapian packing aerasi saat bibit sampai?">${esc(reviewDraft.text)}</textarea>
          </div>

          <div class="txh-rev-field">
            <label class="txh-rev-label">Foto Bibit Saat Diterima (Opsional)</label>
            <div class="txh-rev-upload-row">
              <label class="txh-upload-btn" for="txh-rev-file">
                ${icon('Plus', { size: 15 })} ${reviewDraft.photo ? 'Ganti Foto' : 'Unggah Foto Bibit'}
              </label>
              <input type="file" id="txh-rev-file" accept="image/*" hidden />
              ${reviewDraft.photo ? `
                <div class="txh-rev-preview">
                  <img src="${reviewDraft.photo}" alt="Pratinjau foto ulasan" />
                  <button type="button" data-act="remove-photo" class="txh-rev-preview__del" aria-label="Hapus foto">${icon('X', { size: 12 })}</button>
                </div>` : '<span class="txh-rev-upload-hint">JPG / PNG otomatis dikompresi ringan</span>'}
            </div>
          </div>

          <div class="txh-modal__actions" style="margin-top:18px">
            <button type="button" data-act="close-review" class="btn btn-outline">Nanti Saja</button>
            <button type="button" data-act="submit-review" data-id="${esc(reviewOrderId)}" class="btn btn-primary">
              ${icon('Send', { size: 15 })} Kirim Ulasan
            </button>
          </div>
        </div>
      </div>`;
  }

  function drawPage() {
    const orders = syncOrdersWithAdmin();
    const statusMenu = [
      { id: 'all', label: 'Semua transaksi', count: orders.length },
      { id: 'packing', label: 'Diproses di kebun', count: orders.filter((o) => o.status === 'packing').length },
      { id: 'shipping', label: 'Dalam pengiriman', count: orders.filter((o) => o.status === 'shipping').length },
      { id: 'completed', label: 'Selesai diterima', count: orders.filter((o) => o.status === 'completed').length },
    ];
    const totalPlanted = orders.reduce((sum, o) => sum + (o.items ? o.items.reduce((s, it) => s + (it.qty || 1), 0) : 0), 0);

    function renderOrders() {
      const filtered = orders.filter((o) => {
        if (activeTab !== 'all' && o.status !== activeTab) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchId = (o.id || '').toLowerCase().includes(q);
          const matchItem = (o.items || []).some((it) => (it.name || '').toLowerCase().includes(q));
          if (!matchId && !matchItem) return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        return `
          <div class="empty-state" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:48px 24px">
            <span class="empty-state__icon">${icon('ShoppingBag', { size: 32 })}</span>
            <h3 class="empty-state__title">Belum Ada Riwayat Pembelian</h3>
            <p class="empty-state__text">Anda belum memiliki transaksi pembelian bibit pada kategori ini. Yuk mulai pilih bibit tanaman favorit Anda di katalog kami!</p>
            <a href="shop.html" class="btn btn-primary" style="margin-top:8px">Mulai Belanja Sekarang ${icon('ArrowRight', { size: 16 })}</a>
          </div>`;
      }

      return filtered.map((o) => {
        const cleanId = String(o.orderId || o.id || '').replace(/^#/, '');
        const vs = computeVisualState(o);
        const isCelebrated = justCompletedId === cleanId;
        const reviewed = typeof ProductReviews !== 'undefined' && ProductReviews.hasReviewedOrder(cleanId);

        const simBtnHTML = o.status === 'packing'
          ? `<button type="button" data-act="sim-ship" data-id="${esc(cleanId)}" class="txh-sim-btn" title="Simulasikan pengiriman kurir secara langsung untuk presentasi">${icon('Play', { size: 12, fill: true })} Simulasi Pengiriman</button>`
          : o.status === 'shipping'
            ? `<button type="button" data-act="sim-replay" data-id="${esc(cleanId)}" class="txh-sim-btn" title="Putar ulang animasi perjalanan kurir">${icon('Play', { size: 12, fill: true })} Putar Animasi Kurir</button>`
            : '';

        const stepNode = (idx, label) => {
          const isDone = idx <= vs.stepDone || vs.completed;
          const isCur = !vs.completed && idx === vs.stepActive;
          return `
            <div class="txh-track__step${isDone ? ' is-done' : ''}${isCur ? ' is-current' : ''}" data-step-idx="${idx}">
              <span class="txh-track__dot">${isDone ? icon('Check', { size: 12, sw: 3 }) : idx}</span>
              <span>${label}</span>
            </div>`;
        };

        return `
        <article class="txh-card reveal is-visible${isCelebrated ? ' is-celebrated' : ''}" data-order-card="${esc(cleanId)}">
          <div class="txh-card__head">
            <div class="txh-card__id-group">
              <span class="chip ${vs.chipCls}" data-el="chip">${esc(vs.badge)}</span>
              <span class="txh-card__id">${esc(o.id)}</span>
            </div>
            <div class="txh-card__date">${esc(o.date)} • Ekspedisi: <strong>${esc(o.kurir || 'JNE Botanical Express')}</strong></div>
          </div>

          ${o.alamat ? `<div class="txh-resi">Penerima: <strong>${esc(o.penerima || userName)} (${esc(o.hp || '-')})</strong> • Tujuan: <strong>${esc(o.alamat)}, ${esc(o.kota || '')}</strong></div>` : ''}
          ${o.resi ? `<div class="txh-resi">No. Resi: <strong>${esc(o.resi)}</strong></div>` : ''}

          <div class="txh-track">
            <div class="txh-track__top">
              <span class="txh-live-pill" data-el="livetag">
                <span class="txh-live-dot${vs.moving ? ' is-pulsing' : vs.arrivedWaiting ? ' is-arrived' : vs.completed ? ' is-done' : ''}"></span>
                ${esc(vs.liveTag)}
              </span>
              ${simBtnHTML}
            </div>

            <div class="txh-route">
              <div class="txh-route__rail">
                <div class="txh-route__fill" data-el="bar-fill" style="width:${vs.pct}%"></div>
              </div>
              <div class="txh-route__vehicle${vs.moving ? ' is-moving' : ''}${vs.arrivedWaiting ? ' is-arrived' : ''}${vs.completed ? ' is-done' : ''}" data-el="truck" style="left:${vs.pct}%">
                ${vs.completed
                  ? icon('Check', { size: 15, sw: 3 })
                  : vs.pct <= 28 && !vs.moving
                    ? icon('Sprout', { size: 15 })
                    : icon('Truck', { size: 15 })}
              </div>
            </div>

            <div class="txh-track__steps">
              ${stepNode(1, 'Dikemas &amp; Aerasi')}
              ${stepNode(2, 'Dibawa Kurir')}
              ${stepNode(3, 'Transit Hub Kota')}
              ${stepNode(4, 'Sampai di Tujuan')}
            </div>

            <div class="txh-log" data-el="log-box">
              <div class="txh-log__time">${o.confirmedAt || o.time || 'Update Terkini'}</div>
              <div class="txh-log__body">
                <strong>${esc(vs.logTitle)}</strong>
                <span>${esc(vs.logDesc)}</span>
              </div>
            </div>

            <div data-el="arrive-banner">
              ${vs.arrivedWaiting ? `
                <div class="txh-arrive-callout">
                  <div class="txh-arrive-callout__left">
                    <span class="txh-arrive-callout__icon">${icon('CheckCircle2', { size: 20 })}</span>
                    <div>
                      <strong>Paket Bibit Sudah Sampai di Alamat Anda!</strong>
                      <span>Hanya Pembeli yang dapat menyelesaikan pesanan. Pastikan bibit diterima segar lalu klik konfirmasi.</span>
                    </div>
                  </div>
                  <button type="button" data-act="open-confirm" data-id="${esc(cleanId)}" class="btn btn-primary btn-sm txh-confirm-pulse">
                    ${icon('Check', { size: 16, sw: 2.6 })} Konfirmasi Pesanan Sampai
                  </button>
                </div>` : vs.completed ? `
                <div class="txh-done-callout">
                  <span class="txh-done-callout__icon">${icon('ShieldCheck', { size: 18 })}</span>
                  <span><strong>Pesanan Selesai Diterima Pembeli</strong> • Garansi Tumbuh 14 Hari aktif.${!reviewed ? ' Yuk bagikan ulasan bibit Anda!' : ''}</span>
                </div>` : ''}
            </div>
          </div>

          <div class="txh-items">
            ${(o.items || []).map(itemHTML).join('')}
          </div>

          ${vs.completed ? renderSubmittedReviewBox(o, cleanId) : ''}

          <div class="txh-card__foot">
            <div class="txh-card__total">Total belanja: <strong>Rp ${formatPrice(o.total || 0)}</strong></div>
            <div class="txh-card__actions" data-el="foot-actions">
              ${renderFootActions(o, vs, cleanId)}
            </div>
          </div>
        </article>`;
      }).join('');
    }

    view.innerHTML = `
    <div class="txh-page">
      <div class="container">
        <nav class="txh-breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a><span>/</span><span>Akun Saya</span><span>/</span>
          <span class="txh-breadcrumb__current">Profil, Lacak Pesanan &amp; Ulasan</span>
        </nav>

        <div class="txh-grid">
          <aside class="txh-side">
            <div class="txh-profile">
              <div class="txh-profile__avatar">${esc(initials)}</div>
              <h2 class="txh-profile__name">${esc(userName)}</h2>
              <span class="chip chip--soft">Member AgriBibit</span>
              <div class="txh-profile__stats">
                <div class="txh-profile__stat"><strong>${totalPlanted}</strong><span>Bibit dibeli</span></div>
                <div class="txh-profile__stat"><strong>14 Hari</strong><span>Garansi tumbuh</span></div>
              </div>
              <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: center;">
                <button type="button" data-act="logout-user" class="btn btn-outline btn-sm" style="width:100%">Keluar dari Akun</button>
              </div>
            </div>

            <div class="txh-menu">
              <div class="txh-menu__title">Status Pesanan</div>
              <div class="txh-menu__list">
                ${statusMenu.map((m) => `
                  <button type="button" data-tab="${m.id}" class="txh-menu__item${activeTab === m.id ? ' is-active' : ''}">
                    <span>${m.label.replace('&', '&amp;')}</span><span class="txh-menu__badge">${m.count}</span>
                  </button>`).join('')}
              </div>
            </div>
          </aside>

          <div class="txh-main">
            <div class="txh-filters">
              <div class="search-field">
                ${icon('Search', { size: 18 })}
                <input type="search" id="txh-search" placeholder="Cari nomor pesanan atau nama bibit..." aria-label="Cari transaksi" value="${esc(searchQuery)}" />
              </div>
              <div class="txh-periods">
                ${periods.map((p) => `<button type="button" data-period="${p}" class="txh-period-btn${activePeriod === p ? ' is-active' : ''}">${p}</button>`).join('')}
              </div>
            </div>

            <div id="txh-orders-list" style="display:flex;flex-direction:column;gap:var(--sp-5)">
              ${renderOrders()}
            </div>
          </div>
        </div>
      </div>
      ${renderConfirmModal(orders)}
      ${renderReviewModal(orders)}
    </div>`;

    const listEl = view.querySelector('#txh-orders-list');
    const searchInput = view.querySelector('#txh-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim();
        listEl.innerHTML = renderOrders();
      });
    }

    const revTextEl = view.querySelector('#txh-rev-text');
    if (revTextEl) {
      revTextEl.addEventListener('input', () => {
        reviewDraft.text = revTextEl.value;
      });
    }

    const revFileEl = view.querySelector('#txh-rev-file');
    if (revFileEl) {
      revFileEl.addEventListener('change', () => {
        const file = revFileEl.files && revFileEl.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const im = new Image();
          im.onload = () => {
            const maxSide = 480;
            const scale = Math.min(1, maxSide / Math.max(im.width, im.height));
            const c = document.createElement('canvas');
            c.width = Math.round(im.width * scale);
            c.height = Math.round(im.height * scale);
            c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
            reviewDraft.photo = c.toDataURL('image/jpeg', 0.78);
            drawPage();
          };
          im.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    }

    autoStartPendingSimulations(orders);
  }

  view.addEventListener('click', (ev) => {

    if (ev.target.classList && ev.target.classList.contains('txh-modal-backdrop')) {
      confirmOrderId = null;
      reviewOrderId = null;
      drawPage();
      return;
    }

    const tab = ev.target.closest('[data-tab]');
    if (tab) {
      activeTab = tab.dataset.tab;
      drawPage();
      return;
    }

    const period = ev.target.closest('[data-period]');
    if (period) {
      activePeriod = period.dataset.period;
      drawPage();
      return;
    }

    const actEl = ev.target.closest('[data-act]');
    if (!actEl) return;
    const act = actEl.dataset.act;

    if (act === 'logout-user') {
      clearAllTimers();
      AuthUser.clear();
      toast('Berhasil keluar', 'Anda sekarang dalam mode Guest.');
      Router.go('/');
      return;
    }

    if (act === 'sim-ship' || act === 'sim-replay') {
      const id = actEl.dataset.id;
      const orders = syncOrdersWithAdmin();
      const ord = orders.find((o) => String(o.orderId || o.id || '').replace(/^#/, '') === id);
      if (ord && ord.status !== 'completed') {
        ord.simSeen = false;
        toast('Simulasi dimulai', `Memutar animasi perjalanan kurir untuk pesanan #${id}...`);
        runLiveCourierSimulation(ord, act === 'sim-ship');
      }
      return;
    }

    if (act === 'open-confirm') {
      const id = actEl.dataset.id;
      clearOrderTimers(id);
      liveStates.delete(id);
      persistCourierStage(id, 'Sampai di tujuan', true);
      confirmOrderId = id;
      drawPage();
      return;
    }

    if (act === 'close-confirm') {
      confirmOrderId = null;
      drawPage();
      return;
    }

    if (act === 'do-confirm') {
      confirmOrderReceived(actEl.dataset.id);
      return;
    }

    if (act === 'open-review') {
      reviewDraft = {
        rating: 5,
        tags: ['Bibit segar & sehat', 'Packing aerasi aman'],
        text: '',
        photo: '',
      };
      reviewOrderId = actEl.dataset.id;
      drawPage();
      return;
    }

    if (act === 'close-review') {
      reviewOrderId = null;
      drawPage();
      return;
    }

    if (act === 'set-star') {
      const revTextEl = view.querySelector('#txh-rev-text');
      if (revTextEl) reviewDraft.text = revTextEl.value;
      reviewDraft.rating = Number(actEl.dataset.star) || 5;
      drawPage();
      return;
    }

    if (act === 'toggle-tag') {
      const revTextEl = view.querySelector('#txh-rev-text');
      if (revTextEl) reviewDraft.text = revTextEl.value;
      const tg = actEl.dataset.tag;
      if (reviewDraft.tags.includes(tg)) {
        reviewDraft.tags = reviewDraft.tags.filter((x) => x !== tg);
      } else {
        reviewDraft.tags = [...reviewDraft.tags, tg];
      }
      drawPage();
      return;
    }

    if (act === 'remove-photo') {
      const revTextEl = view.querySelector('#txh-rev-text');
      if (revTextEl) reviewDraft.text = revTextEl.value;
      reviewDraft.photo = '';
      drawPage();
      return;
    }

    if (act === 'submit-review') {
      submitOrderReview(actEl.dataset.id);
    }
  });

  function onAdminOrderChange(ev) {
    if (ev.key === 'agribibit.db.orders') {
      if (simTimers.size > 0 || confirmOrderId || reviewOrderId) {
        syncOrdersWithAdmin();
        return;
      }
      drawPage();
      toast('Update Lacak Pesanan', 'Status pesanan diperbarui secara live dari Kebun / Ekspedisi.');
    }
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'visible' && !confirmOrderId && !reviewOrderId) {
      const orders = syncOrdersWithAdmin();
      autoStartPendingSimulations(orders);
    }
  }

  window.addEventListener('storage', onAdminOrderChange);
  document.addEventListener('visibilitychange', onVisibilityChange);

  drawPage();

  return () => {
    clearAllTimers();
    window.removeEventListener('storage', onAdminOrderChange);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
};
