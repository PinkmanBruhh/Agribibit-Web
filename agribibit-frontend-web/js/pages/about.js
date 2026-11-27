/* TENTANG KAMI */
Pages.about = function (view) {
  const stageImages = ['./assets/images/news-2.jpg', './assets/images/news-3.jpg', './assets/images/news-1.jpg'];
  const memberAvatars = ['./assets/images/news-3.jpg', './assets/images/news-1.jpg', './assets/images/news-2.jpg'];

  const pillar = (ic, title, text, foot) => `
    <article class="about-pillar">
      <span class="about-pillar__icon">${icon(ic, { size: 24 })}</span>
      <h3>${title}</h3>
      <p>${text}</p>
      <span class="about-pillar__foot">${icon('Check', { size: 16 })} ${foot}</span>
    </article>`;

  const stage = (img, alt, eyebrow, title, text, chip) => `
    <article class="about-stage reveal">
      <img src="${img}" alt="${alt}" class="about-stage__img" loading="lazy" />
      <div class="about-stage__body">
        <span class="eyebrow">${eyebrow}</span>
        <h3>${title}</h3>
        <p>${text}</p>
        <span class="chip chip--soft">${chip}</span>
      </div>
    </article>`;

  const guarantee = (title, text) => `
    <div class="about-guarantee-card">
      <div class="about-guarantee-card__head"><span class="about-guarantee-card__dot"></span>${title}</div>
      <p>${text}</p>
    </div>`;

  view.innerHTML = `
  <div class="about-page">
    <div class="container">
      <nav class="about-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a><span>/</span>
        <span class="about-breadcrumb__current">Tentang Kami (About Us)</span>
      </nav>
    </div>

    <section class="about-hero">
      <div class="container about-hero__grid">
        <div>
          <span class="chip chip--soft">Dedikasi botani sejak 2018</span>
          <h1 class="about-hero__title">Menghadirkan Kehidupan Hijau ke Setiap Sudut Rumah &amp; Kebun Anda.</h1>
          <p class="about-hero__lead">Perjalanan AgriBibit berawal dari kebun pembibitan di lereng sejuk Malang, Jawa Timur. Kami berdedikasi menyediakan bibit tanaman terakreditasi, indukan unggul bebas penyakit, serta pendampingan edukasi flora yang ramah dan mudah dipahami.</p>
          <div class="about-stats">
            <div class="about-stat"><strong>50K+</strong><span>Bibit berhasil diadopsi</span></div>
            <div class="about-stat"><strong>99.4%</strong><span>Keberhasilan tumbuh</span></div>
            <div class="about-stat"><strong>120+</strong><span>Varietas unggul</span></div>
            <div class="about-stat"><strong>15</strong><span>Agronomis tersertifikasi</span></div>
          </div>
        </div>
        <div class="about-hero__visual">
          <div class="about-hero__img-wrap">
            <img src="./assets/images/news-3.jpg" alt="Kebun Indukan Bibit AgriBibit di Malang" />
          </div>
          <div class="about-hero__float">
            <div><strong>Kebun Indukan Malang</strong><span>Elevasi 850 mdpl • Sejuk &amp; alami</span></div>
            <span class="chip chip--soft">Terakreditasi</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section--tight">
      <div class="container">
        <div class="about-pillars-panel reveal">
          <div class="section-head">
            <span class="eyebrow">Kisah &amp; Misi Kami</span>
            <h2 class="section-title">Dari Hobi Menjadi Dedikasi Botani Nasional</h2>
            <p class="section-subtitle">Berawal dari kecintaan kami terhadap flora nusantara dan tekad menghadirkan bibit sehat dengan pengemasan standar hortikultura.</p>
          </div>
          <div class="about-pillars-grid">
            ${pillar('Sprout', 'Bibit Sehat Berakar Kuat', 'Setiap bibit melalui proses aklimatisasi ketat selama 21 hari dengan nutrisi slow-release organik.', '100% bebas hama &amp; fungi')}
            ${pillar('MessageCircle', 'Edukasi &amp; Pendampingan', 'Kami percaya merawat tanaman adalah ikatan seumur hidup. Nikmati konsultasi diagnosis gratis bersama Dokter Tanaman via WhatsApp.', 'Layanan Dokter Tanaman aktif 7 hari')}
            ${pillar('Leaf', 'Ekologi &amp; Keberlanjutan', 'Meminimalisir jejak karbon pertanian dengan media tanam cocopeat organik dan pot bio-degradable.', 'Nol limbah plastik sekali pakai')}
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="about-stages-head reveal">
          <div class="section-head section-head--left">
            <span class="eyebrow">Fasilitas &amp; Standar Kualitas</span>
            <h2 class="section-title">Kebun Pembibitan Berteknologi Presisi</h2>
          </div>
          <p>Dari laboratorium benih steril hingga rumah kaca aklimatisasi, setiap tahap diawasi dengan instrumen IoT untuk menjamin vigor tertinggi sebelum dikirim.</p>
        </div>
        <div class="about-stages-grid">
          ${stage(stageImages[0], 'Laboratorium Benih &amp; Semai Terkontrol', 'Tahap 1: Semai Lab', 'Laboratorium Benih &amp; Semai Terkontrol', 'Pengaturan suhu dan kelembapan konstan, serta spektrum cahaya optimal untuk memastikan laju perkembangan benih.', '25°C stabil • Full spectrum')}
          ${stage(stageImages[1], 'Rumah Kaca Aklimatisasi Khusus', 'Tahap 2: Adaptasi', 'Rumah Kaca Aklimatisasi Khusus', 'Bibit dipindahkan ke greenhouse beratap paranet UV untuk melatih stomata daun menghadapi intensitas cuaca alami.', 'Misting otomatis • 65% paranet UV')}
          ${stage(stageImages[2], 'Teknologi Ekspedisi Hidrogel Akar', 'Tahap 3: Logistik', 'Teknologi Ekspedisi Hidrogel Akar', 'Kardus kemasan aerasi berpori anti-gencet dilengkapi formula polimer hidrogel organik yang menjaga kelembapan akar hingga 7 hari.', 'Box aerasi 5 lapis • Tahan 7 hari')}
        </div>
      </div>
    </section>

    <section class="section--tight">
      <div class="container">
        <div class="about-team-head reveal">
          <div class="section-head section-head--left">
            <span class="eyebrow">Pakar Pertanian Tersertifikasi</span>
            <h2 class="section-title">Bertemu dengan Tim Ahli Kami</h2>
          </div>
          <a href="hubungi-kami.html" class="btn btn-primary">Konsultasi Gratis Bersama Tim Ahli</a>
        </div>
        <div class="about-team-grid">
          ${teamMembers.map((m, i) => `
          <article class="about-member reveal">
            <img src="${memberAvatars[i % memberAvatars.length]}" alt="${esc(m.name)}" class="about-member__img" loading="lazy" />
            <h3>${esc(m.name)}</h3>
            <div class="about-member__role">${esc(m.role)}</div>
            <p>${esc(m.bio)}</p>
            <span class="chip chip--soft">${icon('Check', { size: 14 })} ${esc(m.credential)}</span>
          </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Jaminan Kepuasan Sahabat Tanam</span>
          <h2 class="section-title">Garansi Tumbuh Segar 14 Hari &amp; Keamanan Pengiriman</h2>
          <p class="section-subtitle">AgriBibit memberlakukan protokol proteksi terlengkap untuk memastikan Anda menerima bibit dalam kondisi prima.</p>
        </div>
        <div class="about-guarantees reveal">
          ${guarantee('Garansi Ganti 100%', 'Jika bibit layu permanen atau patah selama perjalanan, kirimkan bukti unboxing dan kami kirimkan bibit pengganti baru tanpa biaya tambahan.')}
          ${guarantee('Flora Berlisensi Resmi', 'Bekerjasama dengan balai karantina resmi pertanian, menjamin keabsahan surat jalan dan keamanan flora antarpulau di seluruh Indonesia.')}
          ${guarantee('Komunitas Sahabat Tanam', 'Bergabung bersama 25.000+ perawat tanaman aktif dalam grup eksklusif untuk bertukar tips pemupukan dan inspirasi penataan kebun.')}
        </div>
      </div>
    </section>

    <div class="container">
      <section class="about-cta reveal">
        <div class="about-cta__icon">${icon('Sprout', { size: 28 })}</div>
        <h2>Siap Memulai Petualangan Menanam Anda?</h2>
        <p>Pilih dari ratusan varietas bibit berkualitas tinggi atau bicarakan kebutuhan taman impian Anda bersama dokter botani kami hari ini.</p>
        <div class="about-cta__actions">
          <a href="shop.html" class="btn btn-accent btn-lg">Jelajahi Katalog Bibit</a>
          <a href="hubungi-kami.html" class="btn btn-secondary btn-lg">Konsultasi dengan Dokter Tanaman</a>
        </div>
      </section>
    </div>
  </div>`;
};
