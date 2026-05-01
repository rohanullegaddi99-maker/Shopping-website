import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import api from '../api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-20 text-xl text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
      <div className="w-full md:w-1/2">
        <img src={product.imageUrl || 'https://via.placeholder.com/600'} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="w-full md:w-1/2 p-8 md:p-12 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-yellow-400">
            <Star size={20} fill="currentColor" />
            <span className="text-gray-600 font-medium">{product.rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
        <div className="text-3xl font-bold text-indigo-600">₹{product.price}</div>
        
        <div className="pt-6 border-t border-gray-100">
          <button className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-lg transition flex items-center justify-center gap-3">
            <ShoppingCart size={24} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
