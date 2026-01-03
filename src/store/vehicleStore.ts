import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Vehicle {
  id: string;
  type: 'truck' | 'bike';
  model: string;
  licensePlate: string;
  driverId: string;
  driverName: string;
  status: 'available' | 'in-use' | 'maintenance';
  lastService: string;
}

interface VehicleStore {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getVehiclesByType: (type: 'truck' | 'bike') => Vehicle[];
  initializeVehicles: () => void;
}

const initialVehicles: Vehicle[] = [
  {
    id: 'VEH-001',
    type: 'truck',
    model: 'Ford F-150',
    licensePlate: 'ABC-1234',
    driverId: '1',
    driverName: 'John Doe',
    status: 'in-use',
    lastService: '2024-12-01',
  },
  {
    id: 'VEH-002',
    type: 'bike',
    model: 'Honda CBR',
    licensePlate: 'XYZ-5678',
    driverId: '3',
    driverName: 'Mike Johnson',
    status: 'available',
    lastService: '2024-11-15',
  },
  {
    id: 'VEH-003',
    type: 'truck',
    model: 'Chevrolet Silverado',
    licensePlate: 'DEF-9012',
    driverId: '5',
    driverName: 'Tom Brown',
    status: 'maintenance',
    lastService: '2024-12-28',
  },
  {
    id: 'VEH-004',
    type: 'bike',
    model: 'Yamaha R1',
    licensePlate: 'GHI-3456',
    driverId: '1',
    driverName: 'John Doe',
    status: 'available',
    lastService: '2024-12-10',
  },
];

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set, get) => ({
      vehicles: [],
      
      addVehicle: (vehicle) => {
        const newVehicle: Vehicle = {
          ...vehicle,
          id: `VEH-${Date.now()}`,
        };
        set((state) => ({
          vehicles: [...state.vehicles, newVehicle],
        }));
      },
      
      updateVehicle: (id, updates) => {
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) =>
            vehicle.id === id ? { ...vehicle, ...updates } : vehicle
          ),
        }));
      },
      
      deleteVehicle: (id) => {
        set((state) => ({
          vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
        }));
      },
      
      getVehiclesByType: (type) => {
        return get().vehicles.filter((vehicle) => vehicle.type === type);
      },
      
      initializeVehicles: () => {
        const currentVehicles = get().vehicles;
        if (currentVehicles.length === 0) {
          set({ vehicles: initialVehicles });
        }
      },
    }),
    {
      name: 'vehicle-storage',
    }
  )
);