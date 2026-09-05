/**
 * Amma Ruchulu - Store Owner Admin Dashboard Engine
 * Real-time Order Tracking, Status Updates, Revenue Analytics, and WhatsApp Dispatch
 */

let dashboardState = {
  orders: [],
  currentFilter: "all",
  searchQuery: ""
};

// Zero initial orders - Fresh clean store start
const INITIAL_SEED_ORDERS = [];

// Reset all orders to 0 (Clear Supabase Cloud & LocalStorage)
async function resetOrdersToZero() {
  if (!confirm("⚠️ Are you sure you want to reset and delete ALL orders? Dashboard will start with ZERO orders.")) {
    return;
  }

  // 1. Clear LocalStorage
  localStorage.removeItem("amma_ruchulu_all_orders");
  dashboardState.orders = [];
  renderDashboard();

  // 2. Clear Supabase Cloud Table
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient.from("orders").delete().gt("id", 0);
      if (error) {
        console.warn("Supabase clear error:", error.message);
      } else {
        console.log("✅ Supabase orders table cleared to 0");
      }
    } catch (err) {
      console.error("Error clearing Supabase:", err);
    }
  }

  showDashboardToast("✅ All orders cleared! Dashboard reset to 0 orders.", "success");
}

// Supabase Cloud Configuration
let supabaseClient = null;

function getSupabaseConfig() {
  return {
    url: localStorage.getItem("amma_supabase_url") || "https://ifodvvqzpuoyhfwjtclw.supabase.co",
    anonKey: localStorage.getItem("amma_supabase_key") || "sb_publishable_nyRqCbF7fvOJ7UMZ2jISSw_mX5XXkqo"
  };
}

function initSupabase() {
  const config = getSupabaseConfig();
  if (window.supabase && config.url && config.anonKey) {
    try {
      supabaseClient = window.supabase.createClient(config.url, config.anonKey);
      updateSupabaseStatusBadge(true);
      setupSupabaseRealtime();
      return supabaseClient;
    } catch (err) {
      console.error("Supabase init error:", err);
      updateSupabaseStatusBadge(false);
    }
  } else {
    updateSupabaseStatusBadge(false);
  }
  return null;
}

function updateSupabaseStatusBadge(isConnected) {
  const btn = document.getElementById("supabase-status-btn");
  const text = document.getElementById("supabase-status-text");
  if (!btn || !text) return;

  if (isConnected) {
    btn.className = "px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition border border-emerald-500 shadow-md";
    text.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span> ⚡ Supabase: Cloud Connected';
  } else {
    btn.className = "px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition border border-amber-500/40 shadow-sm";
    text.innerHTML = '⚡ Connect Supabase';
  }
}

// Real-time Cloud Subscriptions with Sound & Visual Notifications
function setupSupabaseRealtime() {
  if (!supabaseClient) return;

  try {
    supabaseClient
      .channel("public:orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, payload => {
        console.log("⚡ NEW ORDER received via Real-time:", payload);
        loadOrders();
        
        const newOrder = payload.new;
        const customerName = newOrder.customer_name || "New Customer";
        const total = newOrder.grand_total || 0;
        const orderId = newOrder.order_id || "New Order";

        // 1. Play notification sound
        playOrderSound();

        // 2. Show big popup notification banner on dashboard
        showNewOrderBanner(orderId, customerName, total, newOrder);

        // 3. Blink the browser tab title
        blinkTabTitle(`🔔 NEW ORDER — ${orderId}`);

        // 4. Browser push notification (if allowed)
        if (Notification.permission === "granted") {
          new Notification("🔔 New Pickle Order!", {
            body: `${customerName} ordered ₹${total} worth of pickles!\nOrder ID: ${orderId}`,
            icon: "mango_pickle.jpg"
          });
        }

        showDashboardToast(`🔔 NEW ORDER from ${customerName} — ₹${total}!`);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, payload => {
        console.log("⚡ Order UPDATED:", payload);
        loadOrders();
        showDashboardToast("⚡ Order status updated!");
      })
      .subscribe();

    // Request browser notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

  } catch (err) {
    console.error("Realtime subscription error:", err);
  }
}

// Play notification sound when new order arrives
function playOrderSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // Play 3 ascending beeps
    [0, 200, 400].forEach((delay, i) => {
      setTimeout(() => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 600 + (i * 200); // ascending pitch
        oscillator.type = "sine";
        gainNode.gain.value = 0.3;
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.15);
      }, delay);
    });
  } catch (e) {
    console.log("Audio not available:", e);
  }
}

// Blink browser tab title for attention
function blinkTabTitle(newTitle) {
  const originalTitle = document.title;
  let isOriginal = true;
  const blinkInterval = setInterval(() => {
    document.title = isOriginal ? newTitle : originalTitle;
    isOriginal = !isOriginal;
  }, 800);
  // Stop blinking after 15 seconds
  setTimeout(() => {
    clearInterval(blinkInterval);
    document.title = originalTitle;
  }, 15000);
}

