const products = window.BUTTERIOS_PRODUCTS;
const categories = ["All", ...new Set(products.map((p) => p.category))];
let selectedCategory = "All";
let searchText = "";
const cart = window.loadCartMap();

const categoryFilters = document.getElementById("categoryFilters");
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const goCartBtn = document.getElementById("goCartBtn");

function buildCategoryChips() {
  categoryFilters.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = `chip ${cat === selectedCategory ? "active" : ""}`;
    btn.textContent = cat;
    btn.onclick = () => {
      selectedCategory = cat;
      buildCategoryChips();
      renderProducts();
    };
    categoryFilters.appendChild(btn);
  });
}

function renderProducts() {
  const filtered = products.filter((p) => {
    const hitCategory = selectedCategory === "All" || p.category === selectedCategory;
    const hitSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
    return hitCategory && hitSearch;
  });

  productGrid.innerHTML = "";
  if (!filtered.length) {
    productGrid.innerHTML = "<p>No products found. Try another holiday or keyword.</p>";
    return;
  }

  filtered.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "product";
    card.style.animationDelay = `${i * 35}ms`;
    card.innerHTML = `
      <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" />
      <span class="tag">${p.badge}</span>
      <h3>${p.name}</h3>
      <p>${p.category}</p>
      <p class="product-price">${window.toUSD(p.price)}</p>
      <button type="button">Add to Cart</button>
    `;
    card.querySelector("button").onclick = () => addToCart(p.id);
    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
}

function updateQty(productId, delta) {
  const next = (cart.get(productId) || 0) + delta;
  if (next <= 0) {
    cart.delete(productId);
  } else {
    cart.set(productId, next);
  }
  renderCart();
}

function renderCart() {
  const items = window.getCartItems(cart);
  const qtyCount = items.reduce((sum, item) => sum + item.qty, 0);

  window.saveCartMap(cart);
  cartCount.textContent = qtyCount;

  if (!items.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartSubtotal.textContent = "$0.00";
    return;
  }

  cartItems.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="item-row">
        <img class="thumb" src="${item.image}" alt="${item.name}" />
        <strong>${item.name}</strong>
      </div>
      <div class="cart-meta">
        <span>${window.toUSD(item.price)}</span>
        <div class="qty">
          <button type="button" aria-label="Decrease quantity">-</button>
          <span>${item.qty}</span>
          <button type="button" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <span>Line Total: <strong>${window.toUSD(item.total)}</strong></span>
    `;
    const [minusBtn, plusBtn] = row.querySelectorAll("button");
    minusBtn.onclick = () => updateQty(item.id, -1);
    plusBtn.onclick = () => updateQty(item.id, 1);
    cartItems.appendChild(row);
  });

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  cartSubtotal.textContent = window.toUSD(subtotal);
}

function toggleCart(isOpen) {
  cartDrawer.classList.toggle("open", isOpen);
  overlay.classList.toggle("show", isOpen);
  cartDrawer.setAttribute("aria-hidden", String(!isOpen));
}

searchInput.addEventListener("input", (e) => {
  searchText = e.target.value;
  renderProducts();
});

cartBtn.addEventListener("click", () => toggleCart(true));
closeCartBtn.addEventListener("click", () => toggleCart(false));
overlay.addEventListener("click", () => toggleCart(false));
goCartBtn.addEventListener("click", () => {
  window.location.href = "./cart.html";
});

buildCategoryChips();
renderProducts();
renderCart();
