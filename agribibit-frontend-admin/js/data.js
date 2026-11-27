(function () {
  'use strict';
  var K = { cat: 'agribibit.db.catalog', ord: 'agribibit.db.orders', mov: 'agribibit.db.moves', meta: 'agribibit.db.meta' };
  var OLD_CAT = 'agribibit.produk.v2';
  var VER = 1, DAY = 864e5;
  var KAT = { sayur: 'Bibit Sayur', buah: 'Bibit Buah', hias: 'Tanaman Hias' };
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var MONF = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var DOW = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  function rd(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function wr(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  var p2 = function (n) { return n < 10 ? '0' + n : '' + n; };
  function iso(d) { return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + 'T' + p2(d.getHours()) + ':' + p2(d.getMinutes()); }
  function sod(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function fmtDate(s) { var d = new Date(s); return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); }

  /* SEED KATALOG */
  var SEED = {
    sayur: [['Cabai Rawit Hibrida', 'SY-001', 12000, 120], ['Tomat Cherry', 'SY-002', 9000, 18], ['Terong Ungu', 'SY-003', 7000, 64], ['Kangkung Bangkok', 'SY-004', 4000, 0], ['Sawi Hijau', 'SY-005', 5000, 90], ['Bayam Hijau', 'SY-006', 4500, 52]],
    buah: [['Mangga Harum Manis', 'BH-001', 35000, 80], ['Jeruk Santang Madu', 'BH-002', 28000, 12], ['Alpukat Aligator', 'BH-003', 40000, 45], ['Durian Montong', 'BH-004', 85000, 0], ['Jambu Kristal', 'BH-005', 25000, 60], ['Pepaya California', 'BH-006', 15000, 70]],
    hias: [['Monstera Variegata', 'TH-001', 65000, 25], ['Aglaonema Suksom', 'TH-002', 45000, 14], ['Sansevieria', 'TH-003', 30000, 70], ['Anggrek Bulan', 'TH-004', 55000, 9], ['Philodendron Birkin', 'TH-005', 38000, 40], ['Calathea Ornata', 'TH-006', 42000, 33], ['Parlor Palm', 'TH-007', 35000, 48], ['Kaktus', 'TH-008', 20000, 80]]
  };
  var PHOTO = {
    'SY-001': 'assets/produk/cabai-rawit-hibrida.png', 'SY-002': 'assets/produk/tomat-cherry.png', 'SY-003': 'assets/produk/terong-ungu.png', 'SY-004': 'assets/produk/kangkung-bangkok.png', 'SY-005': 'assets/produk/sawi-hijau.png?v=2', 'SY-006': 'assets/produk/bayam-hijau.png',
    'BH-001': 'assets/produk/mangga-harum-manis.png', 'BH-002': 'assets/produk/jeruk-santang-madu.png', 'BH-003': 'assets/produk/alpukat-aligator.png', 'BH-004': 'assets/produk/durian-montong.png', 'BH-005': 'assets/produk/jambu-kristal.png', 'BH-006': 'assets/produk/pepaya-california.png',
    'TH-001': 'assets/produk/monstera-variegata.png', 'TH-002': 'assets/produk/aglaonema-suksom.png', 'TH-003': 'assets/produk/sansevieria.png',
    'TH-004': 'assets/produk/anggrek-bulan.png', 'TH-005': 'assets/produk/philodendron-birkin.png', 'TH-006': 'assets/produk/Calathea-Ornata.png', 'TH-007': 'assets/produk/parlor-palm.png', 'TH-008': 'assets/produk/kaktus.png'
  };
  function seedCatalog() {
    var old = rd(OLD_CAT), ok = old && old.sayur && old.buah && old.hias;
    if (ok) return old;
    var o = {}, n = 0;
    Object.keys(SEED).forEach(function (k) { o[k] = SEED[k].map(function (r) { return { id: 'p' + (++n), nama: r[0], sku: r[1], harga: r[2], stok: r[3], min: 20 }; }); });
    return o;
  }

  /* SEED PESANAN & MUTASI STOK */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var NAMES = ['Budi Santoso', 'Dewi Lestari', 'Hendra Wijaya', 'Anisa Rahmawati', 'Fajar Setiawan', 'Rina Anggraini', 'Agus Kurnia', 'Siti Wahyuni', 'Rudi Hartono', 'Melati Kusumawardani', 'Bambang Prakoso', 'Dedi Heryanto', 'Kelompok Tani Subur', 'Yuli Astuti', 'Eko Prasetyo', 'Nurul Hidayah', 'Wahyu Pratama', 'Sari Indah', 'Taufik Hidayat', 'Lina Marlina', 'Joko Susilo', 'Ratna Sari', 'Andi Saputra', 'Fitri Handayani', 'Slamet Riyadi', 'Maya Puspita', 'Doni Kusuma', 'Intan Permata', 'Kelompok Tani Makmur', 'Rian Hidayat'];
  var KOTA = ['Malang', 'Surabaya', 'Bandung', 'Jakarta Selatan', 'Depok', 'Yogyakarta', 'Semarang', 'Bogor', 'Bekasi', 'Denpasar', 'Medan', 'Makassar'];
  var KURIR = [['JNE Yes', 18000], ['SiCepat', 15000], ['GoSend Sameday', 25000]];
  function flat(cat) { var a = []; Object.keys(cat).forEach(function (k) { cat[k].forEach(function (p) { a.push({ id: p.id, nama: p.nama, sku: p.sku, kat: k, harga: p.harga, stok: p.stok, rusak: p.rusak || 0, min: p.min, foto: p.foto }); }); }); return a; }

  function seedOrders(cat, now) {
    var R = rng(20261116), prods = flat(cat), orders = [];
    var by = {}; prods.forEach(function (p) { by[p.sku] = p; });
    var weights = prods.map(function (p) { return (p.kat === 'sayur' ? 2.2 : p.kat === 'buah' ? 1.6 : 1.2) * (0.6 + R()); });
    var wsum = weights.reduce(function (a, b) { return a + b; }, 0);
    function pick() { var r = R() * wsum, i = 0; while (i < prods.length - 1 && (r -= weights[i]) > 0) i++; return prods[i]; }
    function line(p, qty) { return { sku: p.sku, nama: p.nama, kat: p.kat, qty: qty, harga: p.harga }; }
    function phone() { return '+62 8' + (10 + Math.floor(R() * 89)) + '-' + (1000 + Math.floor(R() * 8999)) + '-' + (1000 + Math.floor(R() * 8999)); }
    var start = new Date(now.getFullYear(), 0, 1), last = addDays(sod(now), -7);
    var span = (last - start) / DAY, fr = [];
    for (var i = 0; i < 303; i++) fr.push(Math.pow(R(), 0.72));
    fr.sort(function (a, b) { return a - b; });
    fr.forEach(function (f, idx) {
      var d = new Date(start.getTime() + f * span * DAY); d.setHours(7 + Math.floor(R() * 14), Math.floor(R() * 60), 0, 0);
      var u = R(), n = u < 0.45 ? 1 : u < 0.78 ? 2 : u < 0.94 ? 3 : 4, used = {}, items = [];
      while (items.length < n) { var p = pick(); if (used[p.sku]) continue; used[p.sku] = 1; var q = 1 + Math.floor(R() * 4); if (p.kat === 'sayur') q *= 1 + Math.floor(R() * 3); items.push(line(p, q)); }
      var age = (sod(now) - sod(d)) / DAY, s;
      s = age <= 9 ? (R() < 0.4 ? 'Dikirim' : 'Selesai') : 'Selesai';
      var k = KURIR[Math.floor(R() * 3)];
      orders.push({ id: 'PS-' + ('000' + (idx + 1)).slice(-4), t: iso(d), nama: NAMES[Math.floor(R() * NAMES.length)], hp: phone(), kota: KOTA[Math.floor(R() * KOTA.length)], kurir: k[0], ongkir: k[1], items: items, status: s, tepat: s === 'Selesai' ? R() < 0.78 : null });
    });
    var H = [
      [8, 'Budi Santoso', 'Selesai', [['BH-001', 1]]], [8, 'Dewi Lestari', 'Dikirim', [['TH-001', 1], ['TH-007', 2]]], [7, 'Hendra Wijaya', 'Proses', [['BH-002', 1]]],
      [7, 'Anisa Rahmawati', 'Proses', [['TH-002', 1], ['TH-003', 1]]], [6, 'Fajar Setiawan', 'Selesai', [['BH-003', 1]]], [6, 'Kelompok Tani Subur', 'Dikirim', [['SY-001', 10], ['SY-002', 5], ['SY-003', 5]]],
      [5, 'Rudi Hartono', 'Proses', [['TH-003', 1]]], [5, 'Melati Kusumawardani', 'Proses', [['TH-004', 1]]], [4, 'Siti Wahyuni', 'Proses', [['SY-001', 2]]],
      [4, 'Bambang S.', 'Proses', [['BH-003', 1]]], [3, 'Dedi Heryanto', 'Proses', [['BH-001', 3], ['BH-004', 1], ['BH-003', 1]]], [3, 'Budi Santoso', 'Selesai', [['BH-002', 1]]],
      [2, 'Rina Anggraini', 'Dikirim', [['TH-001', 1]]], [2, 'Agus Kurnia', 'Selesai', [['BH-002', 2]]], [2, 'Dedi Heryanto', 'Dikirim', [['BH-001', 1]]]
    ];
    H.forEach(function (h, i) {
      var d = addDays(sod(now), -h[0]); d.setHours(8 + (i % 10), (i * 7) % 60, 0, 0);
      var k = KURIR[i % 3];
      orders.push({ id: 'PS-' + ('000' + (304 + i)).slice(-4), t: iso(d), nama: h[1], hp: phone(), kota: KOTA[i % KOTA.length], kurir: k[0], ongkir: k[1], items: h[3].map(function (x) { return line(by[x[0]], x[1]); }), status: h[2], tepat: h[2] === 'Selesai' ? true : null });
    });
    for (var j = 0; j < 6; j++) {
      var dd = addDays(sod(now), -(j < 2 ? 1 : 0)); dd.setHours(8 + j, (j * 11) % 60, 0, 0);
      var nn = 1 + Math.floor(R() * 3), us = {}, its = [];
      while (its.length < nn) { var pp = pick(); if (us[pp.sku]) continue; us[pp.sku] = 1; its.push(line(pp, 1 + Math.floor(R() * 4))); }
      orders.push({ id: 'PS-' + ('000' + (319 + j)).slice(-4), t: iso(dd), nama: NAMES[Math.floor(R() * NAMES.length)], hp: phone(), kota: KOTA[Math.floor(R() * KOTA.length)], kurir: 'GoSend Sameday', ongkir: 25000, items: its, status: 'Dikirim', tepat: null });
    }
    return orders;
  }
  function seedMoves(cat, orders, now) {
    var R = rng(777), out = [], keluar = {};
    orders.forEach(function (o) {
      o.items.forEach(function (it) {
        out.push({
          t: o.t,
          sku: it.sku,
          qty: it.qty,
          type: 'keluar',
          src: 'order',
          ref: o.id,
          pembeli: o.nama || 'Pembeli Online',
          petugas: 'Sistem Toko Online'
        });
        keluar[it.sku] = (keluar[it.sku] || 0) + it.qty;
      });
    });
    var SUPP = ['Kebun Induk Batu', 'Greenhouse Malang', 'Mitra Tani Organik', 'Balai Benih Hortikultura'];
    var start = new Date(now.getFullYear(), 0, 5), span = (addDays(sod(now), -2) - start) / DAY;
    flat(cat).forEach(function (p, pIdx) {
      var tot = Math.round((keluar[p.sku] || 0) * 0.92), n = 8, each = Math.max(10, Math.round(tot / n));
      for (var i = 0; i < n; i++) {
        var d = new Date(start.getTime() + ((i + R() * 0.7) / n) * span * DAY);
        d.setHours(9 + (i % 6), (pIdx * 7 + i * 13) % 60, 0, 0);
        var notaNo = 'SJ-' + d.getFullYear() + p2(d.getMonth() + 1) + '-' + ('00' + (pIdx * 8 + i + 1)).slice(-3);
        out.push({
          t: iso(d),
          sku: p.sku,
          qty: each,
          type: 'masuk',
          src: 'restock',
          ref: notaNo,
          supplier: SUPP[(pIdx + i) % SUPP.length],
          petugas: 'AgriBibit Admin'
        });
      }
    });
    out.sort(function (a, b) { return a.t < b.t ? -1 : a.t > b.t ? 1 : 0; });
    return out;
  }

  /* STATE */
  var db = { cat: null, ord: null, mov: null };
  function load() {
    var now = new Date(), meta = rd(K.meta);
    db.cat = rd(K.cat); db.ord = rd(K.ord); db.mov = rd(K.mov);
    if (!db.cat || !db.cat.sayur || !meta || meta.v !== VER) {
      db.cat = seedCatalog(); db.ord = seedOrders(db.cat, now); db.mov = seedMoves(db.cat, db.ord, now);
      wr(K.cat, db.cat); wr(K.ord, db.ord); wr(K.mov, db.mov); wr(K.meta, { v: VER, seeded: iso(now) });
    }
    db.ord = db.ord || []; db.mov = db.mov || [];
    var fix = false; db.ord.forEach(function (o) { if (o.status === 'Retur') { o.status = 'Selesai'; o.tepat = true; fix = true; } }); if (fix) wr(K.ord, db.ord);
    var fixedFoto = false;
    Object.keys(db.cat).forEach(function (k) {
      db.cat[k].forEach(function (p) {
        if (PHOTO[p.sku] && (!p.foto || p.foto.indexOf('assets/produk/') === 0 || (p.sku === 'SY-005' && p.foto.indexOf('?v=2') < 0))) {
          if (p.foto !== PHOTO[p.sku]) {
            p.foto = PHOTO[p.sku];
            fixedFoto = true;
          }
        }
      });
    });
    if (fixedFoto) wr(K.cat, db.cat);
  }
  load();

  /* PERIODE & AGREGASI */
  function buckets(kind, now) {
    now = now || new Date();
    var t0 = sod(now), b = [], text = '', days = 1, i;
    if (kind === 'hari') {
      for (i = 0; i < 8; i++) { b.push({ label: p2(i * 3), from: new Date(t0.getTime() + i * 3 * 36e5), to: new Date(t0.getTime() + (i + 1) * 3 * 36e5) }); }
      text = 'Hari ini, ' + now.getDate() + ' ' + MONF[now.getMonth()] + ' ' + now.getFullYear();
    } else if (kind === 'minggu' || kind === 'bulan30') {
      var n = kind === 'minggu' ? 7 : 30; days = n;
      for (i = n - 1; i >= 0; i--) { var d = addDays(t0, -i); b.push({ label: kind === 'minggu' ? DOW[d.getDay()] + ' ' + d.getDate() : '' + d.getDate(), from: d, to: addDays(d, 1) }); }
      var a = addDays(t0, -(n - 1));
      text = a.getDate() + (a.getMonth() !== now.getMonth() ? ' ' + MONF[a.getMonth()] : '') + ' \u2013 ' + now.getDate() + ' ' + MONF[now.getMonth()] + ' ' + now.getFullYear();
    } else if (kind === 'bulanan') {
      var y = now.getFullYear(), m = now.getMonth(), dim = new Date(y, m + 1, 0).getDate(), w = Math.ceil(now.getDate() / 7); days = now.getDate();
      for (i = 0; i < w; i++) b.push({ label: 'M' + (i + 1), from: new Date(y, m, 1 + i * 7), to: new Date(y, m, Math.min(dim, (i + 1) * 7) + 1) });
      text = '1 \u2013 ' + now.getDate() + ' ' + MONF[m] + ' ' + y;
    } else {
      var yy = now.getFullYear(); days = Math.round((t0 - new Date(yy, 0, 1)) / DAY) + 1;
      for (i = 0; i <= now.getMonth(); i++) b.push({ label: MON[i], from: new Date(yy, i, 1), to: new Date(yy, i + 1, 1) });
      text = '1 Januari \u2013 ' + now.getDate() + ' ' + MONF[now.getMonth()] + ' ' + yy;
    }
    return { b: b, text: text, days: days };
  }
  function inB(s, bk) { var t = new Date(s); return t >= bk.from && t < bk.to; }
  function orderSub(o) { return o.items.reduce(function (s, i) { return s + i.qty * i.harga; }, 0); }
  function orderQty(o) { return o.items.reduce(function (s, i) { return s + i.qty; }, 0); }
  function sold() { return true; }
  function series(kind, fn, now) {
    var P = buckets(kind, now), vals = P.b.map(function (bk) { return db.ord.reduce(function (s, o) { return s + (sold(o) && inB(o.t, bk) ? fn(o) : 0); }, 0); });
    return { labels: P.b.map(function (x) { return x.label; }), values: vals, text: P.text, days: P.days, total: vals.reduce(function (a, b) { return a + b; }, 0) };
  }
  function moveSeries(kind, now) {
    var P = buckets(kind, now), masuk = [], keluar = [];
    P.b.forEach(function (bk) { var m = 0, k = 0; db.mov.forEach(function (x) { if (inB(x.t, bk)) { if (x.type === 'masuk') m += x.qty; else k += x.qty; } }); masuk.push(m); keluar.push(k); });
    var tm = masuk.reduce(function (a, b) { return a + b; }, 0), tk = keluar.reduce(function (a, b) { return a + b; }, 0);
    return { labels: P.b.map(function (x) { return x.label; }), masuk: masuk, keluar: keluar, text: P.text, net: tm - tk };
  }
  function monthRange(y, m) { return { from: new Date(y, m, 1), to: new Date(y, m + 1, 1) }; }
  function monthOrders(y, m) { var r = monthRange(y, m); return db.ord.filter(function (o) { var t = new Date(o.t); return t >= r.from && t < r.to; }); }
  function katOf(sku) { var f = flat(db.cat).filter(function (p) { return p.sku === sku; })[0]; return f ? f.kat : null; }
  function categorySales(y, m) {
    var o = {}; Object.keys(KAT).forEach(function (k) { o[k] = { kat: k, nama: KAT[k], unit: 0, nilai: 0, pesanan: 0, kirim: 0 }; });
    monthOrders(y, m).forEach(function (ord) {
      var seen = {};
      ord.items.forEach(function (it) {
        var k = it.kat || katOf(it.sku); if (!k) return;
        if (!seen[k]) { seen[k] = 1; o[k].pesanan++; }
        o[k].unit += it.qty; o[k].nilai += it.qty * it.harga; if (ord.status === 'Dikirim' || ord.status === 'Selesai') o[k].kirim += it.qty;
      });
    });
    var arr = Object.keys(o).map(function (k) { return o[k]; }), tot = arr.reduce(function (s, x) { return s + x.nilai; }, 0);
    arr.forEach(function (x) { x.pct = tot ? Math.round(x.nilai / tot * 100) : 0; });
    return { rows: arr, total: tot };
  }
  function categoryStock(now) {
    now = now || new Date();
    var o = {}; Object.keys(KAT).forEach(function (k) { o[k] = { kat: k, nama: KAT[k], stok: 0, varietas: 0, keluar: 0 }; });
    flat(db.cat).forEach(function (p) { o[p.kat].stok += p.stok; o[p.kat].varietas++; });
    var r = monthRange(now.getFullYear(), now.getMonth());
    db.mov.forEach(function (x) { var t = new Date(x.t); if (x.type === 'keluar' && t >= r.from && t < r.to) { var k = katOf(x.sku); if (k) o[k].keluar += x.qty; } });
    var arr = Object.keys(o).map(function (k) { return o[k]; }), tot = arr.reduce(function (s, x) { return s + x.stok; }, 0);
    arr.forEach(function (x) { x.pct = tot ? Math.round(x.stok / tot * 100) : 0; });
    return { rows: arr, total: tot };
  }

  function stockReport(y, m) {
    var r = monthRange(y, m), isNow = (new Date()).getFullYear() === y && (new Date()).getMonth() === m;
    return flat(db.cat).map(function (p) {
      var masuk = 0, keluar = 0, rusak = 0, after = 0;
      db.mov.forEach(function (x) { if (x.sku !== p.sku) return; var t = new Date(x.t), v = x.type === 'masuk' ? x.qty : -x.qty; if (t >= r.from && t < r.to) { if (v > 0) masuk += v; else if (x.src === 'rusak') rusak -= v; else keluar -= v; } else if (t >= r.to) after += v; });
      var akhir = p.stok - after, awal = akhir - masuk + keluar + rusak;
      return { id: p.id, sku: p.sku, nama: p.nama, kat: p.kat, foto: p.foto, awal: Math.max(0, awal), masuk: masuk, keluar: keluar, rusak: rusak, akhir: akhir, stokNow: p.stok, min: p.min, harga: p.harga, rusakNow: p.rusak || 0 };
    });
  }
  function status(p) { return p.stok <= 0 ? 'habis' : p.stok <= p.min ? 'menipis' : 'aman'; }

  function findSku(sku) { var hit = null; Object.keys(db.cat).forEach(function (k) { db.cat[k].forEach(function (p) { if (p.sku === sku) hit = p; }); }); return hit; }

  function stockMove(sku, tipe, qty, info) {
    info = info || {};
    var n = Number(qty);
    if (!Number.isInteger(n) || n < 1) return { ok: false, message: 'Jumlah harus bilangan bulat minimal 1.' };
    var p = findSku(sku);
    if (!p) return { ok: false, message: 'Bibit tidak ditemukan.' };
    var snapCat = JSON.stringify(db.cat), snapMov = JSON.stringify(db.mov);
    var t = iso(new Date());
    var pf = rd('agribibit.profil') || {};
    var actor = pf.nama || 'AgriBibit Admin';
    var stokAwal = p.stok;

    if (tipe === 'masuk') {
      if (!info.nota) return { ok: false, message: 'No. Nota / Kode Batch Semai wajib diisi.' };
      if (!info.foto) return { ok: false, message: 'Foto bukti Nota / Surat Jalan wajib diunggah.' };
      p.stok += n;
      db.mov.push({
        id: 'MV-' + Date.now(),
        t: t,
        sku: sku,
        qty: n,
        before: stokAwal,
        after: p.stok,
        type: 'masuk',
        src: 'masuk',
        sumber: info.sumber || 'Nota Supplier',
        ref: info.nota,
        supplier: info.supplier || '',
        harga: info.harga || 0,
        foto: info.foto,
        petugas: actor
      });
    } else if (tipe === 'rusak') {
      if (!info.alasan) return { ok: false, message: 'Alasan kerusakan bibit wajib dipilih.' };
      if (!info.foto) return { ok: false, message: 'Foto fisik bibit rusak wajib diunggah sebagai bukti audit.' };
      if (n > p.stok) return { ok: false, message: 'Jumlah rusak (' + n + ') melebihi stok tersedia (' + p.stok + ').' };
      p.stok -= n;
      p.rusak = (p.rusak || 0) + n;
      db.mov.push({
        id: 'MV-' + Date.now(),
        t: t,
        sku: sku,
        qty: n,
        before: stokAwal,
        after: p.stok,
        type: 'keluar',
        src: 'rusak',
        ref: info.alasan,
        ket: info.ket || '',
        foto: info.foto,
        petugas: actor
      });
    } else {
      return { ok: false, message: 'Jenis mutasi stok tidak diizinkan.' };
    }

    if (!wr(K.cat, db.cat) || !wr(K.mov, db.mov)) {
      db.cat = JSON.parse(snapCat); db.mov = JSON.parse(snapMov);
      return { ok: false, message: 'Penyimpanan browser penuh. Gunakan foto dengan ukuran lebih kecil.' };
    }
    return { ok: true, stok: p.stok, rusak: p.rusak || 0 };
  }

  window.AgriData = {
    KAT: KAT, MON: MON, MONF: MONF,
    catalog: function () { return db.cat; },
    saveCatalog: function (c) { db.cat = c; return wr(K.cat, c); },
    products: function () { return flat(db.cat); },
    orders: function () { return db.ord; },
    saveOrders: function (o) { db.ord = o; return wr(K.ord, o); },
    addOrder: function (o) { db.ord.push(o); o.items.forEach(function (it) { db.mov.push({ t: o.t, sku: it.sku, qty: it.qty, type: 'keluar', src: 'order', ref: o.id }); var p = flat(db.cat).filter(function (x) { return x.sku === it.sku; })[0]; if (p) { Object.keys(db.cat).forEach(function (k) { db.cat[k].forEach(function (q) { if (q.sku === it.sku) q.stok = Math.max(0, q.stok - it.qty); }); }); } }); wr(K.cat, db.cat); wr(K.mov, db.mov); return wr(K.ord, db.ord); },
    moves: function () { return db.mov; },
    stockMove: stockMove,
    logMove: function (sku, delta, src) { if (!delta) return true; db.mov.push({ t: iso(new Date()), sku: sku, qty: Math.abs(delta), type: delta > 0 ? 'masuk' : 'keluar', src: src || 'edit' }); return wr(K.mov, db.mov); },
    status: status, orderSub: orderSub, orderQty: orderQty, orderTotal: function (o) { return orderSub(o) + o.ongkir; }, fmtDate: fmtDate, sold: sold,
    buckets: buckets, salesSeries: function (k, n) { return series(k, orderSub, n); }, qtySeries: function (k, n) { return series(k, orderQty, n); },
    moveSeries: moveSeries, monthOrders: monthOrders, categorySales: categorySales, categoryStock: categoryStock, stockReport: stockReport,
    onChange: function (fn) { window.addEventListener('storage', function (e) { if (e.key && e.key.indexOf('agribibit.db.') === 0) { load(); fn(); } }); },
    reset: function () { Object.keys(K).forEach(function (k) { try { localStorage.removeItem(K[k]); } catch (e) {  } }); load(); }
  };
})();
