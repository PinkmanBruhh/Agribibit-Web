const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

function Stars(value = 5, size = 14) {
  let out = '';
  for (let i = 0; i < 5; i++) out += icon('Star', { size, sw: 1.75, fill: i < Math.round(value) });
  return `<span class="stars" aria-label="Rating ${value} dari 5">${out}</span>`;
}

function LeafDecor(cls = '', variant = 'branch') {
  if (variant === 'single') {
    return `<svg class="${cls}" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <path d="M18 104C18 56 52 18 104 16c2 50-34 88-86 88Z" fill="currentColor" opacity=".18" />
      <path d="M22 100C46 74 70 50 98 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".45" />
      <path d="M44 78c10 0 22-2 30-8M58 62c8 0 16-2 24-6M38 70c0-10 2-20 6-28M54 54c0-8 2-16 6-22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".35" />
    </svg>`;
  }
  return `<svg class="${cls}" viewBox="0 0 220 220" fill="none" aria-hidden="true">
    <path d="M30 210C70 150 110 100 200 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".4" />
    <path d="M70 156c-30-4-48-24-50-52 30 0 50 20 50 52Z" fill="currentColor" opacity=".16" />
    <path d="M96 124c-6-30 6-56 32-70 10 28-2 56-32 70Z" fill="currentColor" opacity=".2" />
    <path d="M104 118c28 6 52-4 66-28-28-10-54 2-66 28Z" fill="currentColor" opacity=".14" />
    <path d="M140 80c-4-24 6-44 26-56 8 22 0 44-26 56Z" fill="currentColor" opacity=".18" />
    <path d="M150 74c20 2 38-6 48-24-20-6-40 2-48 24Z" fill="currentColor" opacity=".12" />
  </svg>`;
}

function ProductCard(product, { showAdd = true, showCategory = true } = {}) {
  const soldOut = product.stock === 0;
  const name = esc(product.name);
  return `
  <article class="product-card">
    <a href="detail-produk.html?id=${product.id}" class="product-card__media">
      <img src="${product.image}" alt="Foto ${name}" loading="lazy" />
    </a>
    ${product.badge ? `<span class="badge product-card__badge ${soldOut ? 'badge-red' : 'badge-green'}">${esc(product.badge)}</span>` : ''}
    <button type="button" class="icon-btn icon-btn--sm product-card__wish" data-act="wish"
      aria-pressed="false" aria-label="Simpan ${name} ke wishlist" data-name="${name}">
      ${icon('Heart', { size: 16 })}
    </button>
    <div class="product-card__body">
      ${showCategory ? `<span class="product-card__cat">${esc(product.category)}</span>` : ''}
      <a href="detail-produk.html?id=${product.id}" class="product-card__name">${name}</a>
      <span class="product-card__rating">
        ${Stars(product.rating || 4)}
        ${product.reviews ? `<span>(${product.reviews})</span>` : ''}
      </span>
      <div class="product-card__price">
        ${product.originalPrice ? `<span class="price-old">Rp ${formatPrice(product.originalPrice)}</span>` : ''}
        <span class="price-new">Rp ${formatPrice(product.price)}</span>
      </div>
      ${showAdd ? `
      <div class="product-card__cta">
        <button type="button" class="btn btn-secondary btn-sm btn-block" data-act="add" data-id="${product.id}" ${soldOut ? 'disabled' : ''}>
          ${icon('ShoppingCart', { size: 16 })}
          ${soldOut ? 'Stok Habis' : 'Tambah ke Keranjang'}
        </button>
      </div>` : ''}
    </div>
  </article>`;
}

const Reveal = (() => {
  let io = null;
  function ensure() {
    if (io || !('IntersectionObserver' in window)) return;
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  return {
    scan(root = document) {
      const els = root.querySelectorAll('.reveal:not(.is-visible)');
      ensure();
      if (!io) { els.forEach((el) => el.classList.add('is-visible')); return; }
      els.forEach((el) => io.observe(el));
    },
    showAll(root) {
      root.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    },
  };
})();

function setHTML(el, html) {
  if (!el) return;
  el.innerHTML = html;
  Reveal.showAll(el);
}
