import { useState, useEffect } from 'react';
import { PlusCircle, Truck as TruckIcon, Bike } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { theme } from '../theme';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

export default function Vehicles() {

  const { vehicles, initializeVehicles } = useVehicleStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    initializeVehicles();
  }, [initializeVehicles]);



  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || vehicle.type === filterType;
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const statusColors = {
    'available': 'bg-green-100 text-green-700',
    'in-use': 'bg-blue-100 text-blue-700',
    'maintenance': 'bg-orange-100 text-orange-700'
  };

  const columns = [
    { 
      key: 'model', 
      label: 'Vehicle', 
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: item.type === 'truck' ? theme.gradients.dark : theme.gradients.secondary,
            }}
          >
            {item.type === 'truck' ? (
              <TruckIcon size={20} className="text-white" />
            ) : (
              <Bike size={20} className="text-white" />
            )}
          </div>
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    { key: 'licensePlate', label: 'License Plate' },
    { key: 'driverName', label: 'Driver' },
    { 
      key: 'type', 
      label: 'Type', 
      render: (value: string) => (
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
          style={{
            backgroundColor: value === 'truck' ? theme.colors.navy.light : theme.colors.secondary.light,
            color: value === 'truck' ? theme.colors.navy.main : theme.colors.secondary.main,
          }}
        >
          {value}
        </span>
      )
    },
    { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value} colorMap={statusColors} /> },
    { key: 'lastService', label: 'Last Service', render: (value: string) => new Date(value).toLocaleDateString() }
  ];

  const renderGridItem = (vehicle: any) => (
    <div key={vehicle.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-14 h-14 rounded-lg flex items-center justify-center"
          style={{
            background: vehicle.type === 'truck' ? theme.gradients.dark : theme.gradients.secondary,
          }}
        >
          {vehicle.type === 'truck' ? (
            <TruckIcon size={28} className="text-white" />
          ) : (
            <Bike size={28} className="text-white" />
          )}
        </div>
        <StatusBadge status={vehicle.status} colorMap={statusColors} />
      </div>

      <h3 className="font-bold text-lg text-gray-900 mb-1">{vehicle.model}</h3>
      <p className="text-sm text-gray-600 mb-3">{vehicle.licensePlate}</p>

      <div className="space-y-2 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Driver:</span>
          <span className="font-medium text-gray-900">{vehicle.driverName}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Last Service:</span>
          <span className="font-medium text-gray-900">
            {new Date(vehicle.lastService).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span
            className="font-medium capitalize"
            style={{
              color: vehicle.type === 'truck' ? theme.colors.navy.main : theme.colors.secondary.main,
            }}
          >
            {vehicle.type}
          </span>
        </div>
      </div>

      <button
        className="w-full mt-4 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        style={{
          background: vehicle.type === 'truck' ? theme.gradients.dark : theme.gradients.secondary,
        }}
      >
        View Details
      </button>
    </div>
  );

  const filters = (
    <>
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
      >
        <option value="all">All Types</option>
        <option value="truck">Truck</option>
        <option value="bike">Bike</option>
      </select>
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
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicles"
        description="Manage your fleet of trucks and bikes"
        action={
          <button
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            style={{ background: theme.gradients.primary }}
          >
            <PlusCircle size={20} />
            Add Vehicle
          </button>
        }
      />

      {/* Quick Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/trucks')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Trucks</h3>
              <p className="text-3xl font-bold mt-2" style={{ color: theme.colors.navy.main }}>
                {trucks.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {trucks.filter(t => t.status === 'available').length} available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: theme.gradients.dark }}
              >
                <TruckIcon size={24} className="text-white" />
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/motorcycles')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Motorcycles</h3>
              <p className="text-3xl font-bold mt-2" style={{ color: theme.colors.secondary.main }}>
                {motorcycles.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {motorcycles.filter(m => m.status === 'available').length} available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: theme.gradients.secondary }}
              >
                <Bike size={24} className="text-white" />
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div> */}

      <DataTable
        data={filteredVehicles}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search vehicles..."
        filters={filters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        renderGridItem={renderGridItem}
        emptyMessage="No vehicles found"
      />
    </div>
  );
}