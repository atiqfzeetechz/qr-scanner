import { useState, useEffect } from 'react';
import { PlusCircle, Bike } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { theme } from '../theme';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

export default function Motorcycles() {
  const {  getVehiclesByType, initializeVehicles } = useVehicleStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    initializeVehicles();
  }, [initializeVehicles]);

  const motorcycles = getVehiclesByType('bike');
  
  const filteredMotorcycles = motorcycles.filter((bike) => {
    const matchesSearch =
      bike.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bike.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bike.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bike.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    'available': 'bg-green-100 text-green-700',
    'in-use': 'bg-blue-100 text-blue-700',
    'maintenance': 'bg-orange-100 text-orange-700'
  };

  const columns = [
    { 
      key: 'model', 
      label: 'Motorcycle', 
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: theme.gradients.secondary }}
          >
            <Bike size={20} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    { key: 'licensePlate', label: 'License Plate' },
    { key: 'driverName', label: 'Driver' },
    { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value} colorMap={statusColors} /> },
    { key: 'lastService', label: 'Last Service', render: (value: string) => new Date(value).toLocaleDateString() }
  ];

  const renderGridItem = (bike: any) => (
    <div key={bike.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-14 h-14 rounded-lg flex items-center justify-center"
          style={{ background: theme.gradients.secondary }}
        >
          <Bike size={28} className="text-white" />
        </div>
        <StatusBadge status={bike.status} colorMap={statusColors} />
      </div>

      <h3 className="font-bold text-lg text-gray-900 mb-1">{bike.model}</h3>
      <p className="text-sm text-gray-600 mb-3">{bike.licensePlate}</p>

      <div className="space-y-2 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Driver:</span>
          <span className="font-medium text-gray-900">{bike.driverName}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Last Service:</span>
          <span className="font-medium text-gray-900">
            {new Date(bike.lastService).toLocaleDateString()}
          </span>
        </div>
      </div>

      <button
        className="w-full mt-4 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        style={{ background: theme.gradients.secondary }}
      >
        View Details
      </button>
    </div>
  );

  const filters = (
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
    >
      <option value="all">All Status</option>
      <option value="available">Available</option>
      <option value="in-use">In Use</option>
      <option value="maintenance">Maintenance</option>
    </select>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Motorcycles"
        description={`Manage your motorcycle fleet (${motorcycles.length} bikes)`}
        action={
          <button
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            style={{ background: theme.gradients.secondary }}
          >
            <PlusCircle size={20} />
            Add Motorcycle
          </button>
        }
      />

      <DataTable
        data={filteredMotorcycles}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search motorcycles..."
        filters={filters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        renderGridItem={renderGridItem}
        emptyMessage="No motorcycles found"
        emptyIcon={<Bike size={48} className="mx-auto text-gray-300 mb-4" />}
      />
    </div>
  );
}