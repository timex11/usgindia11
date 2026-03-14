import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

// Use relative path to leverage Next.js rewrites (avoids CORS and mixed content)
const API_URL = '/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error('Session expired. Please login again.');
    } else {
      const data = error.response?.data as { message?: string } | undefined;
      const message = data?.message || error.message || 'Something went wrong';
      toast.error(message);
    }
    return Promise.reject(error);
  }
);
