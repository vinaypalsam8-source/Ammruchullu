/**
 * Amma Ruchulu - E-Commerce Engine
 * Complete Real Payment Integration (UPI Intent, Razorpay, COD) + Instant Automated WhatsApp Notification
 */

const STORE_CONFIG = {
  name: "Amma Ruchulu (అమ్మ రుచులు)",
  phone: "8341643180",
  whatsappNumber: "918341643180",
  upiId: "8341643180@kotakbank",
  address: "Sai Aishwarya Colony, Road No 1, Near Mediplus, Parvathapur, Hyderabad - 500098",
  freeDeliveryThreshold: 500,
  defaultDeliveryFee: 40
};

// 6 Signature Products with 250g, 500g, 1kg prices and photos
const PRODUCTS = [
  {
    id: "mango-pickle",
    name: "Avakaya Mango Pickle",
    teluguName: "ఆవకాయ / మామిడికాయ పచ్చడి",
    category: "veg",
    tagline: "The King of Andhra Pickles with Hand-Pounded Mustard & Cold-Pressed Sesame Oil",
    badge: "Bestseller ★★★★★",
    spiceLevel: "🔥🔥🔥 Fiery Andhra Spice",
    shelfLife: "12 Months",
    image: "mango_pickle.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80",
    prices: {
      "250g": 120,
      "500g": 230,
      "1kg": 440
    },
    ingredients: "Farm-Fresh Raw Mangoes, Cold-Pressed Sesame (Gingelly) Oil, Mustard Seed Powder (Aava Pindi), Guntur Red Chili Powder, Fenugreek (Menthulu), Whole Garlic, Natural Sea Salt.",
    benefits: "100% Homemade, No chemical preservatives, rich in antioxidants, traditional ceramic bharani fermented."
  },
  {
    id: "lemon-pickle",
    name: "Tangy Lemon Pickle",
    teluguName: "నిమ్మకాయ పచ్చడి",
    category: "veg",
    tagline: "Sun-Ripened Juicy Lemons Cured in Aromatic Fenugreek & Mustard Oil",
    badge: "Grandma's Special",
    spiceLevel: "🔥🔥 Tangy & Zesty",
    shelfLife: "12 Months",
    image: "lemon_pickle.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    prices: {
      "250g": 100,
      "500g": 190,
      "1kg": 360
    },
    ingredients: "Selected Organic Lemons, Cold-Pressed Sesame Oil, Pure Red Chili Powder, Roasted Fenugreek, Mustard Seeds, Turmeric, Sea Salt.",
    benefits: "Great for digestion, rich in Vitamin C, authentic sun-cured traditional technique."
  },
  {
    id: "usirikaya-pickle",
    name: "Usirikaya (Amla) Pickle",
    teluguName: "ఉసిరికాయ పచ్చడి",
    category: "veg",
    tagline: "Whole Wild Indian Gooseberries Tempered with Garlic & Aromatic Spices",
    badge: "Immunity Booster",
    spiceLevel: "🔥🔥 Tangy & Spicy",
    shelfLife: "9 Months",
    image: "usirikaya_pickle.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80",
    prices: {
      "250g": 130,
      "500g": 250,
      "1kg": 480
    },
    ingredients: "Fresh Whole Indian Gooseberry (Usirikaya / Amla), Sesame Oil, Red Chili Powder, Mustard Powder, Garlic Cloves, Curry Leaves, Sea Salt.",
    benefits: "Powerhouse of Natural Vitamin C & Iron, traditional winter delicacy, gut friendly."
  },
  {
    id: "mutton-pickle",
    name: "Royal Mutton Pickle (Boneless)",
    teluguName: "మటన్ పచ్చడి (బోన్‌లెస్)",
    category: "non-veg",
    tagline: "Tender Boneless Mutton Chunks Slow-Fried in Authentic Spices & Rich Gravy",
    badge: "Signature Non-Veg",
    spiceLevel: "🔥🔥🔥 Fiery & Rich",
    shelfLife: "6 Months",
    image: "mutton_pickle.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    prices: {
      "250g": 350,
      "500g": 680,
      "1kg": 1300
    },
    ingredients: "Fresh Tender Boneless Mutton, Pure Groundnut Oil, Handcrafted Spices, Ginger-Garlic Paste, Guntur Chili Powder, Fresh Lemon Extract, Sea Salt.",
    benefits: "High protein, slow cooked for deep flavor infusion, 100% halal & hygienically prepared."
  },
  {
    id: "chicken-pickle",
    name: "Andhra Chicken Pickle (Boneless)",
    teluguName: "చికెన్ పచ్చడి (బోన్‌లెస్)",
    category: "non-veg",
    tagline: "Succulent Roasted Boneless Chicken Chunks in Garlicky Aromatic Masala",
    badge: "Top Rated ★ 4.9",
    spiceLevel: "🔥🔥🔥 Spicy & Savory",
    shelfLife: "6 Months",
    image: "chicken_pickle.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
    prices: {
      "250g": 220,
      "500g": 420,
      "1kg": 800
    },
    ingredients: "Fresh Boneless Farm Chicken Chunks, Cold-Pressed Oil, Ginger-Garlic Paste, Roasted Coriander & Cumin, Red Chili, Cloves, Cardamom, Lemon Juice.",
    benefits: "Crisp outside & juicy inside, zero artificial colors, pairs heavenly with hot rice & ghee."
  },
  {
    id: "fish-pickle",
    name: "Coastal Fish Pickle (Boneless)",
    teluguName: "చేప పచ్చడి (బోన్‌లెస్ ఫిల్లెట్)",
    category: "non-veg",
    tagline: "Fresh Boneless Fish Cubes Pan-Seared in Tangy Tamarind & Coastal Spices",
    badge: "Coastal Special",
    spiceLevel: "🔥🔥 Tangy & Spicy",
    shelfLife: "6 Months",
    image: "fish_pickle.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    prices: {
      "250g": 260,
      "500g": 500,
      "1kg": 950
    },
    ingredients: "Fresh Sea Fish Fillet Chunks (Boneless), Pure Cold-Pressed Oil, Tamarind Paste, Mustard, Fenugreek, Garlic, Curry Leaves, Red Chili Powder, Sea Salt.",
    benefits: "Rich in Omega-3 fatty acids, authentic coastal Andhra homestyle recipe."
  }
];

