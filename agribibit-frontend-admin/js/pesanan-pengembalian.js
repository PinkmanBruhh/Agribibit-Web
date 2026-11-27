(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var D = [
    { id: 'RT-001', o: 'PS-0308', n: 'Fajar Setiawan', p: 'Bibit Alpukat Aligator', a: 'Bibit layu saat tiba', s: 'Menunggu' },
    { id: 'RT-002', o: 'PS-0316', n: 'Rina Anggraini', p: 'Bibit Monstera Variegata', a: 'Salah varian', s: 'Menunggu' },
    { id: 'RT-003', o: 'PS-0317', n: 'Agus Kurnia', p: 'Bibit Jeruk Santang Madu', a: 'Kemasan rusak', s: 'Disetujui' },
    { id: 'RT-004', o: 'PS-0318', n: 'Dedi Heryanto', p: 'Bibit Mangga Harum Manis', a: 'Tidak sesuai foto', s: 'Ditolak' }
  ];
  var CLS = { Menunggu: 'proses', Disetujui: 'selesai', Ditolak: 'retur' };
  var f = '', desc = false, shown = D;

  function render() {
    shown = D.filter(function (d) { return !f || d.s === f; }).sort(function (a, b) { return desc ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id); });
    $('rows').innerHTML = shown.length ? shown.map(function (d) {
      var act = d.s === 'Menunggu'
        ? '<div class="filters" style="gap:6px"><button class="btn sm" data-d="' + d.id + '">Detail</button><button class="btn sm gr" data-a="' + d.id + '" data-v="Disetujui">Setujui</button><button class="btn sm rd" data-a="' + d.id + '" data-v="Ditolak">Tolak</button></div>'
        : '<button class="btn sm" style="width:100%;max-width:220px;justify-content:center" data-d="' + d.id + '">Detail</button>';
      return '<tr><td class="id">' + d.id + '</td><td class="mu">' + d.o + '</td><td><b>' + esc(d.n) + '</b></td><td>' + esc(d.p) + '</td><td class="mu">' + esc(d.a) + '</td><td><span class="st ' + CLS[d.s] + '">' + d.s + '</span></td><td>' + act + '</td></tr>';
    }).join('') : '<tr><td colspan="7" class="empty">Tidak ada retur dengan status ini.</td></tr>';
    $('count').innerHTML = 'Menampilkan <b>' + shown.length + '</b> dari <b>7</b> retur';
    ['Menunggu', 'Disetujui', 'Ditolak'].forEach(function (s, i) { $('n' + i).textContent = D.filter(function (d) { return d.s === s; }).length; });
  }
  $('chips').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    f = b.dataset.s; this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); render();
  });
  $('sort').addEventListener('click', function () { desc = !desc; render(); });
  var dlg = $('dlg');
  $('rows').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var d = D.filter(function (x) { return x.id === (b.dataset.a || b.dataset.d); })[0];
    if (b.dataset.a) { d.s = b.dataset.v; render(); return; }
    $('dId').textContent = d.id;
    $('dBody').innerHTML = [['Pesanan', d.o], ['Penerima', d.n], ['Produk', d.p], ['Alasan', d.a], ['Status', d.s]].map(function (p) { return '<dt>' + p[0] + '</dt><dd>' + esc(p[1]) + '</dd>'; }).join('');
    dlg.showModal();
  });
  $('dClose').addEventListener('click', function () { dlg.close(); });
  render();
})();
