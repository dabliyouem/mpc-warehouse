// MPC/SRC WAREHOUSE - Application Logic

(function () {
  'use strict';

  // --- STATE MANAGEMENT ---
  const state = {
    products: [],
    config: {},
    activeCategory: 'ALL',
    searchQuery: '',
    sliderIndices: {},
    currentSlideDetail: 0,
    editingProductId: null,
  };

  // Load from localStorage or defaults
  function loadData() {
    try {
      const savedConfig = localStorage.getItem('mpc_warehouse_config');
      state.config = savedConfig ? JSON.parse(savedConfig) : { ...DEFAULT_CONFIG };
      // Ensure adminPassword is always set
      if (!state.config.adminPassword || state.config.adminPassword.trim() === '') {
        state.config.adminPassword = 'admin123';
      }
    } catch (e) {
      state.config = { ...DEFAULT_CONFIG };
    }

    try {
      const savedProducts = localStorage.getItem('mpc_warehouse_products');
      state.products = savedProducts ? JSON.parse(savedProducts) : [...INITIAL_PRODUCTS];
    } catch (e) {
      state.products = [...INITIAL_PRODUCTS];
    }
  }

  function saveProducts() {
    try {
      localStorage.setItem('mpc_warehouse_products', JSON.stringify(state.products));
    } catch (e) {
      console.error('Error saving products:', e);
    }
  }

  function saveConfig() {
    try {
      localStorage.setItem('mpc_warehouse_config', JSON.stringify(state.config));
    } catch (e) {
      console.error('Error saving config:', e);
    }
  }

  // --- AUTHENTICATION HELPERS ---
  function isAdminLoggedIn() {
    return (
      sessionStorage.getItem('mpc_admin_auth') === 'true' ||
      localStorage.getItem('mpc_admin_auth') === 'true'
    );
  }

  function loginAdmin(password) {
    const entered = (password || '').trim();
    const stored = (state.config.adminPassword || 'admin123').trim();

    // Flexible matching: exact match, case-insensitive, or default fallback 'admin123' / 'admin'
    if (
      entered === stored ||
      entered.toLowerCase() === stored.toLowerCase() ||
      entered === 'admin123' ||
      entered.toLowerCase() === 'admin123' ||
      entered.toLowerCase() === 'admin'
    ) {
      sessionStorage.setItem('mpc_admin_auth', 'true');
      localStorage.setItem('mpc_admin_auth', 'true');
      return true;
    }
    return false;
  }

  function logoutAdmin() {
    sessionStorage.removeItem('mpc_admin_auth');
    localStorage.removeItem('mpc_admin_auth');
    window.location.href = 'index.html';
  }

  // --- STRICT WHATSAPP FORMATTER ---
  // STRICT REQUIREMENT: Only REF, DESIGNATION, and QTE. No more, no less.
  function buildStrictWhatsAppUrl(prod) {
    const rawPhone = state.config.whatsapp || '12345678900';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const message = `REF: ${prod.ref}\nDesignation: ${prod.designation}\nQte: ${prod.qte}`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  // --- UNIQUE CATEGORIES LIST ---
  function getCategories() {
    const set = new Set();
    state.products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }

  // --- PAGE INITIALIZERS ---
  function init() {
    loadData();

    // DOM-based detection: 100% reliable regardless of URL path, server, or hosting
    if (document.getElementById('admin-login-form')) {
      initAdminLoginPage();
    } else if (document.getElementById('admin-inventory-tbody')) {
      initAdminPage();
    } else if (document.getElementById('product-detail-view')) {
      initProductDetailPage();
    } else if (document.getElementById('products-grid')) {
      initCatalogPage();
    }

    // Update common header status if elements exist
    updateHeaderAuthButton();
  }

  function updateHeaderAuthButton() {
    const authBtn = document.getElementById('header-admin-link');
    if (!authBtn) return;

    if (isAdminLoggedIn()) {
      authBtn.href = 'admin.html';
      authBtn.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 inline-block"></span>Admin Panel`;
    } else {
      authBtn.href = 'admin-login.html';
      authBtn.innerHTML = `Admin Login`;
    }
  }

  // ==========================================
  // 1. CATALOG PAGE (index.html)
  // ==========================================
  function initCatalogPage() {
    renderCategoryControls();
    renderCatalogProducts();

    // Search event
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderCatalogProducts();
      });
    }

    // Category Dropdown event
    const categoryDropdown = document.getElementById('category-dropdown');
    if (categoryDropdown) {
      categoryDropdown.addEventListener('change', (e) => {
        state.activeCategory = e.target.value;
        syncCategoryPills();
        renderCatalogProducts();
      });
    }
  }

  function renderCategoryControls() {
    const dropdown = document.getElementById('category-dropdown');
    const pillsContainer = document.getElementById('category-pills');
    const categories = getCategories();

    // 1. Dropdown options
    if (dropdown) {
      dropdown.innerHTML = `
        <option value="ALL">All Categories (${state.products.length})</option>
        ${categories
          .map((cat) => {
            const count = state.products.filter((p) => p.category === cat).length;
            return `<option value="${escapeAttr(cat)}" ${state.activeCategory === cat ? 'selected' : ''}>${escapeHtml(cat)} (${count})</option>`;
          })
          .join('')}
      `;
    }

    // 2. Category Pills / Grid
    if (pillsContainer) {
      let pillsHtml = `
        <button 
          type="button" 
          onclick="window.app.setCategory('ALL')"
          class="cat-pill px-4 py-2 rounded-xl text-xs font-bold transition-all ${state.activeCategory === 'ALL' ? 'bg-black text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
        >
          All (${state.products.length})
        </button>
      `;

      categories.forEach((cat) => {
        const count = state.products.filter((p) => p.category === cat).length;
        const isActive = state.activeCategory === cat;
        pillsHtml += `
          <button 
            type="button" 
            onclick="window.app.setCategory('${escapeAttr(cat)}')"
            class="cat-pill px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${isActive ? 'bg-black text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
          >
            ${escapeHtml(cat)} <span class="opacity-60 text-[10px] ml-1">(${count})</span>
          </button>
        `;
      });

      pillsContainer.innerHTML = pillsHtml;
    }
  }

  function syncCategoryPills() {
    const dropdown = document.getElementById('category-dropdown');
    if (dropdown) dropdown.value = state.activeCategory;

    const pillsContainer = document.getElementById('category-pills');
    if (pillsContainer) {
      const buttons = pillsContainer.querySelectorAll('button');
      buttons.forEach((btn) => {
        const text = btn.textContent.trim();
        if ((state.activeCategory === 'ALL' && text.startsWith('All')) || text.startsWith(state.activeCategory)) {
          btn.className = 'cat-pill px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap bg-black text-white';
        } else {
          btn.className = 'cat-pill px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap bg-slate-100 text-slate-700 hover:bg-slate-200';
        }
      });
    }
  }

  function setCategory(categoryName) {
    state.activeCategory = categoryName;
    syncCategoryPills();
    renderCatalogProducts();
  }

  function renderCatalogProducts() {
    const container = document.getElementById('products-grid');
    const countBadge = document.getElementById('catalog-count');
    if (!container) return;

    let filtered = [...state.products];

    // Filter by search
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        return (
          (p.ref && p.ref.toLowerCase().includes(q)) ||
          (p.designation && p.designation.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.type && p.type.toLowerCase().includes(q))
        );
      });
    }

    // Filter by category
    if (state.activeCategory !== 'ALL') {
      filtered = filtered.filter((p) => p.category === state.activeCategory);
    }

    if (countBadge) {
      countBadge.textContent = `${filtered.length} products`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <i class="fa-solid fa-box-open text-4xl text-slate-300 mb-3"></i>
          <p class="font-bold text-slate-700">No products found</p>
          <p class="text-xs text-slate-400 mt-1">Try resetting the category or search keywords.</p>
          <button onclick="window.app.resetCatalogFilters()" class="mt-4 px-4 py-2 bg-black text-white text-xs font-bold rounded-xl">Reset</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((prod) => createCatalogCard(prod)).join('');
  }

  function createCatalogCard(prod) {
    const images = prod.images && prod.images.length > 0 ? prod.images : ['https://placehold.co/600x450?text=No+Photo'];
    const currentSlide = state.sliderIndices[prod.id] || 0;
    const hasMultiple = images.length > 1;

    return `
      <div class="product-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-slate-400 transition-all">
        
        <!-- Image Slider Area -->
        <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          <div class="slider-track flex h-full transition-transform duration-300" id="slider-track-${prod.id}" style="transform: translateX(-${currentSlide * 100}%);">
            ${images
              .map(
                (src, idx) => `
              <div class="slider-slide flex-shrink-0 w-full h-full cursor-pointer" onclick="window.location.href='product.html?id=${prod.id}'">
                <img src="${escapeAttr(src)}" alt="${escapeAttr(prod.designation)}" class="w-full h-full object-cover" loading="lazy" onerror="this.src='https://placehold.co/600x450?text=Photo'">
              </div>
            `
              )
              .join('')}
          </div>

          <!-- Slide navigation arrows (if multi-image) -->
          ${
            hasMultiple
              ? `
            <button type="button" onclick="event.stopPropagation(); window.app.changeCardSlide('${prod.id}', -1)" class="slider-arrow prev" aria-label="Previous image">
              <i class="fa-solid fa-chevron-left text-xs"></i>
            </button>
            <button type="button" onclick="event.stopPropagation(); window.app.changeCardSlide('${prod.id}', 1)" class="slider-arrow next" aria-label="Next image">
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
            <div class="slider-dots" id="slider-dots-${prod.id}">
              ${images.map((_, i) => `<span class="slider-dot ${i === currentSlide ? 'active' : ''}"></span>`).join('')}
            </div>
          `
              : ''
          }
        </div>

        <!-- Product Details -->
        <div class="p-4 flex flex-col flex-grow cursor-pointer" onclick="window.location.href='product.html?id=${prod.id}'">
          
          <!-- Category Tag -->
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            ${escapeHtml(prod.category)}
          </div>

          <!-- REF & QTE Row -->
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="font-mono text-xs font-black bg-slate-100 text-slate-900 px-2 py-1 rounded border border-slate-200">
              REF: ${escapeHtml(prod.ref)}
            </span>
            <span class="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Qte: ${prod.qte} ${escapeHtml(prod.unit || 'pcs')}
            </span>
          </div>

          <!-- Designation (Item Name) -->
          <h3 class="font-bold text-sm text-slate-900 line-clamp-2 hover:text-black mb-3">
            ${escapeHtml(prod.designation)}
          </h3>

          <!-- View Details Button -->
          <div class="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-black">
            <span>View Details & Order</span>
            <i class="fa-solid fa-arrow-right text-[11px]"></i>
          </div>

        </div>
      </div>
    `;
  }

  function changeCardSlide(productId, delta) {
    const prod = state.products.find((p) => p.id === productId);
    if (!prod || !prod.images || prod.images.length <= 1) return;

    const total = prod.images.length;
    let current = state.sliderIndices[productId] || 0;
    current = (current + delta + total) % total;
    state.sliderIndices[productId] = current;

    const track = document.getElementById(`slider-track-${productId}`);
    if (track) track.style.transform = `translateX(-${current * 100}%)`;

    const dotsContainer = document.getElementById(`slider-dots-${productId}`);
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, i) => {
        dot.className = `slider-dot ${i === current ? 'active' : ''}`;
      });
    }
  }

  function resetCatalogFilters() {
    state.searchQuery = '';
    state.activeCategory = 'ALL';

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    syncCategoryPills();
    renderCatalogProducts();
  }

  // ==========================================
  // 2. DEDICATED PRODUCT DETAIL PAGE (product.html)
  // ==========================================
  function initProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const detailContainer = document.getElementById('product-detail-view');
    if (!detailContainer) return;

    const prod = state.products.find((p) => p.id === productId);

    if (!prod) {
      detailContainer.innerHTML = `
        <div class="max-w-md mx-auto py-20 text-center">
          <i class="fa-solid fa-triangle-exclamation text-4xl text-amber-500 mb-3"></i>
          <h2 class="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p class="text-sm text-slate-500 mb-6">The product you requested does not exist or has been removed from inventory.</p>
          <a href="index.html" class="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl inline-flex items-center gap-2">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Return to Catalog</span>
          </a>
        </div>
      `;
      return;
    }

    state.currentSlideDetail = 0;
    const images = prod.images && prod.images.length > 0 ? prod.images : ['https://placehold.co/800x600?text=Product+Photo'];
    const waUrl = buildStrictWhatsAppUrl(prod);
    const rawPhone = state.config.phone || '+1 234 567 8900';
    const cleanPhone = rawPhone.replace(/\s+/g, '');

    detailContainer.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        <!-- Left: Image Slider & Gallery -->
        <div class="space-y-4">
          <div class="relative aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
            <img id="detail-main-img" src="${escapeAttr(images[0])}" alt="${escapeAttr(prod.designation)}" class="w-full h-full object-cover">
            
            ${
              images.length > 1
                ? `
              <button onclick="window.app.changeDetailSlide(-1)" class="slider-arrow prev" aria-label="Previous">
                <i class="fa-solid fa-chevron-left text-sm"></i>
              </button>
              <button onclick="window.app.changeDetailSlide(1)" class="slider-arrow next" aria-label="Next">
                <i class="fa-solid fa-chevron-right text-sm"></i>
              </button>
            `
                : ''
            }
          </div>

          <!-- Thumbnails -->
          ${
            images.length > 1
              ? `
            <div class="flex items-center gap-2 overflow-x-auto pb-2" id="detail-thumbnails">
              ${images
                .map(
                  (src, idx) => `
                <button 
                  onclick="window.app.setDetailSlide(${idx})"
                  class="detail-thumb flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${idx === 0 ? 'border-black' : 'border-slate-200'}"
                >
                  <img src="${escapeAttr(src)}" alt="thumb ${idx + 1}" class="w-full h-full object-cover">
                </button>
              `
                )
                .join('')}
            </div>
          `
              : ''
          }
        </div>

        <!-- Right: Specifications & Direct Order -->
        <div class="space-y-6">
          
          <!-- Category -->
          <div class="text-xs font-bold uppercase tracking-wider text-slate-400">
            ${escapeHtml(prod.category)} ${prod.type ? `• ${escapeHtml(prod.type)}` : ''}
          </div>

          <!-- Designation -->
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            ${escapeHtml(prod.designation)}
          </h1>

          <!-- REF & QTE High-Contrast Display -->
          <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span class="text-xs font-bold text-slate-400 uppercase">Product Reference</span>
              <div class="font-mono text-lg font-black text-slate-900 mt-0.5">
                REF: ${escapeHtml(prod.ref)}
              </div>
            </div>
            <div>
              <span class="text-xs font-bold text-slate-400 uppercase">Available Stock</span>
              <div class="text-lg font-black text-emerald-700 mt-0.5">
                QTE: ${prod.qte} ${escapeHtml(prod.unit || 'pcs')}
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Details & Specifications</h3>
            <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              ${escapeHtml(prod.description || 'Warehouse ready in-stock inventory item.')}
            </p>
          </div>

          <!-- Direct Actions: WhatsApp & Call (Strictly No Clutter) -->
          <div class="pt-4 border-t border-slate-200 space-y-3">
            <span class="text-xs font-bold text-slate-500 block">Contact Warehouse for this Item:</span>

            <!-- Strictly Formatted WhatsApp Order Link -->
            <a 
              href="${waUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.99]"
            >
              <i class="fa-brands fa-whatsapp text-lg"></i>
              <span>Send Order on WhatsApp</span>
            </a>

            <!-- Direct Phone Call Button -->
            <a 
              href="tel:${cleanPhone}" 
              class="w-full py-3 px-6 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <i class="fa-solid fa-phone text-xs"></i>
              <span>Call Us: ${escapeHtml(state.config.phone || '+1 234 567 8900')}</span>
            </a>

            <!-- Info text showing what will be sent -->
            <div class="text-[11px] text-slate-400 bg-slate-100 p-2.5 rounded-lg">
              <span class="font-bold text-slate-600">WhatsApp Message Sent:</span>
              <pre class="mt-1 font-mono text-[10px] text-slate-700">REF: ${escapeHtml(prod.ref)}&#10;Designation: ${escapeHtml(prod.designation)}&#10;Qte: ${prod.qte}</pre>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  function changeDetailSlide(delta) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const prod = state.products.find((p) => p.id === productId);
    if (!prod || !prod.images || prod.images.length <= 1) return;

    const total = prod.images.length;
    state.currentSlideDetail = (state.currentSlideDetail + delta + total) % total;
    setDetailSlide(state.currentSlideDetail);
  }

  function setDetailSlide(index) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const prod = state.products.find((p) => p.id === productId);
    if (!prod || !prod.images) return;

    state.currentSlideDetail = index;
    const mainImg = document.getElementById('detail-main-img');
    if (mainImg) mainImg.src = prod.images[index];

    const thumbs = document.querySelectorAll('.detail-thumb');
    thumbs.forEach((t, i) => {
      if (i === index) {
        t.className = 'detail-thumb flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all border-black';
      } else {
        t.className = 'detail-thumb flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all border-slate-200';
      }
    });
  }

  // ==========================================
  // 3. ADMIN LOGIN PAGE (admin-login.html)
  // ==========================================
  function initAdminLoginPage() {
    const form = document.getElementById('admin-login-form');
    const pwdInput = document.getElementById('admin-password-input');
    const errorMsg = document.getElementById('login-error');
    const toggleBtn = document.getElementById('toggle-pwd-btn');
    const resetBtn = document.getElementById('reset-pwd-btn');
    const fillBtn = document.getElementById('fill-pwd-btn');

    // Toggle password show/hide
    if (toggleBtn && pwdInput) {
      toggleBtn.addEventListener('click', () => {
        const isPwd = pwdInput.type === 'password';
        pwdInput.type = isPwd ? 'text' : 'password';
        toggleBtn.innerHTML = isPwd
          ? '<i class="fa-solid fa-eye-slash text-slate-500"></i>'
          : '<i class="fa-solid fa-eye text-slate-500"></i>';
      });
    }

    // Auto-fill default password button
    if (fillBtn && pwdInput) {
      fillBtn.addEventListener('click', () => {
        pwdInput.value = 'admin123';
        if (errorMsg) errorMsg.classList.add('hidden');
      });
    }

    // Emergency Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.config.adminPassword = 'admin123';
        saveConfig();
        if (pwdInput) pwdInput.value = 'admin123';
        if (errorMsg) {
          errorMsg.classList.remove('hidden');
          errorMsg.className = 'mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2';
          errorMsg.innerHTML = '<i class="fa-solid fa-check"></i><span>Password reset to: <strong>admin123</strong></span>';
        }
      });
    }

    if (form && pwdInput) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = pwdInput.value;

        if (loginAdmin(pwd)) {
          window.location.href = 'admin.html';
        } else {
          if (errorMsg) {
            errorMsg.classList.remove('hidden');
            errorMsg.className = 'mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2';
            errorMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i><span>Incorrect password. Default is <strong>admin123</strong></span>';
          }
        }
      });
    }
  }

  // ==========================================
  // 4. DEDICATED ADMIN MANAGEMENT PAGE (admin.html)
  // ==========================================
  function initAdminPage() {
    // Protected route check
    if (!isAdminLoggedIn()) {
      window.location.href = 'admin-login.html';
      return;
    }

    renderAdminInventoryTable();
    loadAdminSettingsIntoForm();

    // Form Submissions
    const addProductForm = document.getElementById('admin-product-form');
    if (addProductForm) {
      addProductForm.addEventListener('submit', handleAdminProductFormSubmit);
    }

    const settingsForm = document.getElementById('admin-settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', handleAdminSettingsFormSubmit);
    }
  }

  function renderAdminInventoryTable() {
    const tbody = document.getElementById('admin-inventory-tbody');
    const countBadge = document.getElementById('admin-total-items');
    if (!tbody) return;

    if (countBadge) countBadge.textContent = `${state.products.length} products`;

    tbody.innerHTML = state.products
      .map((p) => {
        const primaryImg = (p.images && p.images[0]) || 'https://placehold.co/100x100?text=No+Photo';
        return `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
          <td class="py-3 px-4 w-16">
            <img src="${escapeAttr(primaryImg)}" alt="img" class="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200">
          </td>
          <td class="py-3 px-4 font-mono font-bold text-xs text-slate-900">${escapeHtml(p.ref)}</td>
          <td class="py-3 px-4 font-bold text-xs text-slate-900 max-w-xs truncate">${escapeHtml(p.designation)}</td>
          <td class="py-3 px-4 text-xs text-slate-600">${escapeHtml(p.category)}</td>
          <td class="py-3 px-4 text-center">
            <input 
              type="number" 
              value="${p.qte}" 
              min="0" 
              class="w-20 text-center font-bold text-xs py-1.5 px-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-black"
              onchange="window.app.quickUpdateStock('${p.id}', this.value)"
            >
          </td>
          <td class="py-3 px-4 text-right whitespace-nowrap">
            <button onclick="window.app.startEditAdminProduct('${p.id}')" class="px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded">
              Edit
            </button>
            <button onclick="window.app.deleteAdminProduct('${p.id}')" class="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded">
              Delete
            </button>
          </td>
        </tr>
      `;
      })
      .join('');
  }

  function quickUpdateStock(productId, newQteStr) {
    const qte = parseInt(newQteStr, 10);
    if (isNaN(qte) || qte < 0) return;

    const prod = state.products.find((p) => p.id === productId);
    if (prod) {
      prod.qte = qte;
      saveProducts();
      showToast(`Updated [${prod.ref}] Qte to ${qte}`);
    }
  }

  function handleAdminProductFormSubmit(e) {
    e.preventDefault();

    const ref = document.getElementById('prod-ref').value.trim();
    const designation = document.getElementById('prod-designation').value.trim();
    const category = document.getElementById('prod-category').value.trim();
    const type = document.getElementById('prod-type').value.trim();
    const qte = parseInt(document.getElementById('prod-qte').value, 10) || 0;
    const unit = document.getElementById('prod-unit').value.trim() || 'pcs';
    const imagesRaw = document.getElementById('prod-images').value.trim();
    const description = document.getElementById('prod-description').value.trim();

    if (!ref || !designation || !category) {
      alert('Reference, Designation, and Category are required.');
      return;
    }

    const images = imagesRaw
      ? imagesRaw
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : ['https://placehold.co/600x450?text=Warehouse+Stock'];

    if (state.editingProductId) {
      // Update existing
      const prod = state.products.find((p) => p.id === state.editingProductId);
      if (prod) {
        prod.ref = ref;
        prod.designation = designation;
        prod.category = category;
        prod.type = type;
        prod.qte = qte;
        prod.unit = unit;
        prod.images = images;
        prod.description = description;
      }
      showToast('Product updated successfully!');
    } else {
      // Create new
      const newProd = {
        id: 'prod-' + Date.now(),
        ref,
        designation,
        category,
        type,
        qte,
        unit,
        images,
        description,
      };
      state.products.unshift(newProd);
      showToast('New product added to inventory!');
    }

    saveProducts();
    resetAdminProductForm();
    renderAdminInventoryTable();
    window.app.switchAdminSection('table');
  }

  function startEditAdminProduct(productId) {
    const prod = state.products.find((p) => p.id === productId);
    if (!prod) return;

    state.editingProductId = productId;

    document.getElementById('prod-ref').value = prod.ref || '';
    document.getElementById('prod-designation').value = prod.designation || '';
    document.getElementById('prod-category').value = prod.category || '';
    document.getElementById('prod-type').value = prod.type || '';
    document.getElementById('prod-qte').value = prod.qte || 0;
    document.getElementById('prod-unit').value = prod.unit || 'pcs';
    document.getElementById('prod-images').value = (prod.images || []).join('\n');
    document.getElementById('prod-description').value = prod.description || '';

    const titleEl = document.getElementById('product-form-title');
    const submitBtn = document.getElementById('product-form-submit-btn');
    if (titleEl) titleEl.textContent = `Edit Product: ${prod.ref}`;
    if (submitBtn) submitBtn.textContent = 'Save Changes';

    window.app.switchAdminSection('form');
  }

  function resetAdminProductForm() {
    state.editingProductId = null;
    const form = document.getElementById('admin-product-form');
    if (form) form.reset();

    const titleEl = document.getElementById('product-form-title');
    const submitBtn = document.getElementById('product-form-submit-btn');
    if (titleEl) titleEl.textContent = 'Add New Product';
    if (submitBtn) submitBtn.textContent = 'Add Product';
  }

  function deleteAdminProduct(productId) {
    const prod = state.products.find((p) => p.id === productId);
    if (!prod) return;

    if (confirm(`Delete [${prod.ref}] - ${prod.designation}?`)) {
      state.products = state.products.filter((p) => p.id !== productId);
      saveProducts();
      renderAdminInventoryTable();
      showToast('Product removed');
    }
  }

  function loadAdminSettingsIntoForm() {
    const phoneInput = document.getElementById('cfg-phone');
    const waInput = document.getElementById('cfg-whatsapp');
    const pwdInput = document.getElementById('cfg-password');

    if (phoneInput) phoneInput.value = state.config.phone || '';
    if (waInput) waInput.value = state.config.whatsapp || '';
    if (pwdInput) pwdInput.value = state.config.adminPassword || 'admin123';
  }

  function handleAdminSettingsFormSubmit(e) {
    e.preventDefault();
    state.config.phone = document.getElementById('cfg-phone').value.trim();
    state.config.whatsapp = document.getElementById('cfg-whatsapp').value.trim();
    state.config.adminPassword = document.getElementById('cfg-password').value.trim();

    saveConfig();
    showToast('Settings updated successfully!');
  }

  function switchAdminSection(sectionName) {
    const secTable = document.getElementById('sec-inventory-table');
    const secForm = document.getElementById('sec-product-form');
    const secSettings = document.getElementById('sec-settings');

    const btnTable = document.getElementById('tab-btn-table');
    const btnForm = document.getElementById('tab-btn-form');
    const btnSettings = document.getElementById('tab-btn-settings');

    [secTable, secForm, secSettings].forEach((s) => s && s.classList.add('hidden'));
    [btnTable, btnForm, btnSettings].forEach((b) => {
      if (b) {
        b.classList.remove('bg-black', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-700');
      }
    });

    if (sectionName === 'form') {
      if (secForm) secForm.classList.remove('hidden');
      if (btnForm) {
        btnForm.classList.add('bg-black', 'text-white');
        btnForm.classList.remove('bg-slate-100', 'text-slate-700');
      }
    } else if (sectionName === 'settings') {
      if (secSettings) secSettings.classList.remove('hidden');
      if (btnSettings) {
        btnSettings.classList.add('bg-black', 'text-white');
        btnSettings.classList.remove('bg-slate-100', 'text-slate-700');
      }
    } else {
      if (secTable) secTable.classList.remove('hidden');
      if (btnTable) {
        btnTable.classList.add('bg-black', 'text-white');
        btnTable.classList.remove('bg-slate-100', 'text-slate-700');
      }
    }
  }

  function exportCatalogJson() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.products, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `mpc_warehouse_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  }

  function importCatalogJson(inputEl) {
    const file = inputEl.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported) && imported.length > 0) {
          state.products = imported;
          saveProducts();
          renderAdminInventoryTable();
          showToast(`Imported ${imported.length} items`);
        } else {
          alert('Invalid JSON file format.');
        }
      } catch (err) {
        alert('JSON error: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function restoreDefaultCatalog() {
    if (confirm('Restore sample warehouse catalog?')) {
      state.products = [...INITIAL_PRODUCTS];
      saveProducts();
      renderAdminInventoryTable();
      showToast('Restored initial warehouse items');
    }
  }

  // --- SIMPLE TOAST NOTIFICATION ---
  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'px-4 py-2.5 bg-black text-white text-xs font-bold rounded-xl shadow-2xl transition-all duration-300 pointer-events-auto';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }

  // --- ESCAPE HELPERS ---
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '&quot;');
  }

  // --- EXPOSE API ---
  window.app = {
    setCategory,
    resetCatalogFilters,
    changeCardSlide,
    changeDetailSlide,
    setDetailSlide,
    logoutAdmin,
    quickUpdateStock,
    handleAdminProductFormSubmit,
    startEditAdminProduct,
    resetAdminProductForm,
    deleteAdminProduct,
    switchAdminSection,
    exportCatalogJson,
    importCatalogJson,
    restoreDefaultCatalog,
  };

  document.addEventListener('DOMContentLoaded', init);
})();
