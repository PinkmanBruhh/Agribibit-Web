(function () {
  var A = AgriData, now = new Date(), Y = now.getFullYear();
  var $ = function (id) { return document.getElementById(id); };
  var rp = function (n) { return 'Rp ' + n.toLocaleString('id-ID'); };
  var nf = function (n) { return n.toLocaleString('id-ID'); };
  var per = $('per');
  for (var m = now.getMonth(); m >= 0; m--) per.insertAdjacentHTML('beforeend', '<option value="' + m + '">' + A.MON[m] + ' ' + Y + '</option>');
  var rows = [];

  function render() {
    var m = +per.value, mo = A.monthOrders(Y, m), sold = mo.filter(A.sold);
    var total = sold.reduce(function (s, o) { return s + A.orderSub(o); }, 0);
    var pm = m === 0 ? A.monthOrders(Y - 1, 11) : A.monthOrders(Y, m - 1);
    var prev = pm.filter(A.sold).reduce(function (s, o) { return s + A.orderSub(o); }, 0);
    var ship = mo.filter(function (o) { return o.status === 'Dikirim' || o.status === 'Selesai'; }).reduce(function (s, o) { return s + A.orderQty(o); }, 0);
    var done = mo.filter(function (o) { return o.status === 'Selesai'; }), tepat = done.filter(function (o) { return o.tepat; }).length;
    $('m0').textContent = rp(total);
    $('c0').innerHTML = prev ? '<span class="up">' + (total >= prev ? '\u2191 +' : '\u2193 ') + ((total - prev) / prev * 100).toFixed(1).replace('.', ',') + '%</span> vs bulan lalu' : 'Belum ada data bulan lalu';
    $('m1').textContent = nf(ship); $('c1').textContent = 'Bibit siap tanam yang dikirim';
    $('m2').textContent = nf(done.length); $('c2').innerHTML = done.length ? '<span class="up">\u25CF ' + (tepat / done.length * 100).toFixed(1).replace('.', ',') + '% tepat waktu</span>' : 'Belum ada pesanan selesai';
    var cs = A.categorySales(Y, m);
    rows = cs.rows;
    $('rows').innerHTML = cs.rows.map(function (r) { return '<tr><td><b>' + r.nama + '</b></td><td>' + nf(r.pesanan) + '</td><td>' + nf(r.kirim) + '</td><td>' + rp(r.nilai) + '</td></tr>'; }).join('') +
      '<tr style="background:var(--bg)"><td><b>TOTAL</b></td><td><b>' + nf(mo.length) + '</b></td><td><b>' + nf(ship) + '</b></td><td class="in-g">' + rp(cs.total) + '</td></tr>';
  }
  per.addEventListener('change', render);
  $('xl').addEventListener('click', function () {
    var csv = 'Kategori,Pesanan,Terkirim,Pendapatan\n' + rows.map(function (r) { return [r.nama, r.pesanan, r.kirim, r.nilai].join(','); }).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'laporan-penjualan.csv'; a.click(); URL.revokeObjectURL(a.href);
  });
  $('pf').addEventListener('click', function () { window.print(); });
  A.onChange(render);
  render();
})();
