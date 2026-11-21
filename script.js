// Menu Data
const menuItems = [
  {
    id: 1,
    name: "Burrata & Roasted Fig",
    category: "starters",
    price: 520,
    tag: "Vegetarian",
    desc: "Hand-pulled burrata, charred black figs, toasted pistachios, and aged balsamic glaze.",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Crispy Calamari & Curry Leaf",
    category: "starters",
    price: 580,
    tag: "Coastal Special",
    desc: "Flash-fried squid rings tossed with tellicherry pepper, crispy curry leaves, and lime aioli.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Saffron Seafood Risotto",
    category: "mains",
    price: 940,
    tag: "Chef's Signature",
    desc: "Carnaroli rice slow-cooked in Kashmiri saffron fumet with tiger prawns and pan-seared scallops.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Hearth-Roasted Lamb Shank",
    category: "mains",
    price: 1150,
    tag: "Slow Cooked 8h",
    desc: "Braised in star anise and black cardamom jus, served over smoked garlic mash.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Wild Mushroom Tagliatelle",
    category: "mains",
    price: 760,
    tag: "Vegetarian",
    desc: "Hand-cut egg pasta with roasted porcini, thyme butter, and 24-month aged parmesan.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Cardamom Dark Chocolate Tart",
    category: "desserts",
    price: 440,
    tag: "70% Single Origin",
    desc: "Silky dark chocolate ganache in a crisp cacao crust with salted caramel and crème fraîche.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
  }
];

let cart = [];

// DOM Elements
const menuGrid = document.getElementById("menuGrid");
const filterBtns = document.querySelectorAll(".filter-btn");
const cartDrawer = document.getElementById("cartDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const cartItemsContainer = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const reserveModal = document.getElementById("reserveModal");
const toastEl = document.getElementById("toast");

// Render Menu Cards
function renderMenu(category = "all") {
  const filtered = category === "all"
    ? menuItems
    : menuItems.filter(item => item.category === category);

  menuGrid.innerHTML = filtered.map(item => `
    <article class="dish-card">
      <img src="${item.image}" alt="${item.name}" class="dish-img" loading="lazy" />
      <div class="dish-body">
        <div class="dish-top">
          <h3>${item.name}</h3>
          <span class="dish-price">₹${item.price}</span>
        </div>
        <p class="dish-desc">${item.desc}</p>
        <div class="dish-footer">
          <span class="diet-tag">${item.tag}</span>
          <button class="add-btn" onclick="addToCart(${item.id})">+ Add</button>
        </div>
      </div>
    </article>
  `).join("");
}

// Filter Button Listeners
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenu(btn.dataset.category);
  });
});

// Cart Functions
function addToCart(id) {
  const dish = menuItems.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...dish, qty: 1 });
  }

  updateCartUI();
  showToast(`Added "${dish.name}" to your order`);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCountEl.textContent = totalItems;
  cartTotalEl.textContent = `₹${totalPrice.toLocaleString("en-IN")}`;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-msg">Your order bag is empty. Select dishes from the menu to begin.</p>`;
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>₹${item.price} × ${item.qty}</span>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join("");
}

// Drawer & Modal Controls
function toggleCart(open) {
  cartDrawer.classList.toggle("open", open);
  drawerOverlay.classList.toggle("open", open);
}

function toggleModal(open) {
  reserveModal.classList.toggle("open", open);
}

document.getElementById("openCartBtn").addEventListener("click", () => toggleCart(true));
document.getElementById("closeCartBtn").addEventListener("click", () => toggleCart(false));
drawerOverlay.addEventListener("click", () => toggleCart(false));

document.getElementById("openReserveBtn").addEventListener("click", () => toggleModal(true));
document.getElementById("heroReserveBtn").addEventListener("click", () => toggleModal(true));
document.getElementById("closeReserveBtn").addEventListener("click", () => toggleModal(false));

// Checkout Action
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Add at least one dish before placing an order.");
    return;
  }
  cart = [];
  updateCartUI();
  toggleCart(false);
  showToast("Order received! Our kitchen is preparing your dishes.");
});

// Reservation Form Submission
document.getElementById("reserveForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("guestName").value;
  const guests = document.getElementById("guestCount").value;
  const time = document.getElementById("reserveTime").value;

  toggleModal(false);
  e.target.reset();
  showToast(`Table for ${guests} reserved under ${name} at ${time}.`);
});

// Toast Helper
let toastTimer;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 3000);
}

// Initialize
renderMenu();