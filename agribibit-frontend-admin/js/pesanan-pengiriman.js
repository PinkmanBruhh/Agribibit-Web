(function () {
  var A = AgriData;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var CLS = { 'Di perjalanan': 'b', 'Tiba di hub': 'a', 'Sampai di tujuan': 'a', 'Diterima Buyer': 'g' };
  var curId = null, shown = [];
  var simTimers = [];

  function clearSimTimers() {
    simTimers.forEach(function (t) { clearTimeout(t); });
    simTimers = [];
  }

  function syncToBuyerOrders(order, resetSim) {
    try {
      var bOrders = JSON.parse(localStorage.getItem('agribibit.user.orders'));
      if (!Array.isArray(bOrders)) return;
      var changed = false;
      bOrders.forEach(function (bo) {
        var cleanId = String(bo.orderId || bo.id || '').replace(/^#/, '');
        if (cleanId === order.id && bo.status !== 'completed') {
          changed = true;
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
      });
      if (changed) localStorage.setItem('agribibit.user.orders', JSON.stringify(bOrders));
    } catch (e) {  }
  }

  function updateSummaryCards() {
    var all = A.orders();
    var transit = 0, waitingBuyer = 0, received = 0;
    all.forEach(function (o, idx) {
      if (o.status === 'Dikirim') {
        var tk = o.tahapKirim || (idx % 3 === 0 ? 'Sampai di tujuan' : idx % 3 === 1 ? 'Tiba di hub' : 'Di perjalanan');
        if (tk === 'Sampai di tujuan') waitingBuyer++;
        else transit++;
      } else if (o.status === 'Selesai') {
        received++;
      }
    });
    if ($('sh0')) $('sh0').textContent = transit.toLocaleString('id-ID');
    if ($('sh1')) $('sh1').textContent = waitingBuyer.toLocaleString('id-ID');
    if ($('sh2')) $('sh2').textContent = received.toLocaleString('id-ID');
  }

  function getShipOrders() {
    var list = A.orders().filter(function (o) { return o.status === 'Dikirim' || o.status === 'Selesai'; });
    list.sort(function (a, b) {
      if (a.status !== b.status) return a.status === 'Dikirim' ? -1 : 1;
      return a.t < b.t ? 1 : a.t > b.t ? -1 : 0;
    });
    return list.slice(0, 30).map(function (o, idx) {
      var first = o.items && o.items[0];
      var pLabel = first ? (/^Bibit /i.test(first.nama) ? first.nama : 'Bibit ' + first.nama) + (o.items.length > 1 ? ' +' + (o.items.length - 1) + ' lainnya' : '') : 'Bibit Tanaman';
      var defaultShipStage = idx % 3 === 0 ? 'Sampai di tujuan' : idx % 3 === 1 ? 'Tiba di hub' : 'Di perjalanan';
      var st = o.status === 'Selesai' ? 'Diterima Buyer' : (o.tahapKirim || defaultShipStage);
      return {
        raw: o,
        id: o.id,
        n: o.nama,
        p: pLabel,
        k: o.kurir || 'JNE Express',
        kn: o.kota ? 'Tujuan: ' + o.kota : 'Ekspedisi Hortikultura',
        r: o.resi || ('JNE-' + o.id.replace(/\D/g, '') + '882'),
        e: A.fmtDate(o.t),
        s: st,
        confirmedAt: o.confirmedAt || '',
        a: o.alamat || (o.kota ? 'Kota ' + o.kota : 'Alamat sesuai data pesanan')
      };
    });
  }

  function rows() {
    updateSummaryCards();
    var D = getShipOrders();
    var t = $('q').value.trim().toLowerCase();
    shown = D.filter(function (d) { return !t || (d.id + ' ' + d.n + ' ' + d.a).toLowerCase().indexOf(t) > -1; });
    if (!curId && shown.length) curId = shown[0].id;
    var activeObj = shown.filter(function (d) { return d.id === curId; })[0] || shown[0] || null;
    if (activeObj) curId = activeObj.id;

    $('rows').innerHTML = shown.length ? shown.map(function (d) {
      var on = d.id === curId;
      var actBtn = '';
      if (d.s !== 'Diterima Buyer') {
        actBtn = '<button class="btn sm" data-sim="' + d.id + '" title="Putar simulasi kurir secara live">Simulasi</button>';
      }
      var pillLabel = d.s === 'Sampai di tujuan' ? 'Menunggu Buyer' : d.s;
      return '<tr' + (on ? ' style="background:var(--bg)"' : '') + '><td class="id">' + d.id + '</td><td><b>' + esc(d.n) + '</b><div class="ps" style="margin:0;font-size:12px">' + esc(d.p) + '</div></td>' +
        '<td>' + esc(d.k) + '<div class="ps" style="margin:0;font-size:12px">' + esc(d.kn) + '</div></td><td><span class="resi mn2">' + esc(d.r) + '</span></td><td>' + d.e + '</td>' +
        '<td><span class="dotp ' + (CLS[d.s] || 'b') + '">' + pillLabel + '</span></td><td><div class="filters" style="gap:6px">' + actBtn + '<button class="btn sm' + (on ? ' gr' : '') + '" data-t="' + d.id + '">' + (on ? icon('search') : '') + 'Lacak</button></div></td></tr>';
    }).join('') : '<tr><td colspan="7" class="empty">Tidak ada paket yang cocok.</td></tr>';
    $('count').innerHTML = 'Menampilkan <b>' + shown.length + '</b> paket pengiriman';
    track(activeObj);
  }

  function track(d) {
    if (!d) {
      $('trk').innerHTML = '<p class="empty">Pilih salah satu pesanan untuk melihat pelacakan.</p>';
      return;
    }
    var isDone = d.s === 'Diterima Buyer';
    var isArrived = d.s === 'Sampai di tujuan';
    var isHub = d.s === 'Tiba di hub';

    var pct = isDone ? 100 : isArrived ? 86 : isHub ? 62 : 36;
    var dotCls = isDone ? '' : isArrived ? 'wait' : 'pulse';
    var truckCls = isDone ? '' : isArrived ? 'wait' : 'mov';

    var S = [
      ['Pesanan dikemas di Kebun', d.e, 'Packing khusus tanaman &amp; pelembab akar siap'],
      ['Diserahkan ke armada kurir', d.e, 'Dibawa oleh armada ' + esc(d.k)],
      ['Transit di Hub Kota Tujuan', (isHub || isArrived || isDone) ? 'Tiba di Hub Sortir Kota Tujuan' : 'Dalam perjalanan menuju Hub', '<span class="chipb">Hub Distribusi Ekspedisi</span>'],
      ['Sampai di alamat Pembeli', isDone ? 'Dikonfirmasi Selesai oleh Pembeli' + (d.confirmedAt ? ' (' + esc(d.confirmedAt) + ')' : '') : isArrived ? 'Paket tiba • Menunggu Konfirmasi Pembeli' : 'Menunggu pengantaran kurir ke lokasi', 'Alamat: ' + esc(d.a)]
    ];

    var footerControl = '';
    if (isDone) {
      footerControl = '<div class="buyer-done"><b>\u2713 Pesanan Telah Dikonfirmasi Pembeli</b>Pembeli telah mengonfirmasi penerimaan bibit dalam kondisi baik. Transaksi resmi selesai.</div>';
    } else {
      footerControl =
        '<div style="margin-top:14px;display:flex;gap:8px">' +
          '<button class="btn pri" style="width:100%;justify-content:center" data-sim="' + d.id + '">\u25B6 Putar Simulasi Kurir (Live)</button>' +
        '</div>' +
        '<div class="buyer-lock"><b>Menunggu Konfirmasi Pembeli</b>Admin hanya memantau ekspedisi hingga paket tiba di tujuan. Status <b>Selesai</b> hanya bisa ditekan oleh Pembeli di web Buyer.</div>';
    }

    $('trk').innerHTML =
      '<div class="top3"><span class="lv"><span class="lv-dot ' + dotCls + '"></span>LIVE TRACKING</span><span class="mn2 ps" style="margin:0">' + esc(d.s) + '</span></div>' +
      '<h2 style="font-size:22px;margin:14px 0 2px">Lacak: ' + d.id + '</h2>' +
      '<p class="ps" style="margin:0 0 10px;color:var(--ink)">' + esc(d.n) + ' \u2022 ' + esc(d.p) + '</p>' +
      '<div class="resi mn2" style="display:block;padding:10px 12px">' + icon('truck').replace('class="ic"', 'class="ic" style="width:14px;height:14px;vertical-align:-2px"') + ' ' + esc(d.k) + ' \u2022 No. Resi ' + esc(d.r) + '</div>' +
      '<div class="adm-route"><div class="adm-route__rail"><div class="adm-route__fill" id="admFill" style="width:' + pct + '%"></div></div><span class="adm-route__truck ' + truckCls + '" id="admTruck" style="left:' + pct + '%">' + (isDone ? icon('check') : icon('truck')) + '</span></div>' +
      '<ul class="tl">' +
      S.map(function (s, i) {
        var c = 'pen';
        if (isDone) c = '';
        else if (isArrived) c = i < 3 ? '' : 'wait';
        else if (isHub) c = i < 2 ? '' : (i === 2 ? 'cur' : 'pen');
        else c = i < 1 ? '' : (i === 1 ? 'cur' : 'pen');
        return '<li class="' + c + '"><span class="nd">' + (c === '' ? icon('check') : '') + '</span><b>' + s[0] + '</b>' + s[1] + '<small style="display:block">' + s[2] + '</small></li>';
      }).join('') +
      '</ul>' + footerControl + '<div class="cfoot"><span>Alamat Tujuan:</span><span class="up">' + esc(d.a) + '</span></div>';
  }

  function runAdminLiveSim(id) {
    clearSimTimers();
    var allOrders = A.orders();
    var target = allOrders.filter(function (o) { return o.id === id; })[0];
    if (!target || target.status === 'Selesai') return;

    curId = id;
    target.status = 'Dikirim';
    target.tahapKirim = 'Di perjalanan';
    target.shippedAt = Date.now();
    A.saveOrders(allOrders);
    syncToBuyerOrders(target, true);
    rows();

    simTimers.push(setTimeout(function () {
      var list = A.orders();
      var o = list.filter(function (x) { return x.id === id; })[0];
      if (o && o.status === 'Dikirim') {
        o.tahapKirim = 'Tiba di hub';
        A.saveOrders(list);
        syncToBuyerOrders(o, false);
        rows();
      }
    }, 2600));

    simTimers.push(setTimeout(function () {
      var list = A.orders();
      var o = list.filter(function (x) { return x.id === id; })[0];
      if (o && o.status === 'Dikirim') {
        o.tahapKirim = 'Sampai di tujuan';
        A.saveOrders(list);
        syncToBuyerOrders(o, false);
        rows();
      }
    }, 5200));
  }

  $('q').addEventListener('input', rows);

  document.getElementById('content').addEventListener('click', function (e) {
    var simBtn = e.target.closest('[data-sim]');
    if (simBtn) {
      runAdminLiveSim(simBtn.dataset.sim);
      return;
    }

    var b = e.target.closest('[data-t]'); if (!b) return;
    curId = b.dataset.t;
    rows();
  });

  $('exp').addEventListener('click', function () {
    var csv = 'ID,Penerima,Alamat,Produk,Kurir,No. Resi,Tanggal,Status\n' + shown.map(function (d) {
      return [d.id, d.n, d.a, d.p, d.k, d.r, d.e, d.s].map(function (v) { return '"' + v + '"'; }).join(',');
    }).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'pengiriman.csv'; a.click(); URL.revokeObjectURL(a.href);
  });

  A.onChange(rows);
  rows();
})();
