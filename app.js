/**
 * KRAVE BY ARI — APPLICATION LOGIC
 * High-performance vanilla JS state management for shopping cart,
 * modals, search, toast notifications, and WhatsApp ordering.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- MENU DATA & STATE ---
  const state = {
    cart: [
      {
        id: 1,
        name: 'Chocolate Delight',
        price: 18000,
        img: 'assets/images/favorite_chocolate.png',
        qty: 1
      }
    ],
    menuItems: [
      { id: 1, name: 'Chocolate Delight', price: 18000, desc: 'Rich. Moist. Irresistible.', img: 'assets/images/favorite_chocolate.png', category: 'cakes' },
      { id: 2, name: 'Red Velvet Cupcake', price: 3000, desc: 'Classic with a twist.', img: 'assets/images/favorite_redvelvet.png', category: 'pastries' },
      { id: 3, name: 'French Macarons', price: 2500, desc: 'Sweet elegance.', img: 'assets/images/favorite_macarons.png', category: 'pastries' },
      { id: 4, name: 'Berry Cheesecake', price: 8000, desc: 'Creamy. Fruity. Perfect.', img: 'assets/images/favorite_cheesecake.png', category: 'cakes' },
      { id: 5, name: 'Celebration Drip Cake', price: 35000, desc: 'Multi-layered custom drip cake with ice cream cone.', img: 'assets/images/hero_vector_cake.png', category: 'cakes' },
      { id: 6, name: 'Gourmet Chocolate Cookies', price: 4500, desc: 'Sweet treats for any occasion.', img: 'assets/images/card_cookies.png', category: 'cookies' },
      { id: 7, name: 'Artisan Pastries Box', price: 6500, desc: 'Delicious delights to indulge in.', img: 'assets/images/card_pastries.png', category: 'pastries' },
      { id: 8, name: 'Fudge Brownie Box', price: 6000, desc: 'Rich and fudgy for chocolate lovers.', img: 'assets/images/card_brownies.png', category: 'brownies' }
    ]
  };

  // Format currency in Nigerian Naira
  const formatNaira = (amount) => {
    return '₦' + Number(amount).toLocaleString('en-NG');
  };

  // --- DOM ELEMENTS ---
  const cartBadges = document.querySelectorAll('.cart-badge');
  const cartTriggers = document.querySelectorAll('.cart-trigger');
  const cartDrawer = document.getElementById('cart-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartEmptyState = document.getElementById('cart-empty-state');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const drawerItemsCount = document.getElementById('drawer-items-count');
  const checkoutBtn = document.getElementById('checkout-btn');
  const exploreTreatsBtn = document.getElementById('explore-treats-btn');

  // Modals
  const orderModal = document.getElementById('order-modal');
  const closeOrderModal = document.getElementById('close-order-modal');
  const orderForm = document.getElementById('order-form');
  const modalOrderItems = document.getElementById('modal-order-items');
  const modalTotalAmount = document.getElementById('modal-total-amount');

  const searchModal = document.getElementById('search-modal');
  const searchTrigger = document.getElementById('search-trigger');
  const closeSearchModal = document.getElementById('close-search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  const fullMenuModal = document.getElementById('full-menu-modal');
  const closeFullMenuModal = document.getElementById('close-full-menu-modal');
  const menuExplorerGrid = document.getElementById('menu-explorer-grid');
  const menuFilterBtns = document.querySelectorAll('.menu-filter-btn');

  const storyModal = document.getElementById('story-modal');
  const ourStoryBtn = document.getElementById('our-story-btn');
  const closeStoryModal = document.getElementById('close-story-modal');
  const closeStoryBtn = document.getElementById('close-story-btn');

  // Mobile Navigation
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Action Buttons
  const navOrderBtn = document.getElementById('nav-order-btn');
  const mobileOrderBtn = document.getElementById('mobile-order-btn');
  const heroOrderBtn = document.getElementById('hero-order-btn');
  const ctaOrderBtn = document.getElementById('cta-order-btn');
  const heroViewMenuBtn = document.getElementById('hero-view-menu-btn');
  const viewFullMenuBtn = document.getElementById('view-full-menu-btn');

  const newsletterForm = document.getElementById('newsletter-form');
  const toastContainer = document.getElementById('toast-container');

  // --- TOAST NOTIFICATIONS ---
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>🧁</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- CART FUNCTIONS ---
  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update Badges
    cartBadges.forEach(badge => {
      badge.textContent = totalItems;
      badge.style.transform = 'scale(1.35)';
      setTimeout(() => {
        badge.style.transform = 'scale(1)';
      }, 200);
    });

    if (drawerItemsCount) {
      drawerItemsCount.textContent = `${totalItems} ${totalItems === 1 ? 'treat' : 'treats'}`;
    }
    if (cartSubtotal) {
      cartSubtotal.textContent = formatNaira(subtotal);
    }

    // Render cart items
    if (state.cart.length === 0) {
      if (cartEmptyState) cartEmptyState.style.display = 'flex';
      if (cartItemsList) cartItemsList.style.display = 'none';
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
      }
    } else {
      if (cartEmptyState) cartEmptyState.style.display = 'none';
      if (cartItemsList) {
        cartItemsList.style.display = 'flex';
        cartItemsList.innerHTML = state.cart.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img" />
            <div class="cart-item-info">
              <h4 class="cart-item-title">${item.name}</h4>
              <p class="cart-item-price">${formatNaira(item.price)}</p>
              <div class="cart-qty-ctrl">
                <button class="qty-btn dec-qty" aria-label="Decrease quantity" data-id="${item.id}">-</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn inc-qty" aria-label="Increase quantity" data-id="${item.id}">+</button>
              </div>
            </div>
            <button class="cart-item-remove" aria-label="Remove item" data-id="${item.id}">✕</button>
          </div>
        `).join('');
      }
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
      }
    }
  }

  function addToCart(product) {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        img: product.img,
        qty: 1
      });
    }
    updateCartUI();
    openCart();
    showToast(`Added ${product.name} to your bag!`);
  }

  function openCart() {
    if (cartDrawer) cartDrawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
  }

  // Cart Triggers
  cartTriggers.forEach(btn => {
    btn.addEventListener('click', openCart);
  });

  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeCart);

  if (exploreTreatsBtn) {
    exploreTreatsBtn.addEventListener('click', () => {
      closeCart();
      const favSection = document.getElementById('favorites');
      if (favSection) favSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Cart Items Click (Qty & Remove)
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const incBtn = e.target.closest('.inc-qty');
      const decBtn = e.target.closest('.dec-qty');
      const delBtn = e.target.closest('.cart-item-remove');

      if (incBtn) {
        const id = parseInt(incBtn.dataset.id, 10);
        const item = state.cart.find(i => i.id === id);
        if (item) {
          item.qty += 1;
          updateCartUI();
        }
      } else if (decBtn) {
        const id = parseInt(decBtn.dataset.id, 10);
        const item = state.cart.find(i => i.id === id);
        if (item) {
          item.qty -= 1;
          if (item.qty <= 0) {
            state.cart = state.cart.filter(i => i.id !== id);
          }
          updateCartUI();
        }
      } else if (delBtn) {
        const id = parseInt(delBtn.dataset.id, 10);
        state.cart = state.cart.filter(i => i.id !== id);
        updateCartUI();
        showToast('Item removed from bag');
      }
    });
  }

  // Product Cards: Add to Cart button listener
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-cart');
    if (addBtn) {
      const id = parseInt(addBtn.dataset.id, 10);
      const name = addBtn.dataset.name;
      const price = parseInt(addBtn.dataset.price, 10);
      const img = addBtn.dataset.img;
      addToCart({ id, name, price, img });
    }
  });

  // --- CHECKOUT & ORDER MODAL (WHATSAPP INTEGRATION) ---
  function openOrderModal() {
    closeCart();
    if (!orderModal) return;

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (modalTotalAmount) modalTotalAmount.textContent = formatNaira(subtotal);

    if (modalOrderItems) {
      if (state.cart.length > 0) {
        modalOrderItems.innerHTML = state.cart.map(item => `
          <div class="modal-order-item-row">
            <span>${item.qty}x ${item.name}</span>
            <span style="font-weight:600;">${formatNaira(item.price * item.qty)}</span>
          </div>
        `).join('');
      } else {
        modalOrderItems.innerHTML = '<p style="color:#888;">No items in cart yet. You can still message Chef Ari with custom specifications!</p>';
      }
    }

    // Set minimum delivery date to tomorrow
    const dateInput = document.getElementById('order-date');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    orderModal.showModal();
  }

  if (checkoutBtn) checkoutBtn.addEventListener('click', openOrderModal);
  if (closeOrderModal) closeOrderModal.addEventListener('click', () => orderModal.close());

  // Direct "Order Now" triggers across page
  const mobileNavOrderBtn = document.getElementById('mobile-nav-order-btn');
  [navOrderBtn, mobileOrderBtn, mobileNavOrderBtn, heroOrderBtn, ctaOrderBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', openOrderModal);
  });

  // Handle Order Form Submission
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('order-name').value.trim();
      const phone = document.getElementById('order-phone').value.trim();
      const date = document.getElementById('order-date').value;
      const address = document.getElementById('order-address').value.trim();
      const notes = document.getElementById('order-notes').value.trim();
      const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

      let itemsSummary = state.cart.map(i => `• ${i.qty}x ${i.name} (${formatNaira(i.price * i.qty)})`).join('\n');
      if (!itemsSummary) itemsSummary = 'Custom dessert inquiry';

      const whatsappText = encodeURIComponent(
        `*🎂 New Order Request — Krave by Ari*\n\n` +
        `*Customer Name:* ${name}\n` +
        `*Phone / WhatsApp:* ${phone}\n` +
        `*Delivery Date:* ${date}\n` +
        `*Delivery Address:* ${address}\n\n` +
        `*Order Items:*\n${itemsSummary}\n\n` +
        `*Subtotal:* ${formatNaira(subtotal)}\n` +
        (notes ? `*Custom Notes / Inscription:* ${notes}\n\n` : '\n') +
        `Please confirm order availability and dispatch schedule!`
      );

      orderModal.close();
      showToast('Opening WhatsApp to send your order! 📱');

      setTimeout(() => {
        window.open(`https://wa.me/2348160128286?text=${whatsappText}`, '_blank');
      }, 500);
    });
  }

  // --- FULL MENU EXPLORER MODAL ---
  function renderMenuExplorer(category = 'all') {
    if (!menuExplorerGrid) return;
    const filtered = category === 'all' 
      ? state.menuItems 
      : state.menuItems.filter(item => item.category === category);

    menuExplorerGrid.innerHTML = filtered.map(item => `
      <div class="product-card" style="display:flex; flex-direction:row; height:130px;">
        <img src="${item.img}" alt="${item.name}" style="width:130px; height:100%; object-fit:cover;" />
        <div class="product-details" style="padding:0.75rem; justify-content:space-between;">
          <div>
            <h4 class="product-name" style="font-size:0.95rem;">${item.name}</h4>
            <p class="product-caption" style="margin-bottom:0.35rem;">${item.desc}</p>
          </div>
          <div class="product-action-row" style="padding-top:0.25rem;">
            <span class="product-price" style="font-size:1rem;">${formatNaira(item.price)}</span>
            <button class="btn-add-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-img="${item.img}" aria-label="Add to bag">
              <img src="assets/images/icon_cart_add.svg" alt="+" width="16" height="16" />
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function openMenuExplorer(category = 'all') {
    renderMenuExplorer(category);
    menuFilterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === category);
    });
    if (fullMenuModal) fullMenuModal.showModal();
  }

  if (heroViewMenuBtn) {
    heroViewMenuBtn.addEventListener('click', () => openMenuExplorer('all'));
  }
  if (viewFullMenuBtn) {
    viewFullMenuBtn.addEventListener('click', () => openMenuExplorer('all'));
  }
  if (closeFullMenuModal) {
    closeFullMenuModal.addEventListener('click', () => fullMenuModal.close());
  }

  menuFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      menuFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMenuExplorer(btn.dataset.filter);
    });
  });

  // Clicking on Specialty cards opens the menu filtered to that category
  document.querySelectorAll('.specialty-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      openMenuExplorer(cat);
    });
  });

  // --- SEARCH MODAL ---
  function renderSearchResults(query = '') {
    if (!searchResults) return;
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) {
      searchResults.innerHTML = '<p style="font-size:0.875rem; color:#999; text-align:center; padding:1.5rem 0;">Type to search our bakery delights...</p>';
      return;
    }

    const matches = state.menuItems.filter(item => 
      item.name.toLowerCase().includes(cleanQuery) || 
      item.desc.toLowerCase().includes(cleanQuery) ||
      item.category.toLowerCase().includes(cleanQuery)
    );

    if (matches.length === 0) {
      searchResults.innerHTML = '<p style="font-size:0.875rem; color:#999; text-align:center; padding:1.5rem 0;">No matching treats found. Try "cake", "cupcake", or "cookie"!</p>';
      return;
    }

    searchResults.innerHTML = matches.map(item => `
      <div class="search-result-item" data-id="${item.id}">
        <img src="${item.img}" alt="${item.name}" />
        <div style="flex:1;">
          <h4 style="font-size:0.95rem; font-weight:700;">${item.name}</h4>
          <p style="font-size:0.8rem; color:#888;">${item.desc}</p>
        </div>
        <span style="font-weight:800; color:var(--deep-pink); font-size:0.95rem;">${formatNaira(item.price)}</span>
        <button class="btn-add-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-img="${item.img}" style="margin-left:0.5rem;" aria-label="Add to bag">
          <img src="assets/images/icon_cart_add.svg" alt="+" width="16" height="16" />
        </button>
      </div>
    `).join('');
  }

  document.querySelectorAll('#search-trigger, #mobile-search-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (searchModal) {
        searchModal.showModal();
        renderSearchResults('');
        if (searchInput) {
          searchInput.value = '';
          setTimeout(() => searchInput.focus(), 100);
        }
      }
    });
  });

  if (closeSearchModal) {
    closeSearchModal.addEventListener('click', () => searchModal.close());
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  // --- STORY MODAL ---
  if (ourStoryBtn) {
    ourStoryBtn.addEventListener('click', () => {
      if (storyModal) storyModal.showModal();
    });
  }
  if (closeStoryModal) {
    closeStoryModal.addEventListener('click', () => storyModal.close());
  }
  if (closeStoryBtn) {
    closeStoryBtn.addEventListener('click', () => storyModal.close());
  }

  // --- MOBILE NAVIGATION TOGGLE ---
  if (mobileToggle && mobileNavDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      mobileNavDrawer.classList.toggle('open');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileNavDrawer.classList.remove('open');
      });
    });
  }

  // --- NEWSLETTER FORM ---
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (emailInput && emailInput.value) {
        showToast('Thank you for subscribing to our sweet newsletter! 💌');
        emailInput.value = '';
      }
    });
  }

  // Initialize UI
  updateCartUI();
});
