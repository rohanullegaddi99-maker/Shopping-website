import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Cart = () => {
  const navigate = useNavigate();
  // Simulating a cart state for the college project
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch a random product to simulate cart
    api.get('/products').then(res => {
      if(res.data.length > 0) {
        setCartItems([{ product: res.data[0], quantity: 1 }]);
      }
    });
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = async () => {
    if(!address) { alert('Please enter delivery address'); return; }
    setLoading(true);
    try {
      const orderData = {
        totalAmount,
        deliveryAddress: address,
        items: cartItems.map(item => ({
          product: { id: item.product.id },
          quantity: item.quantity,
          priceAtPurchase: item.product.price
        }))
      };
      await api.post('/orders', orderData);
      alert('Order Placed Successfully!');
      navigate('/profile');
    } catch(err) {
      alert('Failed to place order. Please login first.');
      navigate('/login');
    }
    setLoading(false);
  };

  if(cartItems.length === 0) return <div className="text-center py-20 text-gray-500">Your cart is empty.</div>;

  return (
    <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h2>
        {cartItems.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6">
            <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl" />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">{item.product.name}</h3>
              <p className="text-indigo-600 font-bold mt-1">₹{item.product.price}</p>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg">
              <button className="text-gray-500 hover:text-black">-</button>
              <span className="font-medium">{item.quantity}</span>
              <button className="text-gray-500 hover:text-black">+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6 sticky top-24">
          <h3 className="text-xl font-bold text-gray-800">Checkout Summary</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
              <textarea 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                rows="3"
                placeholder="Enter complete address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="UPI">UPI (Google Pay, PhonePe)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-lg font-bold text-gray-800">
            <span>Total:</span>
            <span className="text-indigo-600">₹{totalAmount}</span>
          </div>

          <button 
            onClick={handleCheckout} 
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
