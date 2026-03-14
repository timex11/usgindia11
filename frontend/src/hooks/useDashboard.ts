import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { DashboardData } from '@/types';

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await axiosInstance.get('/auth/dashboard');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
