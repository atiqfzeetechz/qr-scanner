import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'driver' | 'customer' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  joinedDate: string;
  phone: string;
  avatar?: string;
}

interface UserStore {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUsersByRole: (role: User['role']) => User[];
  initializeUsers: () => void;
}

const initialUsers: User[] = [
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
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom@example.com',
    role: 'driver',
    status: 'suspended',
    joinedDate: '2024-01-05',
    phone: '+1234567894',
  },
];

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      
      addUser: (user) => {
        const newUser: User = {
          ...user,
          id: `USER-${Date.now()}`,
        };
        set((state) => ({
          users: [...state.users, newUser],
        }));
      },
      
      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        }));
      },
      
      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },
      
      getUsersByRole: (role) => {
        return get().users.filter((user) => user.role === role);
      },
      
      initializeUsers: () => {
        const currentUsers = get().users;
        if (currentUsers.length === 0) {
          set({ users: initialUsers });
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);