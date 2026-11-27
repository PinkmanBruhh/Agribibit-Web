(function () {
  var A = AgriData, now = new Date(), Y = now.getFullYear(), PER = 8, LOG_PER = 10;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s ?? '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var rp = function (n) { return 'Rp ' + Number(n || 0).toLocaleString('id-ID'); };
  var nf = function (n) { return Number(n || 0).toLocaleString('id-ID'); };
  var L = { aman: 'Aman', menipis: 'Menipis', habis: 'Habis' };

  var page = 1, shown = [];
  var logPage = 1, logType = '', logQuery = '', shownLogs = [], allEnrichedLogs = [];

  var per = $('per');
  for (var m = now.getMonth(); m >= 0; m--) {
    per.insertAdjacentHTML('beforeend', '<option value="' + m + '">' + A.MON[m] + ' ' + Y + '</option>');
  }

  function fmtDateTime(isoStr) {
    if (!isoStr) return '-';
    var d = new Date(isoStr);
    if (isNaN(d.getTime())) return esc(isoStr);
    var p = function (n) { return n < 10 ? '0' + n : '' + n; };
    return d.getDate() + ' ' + A.MON[d.getMonth()] + ' ' + d.getFullYear() + ', ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ' WIB';
  }

  function cards() {
    var ps = A.products(), low = ps.filter(function (p) { return A.status(p) === 'menipis'; }), out = ps.filter(function (p) { return A.status(p) === 'habis'; });
    var rusakTot = ps.reduce(function (s, p) { return s + (p.rusak || 0); }, 0);
    $('m0').textContent = nf(ps.reduce(function (s, p) { return s + p.stok; }, 0));
    $('c0').innerHTML = '<span class="up">' + ps.length + ' produk terdaftar</span>' + (rusakTot ? ' &middot; <span style="color:#B42323;font-weight:600">' + nf(rusakTot) + ' rusak</span>' : '');
    $('m1').textContent = low.length;
    $('c1').textContent = 'Stok di bawah atau sama dengan batas minimum';
    $('m2').textContent = out.length;
    $('c2').innerHTML = out.length ? '<span style="color:#B42323">! Perlu pengadaan segera</span>' : 'Tidak ada stok habis';
    $('m3').textContent = rp(ps.reduce(function (s, p) { return s + p.stok * p.harga; }, 0));
    $('c3').textContent = 'Estimasi valuasi gudang aktif';
  }

  function render() {
    var c = $('cat').value, rep = A.stockReport(Y, +per.value);
    shown = rep.filter(function (r) { return !c || r.kat === c; });
    var pages = Math.max(1, Math.ceil(shown.length / PER));
    if (page > pages) page = pages;
    var from = (page - 1) * PER, cur = shown.slice(from, from + PER);

    $('rows').innerHTML = cur.length ? cur.map(function (r) {
      var s = A.status({ stok: r.akhir, min: r.min });
      return '<tr>' +
        '<td><div class="nm"><span class="pi ' + s + '">' + (r.foto ? '<img src="' + r.foto + '" alt="">' : icon('leaf')) + '</span><div><b>' + esc(r.nama) + '</b><small class="mn2">SKU: ' + esc(r.sku) + '</small></div></div></td>' +
        '<td>' + A.KAT[r.kat] + '</td>' +
        '<td>' + nf(r.awal) + '</td>' +
        '<td class="' + (r.masuk ? 'in-g' : 'mu') + '">' + (r.masuk ? '+' + nf(r.masuk) : 0) + '</td>' +
        '<td>' + (r.keluar ? '<span style="color:#0C5A8A;font-weight:600">\u2212' + nf(r.keluar) + '</span>' : 0) + '</td>' +
        '<td>' + (r.rusak ? '<span style="color:#B42323;font-weight:700">\u2212' + nf(r.rusak) + '</span>' : 0) + '</td>' +
        '<td><b' + (r.akhir === 0 ? ' style="color:#B42323"' : '') + '>' + nf(r.akhir) + '</b></td>' +
        '<td><span class="st ' + s + '">' + L[s] + '</span></td>' +
        '<td class="r"><button type="button" class="btn sm" data-filter-sku="' + esc(r.sku) + '">Lihat Log</button></td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="9" class="empty">Belum ada produk di kategori ini.</td></tr>';

    $('count').innerHTML = shown.length
      ? 'Menampilkan <b>' + (from + 1) + '\u2013' + (from + cur.length) + '</b> dari <b>' + shown.length + '</b> produk'
      : 'Menampilkan <b>0</b> produk';

    var h = '<button data-p="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '') + '>Sebelumnya</button>';
    for (var i = 1; i <= pages; i++) h += '<button data-p="' + i + '"' + (i === page ? ' class="on" aria-current="page"' : '') + '>' + i + '</button>';
    h += '<button data-p="' + (page + 1) + '"' + (page === pages ? ' disabled' : '') + '>Selanjutnya</button>';
    $('pg').innerHTML = h;
  }

  function buildLogs() {
    var prodMap = {};
    A.products().forEach(function (p) { prodMap[p.sku] = p; });
    var selMonth = +per.value;
    var moves = A.moves().slice().reverse();

    allEnrichedLogs = moves.filter(function (mv) {
      var d = new Date(mv.t);
      return isNaN(d.getTime()) || (d.getFullYear() === Y && d.getMonth() === selMonth);
    }).map(function (mv, idx) {
      var p = prodMap[mv.sku] || { nama: mv.sku, sku: mv.sku, kat: 'hias' };
      var kind = mv.type === 'masuk' ? 'masuk' : (mv.src === 'rusak' ? 'rusak' : 'order');
      var kindLabel = kind === 'masuk' ? 'Stok Masuk' : (kind === 'rusak' ? 'Bibit Rusak' : 'Terjual Online');
      var refTitle = '';
      var refSub = '';
      if (kind === 'masuk') {
        refTitle = 'Nota: ' + (mv.ref || 'BATCH-KEBUN');
        refSub = (mv.sumber ? mv.sumber + ' \u2022 ' : '') + (mv.supplier || 'Kebun Induk AgriBibit');
      } else if (kind === 'rusak') {
        refTitle = 'Alasan: ' + (mv.ref || 'Bibit Rusak');
        refSub = mv.ket ? 'Karantina: ' + mv.ket : 'Stok jual otomatis dipotong';
      } else {
        refTitle = 'Pesanan #' + (mv.ref || 'PS-ONLINE');
        refSub = mv.pembeli ? 'Pembeli: ' + mv.pembeli : 'Checkout Otomatis Web Buyer';
      }
      var actor = mv.petugas || (kind === 'order' ? 'Sistem Toko Online' : 'AgriBibit Admin');

      return {
        idx: idx,
        raw: mv,
        t: mv.t,
        timeStr: fmtDateTime(mv.t),
        sku: p.sku,
        nama: p.nama,
        fotoProd: p.foto || '',
        kind: kind,
        kindLabel: kindLabel,
        qty: mv.qty,
        refTitle: refTitle,
        refSub: refSub,
        actor: actor,
        hasFoto: Boolean(mv.foto),
        orderRef: kind === 'order' ? (mv.ref || '') : ''
      };
    });
  }

  function renderLogs() {
    buildLogs();
    var q = logQuery.trim().toLowerCase();
    shownLogs = allEnrichedLogs.filter(function (x) {
      if (logType && x.kind !== logType) return false;
      if (q && (x.nama + ' ' + x.sku + ' ' + x.refTitle + ' ' + x.refSub + ' ' + x.actor).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });

    $('clearSkuFilter').hidden = !q;

    var pages = Math.max(1, Math.ceil(shownLogs.length / LOG_PER));
    if (logPage > pages) logPage = pages;
    var from = (logPage - 1) * LOG_PER, cur = shownLogs.slice(from, from + LOG_PER);

    $('logRows').innerHTML = cur.length ? cur.map(function (x) {
      var sign = x.kind === 'masuk' ? '+' : '\u2212';
      var actionHTML = '';
      if (x.hasFoto) {
        actionHTML = '<button type="button" class="btn sm pri" data-proof="' + x.idx + '">Lihat Foto Bukti</button>';
      } else if (x.kind === 'order') {
        actionHTML = '<a href="pesanan.html" class="btn sm">Cek Pesanan \u2197</a>';
      } else {
        actionHTML = '<span class="bd g" style="font-size:11px">Tercatat Sistem</span>';
      }

      return '<tr>' +
        '<td class="mn2" style="font-size:12px;white-space:nowrap">' + x.timeStr + '</td>' +
        '<td><b>' + esc(x.nama) + '</b><small class="mn2" style="display:block;color:var(--mut)">' + esc(x.sku) + '</small></td>' +
        '<td><span class="mv-pill ' + x.kind + '">' + x.kindLabel + '</span></td>' +
        '<td><span class="mv-qty ' + x.kind + '">' + sign + nf(x.qty) + '</span></td>' +
        '<td><b>' + esc(x.refTitle) + '</b><small class="ps" style="display:block;margin:2px 0 0;font-size:12px">' + esc(x.refSub) + '</small></td>' +
        '<td><span style="font-size:12.5px;font-weight:600">' + esc(x.actor) + '</span></td>' +
        '<td class="r">' + actionHTML + '</td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="7" class="empty">Tidak ada catatan mutasi stok pada filter &amp; bulan ini.</td></tr>';

    $('logCount').innerHTML = shownLogs.length
      ? 'Menampilkan <b>' + (from + 1) + '\u2013' + (from + cur.length) + '</b> dari <b>' + nf(shownLogs.length) + '</b> mutasi tercatat'
      : 'Menampilkan <b>0</b> mutasi';

    var h = '<button data-lp="' + (logPage - 1) + '"' + (logPage === 1 ? ' disabled' : '') + '>Sebelumnya</button>', last = 0;
    for (var i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - logPage) <= 1) {
        if (last && i - last > 1) h += '<span class="gap">\u2026</span>';
        h += '<button data-lp="' + i + '"' + (i === logPage ? ' class="on" aria-current="page"' : '') + '>' + i + '</button>';
        last = i;
      }
    }
    h += '<button data-lp="' + (logPage + 1) + '"' + (logPage === pages ? ' disabled' : '') + '>Selanjutnya</button>';
    $('logPg').innerHTML = h;
  }

  function openProofModal(idx) {
    var item = allEnrichedLogs.filter(function (x) { return x.idx === idx; })[0];
    if (!item || !item.raw) return;
    var mv = item.raw;
    var dlg = $('proofDlg');
    $('prBadge').textContent = item.kind === 'rusak' ? 'Bukti Fisik Bibit Rusak' : 'Bukti Nota Stok Masuk';
    $('prBadge').className = 'bd ' + (item.kind === 'rusak' ? 'r' : 'g');
    $('prTitle').textContent = item.nama + ' (' + item.sku + ')';
    $('prSub').textContent = 'Dicatat pada ' + item.timeStr + ' oleh ' + item.actor;
    $('prImgWrap').innerHTML = mv.foto ? '<img src="' + mv.foto + '" alt="Bukti foto audit stok">' : '';

    var rowsMeta = [
      ['Jenis Mutasi', item.kindLabel],
      ['Jumlah Bibit', (item.kind === 'masuk' ? '+' : '\u2212') + nf(item.qty) + ' bibit'],
      ['Referensi / Alasan', item.refTitle],
      ['Keterangan Tambahan', item.refSub]
    ];
    if (typeof mv.before === 'number' && typeof mv.after === 'number') {
      rowsMeta.push(['Perubahan Saldo Stok', mv.before + ' \u2192 ' + mv.after + ' bibit']);
    }
    $('prMeta').innerHTML = rowsMeta.map(function (r) {
      return '<div><span>' + esc(r[0]) + '</span><b>' + esc(r[1]) + '</b></div>';
    }).join('');
    dlg.showModal();
  }

  function all() { cards(); render(); renderLogs(); }

  $('cat').addEventListener('change', function () { page = 1; render(); });
  per.addEventListener('change', function () { page = 1; logPage = 1; render(); renderLogs(); });
  $('pg').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    page = +b.dataset.p; render();
  });

  $('rows').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-filter-sku]');
    if (!btn) return;
    logQuery = btn.dataset.filterSku;
    $('logQ').value = logQuery;
    logPage = 1;
    renderLogs();
    $('logSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('logChips').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    logType = b.dataset.lt;
    logPage = 1;
    this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
    renderLogs();
  });

  $('logQ').addEventListener('input', function () {
    logQuery = this.value;
    logPage = 1;
    renderLogs();
  });

  $('clearSkuFilter').addEventListener('click', function () {
    logQuery = '';
    $('logQ').value = '';
    logPage = 1;
    renderLogs();
  });

  $('logPg').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    logPage = +b.dataset.lp;
    renderLogs();
  });

  $('logRows').addEventListener('click', function (e) {
    var b = e.target.closest('[data-proof]');
    if (!b) return;
    openProofModal(+b.dataset.proof);
  });

  $('prClose').addEventListener('click', function () { $('proofDlg').close(); });
  $('proofDlg').addEventListener('click', function (e) { if (e.target === $('proofDlg')) $('proofDlg').close(); });

  $('xl').addEventListener('click', function () {
    var csv = 'Produk,SKU,Kategori,Awal,Masuk,Keluar_Order,Rusak,Akhir\n' + shown.map(function (r) {
      return [r.nama, r.sku, A.KAT[r.kat], r.awal, r.masuk, r.keluar, r.rusak, r.akhir].map(function (v) { return '"' + v + '"'; }).join(',');
    }).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'rekap-stok.csv'; a.click(); URL.revokeObjectURL(a.href);
  });

  $('xlLog').addEventListener('click', function () {
    var csv = 'Waktu,SKU,Nama_Bibit,Jenis_Mutasi,Jumlah,Referensi,Keterangan,Sumber_Pencatat\n' + shownLogs.map(function (x) {
      var sign = x.kind === 'masuk' ? '+' : '-';
      return [x.timeStr, x.sku, x.nama, x.kindLabel, sign + x.qty, x.refTitle, x.refSub, x.actor].map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'audit-log-mutasi-stok.csv'; a.click(); URL.revokeObjectURL(a.href);
  });

  $('pf').addEventListener('click', function () { window.print(); });

  A.onChange(all);
  all();
})();
