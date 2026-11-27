(function () {
  /* TABEL PENGIRIMAN */
  var DATA = [
    ['Budi Santoso', '+62 812-9843-1120', 'Bibit Mangga Harum Manis', 'buah', 35000, 'Delivered'],
    ['Dewi Lestari', '+62 821-4452-9011', 'Bibit Monstera Variegata', 'hias', 65000, 'Delivered'],
    ['Hendra Wijaya', '+62 857-3319-8762', 'Bibit Jeruk Santang Madu', 'buah', 28000, 'Delivered'],
    ['Anisa Rahmawati', '+62 813-7721-0498', 'Bibit Aglaonema Suksom', 'hias', 45000, 'On Process'],
    ['Fajar Setiawan', '+62 878-1190-6534', 'Bibit Alpukat Aligator', 'buah', 40000, 'Delivered'],
    ['Kelompok Tani Subur', '+62 822-5503-4921', 'Bibit Cabai Rawit Hibrida', 'sayur', 120000, 'Delivered']
  ];
  var rp = function (n) { return 'Rp ' + n.toLocaleString('id-ID'); };
  var q = document.getElementById('q'), cat = document.getElementById('cat'), st = document.getElementById('st');
  var tbody = document.getElementById('rows'), count = document.getElementById('count');
  var shown = DATA;

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function render() {
    var term = q.value.trim().toLowerCase();
    shown = DATA.filter(function (r) {
      return (!term || (r[0] + ' ' + r[1] + ' ' + r[2]).toLowerCase().indexOf(term) > -1) &&
        (!cat.value || r[3] === cat.value) && (!st.value || r[5] === st.value);
    });
    tbody.innerHTML = shown.length ? shown.map(function (r, i) {
      return '<tr class="ani" style="--i:' + i + '"><td class="mono">' + String(i + 1).padStart(2, '0') + '</td><td><b>' + esc(r[0]) + '</b></td><td class="mono">' + r[1] +
        '</td><td>' + esc(r[2]) + '</td><td class="mono"><b>' + rp(r[4]) + '</b></td><td><span class="pill ' + (r[5] === 'Delivered' ? 'ok' : 'wait') + '">' + r[5] + '</span></td><td><button class="kebab" aria-label="Aksi">⋮</button></td></tr>';
    }).join('') : '<tr><td colspan="7" class="empty">Tidak ada pengiriman yang cocok. Ubah kata kunci atau filter.</td></tr>';
    count.innerHTML = 'Menampilkan <b>' + shown.length + '</b> dari <b>142</b> pengiriman';
  }
  [q, cat, st].forEach(function (el) { el.addEventListener('input', render); });
  render();

  document.getElementById('xl').addEventListener('click', function () {
    var csv = 'Recipient Name,Contact,Product,Fee,Status\n' + shown.map(function (r) {
      return [r[0], r[1], r[2], r[4], r[5]].map(function (v) { return '"' + v + '"'; }).join(',');
    }).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'laporan-pengiriman.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.getElementById('pf').addEventListener('click', function () { window.print(); });
})();
