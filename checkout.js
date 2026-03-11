const cart = window.loadCartMap();
const checkoutItems = document.getElementById("checkoutItems");
const checkoutForm = document.getElementById("checkoutForm");

function getSummary(items) {
  const subtotal = items.reduce((s, it) => s + it.total, 0);
  const shipping = subtotal >= 49 || subtotal === 0 ? 0 : 6.99;
  const tax = subtotal * 0.08;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

function renderSummary(items) {
  const { subtotal, shipping, tax, total } = getSummary(items);
  document.getElementById("ckSubtotal").textContent = window.toUSD(subtotal);
  document.getElementById("ckShipping").textContent = window.toUSD(shipping);
  document.getElementById("ckTax").textContent = window.toUSD(tax);
  document.getElementById("ckTotal").textContent = window.toUSD(total);
}

function renderItems(items) {
  if (!items.length) {
    checkoutItems.innerHTML = '<p>Your cart is empty. <a href="./index.html">Go add items</a></p>';
    return;
  }

  checkoutItems.innerHTML = "";
  items.forEach((item) => {
    const line = document.createElement("div");
    line.className = "summary-row";
    line.innerHTML = `<span>${item.name} x ${item.qty}</span><strong>${window.toUSD(item.total)}</strong>`;
    checkoutItems.appendChild(line);
  });
}

const items = window.getCartItems(cart);
renderItems(items);
renderSummary(items);

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!items.length) {
    alert("Your cart is empty. Please add products first.");
    return;
  }

  const orderId = `BT-${Date.now().toString().slice(-6)}`;
  localStorage.removeItem(window.BUTTERIOS_CART_KEY);
  window.location.href = `./order-success.html?orderId=${orderId}`;
});
