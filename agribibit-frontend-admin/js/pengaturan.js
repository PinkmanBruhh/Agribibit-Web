(function () {
  var $ = function (id) { return document.getElementById(id); };
  var KEY = 'agribibit.profil';
  var DEF = { nama: 'AgriBibit Admin', jabatan: 'Distribusi Bibit', email: 'admin.distribusi@agribibit.id', hub: 'Hub JKT-01 (Cakung Central)', bahasa: 'Bahasa Indonesia (ID)' };
  var pr = DEF;
  try { pr = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { pr = DEF; }
  var f = $('pf');
  function fill() {
    ['nama', 'jabatan', 'email', 'hub', 'bahasa'].forEach(function (k) { f.elements[k].value = pr[k]; });
    $('pN').textContent = pr.nama; $('pR').textContent = pr.jabatan; $('pE').textContent = ''; $('pOk').textContent = '';
  }
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = {}; ['nama', 'jabatan', 'email', 'hub', 'bahasa'].forEach(function (k) { v[k] = f.elements[k].value.trim(); });
    $('pOk').textContent = '';
    if (!v.nama) { $('pE').textContent = 'Nama lengkap wajib diisi.'; return; }
    if (!v.jabatan) { $('pE').textContent = 'Jabatan wajib diisi.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) { $('pE').textContent = 'Format email belum benar, contoh: nama@agribibit.id.'; return; }
    pr = v;
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (x) {  }
    fill(); $('pOk').textContent = 'Perubahan disimpan. Nama di header ikut berubah saat halaman dimuat ulang.';
  });
  $('pC').addEventListener('click', fill);
  $('ph').addEventListener('change', function () {
    var file = this.files[0]; if (!file) return;
    var r = new FileReader();
    r.onload = function () { $('avImg').src = r.result; };
    r.readAsDataURL(file);
  });

  var S = [
    { i: 'laptop', n: 'MacBook Pro 14"', b: 'Chrome 128.0 \u2022 macOS Sonoma', l: 'Jakarta Timur, Indonesia', t: 'Hari ini, 09:41 WIB', ip: '182.253.14.88', now: 1 },
    { i: 'phone', n: 'iPhone 15 Pro', b: 'Safari Mobile \u2022 iOS 17.5', l: 'Jakarta Selatan, Indonesia', t: 'Kemarin, 21:15 WIB', ip: '180.244.112.5' },
    { i: 'monitor', n: 'Windows PC \u2013 Gudang Hub 01', b: 'Microsoft Edge \u2022 Windows 11', l: 'Bekasi, Indonesia', t: '6 Nov 2026, 14:02 WIB', ip: '103.111.20.12' }
  ];
  function ses() {
    $('ses').innerHTML = S.map(function (s, k) {
      return '<tr><td><div class="nm"><span class="dv' + (s.now ? ' on' : '') + '">' + icon(s.i) + '</span><div><b>' + s.n.replace(/"/g, '&quot;') + '</b><small>' + s.b + '</small></div></div></td><td><span class="loc">' + icon('pin') + s.l + '</span></td><td>' + s.t + '</td><td class="mn2">' + s.ip + '</td>' +
        '<td>' + (s.now ? '<span class="dotp g">Sesi ini</span>' : '<button class="btn sm" data-k="' + k + '">Keluarkan</button>') + '</td></tr>';
    }).join('');
    $('sCnt').textContent = 'Total: ' + S.length + ' Sesi Tercatat';
  }
  $('ses').addEventListener('click', function (e) {
    var b = e.target.closest('[data-k]'); if (!b) return;
    S.splice(+b.dataset.k, 1); ses();
  });
  var lod = $('lod');
  $('lo').addEventListener('click', function () { lod.showModal(); });
  $('loC').addEventListener('click', function () { lod.close(); });
  $('loOk').addEventListener('click', function () { try { sessionStorage.removeItem('agribibit_session'); } catch (e) {  } location.href = 'login.html'; });

  /* FOTO HERO WEB BUYER */
  var HKEY = 'agribibit.heroImg', HMAX = 1200;
  var HDEF = 'assets/hero-default.jpg';
  function heroGet() { try { return localStorage.getItem(HKEY); } catch (e) { return null; } }
  function heroSet(v) { try { localStorage.setItem(HKEY, v); localStorage.removeItem('agribibit.heroMode'); return true; } catch (e) { return false; } }
  function heroDel() { try { localStorage.removeItem(HKEY); localStorage.removeItem('agribibit.heroMode'); } catch (e) {  } }
  function heroShow() {
    var cur = heroGet();
    $('hrImg').src = cur || HDEF;
    $('hrState').textContent = cur ? 'Foto kustom' : 'Bawaan';
    $('hrReset').hidden = !cur;
    var dl = $('hrDl'); dl.hidden = !cur; if (cur) dl.href = cur;
  }
  $('hrFile').addEventListener('change', function () {
    var file = this.files[0]; this.value = '';
    $('hrE').textContent = ''; $('hrOk').textContent = '';
    if (!file) return;
    if (!/^image\//.test(file.type)) { $('hrE').textContent = 'Pilih file gambar (JPG, PNG, atau WebP).'; return; }
    var r = new FileReader();
    r.onload = function () {
      var im = new Image();
      im.onerror = function () { $('hrE').textContent = 'Gambar tidak bisa dibaca. Coba file lain.'; };
      im.onload = function () {
        var c = document.createElement('canvas'), ctx = c.getContext('2d');
        c.width = im.width; c.height = im.height;
        ctx.drawImage(im, 0, 0);
        var d = ctx.getImageData(0, 0, c.width, c.height).data;
        var top = c.height, left = c.width, right = 0, bottom = 0, found = false;
        for (var y = 0; y < c.height; y++) {
          for (var x = 0; x < c.width; x++) {
            var i = (y * c.width + x) * 4;
            var a = d[i + 3], r = d[i], g = d[i + 1], b = d[i + 2];
            if (a > 25 && !(r > 245 && g > 245 && b > 245)) {
              if (x < left) left = x;
              if (x > right) right = x;
              if (y < top) top = y;
              if (y > bottom) bottom = y;
              found = true;
            }
          }
        }
        var sx = found ? left : 0, sy = found ? top : 0;
        var sw = found ? (right - left + 1) : im.width, sh = found ? (bottom - top + 1) : im.height;
        var side = Math.round(Math.max(sw, sh) * 1.04);
        var out = Math.min(HMAX, side);
        var sc = out / side;
        var oc = document.createElement('canvas'), octx = oc.getContext('2d');
        oc.width = out; oc.height = out;
        octx.fillStyle = '#FFFFFF';
        octx.fillRect(0, 0, out, out);
        var dw = Math.round(sw * sc), dh = Math.round(sh * sc);
        var dx = Math.round((out - dw) / 2), dy = Math.round((out - dh) / 2);
        octx.drawImage(im, sx, sy, sw, sh, dx, dy, dw, dh);
        if (!heroSet(oc.toDataURL('image/jpeg', 0.88))) { $('hrE').textContent = 'Foto terlalu besar untuk disimpan di browser. Coba foto yang lebih kecil.'; return; }
        heroShow(); $('hrOk').textContent = 'Foto hero disimpan. Muat ulang Beranda web buyer untuk melihatnya.';
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });
  $('hrReset').addEventListener('click', function () {
    heroDel(); heroShow(); $('hrE').textContent = ''; $('hrOk').textContent = 'Foto hero dikembalikan ke bawaan.';
  });
  heroShow();
  fill(); ses();
})();
