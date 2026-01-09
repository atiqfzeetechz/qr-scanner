import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: any, token: string | null | undefined) => Promise<void>;
  logout: () => void;
  qrToken: string | null | undefined
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      qrToken: "",
      login: async (user: any, token) => {


        // Simulate API call delay

        set({ user: user, isAuthenticated: true, qrToken: token });
        window.location.href='/admin'
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'truckNBike',
    }
  )
);