/* TRANSAKSI BERHASIL */
Pages.transactionSuccess = function (view) {
  let tx = null;
  try {
    tx = JSON.parse(sessionStorage.getItem('agribibit.lastTx'));
  } catch (e) { tx = null; }

  if (!tx && typeof AuthUser !== 'undefined') {
    const latest = AuthUser.getOrders()[0];
    if (latest) {
      tx = {
        id: latest.id || '#PS-9012',
        dateTime: `${latest.date || 'Hari ini'}${latest.time ? ', ' + latest.time : ''}`,
        payLabel: latest.payLabel || 'Virtual Account BCA (Lunas)',
        total: latest.total || 0,
        penerima: latest.penerima || '',
        kota: latest.kota || '',
        resi: latest.resi || '',
        items: latest.items || [],
      };
    }
  }

  const orderNo = (tx && tx.id) || '#PS-9012';
  const dateTime = (tx && tx.dateTime) || 'Baru saja';
  const payLabel = (tx && tx.payLabel) || 'Virtual Account (Lunas)';
  const totalVal = tx ? tx.total : 133000;
  const items = (tx && Array.isArray(tx.items) && tx.items.length) ? tx.items : [
    { name: 'Alpukat Aligator', qty: 2 },
    { name: 'Monstera Variegata', qty: 1 },
  ];
  const totalQty = items.reduce((s, it) => s + (it.qty || 1), 0);

  view.innerHTML = `
  <div class="txs-page">
    <div class="txs-card reveal">
      <div class="txs-icon-wrap">
        <div class="txs-icon">${icon('Check', { size: 42, sw: 3 })}</div>
        <div class="txs-icon-sub">${icon('Sprout', { size: 15 })}</div>
      </div>

      <span class="eyebrow">Pembayaran Diterima • Verifikasi Otomatis</span>
      <h1 class="txs-title">Transaksi Berhasil!</h1>
      <p class="txs-desc">Terima kasih, pesanan bibit Anda telah masuk ke sistem kebun AgriBibit dan segera dikemas dengan media aerasi khusus.</p>

      <div class="txs-receipt">
        <div class="txs-receipt__head"><span>NO. PESANAN</span><strong>${esc(orderNo)}</strong></div>
        <div class="txs-receipt__row"><span>Waktu transaksi</span><strong>${esc(dateTime)}</strong></div>
        ${tx && tx.penerima ? `<div class="txs-receipt__row"><span>Tujuan pengiriman</span><strong>${esc(tx.penerima)}${tx.kota ? ' • ' + esc(tx.kota) : ''}</strong></div>` : ''}
        <div class="txs-receipt__row txs-receipt__row--border"><span>Metode pembayaran</span><strong>${esc(payLabel)}</strong></div>
        <div class="txs-receipt__total"><span>Total pembayaran</span><strong>Rp ${formatPrice(totalVal)}</strong></div>

        <div class="txs-bars-wrap">
          <div class="txs-bars-label">Ringkasan Item Bibit (${items.length} varietas • ${totalQty} bibit)</div>
          <div class="txs-bars">
            ${items.slice(0, 3).map((it, idx) => `<div class="txs-bar txs-bar--${idx + 1}" title="${esc(it.name)} (x${it.qty || 1})"></div>`).join('')}
          </div>
          <div class="txs-bars-note">${items.map((it) => `${esc(it.name)} (×${it.qty || 1})`).join(' • ')}</div>
        </div>
      </div>

      <div class="txs-actions">
        <button type="button" data-act="history" class="btn btn-primary">${icon('Truck', { size: 18 })} Lacak Pesanan Sekarang</button>
        <button type="button" data-act="invoice" class="btn btn-outline">${icon('Download', { size: 18 })} Unduh Invoice</button>
      </div>

      <a href="shop.html" class="txs-back">${icon('ArrowLeft', { size: 16 })} Kembali ke Katalog Bibit</a>
    </div>
  </div>`;

  view.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-act]');
    if (!t) return;
    if (t.dataset.act === 'history') Router.go('/account/transactions');
    if (t.dataset.act === 'invoice') toast('Invoice diunduh', `Invoice PDF ${orderNo} berhasil diunduh.`);
  });
};