// Show big animated notification banner on dashboard
function showNewOrderBanner(orderId, customerName, total, orderRow) {
  const existingBanner = document.getElementById("new-order-banner");
  if (existingBanner) existingBanner.remove();

  const itemsText = Array.isArray(orderRow.items) 
    ? orderRow.items.map(i => `${i.name} (${i.weight}) x${i.quantity}`).join(", ")
    : "Pickle order";

  const banner = document.createElement("div");
  banner.id = "new-order-banner";
  banner.className = "fixed top-4 left-1/2 -translate-x-1/2 z-[9999] max-w-lg w-full mx-4";
  banner.innerHTML = `
    <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl shadow-2xl p-5 border-2 border-emerald-300 animate-pulse">
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">🔔</span>
            <span class="font-extrabold text-lg">NEW ORDER!</span>
          </div>
          <div class="space-y-1 text-sm">
            <p><strong>🆔</strong> ${orderId}</p>
            <p><strong>👤</strong> ${customerName}</p>
            <p><strong>📦</strong> ${itemsText}</p>
            <p><strong>💰</strong> ₹${total}</p>
            <p><strong>💳</strong> ${orderRow.payment_mode || "COD"}</p>
            <p><strong>📍</strong> ${orderRow.street_address || "Hyderabad"}</p>
          </div>
        </div>
        <button onclick="document.getElementById('new-order-banner').remove()" class="p-2 hover:bg-white/20 rounded-xl transition text-white/80 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Auto-dismiss after 30 seconds
  setTimeout(() => {
    const b = document.getElementById("new-order-banner");
    if (b) b.remove();
  }, 30000);
}

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  initSupabase();
  loadOrders();
  renderDashboard();
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Load Orders from Supabase Cloud (or LocalStorage fallback)
async function loadOrders() {
  const config = getSupabaseConfig();
  
  if (supabaseClient && config.url && config.anonKey) {
    try {
      const { data, error } = await supabaseClient
        .from("orders")
        .select("*")
        .order("id", { ascending: false });

      if (!error && Array.isArray(data)) {
        dashboardState.orders = data.map(row => ({
          orderId: row.order_id,
          timestamp: row.timestamp ? new Date(row.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "Recently",
          orderStatus: row.order_status || "pending",
          customer: {
            fullName: row.customer_name,
            phone: row.phone,
            email: row.email,
            streetAddress: row.street_address,
            landmark: row.landmark,
            pincode: row.pincode,
            utr: row.utr || "N/A"
          },
          items: Array.isArray(row.items) ? row.items : [],
          totals: {
            subtotal: Number(row.subtotal) || 0,
            discountAmount: Number(row.discount_amount) || 0,
            deliveryFee: Number(row.delivery_fee) || 0,
            grandTotal: Number(row.grand_total) || 0
          },
          paymentMode: row.payment_mode || "cod",
          status: row.payment_status || "Order Received"
        }));

        saveOrdersToStorage();
        renderDashboard();
        return;
      } else {
        console.warn("Supabase fetch warning:", error?.message);
      }
    } catch (e) {
      console.error("Error fetching from Supabase:", e);
    }
  }

  // Fallback to LocalStorage
  try {
    const raw = localStorage.getItem("amma_ruchulu_all_orders");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        dashboardState.orders = parsed.map(order => ({
          ...order,
          orderStatus: order.orderStatus || (order.status && order.status.toLowerCase().includes("delivered") ? "completed" : "pending")
        }));
        renderDashboard();
        return;
      }
    }
  } catch (e) {
    console.error("Error reading orders from localStorage", e);
  }

  // Seed default sample orders for immediate demonstration
  dashboardState.orders = [...INITIAL_SEED_ORDERS];
  saveOrdersToStorage();
  renderDashboard();
}

function saveOrdersToStorage() {
  try {
    localStorage.setItem("amma_ruchulu_all_orders", JSON.stringify(dashboardState.orders));
  } catch (e) {
    console.error("Error saving orders", e);
  }
}

// Add sample orders manually
function seedSampleOrders() {
  const newOrder = {
    orderId: `AR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    orderStatus: "pending",
    customer: {
      fullName: "Ramesh Reddy",
      phone: "8341643180",
      email: "customer@gmail.com",
      streetAddress: "Sai Aishwarya Colony, Road No 1, Parvathapur",
      landmark: "Near Mediplus",
      pincode: "500098",
      utr: "N/A"
    },
    items: [
      { id: "mango-pickle", name: "Avakaya Mango Pickle", weight: "500g", unitPrice: 230, quantity: 1 },
      { id: "chicken-pickle", name: "Andhra Chicken Pickle (Boneless)", weight: "500g", unitPrice: 420, quantity: 1 }
    ],
    totals: { subtotal: 650, discountAmount: 65, deliveryFee: 0, grandTotal: 585 },
    paymentMode: "cod",
    status: "Cash on Delivery (Pay upon receipt)"
  };

  dashboardState.orders.unshift(newOrder);
  saveOrdersToStorage();
  renderDashboard();
  showDashboardToast(`Sample Order #${newOrder.orderId} added!`);
}

