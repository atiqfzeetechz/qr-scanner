import { create } from 'zustand';

interface LoaderState {
  isLoading: boolean;
  message?: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  isLoading: false,
  message: undefined,
  
  showLoader: (message?: string) => {
    set({ isLoading: true, message });
  },
  
  hideLoader: () => {
    set({ isLoading: false, message: undefined });
  },
}));