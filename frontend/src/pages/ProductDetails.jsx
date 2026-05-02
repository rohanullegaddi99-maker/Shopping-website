import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, Package } from 'lucide-react';
import api from '../api';
import { addToCart } from '../cartUtils'; // FIX: import cart utility

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);       // FIX: track fetch errors
  const [quantity, setQuantity] = useState(1);     // FIX: quantity selector
  const [added, setAdded] = useState(false);       // FIX: visual feedback

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        // FIX: show proper error instead of infinite "Loading..."
        setError('Product not found or server is unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // FIX: Add to cart handler — adds 'quantity' units of this product
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500">
        <Package size={48} className="animate-pulse text-indigo-400" />
        <p className="text-xl font-medium">Loading product...</p>
      </div>
    );
  }

  // FIX: show clear error if product couldn't be loaded
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500">
        <Package size={48} className="text-red-300" />
        <p className="text-xl font-medium">{error || 'Product not found.'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 flex items-center gap-2 text-indigo-600 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
      {/* Product Image */}
      <div className="w-full md:w-1/2">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/600'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="w-full md:w-1/2 p-8 md:p-12 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-yellow-400">
            <Star size={20} fill="currentColor" />
            <span className="text-gray-600 font-medium">{product.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

        {/* FIX: ₹ Indian Rupee */}
        <div className="text-3xl font-bold text-indigo-600">₹{product.price}</div>

        {/* Stock info */}
        {product.stock !== undefined && (
          <p className="text-sm text-gray-500">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">✓ In Stock ({product.stock} left)</span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </p>
        )}

        {/* FIX: Quantity selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-gray-600 hover:text-black font-bold text-lg w-6"
            >
              −
            </button>
            <span className="font-semibold w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="text-gray-600 hover:text-black font-bold text-lg w-6"
            >
              +
            </button>
          </div>
        </div>

        {/* FIX: Add to Cart with real onClick and visual feedback */}
        <div className="pt-6 border-t border-gray-100">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full md:w-auto px-8 py-4 rounded-xl font-medium text-lg transition flex items-center justify-center gap-3 ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ShoppingCart size={24} />
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
