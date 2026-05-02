// ─── Cart Utility ────────────────────────────────────────────────────────────
// All cart operations use localStorage so the cart persists across page refreshes.
// A custom 'cartUpdated' event is dispatched after every mutation so that any
// component (e.g. Navbar) can reactively update its badge count.

/** Return the full cart array from localStorage */
export const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');

/** Dispatch custom event so listeners (Navbar, etc.) can re-render */
const notifyCartUpdate = () => window.dispatchEvent(new Event('cartUpdated'));

/**
 * Add a product to the cart.
 * If the product already exists, its quantity is incremented.
 * @param {Object} product – the full product object from the API
 */
export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  notifyCartUpdate();
};

/**
 * Remove a product from the cart entirely.
 * @param {number|string} productId
 */
export const removeFromCart = (productId) => {
  const cart = getCart().filter((item) => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  notifyCartUpdate();
};

/**
 * Update the quantity for a specific product.
 * If quantity <= 0 the item is removed.
 * @param {number|string} productId
 * @param {number} quantity
 */
export const updateQuantity = (productId, quantity) => {
  const cart = getCart()
    .map((item) => (item.id === productId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  localStorage.setItem('cart', JSON.stringify(cart));
  notifyCartUpdate();
};

/** Empty the cart completely (called after successful order placement) */
export const clearCart = () => {
  localStorage.removeItem('cart');
  notifyCartUpdate();
};

/** Return the total number of items (sum of all quantities) */
export const getCartCount = () =>
  getCart().reduce((sum, item) => sum + item.quantity, 0);
