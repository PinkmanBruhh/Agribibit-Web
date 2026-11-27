/* BLOG */
Pages.blog = function (view) {
  const cats = ['Semua', 'Panduan Semai', 'Perawatan Indoor', 'Pencegahan Hama', 'Nutrisi & Pupuk'];
  const newsImages = ['./assets/images/news-1.jpg', './assets/images/news-2.jpg', './assets/images/news-3.jpg', './assets/images/news-4.jpg'];

  view.innerHTML = `
  <div class="blog-page">
    <div class="container">
      <nav class="blog-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a><span>/</span>
        <span class="blog-breadcrumb__current">Blog &amp; Panduan Botani</span>
      </nav>

      <div class="section-head reveal">
        <span class="eyebrow">Jurnal Sahabat Tanam</span>
        <h1 class="section-title">Edukasi &amp; Cerita dari Dunia Botani</h1>
        <p class="section-subtitle">Pelajari panduan praktis, teknik semai modern, diagnosis daun, dan tips merawat tanaman dari tim dokter agronomis kami.</p>
      </div>

      <div class="blog-tabs reveal" role="tablist">
        ${cats.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-tab="${esc(c)}" class="blog-tab${i === 0 ? ' is-active' : ''}">${esc(c)}</button>`).join('')}
      </div>

      <div class="blog-grid">
        ${blogPosts.map((post, i) => `
        <article class="blog-card reveal">
          <div class="blog-card__media">
            <img src="${newsImages[i] || post.image}" alt="${esc(post.title)}" loading="lazy" />
            <span class="blog-card__date">${post.date}</span>
          </div>
          <div class="blog-card__body">
            <h2 class="blog-card__title">${esc(post.title)}</h2>
            <p class="blog-card__desc">Panduan lengkap langkah demi langkah untuk merawat bibit sejak awal datang hingga tumbuh rimbun di pekarangan Anda.</p>
            <div class="blog-card__foot">
              <span class="blog-card__time">${icon('BookOpen', { size: 14 })} 4 menit baca</span>
              <span class="blog-card__link">Baca Selengkapnya ${icon('ArrowRight', { size: 14 })}</span>
            </div>
          </div>
        </article>`).join('')}
      </div>
    </div>
  </div>`;

  view.addEventListener('click', (ev) => {
    const tab = ev.target.closest('[data-tab]');
    if (!tab) return;
    view.querySelectorAll('[data-tab]').forEach((b) => {
      const on = b === tab;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
  });
};
