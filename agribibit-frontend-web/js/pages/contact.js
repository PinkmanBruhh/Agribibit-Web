/* HUBUNGI KAMI */
Pages.contact = function (view) {
  let submitted = false;
  const form = { name: '', email: '', phone: '', topic: 'Konsultasi Tanaman', message: '' };
  const topics = ['Konsultasi Tanaman', 'Status Pengiriman & Resi', 'Klaim Garansi Tumbuh 14 Hari', 'Pemesanan Jumlah Besar (B2B)', 'Lainnya'];

  view.innerHTML = `
  <div class="contact-page">
    <div class="container">
      <nav class="contact-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a><span>/</span>
        <span class="contact-breadcrumb__current">Hubungi Kami</span>
      </nav>

      <div class="section-head reveal">
        <span class="eyebrow">Layanan Pelanggan &amp; Agronomis</span>
        <h1 class="section-title">Kami Siap Membantu Kebun Impian Anda</h1>
        <p class="section-subtitle">Ada pertanyaan tentang bibit, garansi tumbuh, klaim pengiriman, atau ingin berkonsultasi langsung dengan Dokter Tanaman? Hubungi kami kapan saja.</p>
      </div>

      <div class="contact-grid">
        <div class="contact-side">
          <div class="contact-wa-card reveal">
            <div class="contact-wa-card__icon">${icon('MessageCircle', { size: 26 })}</div>
            <h2>Dokter Tanaman WhatsApp</h2>
            <p>Kirim foto daun, batang, atau akar tanaman Anda. Dokter agronomis kami siap mendiagnosa dan memberikan resep nutrisi secara gratis.</p>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" class="btn btn-accent">Chat WhatsApp Sekarang</a>
          </div>

          <div class="contact-info-card reveal">
            <div class="contact-info-item">
              <span class="contact-info-item__icon">${icon('MapPin', { size: 20 })}</span>
              <div><h3>Kebun Pembibitan Indukan</h3><p>Jl. Raya Kebun Teh No. 88, Lawang, Kab. Malang, Jawa Timur 65215</p></div>
            </div>
            <div class="contact-info-item">
              <span class="contact-info-item__icon">${icon('Mail', { size: 20 })}</span>
              <div><h3>Email Resmi</h3><p>bantuan@agribibit.id • info@agribibit.id</p></div>
            </div>
            <div class="contact-info-item">
              <span class="contact-info-item__icon">${icon('Clock', { size: 20 })}</span>
              <div><h3>Jam Operasional Kebun</h3><p>Senin – Minggu: 07.30 – 17.00 WIB (Kunjungan dengan reservasi)</p></div>
            </div>
          </div>
        </div>

        <div class="contact-form-card reveal">
          <h2>Kirim Pesan</h2>
          <p class="contact-form-card__sub">Isi formulir di bawah ini dan tim kami akan merespons dalam waktu 1x24 jam kerja.</p>
          <div id="contact-slot"></div>
        </div>
      </div>
    </div>
  </div>`;

  const slot = view.querySelector('#contact-slot');

  function draw() {
    if (submitted) {
      slot.innerHTML = `
      <div class="contact-success">
        ${icon('CheckCircle2', { size: 44, cls: 'contact-success__icon' })}
        <h3>Pesan Terkirim!</h3>
        <p>Terima kasih, tim AgriBibit telah menerima pertanyaan Anda. Kami akan segera menghubungi email atau WhatsApp Anda.</p>
        <button type="button" data-act="again" class="btn btn-outline btn-sm">Kirim Pesan Lain</button>
      </div>`;
      return;
    }
    slot.innerHTML = `
    <form class="contact-form" id="contact-form">
      <div>
        <label class="contact-label" for="c-name">Nama Lengkap *</label>
        <input id="c-name" name="name" type="text" required class="input" placeholder="Contoh: Budi Santoso" value="${esc(form.name)}" />
      </div>
      <div class="contact-form__row">
        <div>
          <label class="contact-label" for="c-email">Email *</label>
          <input id="c-email" name="email" type="email" required class="input" placeholder="nama@email.com" value="${esc(form.email)}" />
        </div>
        <div>
          <label class="contact-label" for="c-phone">No. WhatsApp</label>
          <input id="c-phone" name="phone" type="tel" class="input" placeholder="08123456xxx" value="${esc(form.phone)}" />
        </div>
      </div>
      <div>
        <label class="contact-label" for="c-topic">Topik Pertanyaan</label>
        <select id="c-topic" name="topic" class="input">
          ${topics.map((t) => `<option value="${esc(t)}"${t === form.topic ? ' selected' : ''}>${esc(t)}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="contact-label" for="c-msg">Pesan Anda *</label>
        <textarea id="c-msg" name="message" rows="4" required class="input contact-textarea" placeholder="Ceritakan detail pertanyaan atau kondisi tanaman Anda...">${esc(form.message)}</textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-lg btn-block">${icon('Send', { size: 18 })} Kirim Pertanyaan</button>
    </form>`;
  }

  view.addEventListener('input', (ev) => {
    const name = ev.target.name;
    if (name && name in form) form[name] = ev.target.value;
  });
  view.addEventListener('change', (ev) => {
    if (ev.target.name === 'topic') form.topic = ev.target.value;
  });
  view.addEventListener('submit', (ev) => {
    if (ev.target.id !== 'contact-form') return;
    ev.preventDefault();
    submitted = true;
    draw();
    toast('Pesan terkirim', 'Tim AgriBibit akan merespons dalam 1x24 jam kerja.');
  });
  view.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-act="again"]')) { submitted = false; draw(); }
  });

  draw();
};
