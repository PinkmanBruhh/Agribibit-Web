/* BERANDA */
Pages.home = function (view) {
  const featureCards = [
    { icon: 'Sprout', title: 'Hadirkan Alam ke Rumah', desc: 'Udara lebih segar, suasana tenang, dan sentuhan hijau di setiap sudut ruangan.' },
    { icon: 'Trees', title: 'Tanam Hijau, Hidup Bersih', desc: 'Tanaman menyerap CO₂, melepas oksigen, dan menjaga bumi tetap sehat.' },
    { icon: 'Recycle', title: 'Ekologi & Keberlanjutan', desc: 'Media cocopeat organik dan kemasan ramah lingkungan untuk jejak karbon minimal.' },
  ];
  const tabNames = ['Semua Bibit', 'Bibit Buah', 'Bibit Sayur', 'Tanaman Hias'];
  const newsImages = ['./assets/images/news-1.jpg', './assets/images/news-2.jpg', './assets/images/news-3.jpg', './assets/images/news-4.jpg'];
  const lovedPlants = [...products].filter((p) => p.stock > 0).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);
  const featurePages = Math.ceil(featureCards.length / 2);

  let activeTab = 'Semua Bibit';
  let loading = true;
  let featurePage = 0;
  let loadTimer = null;

  view.innerHTML = `
  <div class="home">
    <!-- HERO -->
    <section class="hero">
      ${LeafDecor('hero__leaf hero__leaf--tl')}
      <div class="container hero__grid">
        <div class="hero__copy">
          <span class="chip chip--soft hero__chip">${icon('Leaf', { size: 14 })} 100% bibit bersertifikat</span>
          <h1 class="hero__title">Tanam Bibit, tumbuhkan masa depan <span class="text-accent">hijau</span></h1>
          <p class="hero__lead">Bibit sayur, buah, dan tanaman hias pilihan dari nursery kami — dikirim segar dengan packing aerasi dan garansi tumbuh.</p>
          <div class="hero__ctas">
            <a href="shop.html" class="btn btn-primary btn-lg">Belanja Sekarang ${icon('ArrowRight', { size: 18 })}</a>
            <a href="#cara-kerja" class="hero__watch">
              <span class="icon-btn icon-btn--neutral">${icon('Play', { size: 16, fill: true })}</span>
              Lihat Cara Kerja
            </a>
          </div>
          <ul class="hero__trust">
            <li><strong>50K+</strong><span>Bibit teradopsi</span></li>
            <li><strong>4.8</strong><span>Rating pembeli</span></li>
            <li><strong>14 hari</strong><span>Garansi tumbuh</span></li>
          </ul>
        </div>

        <div class="hero__visual">
          <div class="hero__glow" aria-hidden="true"></div>
          <img src="${esc(getHeroImage())}" alt="Tanaman Monstera rimbun dalam pot keramik krem" class="hero__img" fetchpriority="high" />
          <svg class="hero__curves" viewBox="0 0 520 520" fill="none" aria-hidden="true">
            <path d="M392 92c-40 4-66 22-82 54" />
            <path d="M110 236c26 8 44 26 52 52" />
            <path d="M396 412c-26-4-48-18-60-42" />
          </svg>
          <div class="float-card float-card--weather">
            <span class="float-card__icon">${icon('CloudSun', { size: 18 })}</span>
            <div><strong>Cuaca</strong><span>Cerah, 28°C</span></div>
          </div>
          <div class="float-card float-card--wet">
            <span class="float-card__icon float-card__icon--dark">${icon('Droplets', { size: 18 })}</span>
            <div class="float-card__grow">
              <strong>Kelembapan</strong>
              <div class="progress"><div class="progress__bar progress__bar--secondary float-card__bar"></div></div>
              <span>72% optimal</span>
            </div>
          </div>
          <div class="float-card float-card--sun">
            <span class="float-card__icon">${icon('Sun', { size: 18 })}</span>
            <div><strong>Cahaya</strong><span>9–10 jam/hari</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY -->
    <section class="section" id="cara-kerja">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Kenapa harus menanam</span>
          <h2 class="section-title">Tanaman Membuat Hidup Lebih Baik</h2>
        </div>
        <div class="why__cards reveal">
          ${featureCards.map((f) => `
            <article class="why-card">
              <span class="why-card__icon">${icon(f.icon, { size: 30, sw: 1.85 })}</span>
              <div class="why-card__body">
                <h3>${esc(f.title)}</h3>
                <p>${esc(f.desc)}</p>
              </div>
            </article>`).join('')}
        </div>
      </div>
    </section>

    <!-- PRODUCTS -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Semua Bibit</span>
          <h2 class="section-title">Jelajahi Bibit Terbaik Kami</h2>
        </div>

        <div class="tabs reveal" role="tablist" aria-label="Kategori bibit">
          ${tabNames.map((cat) => `<button role="tab" data-tab="${cat}" aria-selected="${cat === activeTab}" class="tabs__item${cat === activeTab ? ' is-active' : ''}">${cat}</button>`).join('')}
        </div>

        <div class="product-grid" id="home-grid"></div>
        <div id="home-empty"></div>

        <div class="center-cta">
          <a href="shop.html" class="btn btn-primary">Lihat Seluruh Katalog ${icon('ArrowRight', { size: 16 })}</a>
        </div>
      </div>
    </section>

    <!-- MOST LOVED -->
    <section class="section loved">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Favorit pelanggan</span>
          <h2 class="section-title">Tanaman Paling Dicintai</h2>
        </div>
        <div class="carousel reveal">
          <div class="carousel__track" id="home-track">
            ${lovedPlants.map((p) => `<div class="carousel__slide">${ProductCard(p, { showAdd: false, showCategory: false })}</div>`).join('')}
          </div>
          <div class="carousel__nav">
            <button class="icon-btn" data-act="track-left" aria-label="Geser ke kiri">${icon('ChevronLeft', { size: 18 })}</button>
            <button class="icon-btn icon-btn--primary" data-act="track-right" aria-label="Geser ke kanan">${icon('ChevronRight', { size: 18 })}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- TRENDING BENTO -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Trending</span>
          <h2 class="section-title">Promo &amp; Paket Pilihan</h2>
        </div>

        <div class="bento reveal">

          <a href="shop.html" class="bento__item bento__item--1">
            <div class="bento__content">
              <span class="chip chip--accent">${icon('BadgePercent', { size: 14 })} Hemat 50%</span>
              <h3>Best Seller<br>Tanaman Hias</h3>
              <p>Tanaman hias pilihan kualitas terbaik.</p>
              <span class="btn btn-primary btn-sm">Belanja ${icon('ArrowRight', { size: 14 })}</span>
            </div>
            <span class="bento__spark bento__spark--right" aria-hidden="true"><i></i><i></i></span>
            <img src="./assets/produk/monstera-variegata.png" alt="Monstera variegata dalam pot" loading="lazy" />
          </a>

          <a href="shop.html" class="bento__item bento__item--2">
            <img src="./assets/produk/paket-kebun-sayur.png" alt="Paket kebun sayur dalam kotak kayu" loading="lazy" />
            <div class="bento__content">
              <h3>Paket Kebun<br>Sayur</h3>
              <p>6 bibit sayur +<br>media tanam.</p>
              <span class="btn btn-primary btn-sm">Lihat paket ${icon('ArrowRight', { size: 14 })}</span>
            </div>
          </a>

          <a href="shop.html" class="bento__item bento__item--3">
            <img src="./assets/produk/sansevieria.png" alt="Sansevieria dalam pot" loading="lazy" />
            <span class="bento__vertical">${icon('Leaf', { size: 13 })} Pot Musim Ini</span>
          </a>

          <a href="shop.html" class="bento__item bento__item--4">
            <img src="./assets/produk/aglaonema-suksom.png" alt="Aglaonema suksom merah" loading="lazy" />
            <div class="bento__content bento__content--right">
              <h3>Tanaman<br>Premium</h3>
              <p>Sehat, segar,<br>dan tahan lama.</p>
              <span class="btn btn-primary btn-sm">Belanja ${icon('ArrowRight', { size: 14 })}</span>
            </div>
            <span class="bento__vertical bento__vertical--corner">${icon('Leaf', { size: 13 })} Kualitas Nursery</span>
          </a>

          <a href="shop.html" class="bento__item bento__item--5">
            <img src="./assets/produk/bibit-buah-okulasi.png" alt="Bibit buah jeruk okulasi" loading="lazy" />
            <div class="bento__content">
              <span class="bento__leaf-badge">${icon('Leaf', { size: 22, fill: true })}</span>
              <h3>Bibit Buah Okulasi</h3>
              <p>Cepat berbuah,<br>diskon hingga 30%</p>
              <span class="btn bento__btn-white btn-sm">Pilih bibit ${icon('ArrowRight', { size: 14 })}</span>
            </div>
          </a>

          <a href="shop.html" class="bento__item bento__item--6">
            <span class="bento__spark bento__spark--left" aria-hidden="true"><i></i><i></i></span>
            <img src="./assets/produk/kaktus.png" alt="Kaktus dalam pot putih" loading="lazy" />
            <div class="bento__content bento__content--right">
              <h3>Koleksi<br>Kaktus &amp;<br>Sukulen</h3>
              <p>Perawatan minim,<br>cocok untuk pemula.</p>
              <span class="btn btn-primary btn-sm">Belanja ${icon('ArrowRight', { size: 14 })}</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="section testi">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Testimoni</span>
          <h2 class="section-title">Cerita Panen Sahabat AgriBibit</h2>
        </div>
        <div class="testi__grid">
          ${(testimonials || []).slice(0, 3).map((t, i) => `
          <figure class="testi-card reveal reveal-delay-${i + 1}">
            ${icon('Quote', { size: 28, cls: 'testi-card__quote' })}
            ${Stars(t.rating || 5)}
            <blockquote>${esc(t.text)}</blockquote>
            <figcaption>
              <span class="testi-card__avatar">${esc(t.avatar || (t.name || 'U').charAt(0))}</span>
              <div><strong>${esc(t.name)}</strong><span>${esc(t.variant || 'Pelanggan setia')}</span></div>
            </figcaption>
          </figure>`).join('')}
        </div>
      </div>
    </section>

    <!-- NEWS -->
    <section class="section">
      <div class="container">
        <div class="news__head reveal">
          <div class="section-head section-head--left">
            <span class="eyebrow">Jurnal AgriBibit</span>
            <h2 class="section-title">Artikel Terbaru</h2>
          </div>
          <a href="blog.html" class="btn btn-outline btn-sm">Lihat Semua ${icon('ArrowRight', { size: 14 })}</a>
        </div>
        <div class="news__grid">
          ${blogPosts.slice(0, 4).map((post, i) => `
          <a href="blog.html" class="news-card reveal reveal-delay-${(i % 3) + 1}">
            <img src="${newsImages[i] || post.image}" alt="${esc(post.title)}" loading="lazy" />
            <span class="news-card__date">${post.date}</span>
            <div class="news-card__body">
              <h3>${esc(post.title)}</h3>
              <span class="news-card__arrow">${icon('ArrowUpRight', { size: 18 })}</span>
            </div>
          </a>`).join('')}
        </div>
      </div>
    </section>
  </div>`;

  /* BAGIAN DINAMIS */
  const grid = view.querySelector('#home-grid');
  const empty = view.querySelector('#home-empty');
  const track = view.querySelector('#home-track');

  function drawGrid() {
    const filtered = activeTab === 'Semua Bibit' ? products : products.filter((p) => p.category === activeTab);
    const list = filtered.slice(0, 6);
    if (loading) {
      grid.innerHTML = Array.from({ length: 6 }, () => `
        <div class="skeleton-card" aria-hidden="true">
          <div class="skeleton skeleton-card__media"></div>
          <div class="skeleton skeleton-card__line"></div>
          <div class="skeleton skeleton-card__line skeleton-card__line--short"></div>
        </div>`).join('');
      empty.innerHTML = '';
      return;
    }
    grid.innerHTML = list.map((p) => ProductCard(p)).join('');
    empty.innerHTML = list.length === 0 ? `
      <div class="empty-state">
        <span class="empty-state__icon">${icon('Search', { size: 28 })}</span>
        <h3 class="empty-state__title">Belum ada bibit di kategori ini</h3>
        <p class="empty-state__text">Coba pilih kategori lain atau lihat seluruh katalog kami.</p>
      </div>` : '';
  }

  function startLoading() {
    loading = true;
    drawGrid();
    clearTimeout(loadTimer);
    loadTimer = setTimeout(() => { loading = false; drawGrid(); }, 350);
  }

  startLoading();

  /* EVENT */
  view.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-act], [data-tab]');
    if (!t) return;
    if (t.dataset.tab) {
      activeTab = t.dataset.tab;
      view.querySelectorAll('[data-tab]').forEach((b) => {
        const on = b.dataset.tab === activeTab;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      startLoading();
      return;
    }
    switch (t.dataset.act) {
      case 'track-left': track.scrollBy({ left: -track.clientWidth * 0.8, behavior: 'smooth' }); break;
      case 'track-right': track.scrollBy({ left: track.clientWidth * 0.8, behavior: 'smooth' }); break;
      default: break;
    }
  });

  function onHeroStorage(ev) {
    if (ev.key === 'agribibit.heroImg') {
      const heroImg = view.querySelector('.hero__img');
      if (heroImg) heroImg.src = getHeroImage();
    }
  }
  window.addEventListener('storage', onHeroStorage);

  return () => {
    clearTimeout(loadTimer);
    window.removeEventListener('storage', onHeroStorage);
  };
};
