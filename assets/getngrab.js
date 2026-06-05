/**
 * GetNGrab Theme JS — getngrab.js
 * Handles: cart drawer, wishlist, search, modals, size selection, toast notifications
 * Integrates with Shopify AJAX Cart API
 */
(function() {
  'use strict';

  /* ============================================================
     NAMESPACE
  ============================================================ */
  window.GNG = {};

  /* ============================================================
     TOAST
  ============================================================ */
  let toastTimer;
  GNG.showToast = function(msg, type) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { t.classList.remove('show'); }, 3000);
  };

  /* ============================================================
     MODAL
  ============================================================ */
  GNG.openModal = function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('open');
  };
  GNG.closeModal = function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('open');
  };
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
    }
  });

  /* ============================================================
     LOGIN TABS
  ============================================================ */
  GNG.switchLoginTab = function(tab, el) {
    document.querySelectorAll('.login-tab').forEach(function(t) { t.classList.remove('active'); });
    el.classList.add('active');
    var lf = document.getElementById('loginForm');
    var rf = document.getElementById('registerForm');
    if (lf) lf.style.display = tab === 'login' ? 'block' : 'none';
    if (rf) rf.style.display = tab === 'register' ? 'block' : 'none';
  };

  /* ============================================================
     SEARCH (uses Shopify Predictive Search API)
  ============================================================ */
  GNG.openSearch = function() {
    var el = document.getElementById('searchOverlay');
    if (el) {
      el.classList.add('open');
      setTimeout(function() {
        var inp = document.getElementById('searchInput');
        if (inp) inp.focus();
      }, 100);
    }
  };
  GNG.closeSearch = function(e) {
    if (!e || e.target === document.getElementById('searchOverlay')) {
      var el = document.getElementById('searchOverlay');
      if (el) el.classList.remove('open');
      var inp = document.getElementById('searchInput');
      if (inp) inp.value = '';
      var res = document.getElementById('searchResults');
      if (res) res.innerHTML = '';
    }
  };
  var searchTimer;
  GNG.doSearch = function(q) {
    var res = document.getElementById('searchResults');
    if (!q || !q.trim()) { if (res) res.innerHTML = ''; return; }
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function() {
      // Use Shopify Predictive Search API
      fetch('/search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=6&resources[fields]=title,product_type,handle,price')
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (!res) return;
          var products = (data.resources && data.resources.results && data.resources.results.products) || [];
          if (products.length === 0) {
            res.innerHTML = '<div style="padding:24px;text-align:center;color:var(--mid);font-size:14px">No results found</div>';
            return;
          }
          var html = '';
          products.forEach(function(p) {
            var price = p.price ? ('₹' + (parseInt(p.price) / 100).toLocaleString('en-IN')) : '';
            var img = p.image ? p.image : '';
            html += '<a class="search-result-item" href="/products/' + p.handle + '" onclick="GNG.closeSearch()">';
            html += img
              ? '<img src="' + img + '" alt="' + p.title + '" style="width:40px;height:30px;object-fit:contain;background:#f4f4f4;">'
              : '<div style="font-size:20px">👟</div>';
            html += '<div>';
            html += '<div style="font-weight:700;font-size:14px">' + p.title + '</div>';
            html += '<div style="font-size:12px;color:var(--mid)">' + (p.product_type || '') + (price ? ' • ' + price : '') + '</div>';
            html += '</div></a>';
          });
          res.innerHTML = html;
        })
        .catch(function() {
          if (res) res.innerHTML = '<div style="padding:24px;text-align:center;color:var(--mid);font-size:14px">Search unavailable</div>';
        });
    }, 250);
  };

  /* ============================================================
     CART DRAWER (Shopify AJAX Cart API)
  ============================================================ */
  GNG.toggleCart = function() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    if (!drawer) return;
    var isOpen = drawer.classList.contains('open');
    if (isOpen) {
      GNG.closeCart();
    } else {
      GNG.openCart();
    }
  };
  GNG.openCart = function() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    GNG.refreshCartDrawer();
  };
  GNG.closeCart = function() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  };

  GNG.refreshCartDrawer = function() {
    fetch('/cart.js')
      .then(function(r) { return r.json(); })
      .then(function(cart) {
        GNG.renderCartDrawer(cart);
        GNG.updateCartCount(cart.item_count);
      });
  };

  GNG.renderCartDrawer = function(cart) {
    var itemsEl = document.getElementById('cartItems');
    var subtotalEl = document.getElementById('cartSubtotal');
    var shippingEl = document.getElementById('cartShipping');
    var totalEl = document.getElementById('cartTotal');
    var countEl = document.getElementById('cartHeadCount');

    if (countEl) countEl.textContent = cart.item_count > 0 ? '(' + cart.item_count + ')' : '';

    if (!itemsEl) return;
    if (cart.item_count === 0) {
      itemsEl.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your bag is empty</p></div>';
    } else {
      var html = '';
      cart.items.forEach(function(item, i) {
        var price = GNG.formatMoney(item.final_line_price);
        html += '<div class="cart-item">';
        html += '<div class="cart-item-img">';
        if (item.image) {
          html += '<img src="' + item.image + '" alt="' + item.title + '" style="width:80px;height:60px;object-fit:contain;">';
        } else {
          html += '<span style="font-size:24px">👟</span>';
        }
        html += '</div>';
        html += '<div class="cart-item-info">';
        html += '<div class="cart-item-name">' + item.product_title + '</div>';
        if (item.variant_title && item.variant_title !== 'Default Title') {
          html += '<div class="cart-item-meta">' + item.variant_title + '</div>';
        }
        html += '<div class="cart-qty">';
        html += '<button class="qty-btn" onclick="GNG.changeQty(' + (i+1) + ',' + (item.quantity - 1) + ')">−</button>';
        html += '<span class="qty-num">' + item.quantity + '</span>';
        html += '<button class="qty-btn" onclick="GNG.changeQty(' + (i+1) + ',' + (item.quantity + 1) + ')">+</button>';
        html += '<button class="cart-remove" onclick="GNG.changeQty(' + (i+1) + ',0)" title="Remove">✕</button>';
        html += '</div></div>';
        html += '<div class="cart-item-price">' + price + '</div>';
        html += '</div>';
      });
      itemsEl.innerHTML = html;
    }

    var freeShipping = cart.total_price >= 99900; // ₹999 in paise
    if (subtotalEl) subtotalEl.textContent = GNG.formatMoney(cart.total_price);
    if (shippingEl) shippingEl.textContent = freeShipping ? 'FREE' : 'Calculated at checkout';
    if (totalEl) totalEl.textContent = GNG.formatMoney(cart.total_price);
  };

  GNG.changeQty = function(line, qty) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: line, quantity: qty })
    })
    .then(function(r) { return r.json(); })
    .then(function(cart) {
      GNG.renderCartDrawer(cart);
      GNG.updateCartCount(cart.item_count);
    });
  };

  GNG.addToCart = function(variantId, title, price, image) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    })
    .then(function(r) { return r.json(); })
    .then(function() {
      GNG.showToast(title + ' added to bag ✓', 'success');
      return fetch('/cart.js');
    })
    .then(function(r) { return r.json(); })
    .then(function(cart) {
      GNG.updateCartCount(cart.item_count);
      // Briefly show cart
      GNG.openCart();
    })
    .catch(function() {
      GNG.showToast('Could not add to bag. Please try again.');
    });
  };

  GNG.addToCartFromPDP = function() {
    var btn = document.getElementById('pdAddCart');
    if (!btn) return;
    var variantId = btn.getAttribute('data-variant-id');
    if (!variantId) { GNG.showToast('Please select a size'); return; }
    var title = btn.getAttribute('data-product-title') || 'Product';
    GNG.addToCart(variantId, title, 0, '');
  };

  GNG.updateCartCount = function(count) {
    var el = document.getElementById('cartCount');
    if (el) el.textContent = count;
  };

  GNG.formatMoney = function(cents) {
    return '₹' + (cents / 100).toLocaleString('en-IN');
  };

  /* ============================================================
     PRODUCT PAGE — SIZE & COLOR SELECTION
  ============================================================ */
  GNG.selectSize = function(btn) {
    // Deactivate all
    document.querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    // Update displayed size
    var sel = document.getElementById('selectedSize');
    if (sel) sel.textContent = btn.textContent.trim();
    // Update the add-to-cart button variant
    var variantId = btn.getAttribute('data-variant-id');
    var addBtn = document.getElementById('pdAddCart');
    if (addBtn && variantId) {
      addBtn.setAttribute('data-variant-id', variantId);
    }
    // Update price display
    var price = btn.getAttribute('data-price');
    var compare = btn.getAttribute('data-compare');
    var priceEl = document.getElementById('pdPrice');
    if (priceEl && price) priceEl.textContent = GNG.formatMoney(parseInt(price));
  };

  GNG.selectColor = function(btn, colorName) {
    document.querySelectorAll('.cdot').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var sel = document.getElementById('selectedColor');
    if (sel) sel.textContent = colorName;
  };

  /* ============================================================
     WISHLIST (localStorage)
  ============================================================ */
  GNG.getWishlist = function() {
    try { return JSON.parse(localStorage.getItem('gng_wishlist') || '[]'); } catch(e) { return []; }
  };
  GNG.saveWishlist = function(list) {
    localStorage.setItem('gng_wishlist', JSON.stringify(list));
    var countEl = document.getElementById('wishlistCount');
    if (countEl) {
      countEl.textContent = list.length;
      countEl.style.display = list.length > 0 ? 'flex' : 'none';
    }
  };
  GNG.toggleWishlistItem = function(productId, title) {
    var list = GNG.getWishlist();
    var idx = list.indexOf(String(productId));
    if (idx >= 0) {
      list.splice(idx, 1);
      GNG.showToast(title + ' removed from wishlist');
    } else {
      list.push(String(productId));
      GNG.showToast(title + ' added to wishlist ♥', 'success');
    }
    GNG.saveWishlist(list);
  };
  GNG.toggleWishlist = function() {
    window.location.href = '/collections/wishlist'; // or a custom page
  };

  /* ============================================================
     CART DISCOUNT (client-side display only — Shopify handles real discounts at checkout)
  ============================================================ */
  GNG.applyDiscount = function() {
    var code = (document.getElementById('discountCode') || {}).value || '';
    if (!code.trim()) { GNG.showToast('Enter a coupon code'); return; }
    // Shopify discount codes apply at checkout; here we just show a message
    GNG.showToast('Discount applied at checkout! ✓', 'success');
    var msg = document.getElementById('couponMsg');
    if (msg) { msg.textContent = 'Code "' + code.toUpperCase() + '" will apply at checkout.'; msg.style.display = 'block'; }
  };

  /* ============================================================
     INIT
  ============================================================ */
  document.addEventListener('DOMContentLoaded', function() {
    // Sync cart count on page load
    fetch('/cart.js')
      .then(function(r) { return r.json(); })
      .then(function(cart) { GNG.updateCartCount(cart.item_count); });

    // Sync wishlist count
    var list = GNG.getWishlist();
    var wEl = document.getElementById('wishlistCount');
    if (wEl && list.length > 0) { wEl.textContent = list.length; wEl.style.display = 'flex'; }
  });

})();
