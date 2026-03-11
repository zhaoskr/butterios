const cart = window.loadCartMap();
const cartPageItems = document.getElementById("cartPageItems");

function updateQty(productId, delta) {
  const next = (cart.get(productId) || 0) + delta;
  if (next <= 0) cart.delete(productId);
  else cart.set(productId, next);
  render();
}

function getSummary(items) {
  const subtotal = items.reduce((s, it) => s + it.total, 0);
  const shipping = subtotal >= 49 || subtotal === 0 ? 0 : 6.99;
  const tax = subtotal * 0.08;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

function renderSummary(items) {
  const { subtotal, shipping, tax, total } = getSummary(items);
  document.getElementById("sumSubtotal").textContent = window.toUSD(subtotal);
  document.getElementById("sumShipping").textContent = window.toUSD(shipping);
  document.getElementById("sumTax").textContent = window.toUSD(tax);
  document.getElementById("sumTotal").textContent = window.toUSD(total);
}

function render() {
  window.saveCartMap(cart);
  const items = window.getCartItems(cart);

  if (!items.length) {
    cartPageItems.innerHTML = '<p>Your cart is empty. <a href="./index.html">Back to shopping</a></p>';
    renderSummary(items);
    return;
  }

  cartPageItems.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="item-row">
        <img class="thumb" src="${item.image}" alt="${item.name}" />
        <strong>${item.name}</strong>
      </div>
      <div class="cart-meta">
        <span>${item.category}</span>
        <span>${window.toUSD(item.price)}</span>
      </div>
      <div class="cart-meta">
        <div class="qty">
          <button type="button">-</button>
          <span>${item.qty}</span>
          <button type="button">+</button>
        </div>
        <strong>${window.toUSD(item.total)}</strong>
      </div>
    `;
    const [minusBtn, plusBtn] = row.querySelectorAll("button");
    minusBtn.onclick = () => updateQty(item.id, -1);
    plusBtn.onclick = () => updateQty(item.id, 1);
    cartPageItems.appendChild(row);
  });

  renderSummary(items);
}

render();
