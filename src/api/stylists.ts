import { apiClient } from './client';
import { Stylist } from '../types';

export const stylistsApi = {
  getAll: async (): Promise<Stylist[]> => {
    const { data } = await apiClient.get<Stylist[]>('/stylists');
    return data;
  },

  getById: async (id: string): Promise<Stylist> => {
    const { data } = await apiClient.get<Stylist>(`/stylists/${id}`);
    return data;
  },

  // The public list endpoint returns all active stylists; filtering by service is
  // done client-side where needed.
  getByService: async (_serviceId: string): Promise<Stylist[]> => {
    const { data } = await apiClient.get<Stylist[]>('/stylists');
    return data;
  },

  // Legacy single-salon admin (platform ADMIN/MODERATOR)
  create: async (body: Omit<Stylist, 'id'>): Promise<Stylist> => {
    const { data } = await apiClient.post<Stylist>('/stylists', body);
    return data;
  },

  update: async (id: string, body: Partial<Stylist>): Promise<Stylist> => {
    const { data } = await apiClient.put<Stylist>(`/stylists/${id}`, body);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/stylists/${id}`);
  },
};
