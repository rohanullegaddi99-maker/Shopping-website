import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search } from 'lucide-react';
import { getCartCount } from '../cartUtils'; // FIX: import real cart count utility

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  // FIX: Real cart count from localStorage — starts with actual value
  const [cartCount, setCartCount] = useState(getCartCount());

  // FIX: Listen for cartUpdated events so badge updates instantly on Add to Cart
  useEffect(() => {
    const handleCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    navigate('/login');
    window.location.reload(); // ensure navbar state resets
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          🛍️ SmartShop
        </Link>

        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <div className="flex items-center gap-6">
          {/* FIX: Cart icon shows real count from localStorage */}
          <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 transition">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {token ? (
            <div className="flex items-center gap-4">
              {role === 'ADMIN' && (
                <Link to="/admin" className="text-sm font-bold text-red-600 hover:text-red-700 uppercase tracking-wider">
                  Admin Panel
                </Link>
              )}
              <Link to="/profile" className="text-gray-700 font-medium hidden sm:block hover:text-indigo-600 transition">
                Hi, {name}
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 transition" title="Logout">
                <LogOut size={24} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition"
            >
              <User size={20} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
