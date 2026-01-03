import { useState, useEffect } from 'react';
import { PackagePlus, MapPin, Truck, Bike } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { theme } from '../theme';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

export default function Orders() {
  const { orders, initializeOrders } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVehicle, setFilterVehicle] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    initializeOrders();
  }, [initializeOrders]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesVehicle = filterVehicle === 'all' || order.vehicleType === filterVehicle;
    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const statusColors = {
    'delivered': 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    'pending': 'bg-yellow-100 text-yellow-700',
    'cancelled': 'bg-red-100 text-red-700'
  };

  const columns = [
    { key: 'id', label: 'Order ID', render: (value: string) => <span className="text-sm font-medium text-gray-900">{value}</span> },
    { 
      key: 'customerName', 
      label: 'Customer', 
      render: (value: string, item: any) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 truncate max-w-32">{item.pickupLocation}</p>
        </div>
      )
    },
    { key: 'driverName', label: 'Driver' },
    { 
      key: 'vehicleType', 
      label: 'Vehicle', 
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {value === 'truck' ? <Truck size={16} className="text-gray-600" /> : <Bike size={16} className="text-gray-600" />}
          <span className="text-sm text-gray-700 capitalize">{value}</span>
        </div>
      )
    },
    { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value} colorMap={statusColors} /> },
    { key: 'amount', label: 'Amount', render: (value: number) => <span className="text-sm font-medium text-gray-900">${value}</span> },
    { key: 'createdAt', label: 'Date', render: (value: string) => new Date(value).toLocaleDateString() }
  ];

  const renderGridItem = (order: any) => (
    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900">{order.id}</h3>
          <p className="text-sm text-gray-600 mt-1">Customer: {order.customerName}</p>
        </div>
        <StatusBadge status={order.status} colorMap={statusColors} />
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-2">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: theme.colors.primary.main }} />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Pickup</p>
            <p className="text-sm text-gray-700">{order.pickupLocation}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" style={{ color: theme.colors.secondary.main }} />
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
              background: order.vehicleType === 'truck' ? theme.colors.navy.main : theme.colors.secondary.main,
            }}
          >
            {order.vehicleType}
          </div>
          <span className="text-sm text-gray-600">{order.driverName}</span>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900">${order.amount}</p>
          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );

  const filters = (
    <>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select
        value={filterVehicle}
        onChange={(e) => setFilterVehicle(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
      >
        <option value="all">All Vehicles</option>
        <option value="truck">Truck</option>
        <option value="bike">Bike</option>
      </select>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Track and manage all delivery orders"
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

      <DataTable
        data={filteredOrders}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search orders..."
        filters={filters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        renderGridItem={renderGridItem}
        emptyMessage="No orders found"
      />
    </div>
  );
}