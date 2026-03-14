import { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';
import { axiosInstance } from '@/lib/axios';

export const useApi = () => {
  const [loading, setLoading] = useState(false);

  const request = useCallback(
    async <T>(config: AxiosRequestConfig): Promise<T> => {
      setLoading(true);
      try {
        const response = await axiosInstance.request<T>(config);
        return response.data;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const get = useCallback(<T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'GET', url }), [request]);
  const post = useCallback(<T>(url: string, data?: unknown, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'POST', url, data }), [request]);
  const put = useCallback(<T>(url: string, data?: unknown, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'PUT', url, data }), [request]);
  const patch = useCallback(<T>(url: string, data?: unknown, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'PATCH', url, data }), [request]);
  const del = useCallback(<T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'DELETE', url }), [request]);

  return {
    request,
    loading,
    get,
    post,
    put,
    patch,
    del,
    delete: del,
  };
};
