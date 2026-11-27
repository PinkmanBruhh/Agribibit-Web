Pages.login = function (view) {
  document.body.classList.add('is-auth-page');

  view.innerHTML = `
  <div class="auth-page">
    <div class="auth-split">

      <section class="auth-hero" aria-label="AgriBibit">
        <a href="index.html" class="auth-brand">
          <img src="./assets/logo.png" alt="Logo AgriBibit">
          <span>AgriBibit</span>
        </a>
        <h2>
          Belanja Bibit Unggulan<br>
          &amp; Pantau <span class="accent">Pesananmu</span>.
        </h2>
        <p>Masuk untuk memesan bibit sayur, buah, dan tanaman hias, lalu lacak pengirimannya sampai ke rumah.</p>
      </section>

      <section class="auth-panel">
        <div class="auth-form-wrap">
          <h1>Selamat Datang Kembali</h1>
          <p class="lead">Masuk ke akun AgriBibit Anda untuk berbelanja dan melihat status pesanan.</p>

          <form id="loginForm" novalidate>
            <div class="auth-field" id="fieldEmail">
              <label for="login-email">Email atau Username</label>
              <div class="auth-input">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2.5"/>
                  <path d="M3.5 7l8.5 6 8.5-6"/>
                </svg>
                <input id="login-email" type="text" placeholder="nama@email.com" autocomplete="username" required>
              </div>
              <div class="auth-error">Email atau username wajib diisi.</div>
            </div>

            <div class="auth-field" id="fieldPassword">
              <label for="login-password">Kata Sandi</label>
              <div class="auth-input">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="10" rx="2.5"/>
                  <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
                </svg>
                <input id="login-password" type="password" placeholder="Masukkan kata sandi" autocomplete="current-password" required>
                <button type="button" class="auth-toggle-pw" id="togglePw" aria-label="Tampilkan kata sandi">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke-width="2" aria-hidden="true">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <div class="auth-error">Kata sandi wajib diisi.</div>
            </div>

            <div class="auth-row">
              <label class="auth-remember">
                <input type="checkbox" id="remember" checked>
                <span>Ingat saya</span>
              </label>
              <a href="#" class="auth-link">Lupa kata sandi?</a>
            </div>

            <button type="submit" class="auth-btn-primary">
              Masuk
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>
          </form>

          <div class="auth-divider">atau</div>

          <button type="button" class="auth-btn-google" id="btnGoogle">
            <img src="./assets/google.svg" alt="" width="20" height="20">
            Masuk dengan Google
          </button>

          <button type="button" class="auth-btn-guest" id="btnGuest">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            Masuk sebagai Guest (Tamu)
          </button>

          <p class="auth-signup">
            Belum punya akun? <a href="register.html" class="auth-link">Daftar di sini &rarr;</a>
          </p>

          <div class="auth-trust">
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z"/></svg>
              Data Terenkripsi SSL 256-Bit
            </span>
            <span>&bull;</span>
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
              Anti Spam Terverifikasi
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>`;

  const pw = view.querySelector('#login-password');
  const togglePw = view.querySelector('#togglePw');
  const form = view.querySelector('#loginForm');
  const email = view.querySelector('#login-email');
  const fieldEmail = view.querySelector('#fieldEmail');
  const fieldPassword = view.querySelector('#fieldPassword');
  const btnGoogle = view.querySelector('#btnGoogle');

  togglePw.addEventListener('click', () => {
    const show = pw.type === 'password';
    pw.type = show ? 'text' : 'password';
    togglePw.setAttribute('aria-label', show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = email.value.trim();
    const emailEmpty = emailVal === '';
    const pwEmpty = pw.value === '';
    fieldEmail.classList.toggle('invalid', emailEmpty);
    fieldPassword.classList.toggle('invalid', pwEmpty);
    if (!emailEmpty && !pwEmpty) {
      const displayName = emailVal.includes('@') ? emailVal.split('@')[0] : emailVal;
      AuthUser.set({ name: displayName, email: emailVal });
      toast('Berhasil masuk!', `Selamat datang kembali, ${displayName}`);
      const next = sessionStorage.getItem('agribibit.redirectAfterLogin') || '/';
      sessionStorage.removeItem('agribibit.redirectAfterLogin');
      Router.go(next);
    }
  });

  btnGoogle.addEventListener('click', () => {
    AuthUser.set({ name: 'Sumi Hartati', email: 'sumi.hartati@gmail.com' });
    toast('Berhasil masuk dengan Google!', 'Selamat datang, Sumi Hartati');
    const next = sessionStorage.getItem('agribibit.redirectAfterLogin') || '/';
    sessionStorage.removeItem('agribibit.redirectAfterLogin');
    Router.go(next);
  });

  const btnGuest = view.querySelector('#btnGuest');
  btnGuest.addEventListener('click', () => {
    AuthUser.clear();
    sessionStorage.removeItem('agribibit.redirectAfterLogin');
    toast('Mode Guest aktif', 'Anda dapat menjelajahi katalog. Login diperlukan saat Checkout.');
    Router.go('/');
  });

  [email, pw].forEach((input) => {
    input.addEventListener('input', () => {
      input.closest('.auth-field').classList.remove('invalid');
    });
  });

  return () => document.body.classList.remove('is-auth-page');
};

Pages.register = function (view) {
  document.body.classList.add('is-auth-page');

  view.innerHTML = `
  <div class="auth-page">
    <div class="auth-split">

      <section class="auth-hero" aria-label="AgriBibit">
        <a href="index.html" class="auth-brand">
          <img src="./assets/logo.png" alt="Logo AgriBibit">
          <span>AgriBibit</span>
        </a>
        <h2>
          Tumbuhkan Panen<br>
          Maksimal dari <span class="accent">Benih</span><br>
          Berkualitas.
        </h2>
        <p>Akses ribuan varietas bibit buah, tanaman perkebunan, hingga sayuran hidroponik langsung dari penangkar bersertifikat.</p>
      </section>

      <section class="auth-panel">
        <div class="auth-form-wrap">
          <h1>Buat akun baru</h1>
          <p class="lead">Daftar dan mulai belanja bibit favoritmu di AgriBibit dengan harga penangkar langsung.</p>

          <form id="registerForm" novalidate>
            <div class="auth-field" id="fieldName">
              <label for="reg-name">Nama Lengkap</label>
              <div class="auth-input">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                <input id="reg-name" type="text" placeholder="Nama lengkap Anda" autocomplete="name" required>
              </div>
              <div class="auth-error">Nama lengkap wajib diisi.</div>
            </div>

            <div class="auth-field" id="fieldContact">
              <label for="reg-contact">Email atau No. WhatsApp</label>
              <div class="auth-input">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2.5"/>
                  <path d="M3.5 7l8.5 6 8.5-6"/>
                </svg>
                <input id="reg-contact" type="text" placeholder="contoh@email.com atau 08xxxxxxxxxx" autocomplete="email" required>
              </div>
              <div class="auth-error">Email atau nomor WhatsApp wajib diisi.</div>
            </div>

            <div class="auth-field" id="fieldPassword">
              <label for="reg-password">Kata Sandi <span class="hint">Minimal 8 karakter</span></label>
              <div class="auth-input">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="10" rx="2.5"/>
                  <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
                </svg>
                <input id="reg-password" type="password" placeholder="Buat kata sandi" autocomplete="new-password" required>
                <button type="button" class="auth-toggle-pw" data-target="reg-password" aria-label="Tampilkan kata sandi">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke-width="2" aria-hidden="true">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <div class="auth-strength" id="strength" data-level="0">
                <div class="bars">
                  <span class="bar"></span><span class="bar"></span><span class="bar"></span><span class="bar"></span>
                </div>
                <span class="auth-strength-label" id="strengthLabel"></span>
              </div>
              <div class="auth-error">Kata sandi minimal 8 karakter.</div>
            </div>

            <div class="auth-field" id="fieldConfirm">
              <label for="reg-confirm">Konfirmasi Kata Sandi</label>
              <div class="auth-input">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z"/>
                </svg>
                <input id="reg-confirm" type="password" placeholder="Ulangi kata sandi" autocomplete="new-password" required>
                <button type="button" class="auth-toggle-pw" data-target="reg-confirm" aria-label="Tampilkan kata sandi">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke-width="2" aria-hidden="true">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <div class="auth-error">Konfirmasi kata sandi tidak cocok.</div>
            </div>

            <div class="auth-field" id="fieldTerms">
              <label class="auth-terms">
                <input type="checkbox" id="reg-terms">
                <span>Saya menyetujui <a href="#">Syarat &amp; Ketentuan</a> serta <a href="#">Kebijakan Privasi</a> AgriBibit Indonesia.</span>
              </label>
              <div class="auth-error">Anda perlu menyetujui syarat dan ketentuan.</div>
            </div>

            <button type="submit" class="auth-btn-primary">
              Daftar Sekarang
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>
          </form>

          <p class="auth-signup">
            Sudah punya akun? <a href="login.html" class="auth-link">Masuk di sini &rarr;</a>
          </p>

          <div class="auth-trust">
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z"/></svg>
              Data Terenkripsi SSL 256-Bit
            </span>
            <span>&bull;</span>
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
              Anti Spam Terverifikasi
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>`;

  view.querySelectorAll('.auth-toggle-pw').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = view.querySelector('#' + btn.dataset.target);
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
    });
  });

  const pw = view.querySelector('#reg-password');
  const confirm = view.querySelector('#reg-confirm');
  const strength = view.querySelector('#strength');
  const strengthLabel = view.querySelector('#strengthLabel');
  const labels = ['', 'Lemah', 'Cukup', 'Baik', 'Kuat'];

  function scorePassword(v) {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return v.length === 0 ? 0 : Math.max(1, s);
  }

  pw.addEventListener('input', () => {
    const level = scorePassword(pw.value);
    strength.dataset.level = level;
    strengthLabel.textContent = labels[level];
    pw.closest('.auth-field').classList.remove('invalid');
  });

  const form = view.querySelector('#registerForm');
  const name = view.querySelector('#reg-name');
  const contact = view.querySelector('#reg-contact');
  const terms = view.querySelector('#reg-terms');
  const fields = {
    name: view.querySelector('#fieldName'),
    contact: view.querySelector('#fieldContact'),
    password: view.querySelector('#fieldPassword'),
    confirm: view.querySelector('#fieldConfirm'),
    terms: view.querySelector('#fieldTerms'),
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = {
      name: name.value.trim() === '',
      contact: contact.value.trim() === '',
      password: pw.value.length < 8,
      confirm: confirm.value === '' || confirm.value !== pw.value,
      terms: !terms.checked,
    };
    Object.keys(errors).forEach((k) => fields[k].classList.toggle('invalid', errors[k]));

    const valid = !Object.values(errors).some(Boolean);
    if (valid) {
      const fullName = name.value.trim();
      const firstName = fullName.split(/\s+/)[0];
      AuthUser.set({ name: fullName, firstName, email: contact.value.trim() });
      Router.go('/register-success?nama=' + encodeURIComponent(firstName));
    }
  });

  [name, contact, pw, confirm].forEach((input) => {
    input.addEventListener('input', () => input.closest('.auth-field').classList.remove('invalid'));
  });
  terms.addEventListener('change', () => fields.terms.classList.remove('invalid'));

  return () => document.body.classList.remove('is-auth-page');
};