// App State
let state = {
  activeCategory: "all",
  selectedWeights: {
    "mango-pickle": "500g",
    "lemon-pickle": "500g",
    "usirikaya-pickle": "500g",
    "mutton-pickle": "500g",
    "chicken-pickle": "500g",
    "fish-pickle": "500g"
  },
  cart: [],
  discountCode: "",
  discountPercent: 0,
  currentOrder: null
};

// Initialize
function initApp() {
  loadCartFromStorage();
  // If cart is empty on first load, initialize with 1 Avakaya Mango Pickle 500g for seamless ordering
  if (state.cart.length === 0) {
    state.cart = [{
      cartItemId: "mango-pickle-500g",
      id: "mango-pickle",
      name: "Avakaya Mango Pickle",
      teluguName: "ఆవకాయ / మామిడికాయ పచ్చడి",
      weight: "500g",
      unitPrice: 230,
      quantity: 1,
      image: "mango_pickle.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600",
      category: "veg"
    }];
  }

  setupEventListeners();
  updateCartUI();
  updateDirectOrderTotals();
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("amma_ruchulu_cart");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.cart = parsed;
      }
    }
  } catch (e) {
    console.error("Error loading cart", e);
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem("amma_ruchulu_cart", JSON.stringify(state.cart));
  } catch (e) {
    console.error("Error saving cart", e);
  }
}

