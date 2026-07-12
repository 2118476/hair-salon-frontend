import { apiClient } from './client';
import { ApiResponse, Service } from '../types';

export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await apiClient.get<ApiResponse<Service[]>>('/services');
    return response.data.data;
  },

  getById: async (id: string): Promise<Service> => {
    const response = await apiClient.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<Service, 'id'>): Promise<Service> => {
    const response = await apiClient.post<ApiResponse<Service>>('/services', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Service>): Promise<Service> => {
    const response = await apiClient.put<ApiResponse<Service>>(`/services/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/services/${id}`);
  },
};
