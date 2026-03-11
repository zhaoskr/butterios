window.BUTTERIOS_PRODUCTS = [
  { id: 1, name: "Maple Harvest Table Runner", category: "Thanksgiving", price: 24.99, badge: "Best Seller" },
  { id: 2, name: "Christmas Sparkle Garland", category: "Christmas", price: 32.00, badge: "New" },
  { id: 3, name: "Patriotic Porch Wreath", category: "4th of July", price: 39.50, badge: "USA Pick" },
  { id: 4, name: "Pumpkin Lantern Set", category: "Halloween", price: 27.90, badge: "Limited" },
  { id: 5, name: "Easter Bunny Centerpiece", category: "Easter", price: 29.99, badge: "Spring" },
  { id: 6, name: "Valentine Velvet Heart Pillows", category: "Valentine", price: 22.50, badge: "2-Pack" },
  { id: 7, name: "New Year Gold Confetti Kit", category: "New Year", price: 18.99, badge: "Party" },
  { id: 8, name: "Fall Leaves Door Swag", category: "Thanksgiving", price: 34.95, badge: "Handmade" },
  { id: 9, name: "Candy Cane Porch Lights", category: "Christmas", price: 44.00, badge: "Top Rated" },
  { id: 10, name: "Haunted Mantel Banner", category: "Halloween", price: 16.75, badge: "Spooky" },
  { id: 11, name: "Stars and Stripes Table Set", category: "4th of July", price: 21.99, badge: "U.S. Flag" },
  { id: 12, name: "Spring Blossom Wreath", category: "Easter", price: 31.20, badge: "Fresh Drop" }
];

window.BUTTERIOS_CART_KEY = "butterios-cart-v1";

window.toUSD = function toUSD(num) {
  return `$${Number(num).toFixed(2)}`;
};

window.loadCartMap = function loadCartMap() {
  try {
    const raw = localStorage.getItem(window.BUTTERIOS_CART_KEY);
    if (!raw) return new Map();
    const obj = JSON.parse(raw);
    return new Map(Object.entries(obj).map(([k, v]) => [Number(k), Number(v)]));
  } catch {
    return new Map();
  }
};

window.saveCartMap = function saveCartMap(cartMap) {
  const obj = {};
  cartMap.forEach((v, k) => {
    obj[k] = v;
  });
  localStorage.setItem(window.BUTTERIOS_CART_KEY, JSON.stringify(obj));
};

window.getCartItems = function getCartItems(cartMap) {
  return [...cartMap.entries()].map(([id, qty]) => {
    const p = window.BUTTERIOS_PRODUCTS.find((x) => x.id === id);
    return p ? { ...p, qty, total: p.price * qty } : null;
  }).filter(Boolean);
};
