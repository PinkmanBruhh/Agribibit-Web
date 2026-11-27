(function () {
  var KEY = 'agribibit.heroImg';
  var MAX_W = 1600;
  var hero = document.querySelector('.hero');
  var editBtn = document.getElementById('heroEditBtn');
  var resetBtn = document.getElementById('heroResetBtn');
  if (!hero || !editBtn) return;

  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.hidden = true;
  document.body.appendChild(input);

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  function apply(src) {
    if (src) {
      hero.style.setProperty('--hero-img', 'url("' + src + '")');
      hero.classList.add('has-photo');
    } else {
      hero.style.removeProperty('--hero-img');
      hero.classList.remove('has-photo');
    }
    resetBtn.hidden = !src;
  }

  function shrink(file, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, MAX_W / img.width);
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = function () { alert('Gambar tidak bisa dibaca. Coba file lain.'); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  editBtn.addEventListener('click', function () { input.click(); });

  input.addEventListener('change', function () {
    var file = input.files && input.files[0];
    input.value = '';
    if (!file) return;
    if (!/^image\//.test(file.type)) { alert('Pilih file gambar (JPG, PNG, atau WebP).'); return; }
    shrink(file, function (src) {
      try {
        localStorage.setItem(KEY, src);
        apply(src);
      } catch (e) {
        alert('Foto terlalu besar untuk disimpan di browser. Coba foto dengan ukuran lebih kecil.');
      }
    });
  });

  resetBtn.addEventListener('click', function () {
    try { localStorage.removeItem(KEY); } catch (e) {  }
    apply(null);
  });

  apply(read());
})();
