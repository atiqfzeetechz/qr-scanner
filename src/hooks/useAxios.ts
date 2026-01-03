import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

interface UseAxiosReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (config: AxiosRequestConfig) => Promise<T>;
  get: (url: string, config?: AxiosRequestConfig) => Promise<T>;
  post: (url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
  put: (url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
  delete: (url: string, config?: AxiosRequestConfig) => Promise<T>;
}

export const useAxios = <T = any>(): UseAxiosReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (config: AxiosRequestConfig): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      const response: AxiosResponse<T> = await axiosInstance(config);
      setData(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url: string, config?: AxiosRequestConfig) => {
    return execute({ ...config, method: 'GET', url });
  }, [execute]);

  const post = useCallback((url: string, data?: any, config?: AxiosRequestConfig) => {
    return execute({ ...config, method: 'POST', url, data });
  }, [execute]);

  const put = useCallback((url: string, data?: any, config?: AxiosRequestConfig) => {
    return execute({ ...config, method: 'PUT', url, data });
  }, [execute]);

  const deleteRequest = useCallback((url: string, config?: AxiosRequestConfig) => {
    return execute({ ...config, method: 'DELETE', url });
  }, [execute]);

  return {
    data,
    loading,
    error,
    execute,
    get,
    post,
    put,
    delete: deleteRequest,
  };
};