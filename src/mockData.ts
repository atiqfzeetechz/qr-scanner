export interface User {
  id: string;
  name: string;
  email: string;
  role: 'driver' | 'customer' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  joinedDate: string;
  phone: string;
  avatar?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  driverId: string;
  driverName: string;
  vehicleType: 'truck' | 'bike';
  status: 'pending' | 'in-progress' | 'delivered' | 'cancelled';
  pickupLocation: string;
  deliveryLocation: string;
  createdAt: string;
  deliveredAt?: string;
  amount: number;
}

export interface Vehicle {
  id: string;
  type: 'truck' | 'bike';
  model: string;
  licensePlate: string;
  driverId: string;
  driverName: string;
  status: 'available' | 'in-use' | 'maintenance';
  lastService: string;
}

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalDrivers: number;
  totalVehicles: number;
  ordersGrowth: number;
  revenueGrowth: number;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'driver',
    status: 'active',
    joinedDate: '2024-01-15',
    phone: '+1234567890',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'customer',
    status: 'active',
    joinedDate: '2024-02-20',
    phone: '+1234567891',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'driver',
    status: 'pending',
    joinedDate: '2024-12-25',
    phone: '+1234567892',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'customer',
    status: 'active',
    joinedDate: '2024-03-10',
    phone: '+1234567893',
  },
  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: '2',
    customerName: 'Jane Smith',
    driverId: '1',
    driverName: 'John Doe',
    vehicleType: 'truck',
    status: 'delivered',
    pickupLocation: '123 Main St, New York',
    deliveryLocation: '456 Park Ave, New York',
    createdAt: '2024-12-20T10:00:00Z',
    deliveredAt: '2024-12-20T14:30:00Z',
    amount: 150,
  },
  {
    id: 'ORD-002',
    customerId: '4',
    customerName: 'Sarah Williams',
    driverId: '1',
    driverName: 'John Doe',
    vehicleType: 'bike',
    status: 'in-progress',
    pickupLocation: '789 Broadway, New York',
    deliveryLocation: '321 5th Ave, New York',
    createdAt: '2024-12-30T09:00:00Z',
    amount: 75,
  },
  {
    id: 'ORD-003',
    customerId: '2',
    customerName: 'Jane Smith',
    driverId: '3',
    driverName: 'Mike Johnson',
    vehicleType: 'truck',
    status: 'pending',
    pickupLocation: '555 West St, New York',
    deliveryLocation: '777 East St, New York',
    createdAt: '2024-12-31T08:00:00Z',
    amount: 200,
  },
  {
    id: 'ORD-004',
    customerId: '4',
    customerName: 'Sarah Williams',
    driverId: '1',
    driverName: 'John Doe',
    vehicleType: 'bike',
    status: 'delivered',
    pickupLocation: '100 Downtown, New York',
    deliveryLocation: '200 Uptown, New York',
    createdAt: '2024-12-28T11:00:00Z',
    deliveredAt: '2024-12-28T12:15:00Z',
    amount: 60,
  },
  {
    id: 'ORD-005',
    customerId: '2',
    customerName: 'Jane Smith',
    driverId: '5',
    driverName: 'Tom Brown',
    vehicleType: 'truck',
    status: 'cancelled',
    pickupLocation: '999 Side St, New York',
    deliveryLocation: '888 Back St, New York',
    createdAt: '2024-12-15T15:00:00Z',
    amount: 180,
  }, {
    id: 'ORD-005',
    customerId: '2',
    customerName: 'Jane Smith',
    driverId: '5',
    driverName: 'Tom Brown',
    vehicleType: 'truck',
    status: 'cancelled',
    pickupLocation: '999 Side St, New York',
    deliveryLocation: '888 Back St, New York',
    createdAt: '2024-12-15T15:00:00Z',
    amount: 180,
  }, {
    id: 'ORD-005',
    customerId: '2',
    customerName: 'Jane Smith',
    driverId: '5',
    driverName: 'Tom Brown',
    vehicleType: 'truck',
    status: 'cancelled',
    pickupLocation: '999 Side St, New York',
    deliveryLocation: '888 Back St, New York',
    createdAt: '2024-12-15T15:00:00Z',
    amount: 180,
  }, {
    id: 'ORD-005',
    customerId: '2',
    customerName: 'Jane Smith',
    driverId: '5',
    driverName: 'Tom Brown',
    vehicleType: 'truck',
    status: 'cancelled',
    pickupLocation: '999 Side St, New York',
    deliveryLocation: '888 Back St, New York',
    createdAt: '2024-12-15T15:00:00Z',
    amount: 180,
  }, {
    id: 'ORD-005',
    customerId: '2',
    customerName: 'Jane Smith',
    driverId: '5',
    driverName: 'Tom Brown',
    vehicleType: 'truck',
    status: 'cancelled',
    pickupLocation: '999 Side St, New York',
    deliveryLocation: '888 Back St, New York',
    createdAt: '2024-12-15T15:00:00Z',
    amount: 180,
  }, {
    id: 'ORD-005',
    customerId: '2',
    customerName: 'Jane Smith',
    driverId: '5',
    driverName: 'Tom Brown',
    vehicleType: 'truck',
    status: 'cancelled',
    pickupLocation: '999 Side St, New York',
    deliveryLocation: '888 Back St, New York',
    createdAt: '2024-12-15T15:00:00Z',
    amount: 180,
  }, {
    id: 'ORD-005',
    customerId: '2',
    customerName: 'Jane Smith',
    driverId: '5',
    driverName: 'Tom Brown',
    vehicleType: 'truck',
    status: 'cancelled',
    pickupLocation: '999 Side St, New York',
    deliveryLocation: '888 Back St, New York',
    createdAt: '2024-12-15T15:00:00Z',
    amount: 180,
  }, {
    id: 'ORD-005',
    customerId: '2',
    customerName: 'Jane Smith',
    driverId: '5',
    driverName: 'Tom Brown',
    vehicleType: 'truck',
    status: 'cancelled',
    pickupLocation: '999 Side St, New York',
    deliveryLocation: '888 Back St, New York',
    createdAt: '2024-12-15T15:00:00Z',
    amount: 180,
  }, {
    id: 'ORD-005',
    customerId: '2',
    customerName: 'Jane Smith',
    driverId: '5',
    driverName: 'Tom Brown',
    vehicleType: 'truck',
    status: 'cancelled',
    pickupLocation: '999 Side St, New York',
    deliveryLocation: '888 Back St, New York',
    createdAt: '2024-12-15T15:00:00Z',
    amount: 180,
  },
];

export const mockVehicles: Vehicle[] = [
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

export const mockDashboardStats: DashboardStats = {
  totalOrders: 245,
  activeOrders: 12,
  totalRevenue: 48750,
  totalUsers: 156,
  totalDrivers: 45,
  totalVehicles: 62,
  ordersGrowth: 12.5,
  revenueGrowth: 8.3,
};
