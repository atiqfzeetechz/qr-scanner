import { useState, useEffect } from 'react';
import { Search, PackagePlus, MapPin, Grid3X3, List, MoreVertical, Truck, Bike, CheckCircle } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { theme } from '../theme';
import PageHeader from '../components/PageHeader';

export default function CompletedOrders() {
  const { getOrdersByStatus, initializeOrders } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVehicle, setFilterVehicle] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    initializeOrders();
  }, [initializeOrders]);

  const completedOrders = getOrdersByStatus('delivered');
  
  const filteredOrders = completedOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVehicle = filterVehicle === 'all' || order.vehicleType === filterVehicle;
    return matchesSearch && matchesVehicle;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Orders"
        description={`Successfully delivered orders (${completedOrders.length} orders)`}
        action={
          <button
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            style={{ background: theme.gradients.primary }}
          >
            <PackagePlus size={20} />
            New Order
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search completed orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterVehicle}
              onChange={(e) => setFilterVehicle(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
            >
              <option value="all">All Vehicles</option>
              <option value="truck">Truck</option>
              <option value="bike">Bike</option>
            </select>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-green-50/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Customer: {order.customerName}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                    <CheckCircle size={12} />
                    delivered
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={16}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: theme.colors.primary.main }}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="text-sm text-gray-700">{order.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={16}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: theme.colors.secondary.main }}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Delivery</p>
                      <p className="text-sm text-gray-700">{order.deliveryLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div
                      className="px-3 py-1 rounded-full text-xs font-medium text-white capitalize"
                      style={{
                        background:
                          order.vehicleType === 'truck'
                            ? theme.colors.navy.main
                            : theme.colors.secondary.main,
                      }}
                    >
                      {order.vehicleType}
                    </div>
                    <span className="text-sm text-gray-600">{order.driverName}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${order.amount}</p>
                    <p className="text-xs text-gray-500">
                      Delivered: {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Driver</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Delivered</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-green-50">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-900">{order.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500 truncate max-w-32">{order.pickupLocation}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{order.driverName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {order.vehicleType === 'truck' ? (
                          <Truck size={16} className="text-gray-600" />
                        ) : (
                          <Bike size={16} className="text-gray-600" />
                        )}
                        <span className="text-sm text-gray-700 capitalize">{order.vehicleType}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-900">${order.amount}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-green-300 mb-4" />
            <p className="text-gray-500">No completed orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}