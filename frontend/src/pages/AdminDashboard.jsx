import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Tag, ShoppingBag } from 'lucide-react';
import api from '../api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState({});
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data);
    } catch (e) {
      console.error('Failed to fetch analytics:', e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (e) {
      console.error('Failed to fetch admin orders:', e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (e) {
      console.error('Failed to fetch products:', e);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchOrders();
    fetchProducts();
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status?status=${status}`);
      fetchOrders();
    } catch (e) {
      console.error('Failed to update order status:', e);
    }
  };

  return (
    <div className="flex min-h-[80vh] bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 space-y-2">
        <h2 className="text-2xl font-bold mb-8 tracking-wide text-indigo-400">Admin Panel</h2>
        
        <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'overview' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}>
          <LayoutDashboard size={20} /> Overview
        </button>
        <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'products' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}>
          <Package size={20} /> Products
        </button>
        <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'orders' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}>
          <ShoppingBag size={20} /> Orders
        </button>
        <button onClick={() => setActiveTab('brands')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'brands' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}>
          <Tag size={20} /> Brands
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-800">Dashboard Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">₹{analytics.totalRevenue || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalOrders || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalProducts || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalUsers || 0}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-800">Manage Orders</h3>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-gray-600">{order.user?.name}</td>
                      <td className="px-6 py-4 font-bold">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        {order.status === 'Pending' && (
                          <button onClick={() => updateOrderStatus(order.id, 'Shipped')} className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600">Mark Shipped</button>
                        )}
                        {order.status === 'Shipped' && (
                          <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="text-xs bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600">Mark Delivered</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-bold text-gray-800">Manage Products</h3>
              <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700">Add New Product</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h4>
                    <p className="font-bold text-indigo-600">₹{product.price}</p>
                    <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
