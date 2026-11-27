const BASE_PRODUCTS = [

  {
    id: 1,
    sku: 'SY-001',
    name: 'Cabai Rawit Hibrida',
    category: 'Bibit Sayur',
    price: 12000,
    originalPrice: 15000,
    rating: 4.8,
    reviews: 98,
    sold: '890+',
    stock: 120,
    badge: 'ORGANIK',
    tags: ['Semai 3–5 hari', 'Isi 50 butir'],
    image: './assets/produk/cabai-rawit-hibrida.png',
    images: [
      './assets/produk/cabai-rawit-hibrida.png',
      './assets/produk/cabai-rawit-hibrida.png',
    ],
    description: 'Benih cabai rawit hibrida F1 unggul dengan daya kecambah tinggi (>85%), tahan hama patek, buah lebat dan sangat pedas.',
    specs: { 'Tinggi bibit': '15-20 cm', 'Jumlah daun': '6-8 helai', 'Asal perbanyakan': 'Biji Hibrida', 'Kondisi akar': 'Akar serabut sehat' },
    sizeOptions: ['Benih (Isi 50)', 'Semai Remaja (Polibag)', 'Siap Berbuah'],
    potOptions: ['Polybag Standar', 'Pot Plastik 20cm'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 2,
    sku: 'SY-002',
    name: 'Tomat Cherry',
    category: 'Bibit Sayur',
    price: 9000,
    originalPrice: 12000,
    rating: 4.7,
    reviews: 64,
    sold: '540+',
    stock: 18,
    badge: 'BEST SELLER',
    tags: ['Manis & Juicy', 'Panen 60 hari'],
    image: './assets/produk/tomat-cherry.png',
    images: [
      './assets/produk/tomat-cherry.png',
      './assets/produk/tomat-cherry.png',
    ],
    description: 'Bibit tomat cherry merah manis renyah, berbuah lebat dalam dompolan, sangat cocok ditanam di pekarangan rumah maupun hidroponik.',
    specs: { 'Tinggi bibit': '15-25 cm', 'Jumlah daun': '6-10 helai', 'Asal perbanyakan': 'Biji Seleksi', 'Kondisi akar': 'Akar aktif' },
    sizeOptions: ['Semai Remaja', 'Bibit Berbunga'],
    potOptions: ['Pot Plastik 25cm', 'Polybag 30cm'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 3,
    sku: 'SY-003',
    name: 'Terong Ungu',
    category: 'Bibit Sayur',
    price: 7000,
    originalPrice: 9000,
    rating: 4.6,
    reviews: 42,
    sold: '320+',
    stock: 64,
    badge: 'ORGANIK',
    tags: ['Mudah Tumbuh', 'Panen Panjang'],
    image: './assets/produk/terong-ungu.png',
    images: [
      './assets/produk/terong-ungu.png',
    ],
    description: 'Bibit terong ungu panjang hibrida, batang kokoh dan produktivitas tinggi. Daging buah empuk dan manis.',
    specs: { 'Tinggi bibit': '20-30 cm', 'Jumlah daun': '5-7 helai', 'Asal perbanyakan': 'Biji', 'Kondisi akar': 'Kuat & sehat' },
    sizeOptions: ['Semai Remaja'],
    potOptions: ['Polybag Standar'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 4,
    sku: 'SY-004',
    name: 'Kangkung Bangkok',
    category: 'Bibit Sayur',
    price: 4000,
    originalPrice: 5000,
    rating: 4.7,
    reviews: 71,
    sold: '2.1rb+',
    stock: 0,
    badge: 'HABIS',
    tags: ['Panen cepat', 'Tahan banting'],
    image: './assets/produk/kangkung-bangkok.png',
    images: [
      './assets/produk/kangkung-bangkok.png',
    ],
    description: 'Benih kangkung darat daun sempit varietas Bangkok, rasa renyah gurih, dapat dipanen dalam 21–25 hari setelah semai.',
    specs: { 'Tinggi bibit': '5-10 cm', 'Jumlah daun': '2-4 helai', 'Asal perbanyakan': 'Biji Murni', 'Kondisi akar': 'Sehat' },
    sizeOptions: ['Benih 100gr'],
    potOptions: [],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 5,
    sku: 'SY-005',
    name: 'Sawi Hijau',
    category: 'Bibit Sayur',
    price: 5000,
    originalPrice: 7000,
    rating: 4.8,
    reviews: 83,
    sold: '1.1rb+',
    stock: 90,
    tags: ['Cepat Panen', 'Kaya Serat'],
    image: './assets/produk/sawi-hijau.png',
    images: [
      './assets/produk/sawi-hijau.png',
    ],
    description: 'Bibit sawi hijau / caisim unggul, daun lebar tebal hijau cerah, renyah dan tidak berserat kasar.',
    specs: { 'Tinggi bibit': '10-15 cm', 'Jumlah daun': '4-6 helai', 'Asal perbanyakan': 'Biji', 'Kondisi akar': 'Akar serabut' },
    sizeOptions: ['Semai 2 Minggu', 'Benih Paket'],
    potOptions: ['Tray Semai'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 6,
    sku: 'SY-006',
    name: 'Bayam Hijau',
    category: 'Bibit Sayur',
    price: 4500,
    originalPrice: 6000,
    rating: 4.7,
    reviews: 55,
    sold: '850+',
    stock: 52,
    tags: ['Super Nutrisi', 'Panen 20 Hari'],
    image: './assets/produk/bayam-hijau.png',
    images: [
      './assets/produk/bayam-hijau.png',
    ],
    description: 'Bibit bayam cabut hijau segar, tinggi kandungan zat besi dan vitamin A, daun lembut dan lezat dimasak sayur bening.',
    specs: { 'Tinggi bibit': '8-12 cm', 'Jumlah daun': '4-5 helai', 'Asal perbanyakan': 'Biji Organik', 'Kondisi akar': 'Segar' },
    sizeOptions: ['Benih 50gr', 'Semai Remaja'],
    potOptions: [],
    origin: 'Kebun Malang, Jawa Timur',
  },

  {
    id: 7,
    sku: 'BH-001',
    name: 'Mangga Harum Manis',
    category: 'Bibit Buah',
    price: 35000,
    originalPrice: 45000,
    rating: 4.8,
    reviews: 142,
    sold: '670+',
    stock: 80,
    badge: 'OKULASI',
    tags: ['Okulasi Cepat Berbuah', 'Daging Tebal'],
    image: './assets/produk/mangga-harum-manis.png',
    images: [
      './assets/produk/mangga-harum-manis.png',
    ],
    description: 'Bibit mangga harum manis hasil okulasi indukan produktif. Buah manis harum semerbak, serat halus, cepat berbuah di tabulampot.',
    specs: { 'Tinggi bibit': '50-70 cm', 'Jumlah daun': '12-16 helai', 'Asal perbanyakan': 'Okulasi Indukan', 'Kondisi akar': 'Polybag bibit aktif' },
    sizeOptions: ['Semai Remaja (50cm)', 'Dewasa Siap Bunga (80cm)'],
    potOptions: ['Polybag Standar', 'Planter Bag 50L'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 8,
    sku: 'BH-002',
    name: 'Jeruk Santang Madu',
    category: 'Bibit Buah',
    price: 28000,
    originalPrice: 35000,
    rating: 4.9,
    reviews: 185,
    sold: '920+',
    stock: 12,
    badge: 'BEST SELLER',
    tags: ['Manis Tanpa Biji', 'Rajin Berbuah'],
    image: './assets/produk/jeruk-santang-madu.png',
    images: [
      './assets/produk/jeruk-santang-madu.png',
    ],
    description: 'Bibit jeruk santang madu mini berkulit tipis mudah dikupas. Rasa sangat manis legit berair melimpah, rajin berbuah sepanjang tahun.',
    specs: { 'Tinggi bibit': '40-60 cm', 'Jumlah daun': 'Rimbun', 'Asal perbanyakan': 'Okulasi Mata Tunas', 'Kondisi akar': 'Akar sehat' },
    sizeOptions: ['Semai Remaja', 'Bibit Sudah Berbunga'],
    potOptions: ['Pot Plastik 30cm', 'Planter Bag 35L'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 9,
    sku: 'BH-003',
    name: 'Alpukat Aligator',
    category: 'Bibit Buah',
    price: 40000,
    originalPrice: 50000,
    rating: 4.8,
    reviews: 176,
    sold: '1.2rb+',
    stock: 45,
    badge: 'OKULASI',
    tags: ['Buah Jumbo 1kg', 'Daging Pulen'],
    image: './assets/produk/alpukat-aligator.png',
    images: [
      './assets/produk/alpukat-aligator.png',
    ],
    description: 'Bibit alpukat aligator okulasi super, bentuk buah lonjong membesar dengan bobot hingga 1,2 kg per buah. Daging tebal kuning mentega.',
    specs: { 'Tinggi bibit': '50-65 cm', 'Jumlah daun': '10-14 helai', 'Asal perbanyakan': 'Sambung Pucuk', 'Kondisi akar': 'Kuat di polybag' },
    sizeOptions: ['Semai Remaja (50cm)', 'Dewasa (80cm)'],
    potOptions: ['Polybag Standar', 'Planter Bag 50L'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 10,
    sku: 'BH-004',
    name: 'Durian Montong',
    category: 'Bibit Buah',
    price: 85000,
    originalPrice: 95000,
    rating: 4.8,
    reviews: 203,
    sold: '1.4rb+',
    stock: 0,
    badge: 'HABIS',
    tags: ['Panen 2–3 tahun', 'Full Sun'],
    image: './assets/produk/durian-montong.png',
    images: [
      './assets/produk/durian-montong.png',
    ],
    description: 'Bibit durian montong okulasi unggul dengan perakaran kokoh dan daun sehat. Daging buah kuning tebal, biji kempes, rasa manis legit.',
    specs: { 'Tinggi bibit': '50-60 cm', 'Jumlah daun': '8-12 helai', 'Asal perbanyakan': 'Okulasi Sambung', 'Kondisi akar': 'Sehat & kuat' },
    sizeOptions: ['Semai Remaja', 'Dewasa', 'Jumbo Akar Angin'],
    potOptions: ['Pot Plastik Standar', 'Planter Bag 75L'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 11,
    sku: 'BH-005',
    name: 'Jambu Kristal',
    category: 'Bibit Buah',
    price: 25000,
    originalPrice: 32000,
    rating: 4.7,
    reviews: 95,
    sold: '780+',
    stock: 60,
    tags: ['Hampir Tanpa Biji', 'Renyah Segar'],
    image: './assets/produk/jambu-kristal.png',
    images: [
      './assets/produk/jambu-kristal.png',
    ],
    description: 'Bibit jambu biji kristal non-biji, tekstur renyah mirip buah pir, rasa manis segar kaya vitamin C. Cepat berbuah di pot.',
    specs: { 'Tinggi bibit': '45-60 cm', 'Jumlah daun': '10-15 helai', 'Asal perbanyakan': 'Cangkok / Okulasi', 'Kondisi akar': 'Akar banyak' },
    sizeOptions: ['Semai Remaja', 'Dewasa Siap Buah'],
    potOptions: ['Pot Plastik 35cm'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 12,
    sku: 'BH-006',
    name: 'Pepaya California',
    category: 'Bibit Buah',
    price: 15000,
    originalPrice: 20000,
    rating: 4.7,
    reviews: 110,
    sold: '980+',
    stock: 70,
    tags: ['Pohon Pendek', 'Panen 7 Bulan'],
    image: './assets/produk/pepaya-california.png',
    images: [
      './assets/produk/pepaya-california.png',
    ],
    description: 'Bibit pepaya calina / california asli, batang pendek sudah mulai berbuah lebat. Daging buah merah cerah, manis dan tahan simpan.',
    specs: { 'Tinggi bibit': '30-40 cm', 'Jumlah daun': '6-8 helai', 'Asal perbanyakan': 'Biji Pilihan F1', 'Kondisi akar': 'Polybag akar sehat' },
    sizeOptions: ['Semai Remaja'],
    potOptions: ['Polybag Standar'],
    origin: 'Kebun Malang, Jawa Timur',
  },

  {
    id: 13,
    sku: 'TH-001',
    name: 'Monstera Variegata',
    category: 'Tanaman Hias',
    price: 65000,
    originalPrice: 85000,
    rating: 4.9,
    reviews: 289,
    sold: '1.4rb+',
    stock: 25,
    badge: 'BEST SELLER',
    tags: ['Indoor friendly', 'Variegata Mewah'],
    image: './assets/produk/monstera-variegata.png',
    images: [
      './assets/produk/monstera-variegata.png',
    ],
    description: 'Monstera Variegata bibit eksotis dengan corak marmer putih krem alami yang kontras menawan. Koleksi premium pecinta tanaman hias.',
    specs: { 'Tinggi bibit': '30-40 cm', 'Jumlah daun': '3-4 daun aktif', 'Asal perbanyakan': 'Stek pucuk berakar', 'Kondisi akar': 'Akar rimbun siap pajang' },
    sizeOptions: ['Semai Remaja (3-4 daun)', 'Dewasa', 'Jumbo Akar Angin'],
    potOptions: ['Pot Plastik Standar - Cocopeat nutrisi', 'Pot Terracotta 18cm (+Rp 25.000)'],
    origin: 'Kebun Malang, Jawa Timur',
    guarantee: true,
  },
  {
    id: 14,
    sku: 'TH-002',
    name: 'Aglaonema Suksom',
    category: 'Tanaman Hias',
    price: 45000,
    originalPrice: 55000,
    rating: 4.9,
    reviews: 135,
    sold: '720+',
    stock: 14,
    badge: 'EXCLUSIVE',
    tags: ['Merah Menyala', 'Indoor Teduh'],
    image: './assets/produk/aglaonema-suksom.png',
    images: [
      './assets/produk/aglaonema-suksom.png',
    ],
    description: 'Aglaonema Suksom Jaipong berdaun merah menyala tanpa bintik hijau, pesona ratu daun indoor yang memikat dan membawa nuansa cerah.',
    specs: { 'Tinggi bibit': '20-25 cm', 'Jumlah daun': '5-7 daun', 'Asal perbanyakan': 'Pemisahan Anakan', 'Kondisi akar': 'Akar putih sehat' },
    sizeOptions: ['Remaja 5 Daun', 'Dewasa 8 Daun'],
    potOptions: ['Pot Plastik Putih', 'Pot Terracotta 18cm'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 15,
    sku: 'TH-003',
    name: 'Sansevieria',
    category: 'Tanaman Hias',
    price: 30000,
    originalPrice: 38000,
    rating: 4.8,
    reviews: 160,
    sold: '1.3rb+',
    stock: 70,
    badge: 'AIR PURIFIER',
    tags: ['Penyerap Racun', 'Sangat Tahan'],
    image: './assets/produk/sansevieria.png',
    images: [
      './assets/produk/sansevieria.png',
    ],
    description: 'Lidah mertua (Sansevieria trifasciata) variegata strip kuning, tanaman pembersih udara nomor satu rekomendasi NASA.',
    specs: { 'Tinggi bibit': '25-35 cm', 'Jumlah daun': '4-6 bilah', 'Asal perbanyakan': 'Pemisahan rimpang', 'Kondisi akar': 'Kuat & berakar' },
    sizeOptions: ['Tinggi 30cm', 'Tinggi 50cm'],
    potOptions: ['Pot Minimalis Putih', 'Pot Terracotta 20cm'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 16,
    sku: 'TH-004',
    name: 'Anggrek Bulan',
    category: 'Tanaman Hias',
    price: 55000,
    originalPrice: 70000,
    rating: 4.9,
    reviews: 90,
    sold: '410+',
    stock: 9,
    badge: 'BEST SELLER',
    tags: ['Bunga Tahan Lama', 'Elegance'],
    image: './assets/produk/anggrek-bulan.png',
    images: [
      './assets/produk/anggrek-bulan.png',
    ],
    description: 'Bibit Anggrek Bulan (Phalaenopsis) pasca-aklimatisasi botol, daun tebal segar dan sudah siap memasuki masa pembungaan.',
    specs: { 'Tinggi bibit': '20-30 cm', 'Jumlah daun': '4-5 helai', 'Asal perbanyakan': 'Kultur Jaringan', 'Kondisi akar': 'Akar hijau aktif' },
    sizeOptions: ['Remaja Siap Bunga', 'Sudah Berknop'],
    potOptions: ['Pot Plastik Transparan + Mos', 'Pot Gantung Sabut'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 17,
    sku: 'TH-005',
    name: 'Philodendron Birkin',
    category: 'Tanaman Hias',
    price: 38000,
    originalPrice: 48000,
    rating: 4.8,
    reviews: 112,
    sold: '530+',
    stock: 40,
    badge: 'AIR PURIFIER',
    tags: ['Garis Emas Putih', 'Meja Kerja'],
    image: './assets/produk/philodendron-birkin.png',
    images: [
      './assets/produk/philodendron-birkin.png',
    ],
    description: 'Philodendron Birkin dengan guratan garis pinstripe putih bersih di atas daun hijau gelap mengkilap. Sangat anggun menghias sudut ruangan.',
    specs: { 'Tinggi bibit': '15-25 cm', 'Jumlah daun': '5-8 helai', 'Asal perbanyakan': 'Anakan Rimpang', 'Kondisi akar': 'Sehat mandiri' },
    sizeOptions: ['Semai Remaja', 'Rimbun Dewasa'],
    potOptions: ['Pot Plastik Standar', 'Pot Keramik Minimalis'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 18,
    sku: 'TH-006',
    name: 'Calathea Ornata',
    category: 'Tanaman Hias',
    price: 42000,
    originalPrice: 50000,
    rating: 4.7,
    reviews: 88,
    sold: '460+',
    stock: 33,
    tags: ['Garis Pink Halus', 'Prayer Plant'],
    image: './assets/produk/Calathea-Ornata.png',
    images: [
      './assets/produk/Calathea-Ornata.png',
    ],
    description: 'Calathea Ornata (Pinstripe Calathea) dengan motif garis merah muda halus di permukaan daun dan bagian bawah daun ungu eksotis.',
    specs: { 'Tinggi bibit': '25-35 cm', 'Jumlah daun': '5-7 tangkai', 'Asal perbanyakan': 'Pemisahan rumpun', 'Kondisi akar': 'Sehat berakar' },
    sizeOptions: ['Pot 15cm', 'Pot 20cm'],
    potOptions: ['Pot Plastik Standar', 'Pot Terracotta 18cm'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 19,
    sku: 'TH-007',
    name: 'Parlor Palm',
    category: 'Tanaman Hias',
    price: 35000,
    originalPrice: 40000,
    rating: 4.7,
    reviews: 115,
    sold: '650+',
    stock: 48,
    badge: 'AIR PURIFIER',
    tags: ['Pembersih racun', 'Teduh / Indoor'],
    image: './assets/produk/parlor-palm.png',
    images: [
      './assets/produk/parlor-palm.png',
    ],
    description: 'Palem Parlor (Chamaedorea elegans) tropis yang sangat toleran pencahayaan rendah, memberi suasana tropis asri di ruang tamu.',
    specs: { 'Tinggi bibit': '25-35 cm', 'Jumlah daun': '6-9 tangkai', 'Asal perbanyakan': 'Anakan Berakar', 'Kondisi akar': 'Sehat di media porus' },
    sizeOptions: ['Semai Remaja', 'Rimbun Dewasa'],
    potOptions: ['Pot Plastik Standar', 'Pot Terracotta 18cm'],
    origin: 'Kebun Malang, Jawa Timur',
  },
  {
    id: 20,
    sku: 'TH-008',
    name: 'Kaktus',
    category: 'Tanaman Hias',
    price: 20000,
    originalPrice: 25000,
    rating: 4.8,
    reviews: 140,
    sold: '1.5rb+',
    stock: 80,
    tags: ['Minim Perawatan', 'Meja Kantor'],
    image: './assets/produk/kaktus.png',
    images: [
      './assets/produk/kaktus.png',
    ],
    description: 'Kaktus hias mini koleksi pilihan di pot terracotta mungil, praktis hanya perlu disiram seminggu sekali.',
    specs: { 'Tinggi bibit': '8-12 cm', 'Jumlah daun': 'Batang sukulen', 'Asal perbanyakan': 'Stek anakan', 'Kondisi akar': 'Akar aktif' },
    sizeOptions: ['Mini Pot 8cm', 'Pot 12cm'],
    potOptions: ['Pot Terracotta Mini'],
    origin: 'Batu, Jawa Timur',
  },
]

const categories = [
  { id: 'all', name: 'Semua Bibit', count: 20 },
  { id: 'sayur', name: 'Bibit Sayur', count: 6 },
  { id: 'buah', name: 'Bibit Buah', count: 6 },
  { id: 'hias', name: 'Tanaman Hias', count: 8 },
]

const products = [...BASE_PRODUCTS];

function syncProductsFromAdmin() {
  const KAT_MAP = { sayur: 'Bibit Sayur', buah: 'Bibit Buah', hias: 'Tanaman Hias' };
  const DEFAULT_PHOTO = {
    'SY-001': './assets/produk/cabai-rawit-hibrida.png',
    'SY-002': './assets/produk/tomat-cherry.png',
    'SY-003': './assets/produk/terong-ungu.png',
    'SY-004': './assets/produk/kangkung-bangkok.png',
    'SY-005': './assets/produk/sawi-hijau.png?v=2',
    'SY-006': './assets/produk/bayam-hijau.png',
    'BH-001': './assets/produk/mangga-harum-manis.png',
    'BH-002': './assets/produk/jeruk-santang-madu.png',
    'BH-003': './assets/produk/alpukat-aligator.png',
    'BH-004': './assets/produk/durian-montong.png',
    'BH-005': './assets/produk/jambu-kristal.png',
    'BH-006': './assets/produk/pepaya-california.png',
    'TH-001': './assets/produk/monstera-variegata.png',
    'TH-002': './assets/produk/aglaonema-suksom.png',
    'TH-003': './assets/produk/sansevieria.png',
    'TH-004': './assets/produk/anggrek-bulan.png',
    'TH-005': './assets/produk/philodendron-birkin.png',
    'TH-006': './assets/produk/Calathea-Ornata.png',
    'TH-007': './assets/produk/parlor-palm.png',
    'TH-008': './assets/produk/kaktus.png',
  };

  let adminCat = null;
  try {
    adminCat = JSON.parse(localStorage.getItem('agribibit.db.catalog'));
  } catch (e) {
    adminCat = null;
  }

  if (!adminCat || !adminCat.sayur || !adminCat.buah || !adminCat.hias) {
    const seed = { sayur: [], buah: [], hias: [] };
    BASE_PRODUCTS.forEach((p, idx) => {
      const k = p.category === 'Bibit Sayur' ? 'sayur' : p.category === 'Bibit Buah' ? 'buah' : 'hias';
      seed[k].push({
        id: 'p' + (idx + 1),
        nama: p.name,
        sku: p.sku,
        harga: p.price,
        stok: p.stock,
        min: 20,
        foto: p.image.replace(/^\.\//, ''),
      });
    });
    try {
      localStorage.setItem('agribibit.db.catalog', JSON.stringify(seed));
      adminCat = seed;
    } catch (e) {  }
  }

  if (!adminCat) return;

  const baseBySku = {};
  BASE_PRODUCTS.forEach((bp) => { baseBySku[bp.sku] = bp; });

  const synced = [];
  let customIdCounter = 100;

  ['sayur', 'buah', 'hias'].forEach((k) => {
    const list = Array.isArray(adminCat[k]) ? adminCat[k] : [];
    const catName = KAT_MAP[k];
    list.forEach((ap) => {
      const base = baseBySku[ap.sku];
      let imgPath = ap.foto || (base && base.image) || DEFAULT_PHOTO[ap.sku] || './assets/images/hero-plant.jpg';

      if (DEFAULT_PHOTO[ap.sku] && imgPath && (ap.sku === 'SY-005' || (!imgPath.startsWith('data:') && !imgPath.startsWith('http') && imgPath.includes('assets/produk/')))) {
        imgPath = DEFAULT_PHOTO[ap.sku];
      }
      if (imgPath && !imgPath.startsWith('data:') && !imgPath.startsWith('http') && !imgPath.startsWith('./') && !imgPath.startsWith('/')) {
        imgPath = './' + imgPath;
      }
      const stockNum = Number(ap.stok ?? 0);
      const priceNum = Number(ap.harga ?? (base ? base.price : 15000));

      if (base) {
        let badge = base.badge;
        if (stockNum <= 0) badge = 'HABIS';
        else if (badge === 'HABIS') badge = '';

        synced.push({
          ...base,
          adminId: ap.id,
          sku: ap.sku,
          name: ap.nama || base.name,
          category: catName,
          price: priceNum,
          originalPrice: base.originalPrice && base.originalPrice > priceNum ? base.originalPrice : null,
          stock: stockNum,
          minStock: Number(ap.min ?? 20),
          badge,
          image: imgPath,
          images: [imgPath],
        });
      } else {

        const numMatch = String(ap.id || '').match(/\d+/);
        const numericId = numMatch ? Number(numMatch[0]) : ++customIdCounter;
        synced.push({
          id: numericId,
          adminId: ap.id,
          sku: ap.sku,
          name: ap.nama,
          category: catName,
          price: priceNum,
          originalPrice: null,
          rating: 4.8,
          reviews: 12,
          sold: 'Baru',
          stock: stockNum,
          minStock: Number(ap.min ?? 20),
          badge: stockNum <= 0 ? 'HABIS' : 'BARU',
          tags: ['Bibit Bersertifikat', 'Garansi 14 Hari'],
          image: imgPath,
          images: [imgPath],
          description: `Bibit ${ap.nama} (${ap.sku}) pilihan berkualitas tinggi dari nursery AgriBibit, siap tanam dengan perakaran sehat dan media cocopeat bernutrisi.`,
          specs: { 'Tinggi bibit': '25-40 cm', 'Kondisi akar': 'Sehat & Aktif', 'Media tanam': 'Cocopeat Organik', 'SKU': ap.sku },
          sizeOptions: ['Semai Remaja', 'Siap Tanam'],
          potOptions: ['Polybag Standar', 'Pot Plastik'],
          origin: 'Kebun Malang, Jawa Timur',
        });
      }
    });
  });

  products.length = 0;
  synced.forEach((p) => products.push(p));

  const counts = {
    all: products.length,
    sayur: products.filter((p) => p.category === 'Bibit Sayur').length,
    buah: products.filter((p) => p.category === 'Bibit Buah').length,
    hias: products.filter((p) => p.category === 'Tanaman Hias').length,
  };
  categories.forEach((c) => { c.count = counts[c.id] ?? 0; });
}

syncProductsFromAdmin();

const testimonials = [
  {
    id: 1,
    name: 'Annisa N.',
    avatar: 'AN',
    verified: true,
    rating: 5,
    variant: 'Variasi: Semai Remaja + Pot Standar',
    text: 'Bibit sampai dalam kondisi segar, daunnya hijau dan akarnya kuat. Packing juga rapi pakai aerasi berventilasi. Sangat recommended!',
    image: './assets/produk/monstera-variegata.png',
  },
  {
    id: 2,
    name: 'Bambang W.',
    avatar: 'BW',
    verified: true,
    rating: 5,
    variant: 'Variasi: Bibit Buah Okulasi',
    text: 'Sudah 3x order di sini, dari mangga sampai alpukat tumbuh subur semua. Layanan dokter tanamannya juga sangat membantu.',
    image: './assets/produk/alpukat-aligator.png',
  },
  {
    id: 3,
    name: 'Clara L.',
    avatar: 'CL',
    verified: true,
    rating: 5,
    variant: 'Variasi: Aglaonema Suksom Merah',
    text: 'Warna Aglaonema merahnya asli pekat banget! Packing hidrogel akarnya benar-benar menjaga kelembapan selama pengiriman ke Jakarta.',
    image: './assets/produk/aglaonema-suksom.png',
  },
]

const blogPosts = [
  {
    id: 1,
    date: '17 April 2024',
    title: 'Nurturing Your Passion for Plants: Panduan Semai Pemula',
    image: './assets/produk/monstera-variegata.png',
  },
  {
    id: 2,
    date: '7 Mei 2024',
    title: 'Insight into Plant Care & Cultivation Sayuran Organik',
    image: './assets/produk/cabai-rawit-hibrida.png',
  },
  {
    id: 3,
    date: '21 Juni 2024',
    title: 'Koleksi Tanaman Hias Daun Eksotis Terbaik untuk Rumah',
    image: './assets/produk/Calathea-Ornata.png',
  },
  {
    id: 4,
    date: '17 Agust 2024',
    title: 'Rahasia Tabulampot Buah Tropis Cepat Berbuah Manis',
    image: './assets/produk/mangga-harum-manis.png',
  },
]

const teamMembers = [
  {
    id: 1,
    name: 'Dr. Rian Wicaksono, M.Sc.',
    role: 'Kepala agronomis & spesialis tanaman hias',
    bio: 'Alumnus Institut Pertanian Bogor dengan 12 tahun riset aklimatisasi genus Araceae dan Monstera.',
    credential: 'Sertifikasi BNSP AgriBotanis',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Sumiati Pratama, S.P.',
    role: 'Dokter tanaman & konsultan kesehatan daun',
    bio: 'Pakar diagnosa mikrobiologi tanaman dan formulasi pencegahan kutu yang telah mengobati lebih dari 10.000 keluhan tanaman.',
    credential: 'Lisensi proteksi tanaman',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Hendra Wijaya',
    role: 'Kurator bibit buah okulasi & bonsai',
    bio: 'Berpengalaman 18 tahun dalam teknik sambung pucuk (grafting) mangga madu, alpukat, dan tabulampot cepat berbuah.',
    credential: 'Anggota perkumpulan hortikultura',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  },
]

const transactionHistory = [
  {
    id: 'PZ-8829104',
    status: 'shipping',
    statusLabel: 'Dalam Pengiriman',
    date: '10 Nov 2025',
    courier: 'JNE Botanical Express',
    resi: 'JNE-PLANT-991203819',
    estimasi: 'Estimasi tiba besok sore',
    tracking: [
      { label: 'Dipetik dari kebun', done: true },
      { label: 'Media gel & aerasi', done: true },
      { label: 'Dibawa kurir', done: false },
      { label: 'Estimasi tiba', done: false },
    ],
    items: [
      { name: 'Alpukat Aligator Okulasi', detail: 'Jumlah: 2 polybag bibit · Kelembapan 90%', price: 80000, image: './assets/produk/alpukat-aligator.png' },
      { name: 'Jeruk Santang Madu', detail: 'Jumlah: 1 pohon · Siap bunga', price: 28000, image: './assets/produk/jeruk-santang-madu.png' },
    ],
    total: 108000,
  },
  {
    id: 'PZ-9018442',
    status: 'pending',
    statusLabel: 'Menunggu Pembayaran',
    date: '11 Nov 2025',
    deadline: '11 Nov 2025, 14:00 WIB',
    paymentMethod: 'BCA Virtual Account',
    va: '8277 0812 9018 4420',
    items: [
      { name: 'Monstera Variegata', detail: 'Jumlah: 1 bibit aktif · Tunas baru siap tumbuh', price: 65000, image: './assets/produk/monstera-variegata.png' },
      { name: 'Aglaonema Suksom', detail: 'Jumlah: 1 pot · Daun merah cerah', price: 45000, image: './assets/produk/aglaonema-suksom.png' },
    ],
    total: 110000,
  },
  {
    id: 'PZ-7718290',
    status: 'completed',
    statusLabel: 'Selesai & Garansi Aktif',
    date: '3 Nov 2025',
    guarantee: 'Garansi tumbuh aktif s/d 17 Nov (sisa 7 hari)',
    items: [
      { name: 'Calathea Ornata Pot 18cm', detail: 'Jumlah: 1 pot siap pajang · Kondisi segar', price: 42000, image: './assets/produk/Calathea-Ornata.png' },
      { name: 'Benih Tomat Cherry (isi 50 biji)', detail: 'Jumlah: 2 pack · Daya kecambah 95%', price: 18000, image: './assets/produk/tomat-cherry.png' },
    ],
    total: 60000,
  },
]

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID').format(price)
}