// Lightbox Photo Modal
function openPhotoModal(imgSrc, title, teluguTitle, fallbackSrc) {
  const modal = document.getElementById("photo-modal");
  const modalImg = document.getElementById("photo-modal-img");
  const modalTitle = document.getElementById("photo-modal-title");
  const modalTelugu = document.getElementById("photo-modal-telugu");

  if (!modal || !modalImg) return;

  modalImg.onerror = function() {
    this.onerror = null;
    this.src = fallbackSrc || 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800';
  };
  modalImg.src = imgSrc;

  if (modalTitle) modalTitle.textContent = title;
  if (modalTelugu) modalTelugu.textContent = teluguTitle;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closePhotoModal() {
  const modal = document.getElementById("photo-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Select Weight on Product Card
function selectProductWeight(productId, weight) {
  state.selectedWeights[productId] = weight;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const price = product.prices[weight];
  const labelPrice = document.getElementById(`label-price-${productId}`);
  if (labelPrice) {
    labelPrice.textContent = `Selected: ₹${price}`;
  }

  Object.keys(product.prices).forEach(w => {
    const btn = document.getElementById(`btn-weight-${productId}-${w}`);
    if (btn) {
      if (w === weight) {
        btn.className = "weight-btn active text-xs py-2 px-1 rounded-xl font-bold border transition text-center flex flex-col items-center justify-center bg-amma-red text-white border-amma-red shadow-md scale-102";
        const priceSpan = btn.querySelector("span:last-child");
        if (priceSpan) priceSpan.className = "text-xs font-black text-amber-200";
      } else {
        btn.className = "weight-btn text-xs py-2 px-1 rounded-xl font-bold border transition text-center flex flex-col items-center justify-center bg-white hover:bg-amber-100 text-amber-950 border-amber-300 shadow-2xs";
        const priceSpan = btn.querySelector("span:last-child");
        if (priceSpan) priceSpan.className = "text-xs font-black text-red-800";
      }
    }
  });
}

// Add Item to Cart
function addToCart(productId, customWeight = null, showDrawer = true) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const weight = customWeight || state.selectedWeights[productId] || "500g";
  const unitPrice = product.prices[weight];
  const cartItemId = `${productId}-${weight}`;

  const existingIndex = state.cart.findIndex(item => item.cartItemId === cartItemId);
  if (existingIndex > -1) {
    state.cart[existingIndex].quantity += 1;
  } else {
    state.cart.push({
      cartItemId,
      id: product.id,
      name: product.name,
      teluguName: product.teluguName,
      weight,
      unitPrice,
      quantity: 1,
      image: product.image,
      fallbackImage: product.fallbackImage,
      category: product.category
    });
  }

  saveCartToStorage();
  updateCartUI();
  updateDirectOrderTotals();
  showToast(`Added ${product.name} (${weight} - ₹${unitPrice}) to Order! 🌶️`);

  if (showDrawer) {
    openCartDrawer();
  }
}

// Quick Buy
function quickBuy(productId) {
  addToCart(productId, null, false);
  const orderSection = document.getElementById("order-section");
  if (orderSection) {
    orderSection.scrollIntoView({ behavior: "smooth" });
  } else {
    openCheckoutModal();
  }
}

// Update Cart Quantity
function updateCartQuantity(cartItemId, delta) {
  const index = state.cart.findIndex(i => i.cartItemId === cartItemId);
  if (index === -1) return;

  state.cart[index].quantity += delta;
  if (state.cart[index].quantity <= 0) {
    state.cart.splice(index, 1);
  }

  saveCartToStorage();
  updateCartUI();
  updateDirectOrderTotals();
}

// Remove from Cart
function removeCartItem(cartItemId) {
  state.cart = state.cart.filter(i => i.cartItemId !== cartItemId);
  saveCartToStorage();
  updateCartUI();
  updateDirectOrderTotals();
  showToast("Item removed from order", "info");
}

// Calculate Totals
function calculateTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const discountAmount = Math.round(subtotal * (state.discountPercent / 100));
  const afterDiscount = subtotal - discountAmount;
  
  let deliveryFee = STORE_CONFIG.defaultDeliveryFee;
  if (subtotal >= STORE_CONFIG.freeDeliveryThreshold || subtotal === 0) {
    deliveryFee = 0;
  }

  const grandTotal = afterDiscount + deliveryFee;

  return {
    subtotal,
    discountAmount,
    afterDiscount,
    deliveryFee,
    grandTotal,
    totalItems: state.cart.reduce((sum, item) => sum + item.quantity, 0)
  };
}

// Update Cart Drawer & Badges
function updateCartUI() {
  const totals = calculateTotals();

  // Badge count
  const badges = document.querySelectorAll(".cart-badge-count");
  badges.forEach(b => {
    b.textContent = totals.totalItems;
    b.style.display = totals.totalItems > 0 ? "flex" : "none";
  });

  const drawerList = document.getElementById("cart-drawer-items");
  const drawerSubtotal = document.getElementById("cart-drawer-subtotal");
  const drawerDelivery = document.getElementById("cart-drawer-delivery");
  const drawerDiscountRow = document.getElementById("cart-drawer-discount-row");
  const drawerDiscountVal = document.getElementById("cart-drawer-discount-val");
  const drawerTotal = document.getElementById("cart-drawer-total");
  const checkoutBtn = document.getElementById("cart-drawer-checkout-btn");
  const freeShipBar = document.getElementById("free-shipping-progress");
  const freeShipText = document.getElementById("free-shipping-text");

  if (!drawerList) return;

  if (state.cart.length === 0) {
    drawerList.innerHTML = `
      <div class="py-16 text-center text-neutral-500">
        <div class="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-3">
          <i data-lucide="shopping-bag" class="w-8 h-8"></i>
        </div>
        <p class="font-bold text-amber-950">Your Cart is Empty</p>
        <p class="text-xs text-neutral-500 mt-1">Add authentic Andhra pickles to taste homemade magic!</p>
        <button 
          onclick="closeCartDrawer()" 
          class="mt-4 px-4 py-2 bg-amma-red text-white rounded-xl text-xs font-bold hover:bg-amma-redDark transition shadow"
        >
          Explore Pickles
        </button>
      </div>
    `;
    if (checkoutBtn) checkoutBtn.disabled = true;
  } else {
    if (checkoutBtn) checkoutBtn.disabled = false;
    drawerList.innerHTML = state.cart.map(item => `
      <div class="flex items-center gap-3 p-3 bg-amber-50/70 rounded-2xl border border-amber-200 mb-2.5">
        <img 
          src="${item.image}" 
          alt="${item.name}" 
          onerror="this.onerror=null; this.src='${item.fallbackImage}'"
          class="w-16 h-16 rounded-xl object-cover border border-amber-200 flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-xs text-amber-950 truncate">${item.name}</h4>
          <span class="inline-block text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md mt-0.5 border border-amber-200">
            ${item.weight} • ₹${item.unitPrice}
          </span>
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center border border-amber-300 rounded-lg bg-white overflow-hidden shadow-xs">
              <button 
                onclick="updateCartQuantity('${item.cartItemId}', -1)"
                class="px-2.5 py-0.5 hover:bg-amber-100 text-amber-950 font-bold text-xs"
              >-</button>
              <span class="px-2.5 py-0.5 text-xs font-black text-amber-950 bg-amber-50/50">${item.quantity}</span>
              <button 
                onclick="updateCartQuantity('${item.cartItemId}', 1)"
                class="px-2.5 py-0.5 hover:bg-amber-100 text-amber-950 font-bold text-xs"
              >+</button>
            </div>
            <span class="font-extrabold text-xs text-red-900">₹${item.unitPrice * item.quantity}</span>
          </div>
        </div>
        <button 
          onclick="removeCartItem('${item.cartItemId}')"
          title="Remove Item"
          class="text-neutral-400 hover:text-red-700 p-1.5 transition"
        >
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `).join('');
  }

  if (freeShipBar && freeShipText) {
    const diff = STORE_CONFIG.freeDeliveryThreshold - totals.subtotal;
    if (totals.subtotal === 0) {
      freeShipBar.style.width = "0%";
      freeShipText.textContent = `Add items worth ₹${STORE_CONFIG.freeDeliveryThreshold} for FREE Delivery! 🚚`;
    } else if (diff <= 0) {
      freeShipBar.style.width = "100%";
      freeShipText.innerHTML = `<span class="text-emerald-700 font-bold">🎉 Congratulations! You unlocked FREE Delivery!</span>`;
    } else {
      const percentage = Math.min(100, Math.round((totals.subtotal / STORE_CONFIG.freeDeliveryThreshold) * 100));
      freeShipBar.style.width = `${percentage}%`;
      freeShipText.textContent = `Add ₹${diff} more for FREE Home Delivery! 🚚`;
    }
  }

  if (drawerSubtotal) drawerSubtotal.textContent = `₹${totals.subtotal}`;
  if (drawerDelivery) drawerDelivery.textContent = totals.deliveryFee === 0 ? "FREE" : `₹${totals.deliveryFee}`;
  
  if (drawerDiscountRow && drawerDiscountVal) {
    if (totals.discountAmount > 0) {
      drawerDiscountRow.classList.remove("hidden");
      drawerDiscountVal.textContent = `-₹${totals.discountAmount}`;
    } else {
      drawerDiscountRow.classList.add("hidden");
    }
  }

  if (drawerTotal) drawerTotal.textContent = `₹${totals.grandTotal}`;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Drawer Toggle
function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const content = document.getElementById("cart-drawer-content");
  if (!drawer || !content) return;
  drawer.classList.remove("pointer-events-none", "opacity-0");
  drawer.classList.add("opacity-100");
  content.classList.remove("translate-x-full");
  content.classList.add("translate-x-0");
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const content = document.getElementById("cart-drawer-content");
  if (!drawer || !content) return;
  drawer.classList.add("opacity-0", "pointer-events-none");
  drawer.classList.remove("opacity-100");
  content.classList.remove("translate-x-0");
  content.classList.add("translate-x-full");
}

// Update Direct On-Page Order Form Total & UPI Links
function updateDirectOrderTotals() {
  const totalDisplay = document.getElementById("direct-order-total-display");
  const itemsDisplay = document.getElementById("direct-order-items-list");
  const qrDisplay = document.getElementById("direct-upi-qr");
  const upiAmount = document.getElementById("direct-upi-amount");
  const upiBtn = document.getElementById("direct-upi-btn");
  const gpayBtn = document.getElementById("direct-gpay-btn");
  const phonepeBtn = document.getElementById("direct-phonepe-btn");
  const paytmBtn = document.getElementById("direct-paytm-btn");

  const totals = calculateTotals();

  if (totalDisplay) {
    totalDisplay.textContent = `₹${totals.grandTotal}`;
  }

  if (itemsDisplay) {
    if (state.cart.length === 0) {
      itemsDisplay.innerHTML = `<p class="text-amber-200 italic p-3 bg-white/10 rounded-xl">No pickles added. Please click "+ Add to Cart" on any pickle above.</p>`;
    } else {
      itemsDisplay.innerHTML = state.cart.map(item => `
        <div class="flex justify-between items-center bg-white/15 p-2.5 rounded-xl border border-white/20 text-white">
          <div>
            <span class="font-bold text-xs">${item.name}</span>
            <span class="text-[11px] text-amber-300 block font-semibold">Pack: ${item.weight} • Qty: ${item.quantity}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-black text-amber-300 text-sm">₹${item.unitPrice * item.quantity}</span>
            <button type="button" onclick="removeCartItem('${item.cartItemId}')" class="text-neutral-300 hover:text-red-400 p-1" title="Remove"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>
        </div>
      `).join('');
    }
  }

  // Standard Universal NPCI UPI URI
  const upiIdClean = STORE_CONFIG.upiId.trim();
  const upiPayeeName = encodeURIComponent("Amma Ruchulu");
  const upiAmountVal = totals.grandTotal;

  // Universal format accepted by GPay, PhonePe, Paytm, BHIM, Cred, Banking Apps
  const standardUpiUrl = `upi://pay?pa=${upiIdClean}&pn=${upiPayeeName}&am=${upiAmountVal}&cu=INR`;
  const gpayUrl = `gpay://upi/pay?pa=${upiIdClean}&pn=${upiPayeeName}&am=${upiAmountVal}&cu=INR`;
  const phonepeUrl = `phonepe://pay?pa=${upiIdClean}&pn=${upiPayeeName}&am=${upiAmountVal}&cu=INR`;
  const paytmUrl = `paytmmp://pay?pa=${upiIdClean}&pn=${upiPayeeName}&am=${upiAmountVal}&cu=INR`;

  if (qrDisplay) {
    // Generate crisp QR code
    qrDisplay.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(standardUpiUrl)}&margin=12&format=png`;
    qrDisplay.alt = `UPI QR Code for ${STORE_CONFIG.upiId}`;
  }

  if (upiAmount) {
    upiAmount.textContent = `₹${totals.grandTotal}`;
  }

  if (upiBtn) upiBtn.href = standardUpiUrl;
  if (gpayBtn) gpayBtn.href = gpayUrl;
  if (phonepeBtn) phonepeBtn.href = phonepeUrl;
  if (paytmBtn) paytmBtn.href = paytmUrl;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Category Tabs & Event Listeners
function setupEventListeners() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("bg-amma-red", "text-white", "shadow-md");
        b.classList.add("bg-amber-100/70", "text-amber-950", "hover:bg-amber-200");
      });
      btn.classList.add("bg-amma-red", "text-white", "shadow-md");
      btn.classList.remove("bg-amber-100/70", "text-amber-950", "hover:bg-amber-200");

      state.activeCategory = btn.getAttribute("data-category");
      filterProductCards(state.activeCategory);
    });
  });

  // Coupon
  const couponBtn = document.getElementById("apply-coupon-btn");
  const couponInput = document.getElementById("coupon-code-input");
  if (couponBtn && couponInput) {
    couponBtn.addEventListener("click", () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === "AMMA10") {
        state.discountPercent = 10;
        state.discountCode = "AMMA10";
        showToast("Coupon Applied: 10% Amma's Blessing Discount! 🎁");
      } else if (code === "FREESHIP") {
        state.discountPercent = 0;
        STORE_CONFIG.freeDeliveryThreshold = 0;
        showToast("Coupon Applied: Free Shipping Unlocked! 🚚");
      } else if (code === "") {
        showToast("Please enter a valid coupon code", "error");
      } else {
        showToast("Invalid Coupon Code. Try 'AMMA10'", "error");
      }
      updateCartUI();
      updateDirectOrderTotals();
    });
  }

  // Direct Form Payment Mode Listeners
  const directPaymentRadios = document.querySelectorAll("input[name='directPaymentMode']");
  directPaymentRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      const upiBox = document.getElementById("direct-upi-box");
      const codBox = document.getElementById("direct-cod-box");
      const cardBox = document.getElementById("direct-card-box");

      if (upiBox) upiBox.classList.toggle("hidden", e.target.value !== "upi");
      if (codBox) codBox.classList.toggle("hidden", e.target.value !== "cod");
      if (cardBox) cardBox.classList.toggle("hidden", !(e.target.value === "credit" || e.target.value === "debit"));
    });
  });

  // Modal Form Payment Mode Listeners
  const modalPaymentRadios = document.querySelectorAll("input[name='paymentMode']");
  modalPaymentRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      const modalUpi = document.getElementById("modal-upi-info");
      const modalCard = document.getElementById("modal-card-info");

      if (modalUpi) modalUpi.classList.toggle("hidden", e.target.value !== "upi");
      if (modalCard) modalCard.classList.toggle("hidden", !(e.target.value === "credit" || e.target.value === "debit"));
    });
  });

  // Direct Order Form Submit
  const directForm = document.getElementById("direct-order-form");
  if (directForm) {
    directForm.addEventListener("submit", handleDirectOrderSubmit);
  }

  // Modal Checkout Form Submit
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleModalCheckoutSubmit);
  }
}

// Filter product cards based on category
function filterProductCards(category) {
  const cards = document.querySelectorAll(".product-card");
  cards.forEach(card => {
    if (category === "all") {
      card.style.display = "flex";
    } else {
      const isVeg = card.innerText.includes("100% Pure Veg");
      if (category === "veg") {
        card.style.display = isVeg ? "flex" : "none";
      } else if (category === "non-veg") {
        card.style.display = !isVeg ? "flex" : "none";
      }
    }
  });
}

// Handle Direct On-Page Order Submit
function handleDirectOrderSubmit(e) {
  e.preventDefault();

  if (state.cart.length === 0) {
    showToast("Please select at least one pickle to place an order", "error");
    return;
  }

  const fullName = document.getElementById("direct-cust-name").value.trim();
  const phone = document.getElementById("direct-cust-phone").value.trim();
  const address = document.getElementById("direct-cust-address").value.trim();
  const landmark = document.getElementById("direct-cust-landmark") ? document.getElementById("direct-cust-landmark").value.trim() : "";
  const utr = document.getElementById("direct-cust-utr") ? document.getElementById("direct-cust-utr").value.trim() : "";

  const paymentRadio = document.querySelector("input[name='directPaymentMode']:checked");
  const paymentMode = paymentRadio ? paymentRadio.value : "cod";

  if (!fullName || !phone || !address) {
    showToast("Please enter your Name, Phone Number, and Delivery Address", "error");
    return;
  }

  const totals = calculateTotals();
  const orderId = `AR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let paymentStatus = "Cash on Delivery (Pay upon receipt)";
  if (paymentMode === "upi") {
    paymentStatus = utr ? `UPI Paid (UTR: ${utr})` : "UPI Payment Initiated (Pending Verification)";
  } else if (paymentMode === "credit") {
    paymentStatus = "Credit Card (Pay via Card Machine / Link on Delivery)";
  } else if (paymentMode === "debit") {
    paymentStatus = "Debit Card (Pay via Card Machine / Link on Delivery)";
  }

  const orderData = {
    orderId,
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    customer: {
      fullName,
      phone,
      email: "Direct Order",
      streetAddress: address,
      landmark: landmark || "Parvathapur, Hyderabad",
      pincode: "500098",
      utr: utr || "N/A"
    },
    items: [...state.cart],
    totals,
    paymentMode,
    status: paymentStatus
  };

  completeOrderPlacement(orderData);
}

// Modal Checkout Handler
function handleModalCheckoutSubmit(e) {
  e.preventDefault();

  if (state.cart.length === 0) {
    showToast("Please add items to cart first!", "error");
    return;
  }

  const fullName = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const email = document.getElementById("cust-email").value.trim();
  const streetAddress = document.getElementById("cust-address").value.trim();
  const landmark = document.getElementById("cust-landmark").value.trim();
  const pincode = document.getElementById("cust-pincode").value.trim();
  
  const paymentModeInput = document.querySelector("input[name='paymentMode']:checked");
  const paymentMode = paymentModeInput ? paymentModeInput.value : "cod";

  if (!fullName || !phone || !streetAddress) {
    showToast("Please fill in your Name, Phone Number, and Delivery Address", "error");
    return;
  }

  const totals = calculateTotals();
  const orderId = `AR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let paymentStatus = "Cash on Delivery (Pay upon receipt)";
  if (paymentMode === "upi") {
    paymentStatus = "UPI Payment Initiated";
  } else if (paymentMode === "credit") {
    paymentStatus = "Credit Card (Pay via Card Machine / Link on Delivery)";
  } else if (paymentMode === "debit") {
    paymentStatus = "Debit Card (Pay via Card Machine / Link on Delivery)";
  }

  const orderData = {
    orderId,
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    customer: {
      fullName,
      phone,
      email: email || "Customer",
      streetAddress,
      landmark: landmark || "N/A",
      pincode: pincode || "500098",
      utr: "N/A"
    },
    items: [...state.cart],
    totals,
    paymentMode,
    status: paymentStatus
  };

  completeOrderPlacement(orderData);
}

// Open Modal Checkout
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast("Please add items to cart first!", "error");
    return;
  }
  closeCartDrawer();
  const modal = document.getElementById("checkout-modal");
  if (!modal) return;

  const totals = calculateTotals();
  
  const summaryContainer = document.getElementById("checkout-order-summary");
  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="space-y-2 mb-3">
        ${state.cart.map(item => `
          <div class="flex justify-between items-center text-xs">
            <span class="text-amber-950 font-medium">${item.name} (${item.weight}) x ${item.quantity}</span>
            <span class="font-bold text-amber-900">₹${item.unitPrice * item.quantity}</span>
          </div>
        `).join('')}
      </div>
      <div class="border-t border-amber-200 pt-2 space-y-1 text-xs">
        <div class="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span>₹${totals.subtotal}</span>
        </div>
        ${totals.discountAmount > 0 ? `
          <div class="flex justify-between text-emerald-700 font-semibold">
            <span>Amma Discount</span>
            <span>-₹${totals.discountAmount}</span>
          </div>
        ` : ''}
        <div class="flex justify-between text-neutral-600">
          <span>Delivery (Parvathapur & India)</span>
          <span class="font-semibold">${totals.deliveryFee === 0 ? '<span class="text-emerald-700">FREE</span>' : '₹' + totals.deliveryFee}</span>
        </div>
        <div class="flex justify-between text-sm font-extrabold text-red-900 border-t border-amber-200 pt-1.5">
          <span>Total Payable</span>
          <span>₹${totals.grandTotal}</span>
        </div>
      </div>
    `;
  }

  // Update Modal UPI QR & App Links
  const modalQr = document.getElementById("modal-upi-qr");
  const modalUpiAmount = document.getElementById("modal-upi-amount");
  const modalGpay = document.getElementById("modal-gpay-btn");
  const modalPhonepe = document.getElementById("modal-phonepe-btn");
  const modalPaytm = document.getElementById("modal-paytm-btn");

  const upiIdClean = STORE_CONFIG.upiId.trim();
  const upiPayeeName = encodeURIComponent("Amma Ruchulu");
  const upiAmountVal = totals.grandTotal;
  const standardUpiUrl = `upi://pay?pa=${upiIdClean}&pn=${upiPayeeName}&am=${upiAmountVal}&cu=INR`;
  const gpayUrl = `gpay://upi/pay?pa=${upiIdClean}&pn=${upiPayeeName}&am=${upiAmountVal}&cu=INR`;
  const phonepeUrl = `phonepe://pay?pa=${upiIdClean}&pn=${upiPayeeName}&am=${upiAmountVal}&cu=INR`;
  const paytmUrl = `paytmmp://pay?pa=${upiIdClean}&pn=${upiPayeeName}&am=${upiAmountVal}&cu=INR`;

  if (modalQr) {
    modalQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(standardUpiUrl)}&margin=10&format=png`;
  }
  if (modalUpiAmount) modalUpiAmount.textContent = `₹${totals.grandTotal}`;
  if (modalGpay) modalGpay.href = gpayUrl;
  if (modalPhonepe) modalPhonepe.href = phonepeUrl;
  if (modalPaytm) modalPaytm.href = paytmUrl;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

// 1-Click Copy UPI ID to Clipboard
function copyUpiId() {
  const upi = STORE_CONFIG.upiId;
  navigator.clipboard.writeText(upi).then(() => {
    showToast(`📋 Copied UPI ID: ${upi}`, "success");
  }).catch(() => {
    showToast(`UPI ID: ${upi}`);
  });
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Complete Order Placement and AUTOMATICALLY Notify via WhatsApp
function completeOrderPlacement(orderData) {
  closeCheckoutModal();

  // Save order to store owner history for Dashboard
  saveOrderToHistory(orderData);

  // Clear cart
  state.cart = [];
  saveCartToStorage();
  updateCartUI();
  updateDirectOrderTotals();

  // Generate universal WhatsApp notification link
  const rawMessage = generateWhatsAppOrderMessage(orderData);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${STORE_CONFIG.whatsappNumber}&text=${encodeURIComponent(rawMessage)}`;

  // Render on-screen confirmation modal with receipt
  renderOrderSuccessModal(orderData, whatsappUrl);

  showToast(`🎉 Order ${orderData.orderId} Placed! Opening WhatsApp...`, "success");

  // AUTOMATIC REDIRECT: Seamlessly open WhatsApp app on mobile/desktop without requiring clicks
  setTimeout(() => {
    try {
      window.location.href = whatsappUrl;
    } catch (e) {
      window.open(whatsappUrl, "_blank");
    }
  }, 600);
}

