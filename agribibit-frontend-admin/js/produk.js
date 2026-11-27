(function () {
  var K = window.AGRI_K, NAMES = { sayur: 'Bibit Sayur', buah: 'Bibit Buah', hias: 'Bibit Tanaman Hias' };
  var JENIS = { sayur: 'sayur', buah: 'buah', hias: 'tanaman hias' };
  var PER = 5;
  var FOTO = {
    'SY-001': 'assets/produk/cabai-rawit-hibrida.png', 'SY-002': 'assets/produk/tomat-cherry.png', 'SY-003': 'assets/produk/terong-ungu.png', 'SY-004': 'assets/produk/kangkung-bangkok.png', 'SY-005': 'assets/produk/sawi-hijau.png?v=2', 'SY-006': 'assets/produk/bayam-hijau.png',
    'BH-001': 'assets/produk/mangga-harum-manis.png', 'BH-002': 'assets/produk/jeruk-santang-madu.png', 'BH-003': 'assets/produk/alpukat-aligator.png', 'BH-004': 'assets/produk/durian-montong.png', 'BH-005': 'assets/produk/jambu-kristal.png', 'BH-006': 'assets/produk/pepaya-california.png',
    'TH-001': 'assets/produk/monstera-variegata.png', 'TH-002': 'assets/produk/aglaonema-suksom.png', 'TH-003': 'assets/produk/sansevieria.png',
    'TH-004': 'assets/produk/anggrek-bulan.png', 'TH-005': 'assets/produk/philodendron-birkin.png', 'TH-006': 'assets/produk/Calathea-Ornata.png', 'TH-007': 'assets/produk/parlor-palm.png', 'TH-008': 'assets/produk/kaktus.png'
  };
  var db = AgriData.catalog();
  Object.keys(db).forEach(function (k) {
    db[k].forEach(function (p) {
      if (FOTO[p.sku] && (!p.foto || (p.foto.indexOf('assets/produk/') === 0 && p.foto !== FOTO[p.sku]))) {
        p.foto = FOTO[p.sku];
      }
    });
  });
  function save() { return AgriData.saveCatalog(db); }

  var $ = function (id) { return document.getElementById(id); };
  var rp = function (n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var status = function (p) { return p.stok <= 0 ? 'habis' : p.stok <= p.min ? 'menipis' : 'aman'; };
  var label = { aman: 'Aman', menipis: 'Menipis', habis: 'Habis' };
  var list = function () { return db[K]; };
  var page = 1, sel = {}, shown = [];

  $('pt').textContent = NAMES[K];

  function filtered() {
    var t = $('q').value.trim().toLowerCase(), s = $('st').value;
    return list().filter(function (p) {
      return (!s || status(p) === s) && (!t || (p.nama + ' ' + p.sku).toLowerCase().indexOf(t) > -1);
    });
  }

  function summary() {
    var low = list().filter(function (p) { return status(p) === 'menipis'; }), out = list().filter(function (p) { return status(p) === 'habis'; });
    $('sTot').textContent = list().length;
    $('sTotC').textContent = 'Varietas ' + JENIS[K] + ' aktif';
    $('sLow').textContent = low.length;
    $('sOut').textContent = out.length;
    var cap = function (a, el) {
      $(el).textContent = a.length ? a[0].nama + ' (' + a[0].stok + ' bag)' + (a.length > 1 ? ' +' + (a.length - 1) + ' lainnya' : '') : 'Tidak ada';
    };
    cap(low, 'sLowC'); cap(out, 'sOutC');
  }

  function render() {
    shown = filtered();
    var pages = Math.max(1, Math.ceil(shown.length / PER));
    if (page > pages) page = pages;
    var cur = shown.slice((page - 1) * PER, page * PER);
    $('rows').innerHTML = cur.length ? cur.map(function (p) {
      var s = status(p);
      return '<tr><td><input type="checkbox" class="ck2" data-sel="' + p.id + '"' + (sel[p.id] ? ' checked' : '') + ' aria-label="Pilih ' + esc(p.nama) + '"></td>' +
        '<td><div class="nm"><span class="pi ' + s + '">' + (p.foto ? '<img src="' + p.foto + '" alt="">' : icon('leaf')) + '</span><div><b>' + esc(p.nama) + '</b><small class="id" style="font-family:\'JetBrains Mono\',ui-monospace,monospace;font-size:12px">' + esc(p.sku) + '</small></div></div></td>' +
        '<td class="id">' + rp(p.harga) + '</td>' +
        '<td><span class="stk-n ' + s + '">' + p.stok + '</span>' + (p.rusak ? '<small class="ps" style="display:block;margin:2px 0 0">' + p.rusak + ' rusak</small>' : '') + '</td>' +
        '<td><span class="st ' + s + '">' + label[s] + '</span></td>' +
        '<td><div class="filters" style="gap:8px"><button class="btn sm" data-s="' + p.id + '">Stok</button><button class="btn sm" data-e="' + p.id + '">Edit</button><button class="btn sm red" data-x="' + p.id + '">Hapus</button></div></td></tr>';
    }).join('') : '<tr><td colspan="6" class="empty">Tidak ada bibit yang cocok. Ubah kata kunci atau filter, atau tambah bibit baru.</td></tr>';
    $('count').innerHTML = 'Menampilkan <b>' + cur.length + '</b> dari <b>' + shown.length + '</b> bibit';
    var h = '<button data-p="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '') + '>Sebelumnya</button>';
    for (var i = 1; i <= pages; i++) h += '<button data-p="' + i + '"' + (i === page ? ' class="on" aria-current="page"' : '') + '>' + i + '</button>';
    h += '<button data-p="' + (page + 1) + '"' + (page === pages ? ' disabled' : '') + '>Selanjutnya</button>';
    $('pg').innerHTML = h;
    var n = Object.keys(sel).length;
    $('sel').textContent = n + ' dipilih';
    $('bulk').disabled = !n;
    $('all').checked = cur.length > 0 && cur.every(function (p) { return sel[p.id]; });
    summary();
  }

  $('q').addEventListener('input', function () { page = 1; render(); });
  $('st').addEventListener('change', function () { page = 1; render(); });
  $('pg').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    page = +b.dataset.p; render();
  });
  $('all').addEventListener('change', function () {
    var on = this.checked;
    shown.slice((page - 1) * PER, page * PER).forEach(function (p) { if (on) sel[p.id] = 1; else delete sel[p.id]; });
    render();
  });

  var fd = $('fd'), ff = $('ff'), editId = null, foto = null;
  function showPv() {
    $('pv').innerHTML = foto ? '<img src="' + foto + '" alt="Foto bibit">' : icon('leaf');
    $('fr').hidden = !foto;
    $('fb').textContent = foto ? 'Ganti Foto' : 'Pilih Foto';
  }
  $('fb').addEventListener('click', function () { $('fi').click(); });
  $('fr').addEventListener('click', function () { foto = null; showPv(); });
  $('fi').addEventListener('change', function () {
    var file = this.files[0]; this.value = '';
    if (!file) return;
    if (!/^image\//.test(file.type)) { $('fE').textContent = 'File harus berupa gambar (JPG atau PNG).'; return; }
    if (file.size > 2 * 1024 * 1024) { $('fE').textContent = 'Ukuran foto maksimal 2 MB.'; return; }
    var rd = new FileReader();
    rd.onerror = function () { $('fE').textContent = 'Foto tidak bisa dibaca. Coba file lain.'; };
    rd.onload = function () {
      var im = new Image();
      im.onerror = function () { $('fE').textContent = 'Foto tidak bisa dibuka. Coba file lain.'; };
      im.onload = function () {
        var k = Math.min(1, 256 / Math.max(im.width, im.height)), cv = document.createElement('canvas');
        cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
        var cx = cv.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(im, 0, 0, cv.width, cv.height);
        foto = cv.toDataURL('image/jpeg', 0.82); $('fE').textContent = ''; showPv();
      };
      im.src = rd.result;
    };
    rd.readAsDataURL(file);
  });
  function openForm(p) {
    editId = p ? p.id : null;
    $('fT').textContent = p ? 'Edit Bibit' : 'Tambah Bibit';
    ff.elements.nama.value = p ? p.nama : ''; ff.elements.sku.value = p ? p.sku : ''; ff.elements.harga.value = p ? p.harga : '';
    ff.elements.min.value = p ? p.min : 20;
    foto = p && p.foto ? p.foto : null; showPv();
    $('fE').textContent = '';
    fd.showModal(); ff.elements.nama.focus();
  }
  $('add').addEventListener('click', function () { openForm(null); });
  $('fC').addEventListener('click', function () { fd.close(); });
  ff.addEventListener('submit', function (e) {
    e.preventDefault();
    var nama = ff.elements.nama.value.trim(), sku = ff.elements.sku.value.trim().toUpperCase();
    var harga = ff.elements.harga.value.trim(), min = ff.elements.min.value.trim();
    var err = '';
    if (!nama) err = 'Nama bibit wajib diisi.';
    else if (!sku) err = 'SKU wajib diisi.';
    else if (!/^\d+$/.test(harga)) err = 'Harga harus berupa angka bulat, misalnya 12000.';
    else if (!/^\d+$/.test(min)) err = 'Stok minimum harus berupa angka bulat.';
    else {
      var dup = false;
      Object.keys(db).forEach(function (k) { db[k].forEach(function (p) { if (p.sku === sku && p.id !== editId) dup = true; }); });
      if (dup) err = 'SKU ' + sku + ' sudah dipakai bibit lain.';
    }
    if (err) { $('fE').textContent = err; return; }
    var data = { nama: nama, sku: sku, harga: +harga, min: +min };
    if (foto) data.foto = foto;
    var snap = JSON.stringify(db);
    if (editId) { var t = list().filter(function (p) { return p.id === editId; })[0]; Object.assign(t, data); if (!foto) t.foto = ''; }
    else { data.id = 'p' + Date.now(); data.stok = 0; data.rusak = 0; list().push(data); }
    if (!save()) { db = JSON.parse(snap); $('fE').textContent = 'Penyimpanan browser penuh. Pakai foto yang lebih kecil atau hapus bibit lama.'; return; }
    fd.close(); render();
  });

  var sd = $('sd'), sf = $('sf'), stokSku = null, stokTipe = 'masuk', rFoto = null, mFoto = null;
  function showMPv() {
    $('mpv').innerHTML = mFoto ? '<img src="' + mFoto + '" alt="Foto bukti nota">' : icon('cam');
    $('mb').textContent = mFoto ? 'Ganti Foto' : 'Pilih Foto Nota';
  }
  function showRPv() {
    $('rpv').innerHTML = rFoto ? '<img src="' + rFoto + '" alt="Foto bibit rusak">' : icon('cam');
    $('rb').textContent = rFoto ? 'Ganti Foto' : 'Pilih Foto Bukti';
  }
  function readCompressedProof(file, cb) {
    if (!file) return;
    if (!/^image\//.test(file.type)) { $('sE').textContent = 'File bukti harus berupa gambar (JPG, PNG, atau WebP).'; return; }
    if (file.size > 4 * 1024 * 1024) { $('sE').textContent = 'Ukuran foto maksimal 4 MB.'; return; }
    var rd = new FileReader();
    rd.onerror = function () { $('sE').textContent = 'Foto tidak bisa dibaca. Coba file lain.'; };
    rd.onload = function () {
      var im = new Image();
      im.onerror = function () { $('sE').textContent = 'Foto tidak bisa dibuka. Coba file lain.'; };
      im.onload = function () {
        var k = Math.min(1, 520 / Math.max(im.width, im.height)), cv = document.createElement('canvas');
        cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
        var cx = cv.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(im, 0, 0, cv.width, cv.height);
        $('sE').textContent = '';
        cb(cv.toDataURL('image/jpeg', 0.72));
      };
      im.src = rd.result;
    };
    rd.readAsDataURL(file);
  }
  $('mb').addEventListener('click', function () { $('mi').click(); });
  $('mi').addEventListener('change', function () {
    var f = this.files[0]; this.value = '';
    readCompressedProof(f, function (url) { mFoto = url; showMPv(); });
  });
  $('rb').addEventListener('click', function () { $('ri').click(); });
  $('ri').addEventListener('change', function () {
    var f = this.files[0]; this.value = '';
    readCompressedProof(f, function (url) { rFoto = url; showRPv(); });
  });
  function setTipe(t) {
    stokTipe = t;
    sf.querySelectorAll('[data-t]').forEach(function (b) { b.classList.toggle('on', b.dataset.t === t); });
    $('fMasuk').hidden = t !== 'masuk'; $('fRusak').hidden = t !== 'rusak';
    $('sE').textContent = '';
  }
  function openStok(p) {
    stokSku = p.sku; sf.reset(); rFoto = null; mFoto = null; showMPv(); showRPv();
    $('sI').innerHTML =
      '<div><strong>' + esc(p.nama) + '</strong><small>' + esc(p.sku) + '</small></div>' +
      '<div class="sd-badges">' +
        '<span class="bd g">Tersedia: ' + p.stok + '</span>' +
        (p.rusak ? '<span class="bd r">Rusak: ' + p.rusak + '</span>' : '') +
      '</div>';
    setTipe('masuk'); sd.showModal(); sf.elements.jumlahMasuk.focus();
  }
  sf.addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) setTipe(b.dataset.t); });
  $('sC').addEventListener('click', function () { sd.close(); });
  sf.addEventListener('submit', function (e) {
    e.preventDefault();
    var jRaw = stokTipe === 'masuk' ? sf.elements.jumlahMasuk.value.trim() : sf.elements.jumlahRusak.value.trim();
    var nota = sf.elements.nota.value.trim(), supp = sf.elements.supplier.value.trim(), err = '';
    if (!/^\d+$/.test(jRaw) || +jRaw < 1) err = 'Jumlah bibit harus angka bulat minimal 1.';
    else if (stokTipe === 'masuk' && !nota) err = 'No. Nota / Batch wajib diisi.';
    else if (stokTipe === 'masuk' && !supp) err = 'Nama Supplier / Kebun wajib diisi.';
    else if (stokTipe === 'masuk' && !mFoto) err = 'Foto bukti Nota / Surat Jalan wajib diunggah.';
    else if (stokTipe === 'rusak' && !sf.elements.alasan.value) err = 'Pilih alasan kerusakan bibit.';
    else if (stokTipe === 'rusak' && !rFoto) err = 'Foto bukti bibit rusak wajib diunggah.';
    if (err) { $('sE').textContent = err; return; }
    var info = stokTipe === 'masuk'
      ? { sumber: sf.elements.sumber.value, nota: nota, supplier: supp, foto: mFoto }
      : { alasan: sf.elements.alasan.value, ket: sf.elements.ket.value.trim(), foto: rFoto };
    var r = AgriData.stockMove(stokSku, stokTipe, +jRaw, info);
    if (!r.ok) { $('sE').textContent = r.message; return; }
    sd.close(); db = AgriData.catalog(); render();
  });

  var dd = $('dd'), delIds = [];
  function askDelete(ids) {
    var targets = list().filter(function (p) { return ids.indexOf(p.id) >= 0; });
    var activeWithStock = targets.filter(function (p) { return p.stok > 0; });
    if (activeWithStock.length > 0) {
      delIds = [];
      $('dT').textContent = 'Penghapusan Ditolak (Proteksi Audit Stok)';
      $('dM').textContent = 'Bibit "' + activeWithStock[0].nama + '" masih memiliki stok aktif (' + activeWithStock[0].stok + ' bibit). Demi mencegah manipulasi stok, produk yang masih memiliki persediaan tidak boleh dihapus.';
      $('dOk').hidden = true;
      dd.showModal();
      return;
    }
    delIds = ids;
    $('dOk').hidden = false;
    var one = ids.length === 1 ? targets[0] : null;
    $('dT').textContent = one ? 'Hapus ' + one.nama + '?' : 'Hapus ' + ids.length + ' bibit kosong?';
    $('dM').textContent = 'Hanya produk dengan stok 0 yang dapat dihapus dari katalog.';
    dd.showModal();
  }
  $('dC').addEventListener('click', function () { dd.close(); });
  $('dOk').addEventListener('click', function () {
    db[K] = list().filter(function (p) { return delIds.indexOf(p.id) < 0; });
    delIds.forEach(function (id) { delete sel[id]; });
    save(); dd.close(); render();
  });
  $('bulk').addEventListener('click', function () { askDelete(Object.keys(sel)); });

  $('rows').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var find = function (id) { return list().filter(function (p) { return p.id === id; })[0]; };
    if (b.dataset.s) openStok(find(b.dataset.s));
    else if (b.dataset.e) openForm(find(b.dataset.e));
    else if (b.dataset.x) askDelete([b.dataset.x]);
  });
  $('rows').addEventListener('change', function (e) {
    var id = e.target.dataset && e.target.dataset.sel; if (!id) return;
    if (e.target.checked) sel[id] = 1; else delete sel[id];
    render();
  });

  $('exp').addEventListener('click', function () {
    var csv = 'Nama,SKU,Harga,Stok,Status\n' + shown.map(function (p) {
      return [p.nama, p.sku, p.harga, p.stok, label[status(p)]].map(function (v) { return '"' + v + '"'; }).join(',');
    }).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'stok-' + K + '.csv'; a.click(); URL.revokeObjectURL(a.href);
  });
  AgriData.onChange(function () { db = AgriData.catalog(); render(); });
  render();
})();
