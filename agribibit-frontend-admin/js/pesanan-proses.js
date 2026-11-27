(function () {
  var A = AgriData;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

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
      }
    }, 2800);

    setTimeout(function () {
      var list = A.orders();
      var o = list.filter(function (x) { return x.id === orderId; })[0];
      if (o && o.status === 'Dikirim' && o.tahapKirim !== 'Sampai di tujuan') {
        o.tahapKirim = 'Sampai di tujuan';
        A.saveOrders(list);
        syncToBuyerOrders(o, false);
      }
    }, 5600);
  }

  function thumb(item) {
    if (!item) return icon('leaf');
    var prods = A.products();
    var p = prods.filter(function (x) { return x.sku === item.sku || x.nama === item.nama; })[0];
    return p && p.foto ? '<img src="' + p.foto + '" alt="">' : icon('leaf');
  }

  var BTN = [['Kemas', ''], ['Siap Kirim', 'dk'], ['Serahkan ke Kurir', 'dk']];
  var sel = {};

  function getProsesOrders() {
    var list = A.orders().filter(function (o) { return o.status === 'Proses'; });
    list.sort(function (a, b) { return a.t < b.t ? 1 : a.t > b.t ? -1 : 0; });
    list.forEach(function (o, idx) {
      if (typeof o.tahapProses !== 'number') {
        o.tahapProses = idx % 3;
      }
    });
    return list;
  }

  function card(o) {
    var c = o.tahapProses || 0;
    var first = o.items && o.items[0];
    var pLabel = first ? (/^Bibit /i.test(first.nama) ? first.nama : 'Bibit ' + first.nama) + (o.items.length > 1 ? ' +' + (o.items.length - 1) + ' lainnya' : '') : 'Bibit Tanaman';
    var head = c === 0
      ? '<label style="display:flex;gap:8px;align-items:center;font-weight:700"><input type="checkbox" class="ck2" data-s="' + o.id + '"' + (sel[o.id] ? ' checked' : '') + ' aria-label="Pilih ' + o.id + '">' + o.id + '</label>'
      : '<b>' + o.id + '</b>';
    return '<div class="kcard' + (sel[o.id] ? ' sel' : '') + '"><div class="r1">' + head + '<span>' + esc(o.nama) + '</span></div>' +
      (o.alamat || o.kota ? '<div class="ps" style="margin:-4px 0 0;font-size:12px">' + esc(o.alamat || o.kota) + '</div>' : '') +
      '<div class="pr">' + thumb(first) + esc(pLabel) + '</div><button class="btn ' + BTN[c][1] + '" data-m="' + o.id + '">' + BTN[c][0] + '</button></div>';
  }

  function render() {
    var D = getProsesOrders();
    for (var i = 0; i < 3; i++) {
      var a = D.filter(function (d) { return (d.tahapProses || 0) === i; });
      $('l' + i).innerHTML = a.length ? a.map(card).join('') : '<p class="empty">Tidak ada pesanan di tahap ini.</p>';
      $('n' + i).textContent = a.length; $('k' + i).textContent = a.length;
    }
    $('mark').disabled = !Object.keys(sel).length;
  }
  function say(t) { $('msg').textContent = t; }

  document.getElementById('content').addEventListener('click', function (e) {
    var b = e.target.closest('[data-m]'); if (!b) return;
    var allOrders = A.orders();
    var d = allOrders.filter(function (x) { return x.id === b.dataset.m; })[0];
    if (!d) return;
    delete sel[d.id];
    var curStage = d.tahapProses || 0;
    if (curStage < 2) {
      d.tahapProses = curStage + 1;
      say(d.id + ' dipindah ke ' + ['', 'Sedang Dikemas', 'Siap Dikirim'][d.tahapProses] + '.');
      A.saveOrders(allOrders);
      syncToBuyerOrders(d, false);
      render();
    } else {
      d.status = 'Dikirim';
      d.tahapKirim = 'Di perjalanan';
      d.shippedAt = Date.now();
      say(d.id + ' diserahkan ke kurir! Pelacakan live berjalan otomatis hingga tiba di tujuan (menunggu konfirmasi Pembeli).');
      A.saveOrders(allOrders);
      syncToBuyerOrders(d, true);
      render();
      scheduleCourierAutoAdvance(d.id);
    }
  });

  document.getElementById('content').addEventListener('change', function (e) {
    var id = e.target.dataset && e.target.dataset.s; if (!id) return;
    if (e.target.checked) sel[id] = 1; else delete sel[id];
    render();
  });

  $('mark').addEventListener('click', function () {
    var ids = Object.keys(sel);
    var allOrders = A.orders();
    allOrders.forEach(function (d) {
      if (sel[d.id] && d.status === 'Proses' && (d.tahapProses || 0) === 0) {
        d.tahapProses = 1;
        syncToBuyerOrders(d, false);
      }
    });
    A.saveOrders(allOrders);
    sel = {};
    say(ids.length + ' pesanan ditandai dikemas.');
    render();
  });

  A.onChange(render);
  render();
})();
