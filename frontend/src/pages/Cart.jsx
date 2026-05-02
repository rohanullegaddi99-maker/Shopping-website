import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import api from '../api';
import { getCart, removeFromCart, updateQuantity, clearCart } from '../cartUtils'; // FIX: real cart utility

const Cart = () => {
  const navigate = useNavigate();
  // FIX: Read cart from localStorage (real persistent cart)
  const [cartItems, setCartItems] = useState(getCart());
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  // FIX: Listen to cart updates (in case cart changes from another tab or component)
  useEffect(() => {
    const handleCartUpdate = () => setCartItems(getCart());
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  // FIX: Calculate total from real cart data
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // FIX: Quantity controls wired to real localStorage cart
  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQty);
    }
    setCartItems(getCart()); // refresh local state
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    setCartItems(getCart());
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // FIX: Build order payload from real cart items
      const orderData = {
        totalAmount: totalAmount.toFixed(2),
        deliveryAddress: address,
        paymentMethod,
        items: cartItems.map((item) => ({
          product: { id: item.id },
          quantity: item.quantity,
          priceAtPurchase: item.price,
        })),
      };
      await api.post('/orders', orderData);
      clearCart();              // FIX: clear cart after successful order
      setCartItems([]);
      alert('🎉 Order Placed Successfully!');
      navigate('/profile');
    } catch (err) {
      console.error('Order failed:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('Session expired. Please login again.');
        navigate('/login');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6 text-gray-500">
        <ShoppingBag size={64} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400">Add some products to get started!</p>
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
        >
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Shopping Cart <span className="text-indigo-500 text-xl">({cartItems.length} items)</span>
        </h2>

        {cartItems.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6">
            {/* Product Image — clickable to product page */}
            <Link to={`/product/${item.id}`} className="shrink-0">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/100'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl hover:opacity-90 transition"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.id}`}>
                <h3 className="font-bold text-lg text-gray-800 hover:text-indigo-600 truncate">{item.name}</h3>
              </Link>
              {/* FIX: ₹ Indian Rupee */}
              <p className="text-indigo-600 font-bold mt-1">₹{item.price}</p>
            </div>

            {/* FIX: Quantity controls with real handlers */}
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg shrink-0">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="text-gray-500 hover:text-black font-bold text-lg w-6"
              >
                −
              </button>
              <span className="font-semibold w-4 text-center">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="text-gray-500 hover:text-black font-bold text-lg w-6"
              >
                +
              </button>
            </div>

            {/* Item subtotal */}
            <div className="text-right shrink-0">
              <p className="font-bold text-gray-800">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
            </div>

            {/* FIX: Remove button */}
            <button
              onClick={() => handleRemove(item.id)}
              className="text-gray-400 hover:text-red-500 transition shrink-0"
              title="Remove item"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Checkout Summary */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6 sticky top-24">
          <h3 className="text-xl font-bold text-gray-800">Checkout Summary</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                rows="3"
                placeholder="Enter complete address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="UPI">UPI (Google Pay, PhonePe)</option>
              </select>
            </div>
          </div>

          {/* Order total — FIX: calculated from real cart */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-gray-800 pt-2 border-t border-gray-100">
              <span>Total:</span>
              <span className="text-indigo-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
