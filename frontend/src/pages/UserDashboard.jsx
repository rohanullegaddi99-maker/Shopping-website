import { useState, useEffect } from 'react';
import { Package, User as UserIcon, MapPin } from 'lucide-react';
import api from '../api';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const name = localStorage.getItem('name');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = filterStatus === 'All' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="md:col-span-1 space-y-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-500 text-sm mt-1">Customer</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button className="w-full text-left px-6 py-4 border-b border-gray-50 hover:bg-gray-50 flex items-center gap-3 text-indigo-600 font-medium">
            <Package size={20} /> My Orders
          </button>
          <button className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center gap-3 text-gray-600 font-medium">
            <MapPin size={20} /> Saved Addresses
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:col-span-3 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-2xl font-bold text-gray-800">My Orders</h3>
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center text-gray-500">
            No orders found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-sm text-gray-500">Order #{order.id}</span>
                    <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="font-bold text-lg text-gray-800">₹{order.totalAmount}</div>
                </div>
                
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={item.product?.imageUrl} alt={item.product?.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.product?.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.priceAtPurchase}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