// Refresh Data
function refreshDashboardData() {
  loadOrders();
  renderDashboard();
  showDashboardToast("Dashboard refreshed with latest orders!");
}

// Set Status Filter
function setStatusFilter(filter) {
  dashboardState.currentFilter = filter;
  
  // Update Tab Styling
  document.querySelectorAll(".status-tab-btn").forEach(btn => {
    const isTarget = btn.getAttribute("data-filter") === filter;
    if (isTarget) {
      btn.className = "status-tab-btn active px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-neutral-950 transition";
    } else {
      btn.className = "status-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 transition";
    }
  });

  renderOrdersTable();
}

// Handle Search
function handleSearch(query) {
  dashboardState.searchQuery = query.trim().toLowerCase();
  renderOrdersTable();
}

// Update Order Status (Pending -> Processing -> Completed -> Cancelled)
async function updateOrderStatus(orderId, newStatus) {
  const order = dashboardState.orders.find(o => o.orderId === orderId);
  if (order) {
    order.orderStatus = newStatus;
    saveOrdersToStorage();
    renderKPIs();
    renderOrdersTable();
    showDashboardToast(`Order #${orderId} marked as ${newStatus.toUpperCase()}`);

    // Sync to Supabase Cloud
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from("orders")
          .update({ order_status: newStatus })
          .eq("order_id", orderId);

        if (error) {
          console.warn("Supabase update error:", error.message);
        } else {
          console.log(`✅ Supabase order ${orderId} updated to ${newStatus}`);
        }
      } catch (err) {
        console.error("Supabase status update error:", err);
      }
    }
  }
}

// Delete Order
async function deleteOrder(orderId) {
  if (confirm(`Are you sure you want to delete order #${orderId}?`)) {
    dashboardState.orders = dashboardState.orders.filter(o => o.orderId !== orderId);
    saveOrdersToStorage();
    renderDashboard();
    showDashboardToast(`Order #${orderId} deleted.`);

    // Delete from Supabase Cloud
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from("orders")
          .delete()
          .eq("order_id", orderId);

        if (error) {
          console.warn("Supabase delete error:", error.message);
        } else {
          console.log(`✅ Supabase order ${orderId} deleted`);
        }
      } catch (err) {
        console.error("Supabase delete error:", err);
      }
    }
  }
}

// Render Complete Dashboard
function renderDashboard() {
  renderKPIs();
  renderOrdersTable();
}

// Render KPI Stats Cards
function renderKPIs() {
  const total = dashboardState.orders.length;
  const pending = dashboardState.orders.filter(o => (o.orderStatus || "pending") === "pending").length;
  const processing = dashboardState.orders.filter(o => o.orderStatus === "processing").length;
  const completed = dashboardState.orders.filter(o => o.orderStatus === "completed").length;
  const cancelled = dashboardState.orders.filter(o => o.orderStatus === "cancelled").length;

  const totalRevenue = dashboardState.orders
    .filter(o => o.orderStatus !== "cancelled")
    .reduce((sum, o) => sum + (o.totals?.grandTotal || 0), 0);

  document.getElementById("kpi-total-orders").textContent = total;
  document.getElementById("kpi-pending-orders").textContent = pending;
  document.getElementById("kpi-processing-orders").textContent = processing;
  document.getElementById("kpi-completed-orders").textContent = completed;
  document.getElementById("kpi-total-revenue").textContent = `₹${totalRevenue.toLocaleString("en-IN")}`;

  // Update tab counts
  document.getElementById("count-tab-all").textContent = total;
  document.getElementById("count-tab-pending").textContent = pending;
  document.getElementById("count-tab-processing").textContent = processing;
  document.getElementById("count-tab-completed").textContent = completed;
  document.getElementById("count-tab-cancelled").textContent = cancelled;
}

