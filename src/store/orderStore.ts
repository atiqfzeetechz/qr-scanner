import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Order {
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

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrdersByStatus: (status: Order['status']) => Order[];
  initializeOrders: () => void;
}

const initialOrders: Order[] = [
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
  },
  {
    id: 'ORD-006',
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
  {
    id: 'ORD-007',
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
  {
    id: 'ORD-008',
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
  {
    id: 'ORD-009',
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
  {
    id: 'ORD-010',
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
  {
    id: 'ORD-011',
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
  {
    id: 'ORD-012',
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
  {
    id: 'ORD-013',
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
  {
    id: 'ORD-014',
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
  {
    id: 'ORD-015',
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
  {
    id: 'ORD-016',
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
  {
    id: 'ORD-017',
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

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: `ORD-${Date.now()}`,
        };
        set((state) => ({
          orders: [...state.orders, newOrder],
        }));
      },
      
      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, ...updates } : order
          ),
        }));
      },
      
      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        }));
      },
      
      getOrdersByStatus: (status) => {
        return get().orders.filter((order) => order.status === status);
      },
      
      initializeOrders: () => {
        const currentOrders = get().orders;
        if (currentOrders.length === 0) {
          set({ orders: initialOrders });
        }
      },
    }),
    {
      name: 'order-storage',
    }
  )
);