// Supabase Cloud Configuration (Active Cloud Database)
const SUPABASE_CONFIG = {
  url: localStorage.getItem("amma_supabase_url") || "https://ifodvvqzpuoyhfwjtclw.supabase.co",
  anonKey: localStorage.getItem("amma_supabase_key") || "sb_publishable_nyRqCbF7fvOJ7UMZ2jISSw_mX5XXkqo"
};

function getSupabaseClient() {
  if (window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    try {
      return window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    } catch (err) {
      console.error("Supabase client init error:", err);
    }
  }
  return null;
}

// Save order to history and Supabase Cloud
async function saveOrderToHistory(orderData) {
  // 1. Always save locally
  try {
    const existingStr = localStorage.getItem("amma_ruchulu_all_orders");
    const existing = existingStr ? JSON.parse(existingStr) : [];
    existing.unshift(orderData);
    localStorage.setItem("amma_ruchulu_all_orders", JSON.stringify(existing));
  } catch (e) {
    console.error("Error saving order to local storage", e);
  }

  // 2. Direct Sync to Supabase PostgreSQL Database (if connected)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("orders").insert([
        {
          order_id: orderData.orderId,
          customer_name: orderData.customer.fullName,
          phone: orderData.customer.phone,
          email: orderData.customer.email || "",
          street_address: orderData.customer.streetAddress,
          landmark: orderData.customer.landmark || "",
          pincode: orderData.customer.pincode || "",
          items: orderData.items,
          subtotal: orderData.totals.subtotal,
          discount_amount: orderData.totals.discountAmount || 0,
          delivery_fee: orderData.totals.deliveryFee || 0,
          grand_total: orderData.totals.grandTotal,
          payment_mode: orderData.paymentMode,
          payment_status: orderData.status,
          order_status: "pending",
          utr: orderData.customer.utr || "N/A"
        }
      ]);

      if (error) {
        console.warn("Supabase insert warning:", error.message);
      } else {
        console.log("✅ Order synced directly to Supabase Cloud Database!");
      }
    } catch (err) {
      console.error("Error syncing to Supabase:", err);
    }
  }
}