// Render Orders Table
function renderOrdersTable() {
  const tbody = document.getElementById("orders-table-body");
  const emptyState = document.getElementById("empty-state");
  if (!tbody) return;

  // Filter Orders
  let filtered = dashboardState.orders;

  if (dashboardState.currentFilter !== "all") {
    filtered = filtered.filter(o => (o.orderStatus || "pending") === dashboardState.currentFilter);
  }

  if (dashboardState.searchQuery) {
    const q = dashboardState.searchQuery;
    filtered = filtered.filter(o => {
      const matchId = o.orderId.toLowerCase().includes(q);
      const matchName = o.customer.fullName.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.toLowerCase().includes(q);
      const matchAddress = o.customer.streetAddress.toLowerCase().includes(q);
      const matchItems = o.items.some(i => i.name.toLowerCase().includes(q));
      return matchId || matchName || matchPhone || matchAddress || matchItems;
    });
  }

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  tbody.innerHTML = filtered.map(order => {
    const status = order.orderStatus || "pending";
    const paymentMode = order.paymentMode || "cod";
    const phoneClean = order.customer.phone.replace(/[^0-9]/g, "");

    // Status Badge Color Map
    const statusBadgeClasses = {
      pending: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      processing: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      cancelled: "bg-rose-500/20 text-rose-300 border-rose-500/40"
    };

    // Payment Mode Badges
    const paymentBadgeClasses = {
      cod: "bg-amber-500/20 text-amber-300",
      upi: "bg-emerald-500/20 text-emerald-300",
      credit: "bg-purple-500/20 text-purple-300",
      debit: "bg-blue-500/20 text-blue-300"
    };

    const itemsSummary = order.items.map(i => `
      <div class="flex items-center gap-1.5 text-xs text-neutral-200">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        <span class="font-semibold">${i.name}</span>
        <span class="px-1.5 py-0.2 bg-neutral-800 text-amber-300 rounded text-[10px] font-bold">${i.weight}</span>
        <span class="text-neutral-400">x${i.quantity}</span>
        <span class="text-amber-200/80 font-mono text-[11px]">₹${i.unitPrice * i.quantity}</span>
      </div>
    `).join("");

    return `
      <tr class="hover:bg-neutral-900/60 transition duration-150">
        
        <!-- 1. Order ID & Date -->
        <td class="py-4 px-4 align-top">
          <span class="font-mono font-bold text-amber-400 block text-xs">${order.orderId}</span>
          <span class="text-[11px] text-neutral-500 block mt-0.5">${order.timestamp}</span>
        </td>

        <!-- 2. Customer & Contact -->
        <td class="py-4 px-4 align-top">
          <span class="font-bold text-white block">${order.customer.fullName}</span>
          <a href="tel:${phoneClean}" class="text-[11px] text-amber-400/90 hover:underline flex items-center gap-1 mt-0.5 font-mono">
            📞 ${order.customer.phone}
          </a>
        </td>

        <!-- 3. Delivery Address -->
        <td class="py-4 px-4 align-top max-w-xs">
          <p class="text-xs text-neutral-300 leading-snug line-clamp-2">${order.customer.streetAddress}</p>
          <span class="text-[10px] text-neutral-500 block mt-0.5">${order.customer.landmark || "Parvathapur"} • ${order.customer.pincode || "500098"}</span>
        </td>

        <!-- 4. Pickles Ordered -->
        <td class="py-4 px-4 align-top">
          <div class="space-y-1">
            ${itemsSummary}
          </div>
        </td>

        <!-- 5. Bill & Payment -->
        <td class="py-4 px-4 align-top">
          <span class="text-sm font-black text-amber-300 font-mono block">₹${order.totals.grandTotal}</span>
          <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 ${paymentBadgeClasses[paymentMode] || 'bg-neutral-800 text-neutral-300'}">
            ${paymentMode.toUpperCase()}
          </span>
          ${order.customer.utr && order.customer.utr !== "N/A" ? `<span class="block text-[9px] text-neutral-400 font-mono mt-0.5">UTR: ${order.customer.utr}</span>` : ''}
        </td>

        <!-- 6. Status Selector -->
        <td class="py-4 px-4 align-top">
          <select 
            onchange="updateOrderStatus('${order.orderId}', this.value)"
            class="px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer bg-neutral-900 ${statusBadgeClasses[status] || statusBadgeClasses.pending}"
          >
            <option value="pending" ${status === 'pending' ? 'selected' : ''} class="bg-neutral-900 text-amber-300">⏳ Pending</option>
            <option value="processing" ${status === 'processing' ? 'selected' : ''} class="bg-neutral-900 text-sky-300">🍳 Preparing</option>
            <option value="completed" ${status === 'completed' ? 'selected' : ''} class="bg-neutral-900 text-emerald-300">✅ Completed</option>
            <option value="cancelled" ${status === 'cancelled' ? 'selected' : ''} class="bg-neutral-900 text-rose-300">❌ Cancelled</option>
          </select>
        </td>

        <!-- 7. Actions -->
        <td class="py-4 px-4 align-top text-center">
          <div class="flex items-center justify-center gap-1.5">
            
            <!-- Local Bike Dispatch Button (Porter / Rapido) -->
            <button 
              onclick="openLocalDispatchModal('${order.orderId}')"
              class="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-neutral-950 transition shadow-sm font-bold text-xs flex items-center gap-1 border border-amber-500/30"
              title="Dispatch via Rapido / Porter / Bike Delivery"
            >
              <i data-lucide="bike" class="w-3.5 h-3.5"></i>
              <span class="hidden xl:inline">Dispatch</span>
            </button>

            <!-- WhatsApp Customer Button -->
            <button 
              onclick="notifyCustomerWhatsApp('${order.orderId}')"
              class="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white transition shadow-sm"
              title="Send WhatsApp Update to Customer"
            >
              <i data-lucide="message-circle" class="w-4 h-4"></i>
            </button>

            <!-- Print Kitchen Slip -->
            <button 
              onclick="openKitchenSlipModal('${order.orderId}')"
              class="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 transition shadow-sm"
              title="Print Kitchen Preparation Slip"
            >
              <i data-lucide="printer" class="w-4 h-4"></i>
            </button>

            <!-- Delete Order -->
            <button 
              onclick="deleteOrder('${order.orderId}')"
              class="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition"
              title="Delete Order"
            >
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>

          </div>
        </td>

      </tr>
    `;
  }).join("");

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// WhatsApp Customer Notification Dispatch
function notifyCustomerWhatsApp(orderId) {
  const order = dashboardState.orders.find(o => o.orderId === orderId);
  if (!order) return;

  const phone = order.customer.phone.replace(/[^0-9]/g, "");
  const targetPhone = phone.startsWith("91") ? phone : `91${phone}`;

  let statusMsg = "Your homemade pickles are being prepared with love! ❤️🍛";
  if (order.orderStatus === "completed") {
    statusMsg = "Your order has been DELIVERED! Thank you for ordering from Amma Ruchulu. Enjoy your authentic homemade pickles! 🍛✨";
  } else if (order.orderStatus === "processing") {
    statusMsg = "Your order is currently being FRESHLY PACKED in our Parvathapur kitchen! 🚚📦";
  }

  const itemsText = order.items.map((i, idx) => `${idx + 1}. *${i.name}* (${i.weight}) x ${i.quantity}`).join("\n");

  const msg = `Namaskaram *${order.customer.fullName}* garu! 🙏
━━━━━━━━━━━━━━━━━━
🍛 *AMMA RUCHULU - ORDER UPDATE*
🆔 *Order ID:* ${order.orderId}
📦 *Status:* *${(order.orderStatus || "Pending").toUpperCase()}*
━━━━━━━━━━━━━━━━━━
${statusMsg}

*Ordered Items:*
${itemsText}
💰 *Total Bill:* ₹${order.totals.grandTotal} (${order.paymentMode.toUpperCase()})

📍 *Store Kitchen:* Sai Aishwarya Colony, Parvathapur, Hyderabad
📞 *Helpline:* +91 8341643180`;

  const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

// Open Printable Kitchen Slip Modal
function openKitchenSlipModal(orderId) {
  const order = dashboardState.orders.find(o => o.orderId === orderId);
  if (!order) return;

  const modal = document.getElementById("kitchen-slip-modal");
  const printBody = document.getElementById("print-section");
  if (!modal || !printBody) return;

  const itemsRows = order.items.map((i, idx) => `
    <tr class="border-b">
      <td class="py-2 text-neutral-800 font-medium">${idx + 1}. ${i.name}</td>
      <td class="py-2 text-center font-bold text-red-900">${i.weight}</td>
      <td class="py-2 text-center font-black">x ${i.quantity}</td>
      <td class="py-2 text-right font-mono font-bold">₹${i.unitPrice * i.quantity}</td>
    </tr>
  `).join("");

  printBody.innerHTML = `
    <div class="border border-neutral-300 p-4 rounded-2xl space-y-3 bg-neutral-50 text-xs">
      
      <div class="text-center border-b border-neutral-300 pb-2">
        <h2 class="font-cinzel font-black text-base text-red-900">AMMA RUCHULU (అమ్మ రుచులు)</h2>
        <p class="text-[11px] text-neutral-600">Sai Aishwarya Colony, Road No 1, Parvathapur, Hyderabad - 500098</p>
        <p class="text-[11px] text-neutral-600 font-bold">Helpline: +91 8341643180</p>
      </div>

      <div class="flex justify-between items-start text-xs border-b border-neutral-300 pb-2">
        <div>
          <span class="font-bold text-neutral-900">Order ID: </span>
          <span class="font-mono font-bold text-red-900">${order.orderId}</span>
          <p class="text-[10px] text-neutral-500">${order.timestamp}</p>
        </div>
        <div class="text-right">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.orderStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
            ${(order.orderStatus || 'Pending').toUpperCase()}
          </span>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-neutral-900 mb-0.5">Customer & Delivery Details:</h4>
        <p class="font-semibold text-neutral-800">${order.customer.fullName} (📞 ${order.customer.phone})</p>
        <p class="text-neutral-600 text-[11px] leading-snug">${order.customer.streetAddress}</p>
        <p class="text-neutral-500 text-[10px]">${order.customer.landmark || "Parvathapur"} • Pincode: ${order.customer.pincode || "500098"}</p>
      </div>

      <table class="w-full text-xs">
        <thead class="bg-neutral-200/80 text-neutral-700 font-bold border-b border-neutral-300">
          <tr>
            <th class="py-1.5 text-left">Item Name</th>
            <th class="py-1.5 text-center">Pack</th>
            <th class="py-1.5 text-center">Qty</th>
            <th class="py-1.5 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="border-t border-neutral-300 pt-2 space-y-1 text-xs">
        <div class="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span>₹${order.totals.subtotal}</span>
        </div>
        ${order.totals.discountAmount > 0 ? `
          <div class="flex justify-between text-emerald-700 font-semibold">
            <span>Discount</span>
            <span>-₹${order.totals.discountAmount}</span>
          </div>
        ` : ''}
        <div class="flex justify-between text-neutral-600">
          <span>Home Delivery</span>
          <span>${order.totals.deliveryFee === 0 ? 'FREE' : '₹' + order.totals.deliveryFee}</span>
        </div>
        <div class="flex justify-between text-sm font-extrabold text-red-900 border-t border-neutral-300 pt-1.5">
          <span>Total Payable</span>
          <span>₹${order.totals.grandTotal}</span>
        </div>
      </div>

      <div class="p-2.5 bg-neutral-100 rounded-xl border text-[11px] flex justify-between items-center">
        <span>Payment Mode: <strong class="uppercase">${order.paymentMode}</strong></span>
        <span class="font-bold text-neutral-700">${order.status}</span>
      </div>

      <!-- Kitchen Checkboxes -->
      <div class="pt-2 border-t border-dashed border-neutral-300 flex justify-between text-[10px] text-neutral-600 font-bold">
        <span>[ ] Prepared</span>
        <span>[ ] Quality Checked</span>
        <span>[ ] Packed</span>
        <span>[ ] Dispatched</span>
      </div>

    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeKitchenSlipModal() {
  const modal = document.getElementById("kitchen-slip-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

// Export Orders to CSV Spreadsheet
function exportOrdersToCSV() {
  if (dashboardState.orders.length === 0) {
    alert("No orders available to export.");
    return;
  }

  const headers = ["Order ID", "Date Time", "Status", "Customer Name", "Phone", "Delivery Address", "Items", "Grand Total", "Payment Mode", "Payment Status"];
  const rows = dashboardState.orders.map(o => [
    o.orderId,
    `"${o.timestamp}"`,
    (o.orderStatus || "pending").toUpperCase(),
    `"${o.customer.fullName}"`,
    `"${o.customer.phone}"`,
    `"${o.customer.streetAddress}, ${o.customer.landmark}, ${o.customer.pincode}"`,
    `"${o.items.map(i => `${i.name} (${i.weight}) x${i.quantity}`).join("; ")}"`,
    o.totals.grandTotal,
    o.paymentMode.toUpperCase(),
    `"${o.status}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Amma_Ruchulu_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Dashboard Toast Helper
function showDashboardToast(msg) {
  const toast = document.createElement("div");
  toast.className = "fixed bottom-5 right-5 z-50 bg-amber-400 text-neutral-950 font-bold text-xs px-4 py-3 rounded-2xl shadow-xl border border-amber-300 flex items-center gap-2 animate-bounce";
  toast.innerHTML = `<span>⚡ ${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Supabase Settings Modal Controls
function openSupabaseModal() {
  const modal = document.getElementById("supabase-modal");
  const urlInput = document.getElementById("supabase-url-input");
  const keyInput = document.getElementById("supabase-key-input");
  
  if (urlInput) urlInput.value = localStorage.getItem("amma_supabase_url") || "";
  if (keyInput) keyInput.value = localStorage.getItem("amma_supabase_key") || "";
  
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeSupabaseModal() {
  const modal = document.getElementById("supabase-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function saveSupabaseSettings() {
  const urlInput = document.getElementById("supabase-url-input");
  const keyInput = document.getElementById("supabase-key-input");
  
  const url = urlInput ? urlInput.value.trim() : "";
  const key = keyInput ? keyInput.value.trim() : "";

  if (!url || !key) {
    alert("Please enter both your Supabase Project URL and Anon API Key.");
    return;
  }

  localStorage.setItem("amma_supabase_url", url);
  localStorage.setItem("amma_supabase_key", key);

  closeSupabaseModal();
  initSupabase();
  loadOrders();
  showDashboardToast("Supabase Cloud Connected! Syncing live database...");
}

function disconnectSupabase() {
  if (confirm("Disconnect Supabase and switch back to Local Mode?")) {
    localStorage.removeItem("amma_supabase_url");
    localStorage.removeItem("amma_supabase_key");
    supabaseClient = null;
    closeSupabaseModal();
    updateSupabaseStatusBadge(false);
    loadOrders();
    showDashboardToast("Switched to Local Mode.");
  }
}

// ================= LOCAL BIKE DISPATCH (PORTER / RAPIDO / DUNZO) =================
let currentDispatchOrder = null;

function openLocalDispatchModal(orderId) {
  const order = dashboardState.orders.find(o => o.orderId === orderId);
  if (!order) return;

  currentDispatchOrder = order;

  const modal = document.getElementById("local-dispatch-modal");
  const infoContainer = document.getElementById("local-dispatch-order-info");
  const gmapsLink = document.getElementById("dispatch-gmaps-link");

  if (!modal || !infoContainer) return;

  const itemsList = order.items.map(i => `${i.name} (${i.weight}) x ${i.quantity}`).join(", ");
  const fullAddress = `${order.customer.streetAddress}, ${order.customer.landmark || 'Parvathapur'}, ${order.customer.pincode || '500098'}`;
  
  // Google Maps Direction URL: From Parvathapur kitchen to customer address
  const encodedOrigin = encodeURIComponent("Sai Aishwarya Colony, Road No 1, Parvathapur, Hyderabad, 500098");
  const encodedDest = encodeURIComponent(fullAddress);
  if (gmapsLink) {
    gmapsLink.href = `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDest}`;
  }

  infoContainer.innerHTML = `
    <div class="flex items-center justify-between border-b border-neutral-800 pb-2">
      <div>
        <span class="font-mono font-bold text-amber-400 text-sm">${order.orderId}</span>
        <span class="text-[11px] text-neutral-400 block">${order.timestamp}</span>
      </div>
      <div class="text-right">
        <span class="text-sm font-black text-amber-300">₹${order.totals.grandTotal}</span>
        <span class="text-[10px] text-neutral-400 block uppercase font-bold">${order.paymentMode}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
      <div>
        <strong class="text-neutral-400 block text-[10px] uppercase">Customer Name & Phone:</strong>
        <p class="text-white font-bold">${order.customer.fullName}</p>
        <a href="tel:${order.customer.phone}" class="text-amber-400 font-mono text-xs hover:underline">📞 +91 ${order.customer.phone}</a>
      </div>
      <div>
        <strong class="text-neutral-400 block text-[10px] uppercase">Drop Address:</strong>
        <p class="text-neutral-200">${fullAddress}</p>
      </div>
    </div>

    <div class="pt-2 border-t border-neutral-800">
      <strong class="text-neutral-400 block text-[10px] uppercase">Parcel Contents:</strong>
      <p class="text-amber-200/90 font-medium">${itemsList}</p>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  if (window.lucide) window.lucide.createIcons();
}

function closeLocalDispatchModal() {
  const modal = document.getElementById("local-dispatch-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
  currentDispatchOrder = null;
}

// 1-Click Copy Customer Address Formatted for Rapido / Porter
function copyLocalDispatchDetails() {
  if (!currentDispatchOrder) return;

  const o = currentDispatchOrder;
  const copyText = `RECEIVER: ${o.customer.fullName}
PHONE: ${o.customer.phone}
ADDRESS: ${o.customer.streetAddress}, ${o.customer.landmark || 'Parvathapur'}, PIN: ${o.customer.pincode || '500098'}
PARCEL: Amma Ruchulu Homemade Pickles (${o.items.map(i => `${i.name} ${i.weight}`).join(', ')})`;

  navigator.clipboard.writeText(copyText).then(() => {
    showDashboardToast("📋 Customer Address Copied! Ready to paste in Rapido / Porter.");
    const btn = document.getElementById("copy-dispatch-btn");
    if (btn) {
      btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i><span>Copied! ✓</span>`;
      if (window.lucide) window.lucide.createIcons();
      setTimeout(() => {
        btn.innerHTML = `<i data-lucide="copy" class="w-3.5 h-3.5"></i><span>Copy Full Address & Phone</span>`;
        if (window.lucide) window.lucide.createIcons();
      }, 3000);
    }
  }).catch(() => {
    alert(copyText);
  });
}

// Send Dispatch WhatsApp update to Customer
function sendDispatchWhatsApp() {
  if (!currentDispatchOrder) return;

  const o = currentDispatchOrder;
  const phoneClean = o.customer.phone.replace(/[^0-9]/g, "");
  const targetPhone = phoneClean.startsWith("91") ? phoneClean : `91${phoneClean}`;

  const message = `Namaste ${o.customer.fullName} garu! 🙏

Your delicious homemade pickles from *Amma Ruchulu (అమ్మ రుచులు)* are packed and DISPATCHED! 🍛🛵

🆔 *Order ID:* ${o.orderId}
📦 *Items:* ${o.items.map(i => `${i.name} (${i.weight})`).join(', ')}
📍 *Delivery To:* ${o.customer.streetAddress}
💰 *Total Payable:* ₹${o.totals.grandTotal} (${o.paymentMode.toUpperCase()})

Our local delivery rider is on the way to your doorstep. For any help, call us at +91 8341643180.

Thank you for supporting homemade Andhra Ruchulu! ❤️`;

  const url = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  showDashboardToast(`Opening WhatsApp message for ${o.customer.fullName}...`);
}

// Mark order as dispatched
function markOrderDispatched() {
  if (!currentDispatchOrder) return;
  updateOrderStatus(currentDispatchOrder.orderId, "processing");
  showDashboardToast(`Order ${currentDispatchOrder.orderId} marked as DISPATCHED / PREPARING!`);
  closeLocalDispatchModal();
}

// ================= SHIPROCKET DIRECT API INTEGRATION =================
let shiprocketToken = null;

async function getShiprocketToken() {
  const email = localStorage.getItem("amma_shiprocket_email");
  const password = localStorage.getItem("amma_shiprocket_pass");

  if (!email || !password) {
    openShiprocketModal();
    showDashboardToast("Please enter your Shiprocket email & password to connect.", "warning");
    return null;
  }

  if (shiprocketToken) return shiprocketToken;

  try {
    const res = await fetch("https://apiv2.shiprocket.in/v2/console/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.token) {
      shiprocketToken = data.token;
      return shiprocketToken;
    } else {
      console.error("Shiprocket login error:", data);
      showDashboardToast("Shiprocket auth failed: " + (data.message || "Check email/password"), "error");
      return null;
    }
  } catch (err) {
    console.warn("Direct Shiprocket CORS / Network notice:", err);
    // Return direct deep-link workflow if direct browser CORS is restricted
    return "BROWSER_MODE";
  }
}

// 1-Click Book Shipment on Shiprocket
async function bookCurrentOrderOnShiprocket() {
  if (!currentDispatchOrder) return;

  const o = currentDispatchOrder;
  const email = localStorage.getItem("amma_shiprocket_email");

  if (!email) {
    openShiprocketModal();
    return;
  }

  showDashboardToast(`Connecting to Shiprocket for order ${o.orderId}...`);

  // Calculate total parcel weight from pickle quantities (500g pickle + jar = ~0.65kg)
  let totalWeightKg = o.items.reduce((acc, item) => {
    let w = 0.65;
    if (item.weight === "250g") w = 0.35;
    if (item.weight === "1kg") w = 1.25;
    return acc + (w * item.quantity);
  }, 0);

  const isCod = (o.paymentMode || "cod") === "cod";
  const pickupPincode = localStorage.getItem("amma_shiprocket_pincode") || "500098";

  // Create clean Shiprocket payload
  const orderPayload = {
    order_id: o.orderId,
    order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    pickup_location: "Primary",
    billing_customer_name: o.customer.fullName,
    billing_last_name: "",
    billing_address: o.customer.streetAddress,
    billing_city: o.customer.landmark || "Hyderabad",
    billing_pincode: o.customer.pincode || "500098",
    billing_state: "Telangana",
    billing_country: "India",
    billing_email: o.customer.email && o.customer.email.includes("@") ? o.customer.email : "orders@ammaruchulu.com",
    billing_phone: o.customer.phone.replace(/[^0-9]/g, ""),
    shipping_is_billing: true,
    order_items: o.items.map((item, idx) => ({
      name: `${item.name} (${item.weight})`,
      sku: `${item.id}-${item.weight}-${idx}`,
      units: item.quantity,
      selling_price: item.unitPrice
    })),
    payment_method: isCod ? "COD" : "Prepaid",
    sub_total: o.totals.grandTotal,
    length: 12,
    breadth: 12,
    height: 14,
    weight: Math.max(0.5, totalWeightKg)
  };

  const token = await getShiprocketToken();

  if (token && token !== "BROWSER_MODE") {
    try {
      const createRes = await fetch("https://apiv2.shiprocket.in/v2/console/orders/create/adhoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const result = await createRes.json();
      if (result.order_id) {
        showDashboardToast(`🎉 Shiprocket Order #${result.order_id} Created Successfully!`);
        updateOrderStatus(o.orderId, "processing");
        closeLocalDispatchModal();
        return;
      }
    } catch (apiErr) {
      console.warn("Direct API call handled with direct portal:", apiErr);
    }
  }

  // Instant Direct Shiprocket Portal Link with pre-filled details
  const shiprocketPortalUrl = `https://app.shiprocket.in/orders/create`;
  window.open(shiprocketPortalUrl, "_blank");

  // Copy details to clipboard so store owner can paste effortlessly
  copyLocalDispatchDetails();
  showDashboardToast(`Opened Shiprocket Dashboard. Order details copied to clipboard!`);
  updateOrderStatus(o.orderId, "processing");
}

// Shiprocket Modal Handlers
function openShiprocketModal() {
  const emailInput = document.getElementById("shiprocket-email-input");
  const passInput = document.getElementById("shiprocket-password-input");
  const pinInput = document.getElementById("shiprocket-pincode-input");

  if (emailInput) emailInput.value = localStorage.getItem("amma_shiprocket_email") || "";
  if (passInput) passInput.value = localStorage.getItem("amma_shiprocket_pass") || "";
  if (pinInput) pinInput.value = localStorage.getItem("amma_shiprocket_pincode") || "500098";

  const modal = document.getElementById("shiprocket-modal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeShiprocketModal() {
  const modal = document.getElementById("shiprocket-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function saveShiprocketSettings() {
  const email = document.getElementById("shiprocket-email-input")?.value.trim();
  const pass = document.getElementById("shiprocket-password-input")?.value.trim();
  const pin = document.getElementById("shiprocket-pincode-input")?.value.trim();

  if (!email || !pass) {
    alert("Please enter both Shiprocket login email and password.");
    return;
  }

  localStorage.setItem("amma_shiprocket_email", email);
  localStorage.setItem("amma_shiprocket_pass", pass);
  localStorage.setItem("amma_shiprocket_pincode", pin || "500098");

  closeShiprocketModal();
  showDashboardToast("✅ Shiprocket Connected! Pickup address set to Parvathapur Kitchen.");

  const statusText = document.getElementById("shiprocket-status-text");
  if (statusText) statusText.textContent = `🚛 Shiprocket: Connected (${email.split('@')[0]})`;
}

function disconnectShiprocket() {
  if (confirm("Disconnect Shiprocket settings?")) {
    localStorage.removeItem("amma_shiprocket_email");
    localStorage.removeItem("amma_shiprocket_pass");
    shiprocketToken = null;
    closeShiprocketModal();
    showDashboardToast("Shiprocket disconnected.");

    const statusText = document.getElementById("shiprocket-status-text");
    if (statusText) statusText.textContent = "🚛 Shiprocket: Setup";
  }
}
