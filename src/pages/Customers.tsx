import { useState, useEffect } from 'react';
import { UserPlus, ShoppingBag } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { theme } from '../theme';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

export default function Customers() {
  const {  getUsersByRole, initializeUsers } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    initializeUsers();
  }, [initializeUsers]);

  const customers = getUsersByRole('customer');
  
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    'active': 'bg-green-100 text-green-700',
    'pending': 'bg-yellow-100 text-yellow-700',
    'suspended': 'bg-red-100 text-red-700'
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Name', 
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ background: theme.gradients.secondary }}
          >
            {value.charAt(0)}
          </div>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value} colorMap={statusColors} /> },
    { key: 'joinedDate', label: 'Joined', render: (value: string) => new Date(value).toLocaleDateString() }
  ];

  const renderGridItem = (customer: any) => (
    <div key={customer.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold"
          style={{ background: theme.gradients.secondary }}
        >
          {customer.name.charAt(0)}
        </div>
        <StatusBadge status={customer.status} colorMap={statusColors} />
      </div>

      <h3 className="font-bold text-lg text-gray-900 mb-1">{customer.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{customer.email}</p>

      <div className="space-y-2 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Phone:</span>
          <span className="font-medium text-gray-900">{customer.phone}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Joined:</span>
          <span className="font-medium text-gray-900">
            {new Date(customer.joinedDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );

  const filters = (
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
    >
      <option value="all">All Status</option>
      <option value="active">Active</option>
      <option value="pending">Pending</option>
      <option value="suspended">Suspended</option>
    </select>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={`Manage all customers in the system (${customers.length} customers)`}
        action={
          <button
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            style={{ background: theme.gradients.primary }}
          >
            <UserPlus size={20} />
            Add Customer
          </button>
        }
      />

      <DataTable
        data={filteredCustomers}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search customers..."
        filters={filters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        renderGridItem={renderGridItem}
        emptyMessage="No customers found"
        emptyIcon={<ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />}
      />
    </div>
  );
}