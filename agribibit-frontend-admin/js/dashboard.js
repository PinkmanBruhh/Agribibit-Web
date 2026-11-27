(function () {
  var A = AgriData;
  var GREEN = '#2D6A4F', ORANGE = '#D87A43', SOFT = '#BFD8C9';
  var TARGET_BUAH = 4500000;
  var $ = function (id) { return document.getElementById(id); };
  var rp = function (n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); };
  var nf = function (n) { return Math.round(n).toLocaleString('id-ID'); };
  var dec = function (n, d) { return n.toFixed(d).replace('.', ','); };
  var now = new Date(), Y = now.getFullYear(), M = now.getMonth();

  /* ANIMASI */
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = window.requestAnimationFrame || function (f) { setTimeout(function () { f(Date.now()); }, 16); };
  function onView(el, fn, th) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: th || 0.25 });
    io.observe(el);
  }
  function countUp(el, to, fmt, ms) {
    if (REDUCE) { el.textContent = fmt(to); return; }
    var t0 = null; el.textContent = fmt(0);
    raf(function f(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(Math.round(to * e));
      if (p < 1) raf(f);
    });
  }
  if (!REDUCE) document.querySelectorAll('#content > section:not(.stats)').forEach(function (s) {
    s.classList.add('rv'); onView(s, function () { s.classList.add('seen'); }, 0.08);
  });
  var tween = REDUCE ? false : { duration: 1400, easing: 'easeOutQuart' };
  Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";
  Chart.defaults.color = '#5D5F5B';

  /* KARTU RINGKASAN */
  function stats() {
    var ps = A.products(), ord = A.orders(), td = now.toDateString();
    var mo = A.monthOrders(Y, M), ship = mo.filter(function (o) { return o.status === 'Dikirim' || o.status === 'Selesai'; }).reduce(function (s, o) { return s + A.orderQty(o); }, 0);
    var vals = [
      ps.length,
      ship,
      ord.filter(function (o) { return o.status === 'Proses'; }).length,
      ps.filter(function (p) { return A.status(p) === 'menipis'; }).length,
      ord.filter(function (o) { return new Date(o.t).toDateString() === td; }).length
    ];
    vals.forEach(function (v, i) {
      var el = $('st' + i);
      el.dataset.to = v;
      if (!el.dataset.ready) { el.dataset.ready = 1; el.textContent = REDUCE ? nf(v) : '0'; onView(el, function () { countUp(el, +el.dataset.to, nf, 1400); }); }
      else el.textContent = nf(v);
    });
  }

  /* REGISTRY GRAFIK */
  var C = {};
  function chart(id, cfgFn) { onView($(id), function () { C[id] = new Chart($(id), cfgFn()); }); }
  function refresh(id, cfgFn) { var c = C[id]; if (!c) return; var n = cfgFn(); c.data = n.data; c.update(); }
  var scaleY = function (fmt) { return { min: 0, ticks: { callback: fmt }, grid: { color: '#EEF0EA' }, border: { display: false } }; };
  var juta = function (v) { return v ? (Math.round(v / 1e5) / 10) + 'jt' : '0'; };

  var aR = 'bulan30';
  function aCfg() {
    var s = A.qtySeries(aR), peak = Math.max.apply(null, s.values), avg = s.total / s.values.length;
    $('aSub').textContent = 'Jumlah bibit terpesan \u2022 ' + s.text;
    var half = Math.floor(s.values.length / 2), a = s.values.slice(0, half).reduce(function (x, y) { return x + y; }, 0), b = s.values.slice(half).reduce(function (x, y) { return x + y; }, 0);
    $('aTrend').textContent = a ? (b >= a ? '\u2191 ' : '\u2193 ') + dec(Math.abs((b - a) / a * 100), 1) + '%' : '';
    return {
      type: 'line',
      data: { labels: s.labels, datasets: [{ data: s.values, borderColor: GREEN, borderWidth: 2.5, cubicInterpolationMode: 'monotone', fill: true,
        backgroundColor: function (c) { var ar = c.chart.chartArea; if (!ar) return 'rgba(45,106,79,.1)'; var g = c.chart.ctx.createLinearGradient(0, ar.top, 0, ar.bottom); g.addColorStop(0, 'rgba(45,106,79,.18)'); g.addColorStop(1, 'rgba(45,106,79,0)'); return g; },
        pointBackgroundColor: function (c) { return peak > 0 && c.raw === peak ? ORANGE : GREEN; }, pointRadius: 3.5, pointHoverRadius: 6 },
        { data: s.values.map(function () { return avg; }), borderColor: ORANGE, borderWidth: 1.5, borderDash: [5, 4], pointRadius: 0, fill: false }] },
      options: { maintainAspectRatio: false, animation: tween, plugins: { legend: { display: false } }, scales: { y: scaleY(function (v) { return v; }), x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } } } }
    };
  }
  $('rangeTabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
    aR = b.dataset.r === 'bulan' ? 'bulan30' : b.dataset.r; refresh('lineChart', aCfg);
  });

  function bCfg() {
    var s = A.salesSeries('tahunan'), max = Math.max.apply(null, s.values), cur = s.values.length - 1;
    return { type: 'bar', data: { labels: s.labels, datasets: [{ data: s.values.map(function (v) { return v / 1e6; }), borderRadius: 8, maxBarThickness: 26,
      backgroundColor: s.values.map(function (v, i) { return i === cur ? GREEN : v === max ? ORANGE : SOFT; }) }] },
      options: { maintainAspectRatio: false, animation: REDUCE ? false : { duration: 1100, easing: 'easeOutQuart', delay: function (c) { return c.type === 'data' ? c.dataIndex * 80 : 0; } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return 'Rp ' + dec(c.parsed.y, 1) + ' juta'; } } } },
        scales: { y: { min: 0, ticks: { callback: function (v) { return v + 'jt'; } }, grid: { color: '#EEF0EA' }, border: { display: false } }, x: { grid: { display: false } } } } };
  }
  function bars() {
    var mo = A.monthOrders(Y, M), buah = A.categorySales(Y, M).rows.filter(function (r) { return r.kat === 'buah'; })[0].nilai;
    var p1 = Math.round(buah / TARGET_BUAH * 100), ship = mo.filter(function (o) { return o.status === 'Dikirim' || o.status === 'Selesai'; }), done = mo.filter(function (o) { return o.status === 'Selesai'; });
    var p2 = ship.length ? Math.round(done.length / ship.length * 100) : 0;
    [['bar1', p1], ['bar2', p2]].forEach(function (x) { var el = $(x[0]); el.querySelector('b').textContent = x[1] + '%'; el.querySelector('i').style.setProperty('--w', Math.min(100, x[1]) + '%'); });
  }

  var dPct = 0;
  function dCfg() {
    var from = new Date(now.getTime() - 30 * 864e5), done = A.orders().filter(function (o) { return o.status === 'Selesai' && new Date(o.t) >= from; });
    var tepat = done.filter(function (o) { return o.tepat; }).length; dPct = done.length ? Math.round(tepat / done.length * 100) : 0;
    $('dLeg').innerHTML = '<span><i style="background:#2D6A4F"></i>Tepat Waktu (' + dPct + '%)</span><span><i style="background:#D87A43"></i>Tertunda (' + (done.length ? 100 - dPct : 0) + '%)</span>';
    return { type: 'doughnut', data: { labels: ['Tepat waktu', 'Tertunda'], datasets: [{ data: done.length ? [dPct, 100 - dPct] : [0, 1], backgroundColor: [GREEN, done.length ? ORANGE : '#E3E6DF'], borderWidth: 0, borderRadius: 6 }] },
      options: { maintainAspectRatio: false, cutout: '78%', animation: tween, plugins: { legend: { display: false } } } };
  }

  var sR = 'bulanan';
  function sCfg() {
    var s = A.salesSeries(sR), max = Math.max.apply(null, s.values);
    $('sPer').textContent = 'Periode pengamatan ' + s.text; $('sAvg').textContent = 'Rata-rata ' + rp(s.total / s.days) + ' / hari';
    return { type: 'bar', data: { labels: s.labels, datasets: [{ data: s.values, borderRadius: 6, maxBarThickness: 44, backgroundColor: s.values.map(function (v) { return max > 0 && v === max ? '#8A9180' : '#C4CABB'; }) }] },
      options: { maintainAspectRatio: false, animation: REDUCE ? false : { duration: 1100, easing: 'easeOutQuart', delay: function (c) { return c.type === 'data' ? c.dataIndex * 70 : 0; } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return rp(c.parsed.y); } } } }, scales: { y: scaleY(juta), x: { grid: { display: false } } } } };
  }
  $('tabS').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
    sR = b.dataset.r; refresh('salesChart', sCfg);
  });

  var mR = 'bulanan';
  function mCfg() {
    var s = A.moveSeries(mR);
    $('mPer').textContent = 'Periode pengamatan ' + s.text; $('mNet').textContent = 'Net Inflow: ' + (s.net > 0 ? '+' : '') + nf(s.net) + ' Bibit';
    return { type: 'bar', data: { labels: s.labels, datasets: [{ label: 'Stok masuk', data: s.masuk, backgroundColor: '#A9C3B0', borderRadius: 4, maxBarThickness: 22 }, { label: 'Stok keluar', data: s.keluar, backgroundColor: '#263B30', borderRadius: 4, maxBarThickness: 22 }] },
      options: { maintainAspectRatio: false, animation: tween, plugins: { legend: { display: false } }, scales: { y: scaleY(function (v) { return v; }), x: { grid: { display: false } } } } };
  }
  $('tabM').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
    mR = b.dataset.r; refresh('moveChart', mCfg);
  });

  var COL = { sayur: '#2D6A4F', buah: '#D87A43', hias: '#2E312E' };
  function pcb(r, sub1, sub2) {
    return '<div class="pcb"><div class="a"><span><i style="background:' + COL[r.kat] + '"></i>' + r.nama + '</span><span>' + r.pct + '%</span></div><div class="tk"><i style="width:' + r.pct + '%;background:' + COL[r.kat] + '"></i></div><div class="b"><span>' + sub1 + '</span><span>' + sub2 + '</span></div></div>';
  }
  function cats() {
    var cs = A.categorySales(Y, M), top = cs.rows.slice().sort(function (a, b) { return b.nilai - a.nilai; })[0];
    $('catSales').innerHTML = cs.rows.map(function (r) { return pcb(r, nf(r.unit) + ' bibit terjual', rp(r.nilai)); }).join('');
    $('catSalesNote').textContent = cs.total ? top.nama + ' mendominasi penjualan bulan ini (' + top.pct + '% dari total nilai ' + rp(cs.total) + ').' : 'Belum ada penjualan bulan ini.';
    var ks = A.categoryStock(), tk = ks.rows.slice().sort(function (a, b) { return b.keluar - a.keluar; })[0], tot = ks.rows.reduce(function (s, r) { return s + r.keluar; }, 0);
    $('catStock').innerHTML = ks.rows.map(function (r) { return pcb(r, nf(r.stok) + ' bibit tersedia', r.varietas + ' varietas'); }).join('');
    $('catStockNote').textContent = tot ? tk.nama + ' mendominasi perputaran stok bulan ini (' + Math.round(tk.keluar / tot * 100) + '% dari stok keluar).' : 'Belum ada pergerakan stok keluar bulan ini.';
  }

  /* RENDER */
  chart('lineChart', aCfg); chart('barChart', bCfg); chart('donut', dCfg); chart('salesChart', sCfg); chart('moveChart', mCfg);
  onView($('donut'), function () { countUp($('dv'), dPct, function (n) { return n + '%'; }, 1400); });
  function all() {
    stats(); bars(); cats();
    [['lineChart', aCfg], ['barChart', bCfg], ['donut', dCfg], ['salesChart', sCfg], ['moveChart', mCfg]].forEach(function (x) { refresh(x[0], x[1]); });
    $('dv').textContent = dPct + '%';
  }
  stats(); bars(); cats(); dCfg(); aCfg(); sCfg(); mCfg();
  document.querySelectorAll('.bar').forEach(function (b) { onView(b, function () { b.classList.add('in'); }); });
  A.onChange(all);
})();
