# AgriBibit — Web Buyer (HTML + CSS + JS)

Aplikasi e-commerce pembeli AgriBibit murni menggunakan **HTML, CSS, dan JavaScript** (tanpa Node.js, npm, maupun build step), dengan struktur multi-halaman yang rapi dan seragam dengan **Web Admin (`agribibit-frontend-admin`)**.

## Daftar Halaman (`.html`)

| File | Halaman |
|---|---|
| `index.html` | Beranda (Home) |
| `shop.html` | Katalog Bibit (Shop) |
| `detail-produk.html?id=1` | Detail Bibit & Panduan Perawatan |
| `keranjang.html` | Keranjang Belanja |
| `checkout.html` | Checkout & Alamat Pengiriman (Wajib Login) |
| `transaksi-berhasil.html` | Bukti Pembayaran & Transaksi Berhasil |
| `riwayat-pesanan.html` | Profil Akun & Pelacakan Pesanan |
| `tentang-kami.html` | Tentang Kami (About Us) |
| `blog.html` | Blog & Panduan Botani |
| `hubungi-kami.html` | Hubungi Kami & Konsultasi |
| `login.html` | Masuk Akun / Mode Guest |
| `register.html` | Daftar Akun Baru |
| `berhasil-daftar.html` | Konfirmasi Akun Berhasil Dibuat |

## Struktur Folder

```
agribibit-frontend-web/
├── *.html                 Satu file HTML rapi untuk setiap halaman
├── assets/
│   ├── images/            Gambar banner & artikel
│   ├── produk/            Foto katalog bibit (sinkron dengan Admin)
│   ├── google.svg
│   ├── hero.jpg
│   └── logo.png
├── css/
│   ├── base.css           Variabel desain & reset dasar
│   ├── header.css         Gaya Header, Drawer, & Bottom Nav
│   ├── footer.css         Gaya Footer
│   ├── components.css     Komponen bersama (kartu produk, tombol, modal, toast)
│   ├── style.css          Stylesheet utama penggabung komponen dasar
│   └── pages/             CSS khusus masing-masing halaman
└── js/
    ├── icons.js           Ikon SVG Lucide
    ├── data.js            Data produk & sinkronisasi real-time dengan Admin
    ├── ui.js              Komponen UI bersama
    ├── store.js           Keranjang (localStorage), Sesi Akun, & Toast
    ├── router.js          Multi-page router antar file .html
    ├── layout.js          Header & Footer otomatis
    ├── app.js             Inisialisasi global
    └── pages/             Logika per halaman
```

## Sinkronisasi dengan Web Admin
Buka folder induk (`PJBL 1 FRONT-END`) di VS Code dan jalankan **Live Server** agar Web Admin dan Web Buyer berada di port yang sama:
- Perubahan **Produk (Nama, Harga, Stok, Foto)** dan **Foto Hero** di Admin langsung tampil *real-time* di Web Buyer.
- Pesanan baru dari **Checkout** Web Buyer (beserta alamat asli pembeli) langsung masuk ke **Semua Pesanan**, **Proses**, dan **Pengiriman** di Web Admin, serta memotong stok otomatis.
