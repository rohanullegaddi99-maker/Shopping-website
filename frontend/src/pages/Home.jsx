import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import api from '../api';
import { addToCart } from '../cartUtils'; // FIX: import cart utility

const Home = () => {
  const [products, setProducts] = useState([]);
  const [mood, setMood] = useState('');
  const [addedId, setAddedId] = useState(null); // FIX: track which product was just added for visual feedback

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products' + (mood ? `?mood=${mood}` : ''));
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [mood]);

  // FIX: Add to cart handler — saves to localStorage and shows brief feedback
  const handleAddToCart = (e, product) => {
    e.preventDefault();        // prevent <Link> navigation
    e.stopPropagation();       // stop event bubbling up to <Link>
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500); // clear feedback after 1.5 s
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-4 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Discover Products That Match Your Mood</h1>
          <p className="text-lg opacity-90">Experience shopping powered by AI recommendations and emotional intelligence.</p>
        </div>
        <div className="hidden md:block">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop" alt="Shopping" className="rounded-full w-64 h-64 object-cover border-4 border-white/20 shadow-2xl" />
        </div>
      </div>

      {/* Mood Filters */}
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {['Happy', 'Fitness', 'Casual', 'Professional', 'Relaxed'].map((m) => (
          <button
            key={m}
            onClick={() => setMood(mood === m ? '' : m)}
            className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              mood === m ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 group relative">
            {/* FIX: Link only wraps the image and info — NOT the Add to Cart button */}
            <Link to={`/product/${product.id}`}>
              <div className="relative overflow-hidden rounded-t-xl aspect-square">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* FIX: stopPropagation so Heart click doesn't navigate */}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-red-50 hover:text-red-500 transition text-gray-400"
                >
                  <Heart size={20} />
                </button>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                  {/* FIX: ₹ Indian Rupee currency */}
                  <span className="font-bold text-indigo-600">₹{product.price}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <Star size={16} fill="currentColor" />
                  <span className="text-gray-600 ml-1">{product.rating}</span>
                </div>
              </div>
            </Link>

            {/* FIX: Add to Cart button is OUTSIDE the Link with a real onClick handler */}
            <div className="px-4 pb-4">
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className={`w-full py-2 rounded-lg transition flex items-center justify-center gap-2 font-medium ${
                  addedId === product.id
                    ? 'bg-green-600 text-white'   // success state
                    : 'bg-gray-900 text-white hover:bg-indigo-600'
                }`}
              >
                <ShoppingCart size={18} />
                {addedId === product.id ? '✓ Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products found for this mood.
        </div>
      )}
    </div>
  );
};

export default Home;
