import axios from 'axios';
import { useLoaderStore } from '../store/loaderStore';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from './config';



// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    "Authorization": `Bearer ${useAuthStore.getState().qrToken}`
  },
});

// Request interceptor - show loader
axiosInstance.interceptors.request.use(
  (config) => {
    const { showLoader } = useLoaderStore.getState();
    showLoader('Loading...');
    return config;
  },
  (error) => {
    const { hideLoader } = useLoaderStore.getState();
    hideLoader();
    return Promise.reject(error);
  }
);

// Response interceptor - hide loader
axiosInstance.interceptors.response.use(
  (response) => {
    const { hideLoader } = useLoaderStore.getState();
    hideLoader();
    return response;
  },
  (error) => {
    const { hideLoader } = useLoaderStore.getState();
    hideLoader();
    return Promise.reject(error);
  }
);

export default axiosInstance;