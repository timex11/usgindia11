import { Scholarship } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'; // Backend on 3001

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      signal: controller.signal,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || response.statusText || 'API call failed';
      console.error(`[API Error] ${response.status} ${endpoint}:`, data);
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    
    console.error(`[Network Error] ${endpoint}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Network error occurred');
  }
};

export const getScholarships = async (params?: Record<string, string>, options?: RequestInit) => {
  const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiClient<Scholarship[]>(`/scholarships${queryString}`, options);
};

export const getScholarship = async (id: string, options?: RequestInit) => {
  return apiClient<Scholarship>(`/scholarships/${id}`, options);
};

export const getMyProfile = async (options?: RequestInit) => {
  return apiClient('/auth/profile', options);
};

export const executeAdminCommand = async (command: string, options?: RequestInit) => {
  return apiClient('/admin/command', {
    ...options,
    method: 'POST',
    body: JSON.stringify({ command }),
  });
};