Pages.registerSuccess = function (view) {
  document.body.classList.add('is-auth-page');

  const queryPart = location.search.slice(1) || location.hash.split('?')[1] || '';
  const params = new URLSearchParams(queryPart);
  const savedUser = AuthUser.get();
  const nama = (params.get('nama') || (savedUser && (savedUser.firstName || savedUser.name)) || 'Sahabat Tani').trim();
  const redir = sessionStorage.getItem('agribibit.redirectAfterLogin');
  const nextHref = Router.toHref(redir || '/shop');

  view.innerHTML = `
  <div class="auth-page auth-success-page">
    <a href="index.html" class="auth-success-header">
      <img src="./assets/logo.png" alt="Logo AgriBibit">
      <span>AgriBibit</span>
    </a>

    <div class="auth-success-main">
      <section class="auth-success-card" aria-labelledby="judul-sukses">
        <div class="auth-success-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5"/>
          </svg>
        </div>

        <h1 id="judul-sukses">Akun berhasil dibuat!</h1>
        <p class="lead">
          Selamat datang di AgriBibit, <strong>${esc(nama)}</strong>.
          Akunmu sudah siap dipakai untuk belanja bibit berkualitas langsung dari penangkar.
        </p>

        <ol class="auth-steps">
          <li>
            <span class="num">1</span>
            <p>Pilih bibit favoritmu</p>
          </li>
          <li>
            <span class="num">2</span>
            <p>Checkout dengan mudah</p>
          </li>
          <li>
            <span class="num">3</span>
            <p>Lacak pengirimanmu</p>
          </li>
        </ol>

        <div class="auth-actions">
          <a href="${nextHref}" class="auth-btn-primary" id="btnStartShop">
            ${redir === '/checkout' ? 'Lanjutkan Checkout' : 'Mulai Belanja'}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="blog.html" class="auth-link-guide">
            Lihat Panduan Bercocok Tanam
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>
    </div>

    <div class="auth-success-footer">&copy; 2026 AgriBibit Indonesia. Hak cipta dilindungi.</div>
  </div>`;

  const btnStart = view.querySelector('#btnStartShop');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      sessionStorage.removeItem('agribibit.redirectAfterLogin');
    });
  }

  return () => document.body.classList.remove('is-auth-page');
};
