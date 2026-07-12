import { apiClient } from './client';
import { ApiResponse, Stylist } from '../types';

export const stylistsApi = {
  getAll: async (): Promise<Stylist[]> => {
    const response = await apiClient.get<ApiResponse<Stylist[]>>('/stylists');
    return response.data.data;
  },

  getById: async (id: string): Promise<Stylist> => {
    const response = await apiClient.get<ApiResponse<Stylist>>(`/stylists/${id}`);
    return response.data.data;
  },

  getByService: async (serviceId: string): Promise<Stylist[]> => {
    const response = await apiClient.get<ApiResponse<Stylist[]>>(`/stylists?serviceId=${serviceId}`);
    return response.data.data;
  },

  create: async (data: Omit<Stylist, 'id'>): Promise<Stylist> => {
    const response = await apiClient.post<ApiResponse<Stylist>>('/stylists', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Stylist>): Promise<Stylist> => {
    const response = await apiClient.put<ApiResponse<Stylist>>(`/stylists/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/stylists/${id}`);
  },
};