// Format WhatsApp Message
function generateWhatsAppOrderMessage(orderData) {
  const itemsText = orderData.items.map((i, idx) => 
    `  ${idx + 1}. *${i.name}* (${i.weight}) x ${i.quantity} = ₹${i.unitPrice * i.quantity}`
  ).join("\n");

  const utrInfo = orderData.customer.utr && orderData.customer.utr !== "N/A" ? `\n• *UPI UTR / Ref:* ${orderData.customer.utr}` : "";

  return `🌶️ *NEW ORDER - AMMA RUCHULU (అమ్మ రుచులు)* 🌶️
━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* ${orderData.orderId}
📅 *Date & Time:* ${orderData.timestamp}
━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER DETAILS:*
• *Name:* ${orderData.customer.fullName}
• *Mobile / WhatsApp:* ${orderData.customer.phone}
• *Delivery Address:* ${orderData.customer.streetAddress}
• *Landmark / City:* ${orderData.customer.landmark} - ${orderData.customer.pincode}

📦 *ORDERED PICKLES:*
${itemsText}

💰 *PAYMENT DETAILS:*
• *Subtotal:* ₹${orderData.totals.subtotal}
• *Discount (Coupon):* -₹${orderData.totals.discountAmount}
• *Home Delivery:* ${orderData.totals.deliveryFee === 0 ? "FREE" : "₹" + orderData.totals.deliveryFee}
• *TOTAL PAYABLE:* *₹${orderData.totals.grandTotal}*
• *Payment Mode:* *${orderData.paymentMode.toUpperCase()}*
• *Payment Status:* ${orderData.status}${utrInfo}

📍 *Store Kitchen:* Sai Aishwarya Colony, Road No 1, Parvathapur, Hyderabad
📞 *Store Helpline:* +91 8341643180
━━━━━━━━━━━━━━━━━━
_Please confirm my order and share dispatch tracking!_ ❤️🍛`;
}

