const CartModal = (() => {
  let root = null;

  function render() {
    const show = Cart.showModal && Cart.lastAdded && Router.path() === '/shop';
    if (!show) { root.innerHTML = ''; return; }
    const { product, quantity } = Cart.lastAdded;
    root.innerHTML = `
    <div class="modal-overlay" data-modal-overlay>
      <div class="modal-content shop-modal">
        <button type="button" class="icon-btn icon-btn--sm shop-modal__close" data-modal-close aria-label="Tutup dialog">${icon('X', { size: 16 })}</button>
        <div class="shop-modal__head">
          <span class="shop-modal__check">${icon('Check', { size: 18, sw: 2.5 })}</span>
          Berhasil Ditambahkan ke Keranjang
        </div>
        <div class="shop-modal__item">
          <img src="${product.image}" alt="${esc(product.name)}" class="shop-modal__img" />
          <div class="shop-modal__info">
            <div class="shop-modal__name">${esc(product.name)}</div>
            <div class="shop-modal__meta">Qty: ${quantity} · ${esc(product.category)}</div>
            <div class="shop-modal__price">Rp ${formatPrice(product.price * quantity)}</div>
            <div><span class="chip chip--soft">${icon('ShieldCheck', { size: 13 })} Garansi Tumbuh 14 Hari</span></div>
          </div>
        </div>
        <div class="shop-modal__total">
          <span>Total Sementara (${Cart.totalItems} item):</span>
          <strong>Rp ${formatPrice(Cart.subtotal)}</strong>
        </div>
        <div class="shop-modal__actions">
          <a href="keranjang.html" class="btn btn-primary btn-block" data-modal-close>
            ${icon('ShoppingCart', { size: 16 })} Lihat Keranjang &amp; Checkout ${icon('ArrowRight', { size: 16 })}
          </a>
          <button type="button" class="btn btn-outline btn-block" data-modal-close>Lanjut Pilih Bibit Lain</button>
        </div>
      </div>
    </div>`;
  }

  function mount() {
    root = document.createElement('div');
    document.body.appendChild(root);
    root.addEventListener('click', (ev) => {
      const overlay = ev.target.matches('[data-modal-overlay]');
      if (overlay || ev.target.closest('[data-modal-close]')) Cart.showModal = false;
    });
    Cart.subscribe(render);

    Router.onChange(() => { Cart.showModal = false; });
  }
  return { mount, render };
})();

/* EVENT GLOBAL */
function bindGlobalEvents() {
  document.addEventListener('click', (ev) => {

    const a = ev.target.closest('a[href^="#"]');
    if (a) {
      const href = a.getAttribute('href');
      if (href === '#') ev.preventDefault();
      else if (!href.startsWith('#/')) {
        ev.preventDefault();
        const target = document.getElementById(href.slice(1));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    }

    const wish = ev.target.closest('[data-act="wish"]');
    if (wish) {
      const on = wish.getAttribute('aria-pressed') !== 'true';
      wish.setAttribute('aria-pressed', String(on));
      wish.classList.toggle('is-active', on);
      wish.setAttribute('aria-label', `${on ? 'Hapus' : 'Simpan'} ${wish.dataset.name} ${on ? 'dari' : 'ke'} wishlist`);
      const svg = wish.querySelector('svg');
      if (svg) svg.setAttribute('fill', on ? 'currentColor' : 'none');
      return;
    }

    const add = ev.target.closest('[data-act="add"]');
    if (add) {
      const product = products.find((p) => String(p.id) === String(add.dataset.id));
      if (product && product.stock > 0) Cart.add(product, 1);
    }
  });

  window.addEventListener('storage', (ev) => {
    if (!ev.key) return;
    if (ev.key === 'agribibit.db.catalog') {
      if (typeof syncProductsFromAdmin === 'function') syncProductsFromAdmin();

      Router.go(Router.path());
      toast('Katalog diperbarui', 'Data produk disinkronkan dari Admin.');
    }
  });
}

/* START */
document.addEventListener('DOMContentLoaded', () => {
  Header.mount();
  Footer.mount();
  Toast.mountStack();
  CartModal.mount();
  bindGlobalEvents();
  Router.onChange(() => Header.updateActive());
  Router.onChange(() => Header.closeMenu());
  Router.start();
});
