import { useState, useEffect } from 'react';
import { UserPlus, Users as UsersIcon } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { theme } from '../theme';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

export default function Users() {
  const { users, initializeUsers } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    initializeUsers();
  }, [initializeUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const statusColors = {
    'active': 'bg-green-100 text-green-700',
    'pending': 'bg-yellow-100 text-yellow-700',
    'suspended': 'bg-red-100 text-red-700'
  };

  const roleColors = {
    'admin': 'bg-purple-100 text-purple-700',
    'driver': 'bg-blue-100 text-blue-700',
    'customer': 'bg-orange-100 text-orange-700'
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
    { key: 'role', label: 'Role', render: (value: string) => <StatusBadge status={value} colorMap={roleColors} /> },
    { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value} colorMap={statusColors} /> },
    { key: 'joinedDate', label: 'Joined', render: (value: string) => new Date(value).toLocaleDateString() }
  ];

  const renderGridItem = (user: any) => (
    <div key={user.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold"
          style={{ background: theme.gradients.secondary }}
        >
          {user.name.charAt(0)}
        </div>
        <StatusBadge status={user.status} colorMap={statusColors} />
      </div>

      <h3 className="font-bold text-lg text-gray-900 mb-1">{user.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{user.email}</p>

      <div className="space-y-2 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Phone:</span>
          <span className="font-medium text-gray-900">{user.phone}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Role:</span>
          <StatusBadge status={user.role} colorMap={roleColors} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Joined:</span>
          <span className="font-medium text-gray-900">
            {new Date(user.joinedDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );

  const filters = (
    <>
      <select
        value={filterRole}
        onChange={(e) => setFilterRole(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
      >
        <option value="all">All Roles</option>
        <option value="admin">Admin</option>
        <option value="driver">Driver</option>
        <option value="customer">Customer</option>
      </select>
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
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage all users in the system"
        action={
          <button
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            style={{ background: theme.gradients.primary }}
          >
            <UserPlus size={20} />
            Add User
          </button>
        }
      />

      <DataTable
        data={filteredUsers}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search users..."
        filters={filters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        renderGridItem={renderGridItem}
        emptyMessage="No users found"
        emptyIcon={<UsersIcon size={48} className="mx-auto text-gray-300 mb-4" />}
      />
    </div>
  );
}