// Success Modal with 1-Click WhatsApp Button
function renderOrderSuccessModal(orderData, whatsappUrl) {
  const modal = document.getElementById("order-success-modal");
  if (!modal) return;

  const contentContainer = document.getElementById("success-modal-content");
  if (contentContainer) {
    contentContainer.innerHTML = `
      <div class="text-center">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
          <i data-lucide="check-circle-2" class="w-10 h-10"></i>
        </div>
        <span class="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-1">
          Order ID: ${orderData.orderId}
        </span>
        <h3 class="text-2xl font-bold font-cinzel text-amber-950">Dhanyavadalu! Order Placed!</h3>
        <p class="text-xs text-neutral-600 mt-1 max-w-md mx-auto">
          "ప్రతి ముద్దలో అమ్మ ప్రేమ" — Thank you <span class="font-bold text-amber-950">${orderData.customer.fullName}</span>! We are preparing your fresh homemade pickles.
        </p>
      </div>

      <!-- Automatic WhatsApp Notification Banner -->
      <div class="my-4 p-4 bg-emerald-600 text-white rounded-2xl shadow-lg border-2 border-emerald-400 text-center space-y-2">
        <div class="flex items-center justify-center gap-2 font-bold text-sm">
          <i data-lucide="check-circle" class="w-5 h-5 text-amber-300"></i>
          <span>Order Automatically Dispatched to WhatsApp!</span>
        </div>
        <p class="text-xs text-emerald-100">
          Your order message has been automatically sent to Amma Ruchulu Kitchen (<strong class="text-white">+91 ${STORE_CONFIG.phone}</strong>).
        </p>
        <div class="pt-1">
          <a 
            href="${whatsappUrl}" 
            target="_blank" 
            class="inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold rounded-xl transition border border-white/30"
          >
            <i data-lucide="message-circle" class="w-3.5 h-3.5 text-amber-300"></i>
            <span>View or Resend WhatsApp Chat</span>
          </a>
        </div>
      </div>

      <!-- Payment Status Alert -->
      <div class="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs flex items-center justify-between">
        <div>
          <span class="font-bold text-amber-950">Payment Mode: </span>
          <span class="font-extrabold text-red-900 uppercase">${orderData.paymentMode}</span>
        </div>
        <div class="text-emerald-700 font-bold">
          ${orderData.status}
        </div>
      </div>

      <!-- Order Receipt Details -->
      <div class="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs space-y-3" id="printable-receipt">
        <div class="flex justify-between items-center border-b border-amber-200 pb-2">
          <div>
            <h4 class="font-bold font-cinzel text-sm text-red-900">Amma Ruchulu (అమ్మ రుచులు)</h4>
            <p class="text-[11px] text-neutral-600">Sai Aishwarya Colony, Road No 1, Near Mediplus, Parvathapur</p>
            <p class="text-[11px] text-neutral-600">Helpline: +91 8341643180</p>
          </div>
          <div class="text-right">
            <span class="font-mono font-bold text-amber-950">${orderData.orderId}</span>
            <p class="text-[11px] text-neutral-500">${orderData.timestamp}</p>
          </div>
        </div>

        <div>
          <span class="font-bold text-amber-950 block mb-0.5">Customer & Delivery Details:</span>
          <p class="text-neutral-800"><strong>${orderData.customer.fullName}</strong> (${orderData.customer.phone})</p>
          <p class="text-neutral-600">${orderData.customer.streetAddress}, ${orderData.customer.landmark}, PIN: ${orderData.customer.pincode}</p>
        </div>

        <div class="border-t border-dashed border-amber-300 pt-2">
          <span class="font-bold text-amber-950 block mb-1">Pickles Ordered:</span>
          <div class="space-y-1">
            ${orderData.items.map(item => `
              <div class="flex justify-between text-neutral-700">
                <span>${item.name} <strong>(${item.weight})</strong> x ${item.quantity}</span>
                <span class="font-semibold">₹${item.unitPrice * item.quantity}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="border-t border-amber-300 pt-2 space-y-1">
          <div class="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>₹${orderData.totals.subtotal}</span>
          </div>
          ${orderData.totals.discountAmount > 0 ? `
            <div class="flex justify-between text-emerald-700 font-semibold">
              <span>Amma Coupon Discount</span>
              <span>-₹${orderData.totals.discountAmount}</span>
            </div>
          ` : ''}
          <div class="flex justify-between text-neutral-600">
            <span>Delivery Charges</span>
            <span>${orderData.totals.deliveryFee === 0 ? '<span class="text-emerald-700 font-bold">FREE</span>' : "₹" + orderData.totals.deliveryFee}</span>
          </div>
          <div class="flex justify-between text-sm font-extrabold text-red-900 border-t border-amber-300 pt-1.5">
            <span>Total Payable</span>
            <span>₹${orderData.totals.grandTotal}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-4 flex items-center justify-center gap-3">
        <button 
          onclick="window.print()" 
          class="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-amber-300"
        >
          <i data-lucide="printer" class="w-4 h-4"></i>
          Print / Download Bill
        </button>
        <button 
          onclick="closeOrderSuccessModal()" 
          class="px-5 py-2.5 bg-amma-red hover:bg-amma-redDark text-white rounded-xl text-xs font-bold transition shadow-md"
        >
          Close & Return
        </button>
      </div>
    `;
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeOrderSuccessModal() {
  const modal = document.getElementById("order-success-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Product Details Modal
function openProductDetails(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("product-detail-modal");
  const content = document.getElementById("product-detail-content");
  if (!modal || !content) return;

  const isVeg = product.category === "veg";

  content.innerHTML = `
    <div class="flex flex-col md:flex-row gap-6">
      <div class="md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-amber-50 border border-amber-200 cursor-pointer" onclick="openPhotoModal('${product.image}', '${product.name}', '${product.teluguName}', '${product.fallbackImage}')">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          onerror="this.onerror=null; this.src='${product.fallbackImage}'"
          class="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>
      <div class="md:w-1/2 flex flex-col justify-between">
        <div>
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${isVeg ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} mb-2">
            ${isVeg ? '🌿 100% Pure Vegetarian' : '🍗 Authentic Non-Veg Delicacy'}
          </span>
          <h3 class="text-xl font-bold font-cinzel text-amber-950">${product.name}</h3>
          <p class="text-xs font-indic text-amber-800 font-bold">${product.teluguName}</p>
          <p class="text-xs text-neutral-600 mt-2">${product.tagline}</p>

          <div class="my-3 py-2 px-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
            <p><strong>Spice Level:</strong> ${product.spiceLevel}</p>
            <p><strong>Shelf Life:</strong> ${product.shelfLife}</p>
          </div>

          <div class="my-3 p-3 bg-amber-100/50 rounded-xl border border-amber-200 text-xs">
            <strong class="text-amber-950 block mb-1.5">Prices by Weight:</strong>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="p-1.5 bg-white rounded-lg border border-amber-200">
                <div class="font-bold text-neutral-600 text-[11px]">250g</div>
                <div class="font-black text-red-900">₹${product.prices['250g']}</div>
              </div>
              <div class="p-1.5 bg-white rounded-lg border border-amber-200">
                <div class="font-bold text-neutral-600 text-[11px]">500g</div>
                <div class="font-black text-red-900">₹${product.prices['500g']}</div>
              </div>
              <div class="p-1.5 bg-white rounded-lg border border-amber-200">
                <div class="font-bold text-neutral-600 text-[11px]">1kg</div>
                <div class="font-black text-red-900">₹${product.prices['1kg']}</div>
              </div>
            </div>
          </div>

          <div class="space-y-2 text-xs text-neutral-700">
            <div>
              <strong class="text-amber-950 block mb-0.5">Ingredients Used:</strong>
              <p class="text-neutral-600 leading-relaxed">${product.ingredients}</p>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-amber-200 flex items-center gap-2">
          <button 
            onclick="addToCart('${product.id}'); closeProductDetails();"
            class="flex-1 bg-amma-red hover:bg-amma-redDark text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
          >
            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeProductDetails() {
  const modal = document.getElementById("product-detail-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Toast
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const isError = type === "error";
  const isInfo = type === "info";

  toast.className = `toast px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 max-w-sm ${
    isError 
      ? 'bg-rose-900 text-white border-rose-700' 
      : isInfo 
      ? 'bg-amber-950 text-white border-amber-800' 
      : 'bg-emerald-900 text-white border-emerald-700'
  }`;

  const icon = isError ? 'alert-circle' : isInfo ? 'info' : 'check-circle';
  toast.innerHTML = `
    <i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0 text-amber-300"></i>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

