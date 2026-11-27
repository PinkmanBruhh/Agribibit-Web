(function () {
  var A = AgriData, PER = 6;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var rp = function (n) { return 'Rp ' + n.toLocaleString('id-ID'); };
  var st = '', page = 1, all = [], shown = [], curOrder = null;
  var nm = function (i) { return /^Bibit /i.test(i.nama) ? i.nama : 'Bibit ' + i.nama; };

  function syncToBuyerOrders(order, resetSim) {
    try {
      var bOrders = JSON.parse(localStorage.getItem('agribibit.user.orders'));
      if (!Array.isArray(bOrders)) return;
      var changed = false;
      bOrders.forEach(function (bo) {
        var cleanId = String(bo.orderId || bo.id || '').replace(/^#/, '');
        if (cleanId === order.id) {
          changed = true;
          if (order.status === 'Proses') {
            bo.status = 'packing';
            var tp = order.tahapProses || 0;
            bo.tahapProses = tp;
            bo.tahapKirim = null;
            bo.stage = tp === 0 ? 0 : 1;
            bo.simSeen = false;
            bo.statusLabel = tp === 0 ? 'Pesanan Baru (Menunggu Kemas)' : tp === 1 ? 'Sedang Dikemas & Aerasi' : 'Siap Diserahkan ke Kurir';
          } else if (order.status === 'Dikirim') {
            bo.status = 'shipping';
            var tk = order.tahapKirim || 'Di perjalanan';
            bo.tahapKirim = tk;
            if (order.shippedAt) bo.shippedAt = order.shippedAt;
            if (resetSim) bo.simSeen = false;
            bo.stage = tk === 'Sampai di tujuan' ? 3 : tk === 'Tiba di hub' ? 2.5 : 2;
            bo.statusLabel = tk === 'Sampai di tujuan'
              ? 'Paket Tiba • Menunggu Konfirmasi Anda'
              : tk === 'Tiba di hub'
                ? 'Transit di Hub Kota Tujuan'
                : 'Dalam Perjalanan Kurir';
          }
        }
      });
      if (changed) localStorage.setItem('agribibit.user.orders', JSON.stringify(bOrders));
    } catch (e) {  }
  }

  function scheduleCourierAutoAdvance(orderId) {
    setTimeout(function () {
      var list = A.orders();
      var o = list.filter(function (x) { return x.id === orderId; })[0];
      if (o && o.status === 'Dikirim' && o.tahapKirim === 'Di perjalanan') {
        o.tahapKirim = 'Tiba di hub';
        A.saveOrders(list);
        syncToBuyerOrders(o, false);
        init();
      }
    }, 2800);

    setTimeout(function () {
      var list = A.orders();
      var o = list.filter(function (x) { return x.id === orderId; })[0];
      if (o && o.status === 'Dikirim' && o.tahapKirim !== 'Sampai di tujuan') {
        o.tahapKirim = 'Sampai di tujuan';
        A.saveOrders(list);
        syncToBuyerOrders(o, false);
        init();
      }
    }, 5600);
  }

  function load() {
    all = A.orders().slice().sort(function (a, b) {
      return a.t < b.t ? 1 : a.t > b.t ? -1 : (a.id < b.id ? 1 : -1);
    });
  }
  function stats() {
    var c = { Proses: 0, Dikirim: 0 }, today = new Date().toDateString(), nt = 0;
    all.forEach(function (o) { if (c[o.status] !== undefined) c[o.status]++; if (new Date(o.t).toDateString() === today) nt++; });
    $('s0').textContent = all.length.toLocaleString('id-ID'); $('s1').textContent = c.Proses; $('s2').textContent = c.Dikirim;
    $('sNew').textContent = '+' + nt + ' hari ini';
  }
  function produk(o) { var f = o.items[0]; return esc(nm(f)) + (o.items.length > 1 ? ' <span class="more">+' + (o.items.length - 1) + ' lainnya</span>' : ''); }
  function render() {
    var t = $('q').value.trim().toLowerCase();
    shown = all.filter(function (o) { return (!st || o.status === st) && (!t || (o.id + ' ' + o.nama + ' ' + (o.kota || '')).toLowerCase().indexOf(t) > -1); });
    var pages = Math.max(1, Math.ceil(shown.length / PER)); if (page > pages) page = pages;
    var from = (page - 1) * PER, cur = shown.slice(from, from + PER);
    $('rows').innerHTML = cur.length ? cur.map(function (o, i) {
      var nextCtrl = '';
      if (o.status === 'Proses') {
        nextCtrl = '<button class="btn sm pri" data-next="' + o.id + '" title="Serahkan paket ke kurir & mulai pengiriman">Kirim Kurir</button>';
      } else if (o.status === 'Dikirim') {
        var waitText = o.tahapKirim === 'Sampai di tujuan' ? 'Menunggu Buyer' : (o.tahapKirim === 'Tiba di hub' ? 'Transit Hub' : 'Kurir Jalan');
        nextCtrl = '<span class="bd ' + (o.tahapKirim === 'Sampai di tujuan' ? 'y' : 'b') + '" style="font-size:11px;padding:4px 9px" title="Status Selesai hanya dapat dikonfirmasi oleh Pembeli">' + waitText + '</span>';
      } else if (o.status === 'Selesai') {
        nextCtrl = '<span class="bd g" style="font-size:11px;padding:4px 9px">Dikonfirmasi Buyer</span>';
      }
      return '<tr><td class="no">' + (from + i + 1) + '</td><td class="id">' + o.id + '</td><td><b>' + esc(o.nama) + '</b>' + (o.kota ? '<div class="ps" style="margin:0;font-size:12px">' + esc(o.kota) + '</div>' : '') + '</td><td>' + produk(o) + '</td><td class="mu">' + A.fmtDate(o.t) +
        '</td><td class="id">' + rp(A.orderTotal(o)) + '</td><td><span class="st ' + o.status.toLowerCase() + '">' + o.status + '</span></td><td class="r"><div class="filters" style="justify-content:flex-end;gap:6px">' + nextCtrl + '<button class="btn sm" data-id="' + o.id + '">Detail</button></div></td></tr>';
    }).join('') : '<tr><td colspan="8" class="empty">Tidak ada pesanan yang cocok. Ubah kata kunci atau filter.</td></tr>';
    $('count').innerHTML = shown.length ? 'Menampilkan <b>' + (from + 1) + '\u2013' + (from + cur.length) + '</b> dari <b>' + shown.length.toLocaleString('id-ID') + '</b> pesanan' : 'Menampilkan <b>0</b> pesanan';
    var h = '<button data-p="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '') + '>Sebelumnya</button>', last = 0;
    for (var i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 1) { if (last && i - last > 1) h += '<span class="gap">\u2026</span>'; h += '<button data-p="' + i + '"' + (i === page ? ' class="on" aria-current="page"' : '') + '>' + i + '</button>'; last = i; }
    }
    $('pg').innerHTML = h + '<button data-p="' + (page + 1) + '"' + (page === pages ? ' disabled' : '') + '>Selanjutnya</button>';
  }
  $('chips').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; st = b.dataset.s; page = 1; this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); render(); });
  $('q').addEventListener('input', function () { page = 1; render(); });
  $('pg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; page = +b.dataset.p; render(); $('rows').closest('section').scrollIntoView({ block: 'nearest' }); });

  var dlg = $('dlg');
  $('rows').addEventListener('click', function (e) {
    var nb = e.target.closest('[data-next]');
    if (nb) {
      var listOrd = A.orders();
      var target = listOrd.filter(function (x) { return x.id === nb.dataset.next; })[0];
      if (target && target.status === 'Proses') {
        target.status = 'Dikirim';
        target.tahapKirim = 'Di perjalanan';
        target.shippedAt = Date.now();
        A.saveOrders(listOrd);
        syncToBuyerOrders(target, true);
        init();
        scheduleCourierAutoAdvance(target.id);
      }
      return;
    }

    var b = e.target.closest('[data-id]'); if (!b) return;
    var o = all.filter(function (x) { return x.id === b.dataset.id; })[0], sub = A.orderSub(o);
    curOrder = o;
    $('oNama').textContent = o.nama + (o.hp ? ' (' + o.hp + ')' : '');
    $('oId').textContent = o.id;
    $('oTgl').textContent = 'Dipesan ' + A.fmtDate(o.t);
    var addrEl = $('oAddr');
    if (addrEl) addrEl.textContent = o.alamat || (o.kota ? 'Kota: ' + o.kota : '');

    var selEl = $('oStatSel');
    var saveBtn = $('dSaveStat');
    var doneBadge = $('oBuyerDone');
    var hintEl = $('oStatHint');
    if (o.status === 'Selesai') {
      if (selEl) selEl.hidden = true;
      if (doneBadge) doneBadge.hidden = false;
      if (saveBtn) saveBtn.hidden = true;
      if (hintEl) hintEl.textContent = 'Pesanan ini sudah diterima & diselesaikan oleh Pembeli.';
    } else {
      if (selEl) { selEl.hidden = false; selEl.value = o.status; }
      if (doneBadge) doneBadge.hidden = true;
      if (saveBtn) saveBtn.hidden = false;
      if (hintEl) hintEl.textContent = 'Admin hanya mengelola Proses & Dikirim. Status Selesai dikonfirmasi Pembeli.';
    }

    $('oItems').innerHTML = o.items.map(function (i) {
      return '<div class="ir"><div><b>' + esc(nm(i)) + '</b><small>\u00D7 ' + i.qty + ' \u2022 ' + rp(i.harga) + ' / bibit</small></div><span>' + rp(i.qty * i.harga) + '</span></div>';
    }).join('');
    $('oSub').textContent = rp(sub); $('oOng').textContent = rp(o.ongkir); $('oTot').textContent = rp(sub + o.ongkir);
    dlg.showModal(); $('oItems').scrollTop = 0;
  });

  if ($('dSaveStat')) {
    $('dSaveStat').addEventListener('click', function () {
      if (!curOrder || curOrder.status === 'Selesai') { dlg.close(); return; }
      var newSt = $('oStatSel').value;
      if (newSt !== 'Proses' && newSt !== 'Dikirim') { dlg.close(); return; }
      var listOrd = A.orders();
      var target = listOrd.filter(function (x) { return x.id === curOrder.id; })[0];
      if (target && target.status !== 'Selesai') {
        var wasProses = target.status === 'Proses';
        target.status = newSt;
        if (newSt === 'Proses') {
          target.tahapProses = target.tahapProses || 0;
          target.tahapKirim = null;
        }
        if (newSt === 'Dikirim') {
          target.tahapKirim = 'Di perjalanan';
          target.shippedAt = Date.now();
        }
        A.saveOrders(listOrd);
        syncToBuyerOrders(target, newSt === 'Dikirim' && wasProses);
        init();
        if (newSt === 'Dikirim') scheduleCourierAutoAdvance(target.id);
      }
      dlg.close();
    });
  }

  $('dClose').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  $('exp').addEventListener('click', function () {
    var csv = 'No,Kode Pesanan,Penerima,Alamat,Produk,Tanggal Pesan,Total Bayar,Status\n' + shown.map(function (o, i) {
      return [i + 1, o.id, o.nama, o.alamat || o.kota || '', o.items.map(function (x) { return nm(x) + ' x' + x.qty; }).join('; '), A.fmtDate(o.t), A.orderTotal(o), o.status].map(function (v) { return '"' + v + '"'; }).join(',');
    }).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'pesanan.csv'; a.click(); URL.revokeObjectURL(a.href);
  });
  function init() { load(); stats(); render(); }
  A.onChange(init);
  init();
})();
