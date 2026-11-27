# AgriBibit Front End

Buka `login.html` di browser (atau jalankan server statis, misalnya `npx serve .`).

**Login demo** (ada di `login.html`, ganti dengan request ke backend):
- Email: `admin@agribibit.com`
- Kata sandi: `admin123`

Semua halaman selain `login.html` hanya bisa dibuka setelah login. Kalau belum login, otomatis dialihkan ke `login.html`. Tombol "Keluar dari Akun" di Pengaturan mengakhiri sesi.

## Isi

| File | Halaman |
|---|---|
| `login.html` | Admin Login |
| `index.html` | Dashboard |
| `produk.html?kategori=sayur\|buah\|hias` | Bibit Sayur, Bibit Buah, Bibit Tanaman Hias |
| `pesanan.html` | Semua Pesanan |
| `pesanan-proses.html` | Proses |
| `pesanan-pengiriman.html` | Pengiriman |
| `laporan-penjualan.html` | Laporan Penjualan |
| `laporan-stok.html` | Laporan Stok |
| `laporan-pengiriman.html` | Laporan Pengiriman (dulu tabel di Dashboard) |
| `pengaturan.html` | Pengaturan (profil admin) |

`js/layout.js` membuat sidebar, header, footer, dan menyimpan fungsi ikon (Lucide) yang dipakai semua halaman.
`css/style.css` berisi gaya bersama. `assets/` berisi logo, foto login, foto produk, dan ikon.

## Catatan
- Data pengiriman dan beberapa halaman pesanan masih data contoh. Data Produk dan profil admin tersimpan di browser (localStorage).
- Chart.js dan font Google dimuat dari internet (CDN).
- Ikon: Lucide (ISC), lihat `assets/icons/LICENSE`.

## Data bersama (js/data.js)
Semua halaman membaca satu sumber data (`js/data.js`, tersimpan di localStorage dengan kunci `agribibit.db.*`): katalog produk dan stok, pesanan beserta daftar barangnya, dan riwayat mutasi stok.
- Stok tidak bisa diubah lewat form Edit. Satu-satunya jalur: tombol **Stok** di halaman Produk, berisi **Stok Masuk** (wajib no. nota) dan **Stok Rusak** (alasan wajib, mengurangi stok tersedia). Setiap perubahan dicatat sebagai mutasi di `AgriData.stockMove(...)`.
- Stok tersedia dan jumlah rusak dipisah. Status Aman/Menipis/Habis hanya dihitung dari stok tersedia.
- Dashboard, Laporan Penjualan, Laporan Stok, dan Semua Pesanan menghitung angka dan grafiknya dari data ini, jadi ikut berubah saat stok diedit atau ada pesanan baru (`AgriData.addOrder(...)`).
- Data contoh (324 pesanan, mutasi stok) dibuat otomatis saat pertama kali dibuka. Untuk mengulang dari awal: `AgriData.reset()` di konsol browser.
- Saat backend tersedia, cukup ganti isi fungsi di `data.js` dengan pemanggilan API.
