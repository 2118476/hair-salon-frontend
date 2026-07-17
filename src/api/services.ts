import { apiClient } from './client';
import { Service } from '../types';

export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const { data } = await apiClient.get<Service[]>('/services');
    return data;
  },

  getById: async (id: string): Promise<Service> => {
    const { data } = await apiClient.get<Service>(`/services/${id}`);
    return data;
  },

  // Legacy single-salon admin (platform ADMIN/MODERATOR)
  create: async (body: Omit<Service, 'id'>): Promise<Service> => {
    const { data } = await apiClient.post<Service>('/services', body);
    return data;
  },

  update: async (id: string, body: Partial<Service>): Promise<Service> => {
    const { data } = await apiClient.put<Service>(`/services/${id}`, body);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
  },

  // Tenant-scoped management
  listForBusiness: async (businessId: string): Promise<Service[]> => {
    const { data } = await apiClient.get<Service[]>(`/businesses/${businessId}/services`);
    return data;
  },

  createForBusiness: async (businessId: string, body: Omit<Service, 'id' | 'active'>): Promise<Service> => {
    const { data } = await apiClient.post<Service>(`/businesses/${businessId}/services`, body);
    return data;
  },

  updateForBusiness: async (businessId: string, id: string, body: Partial<Service>): Promise<Service> => {
    const { data } = await apiClient.put<Service>(`/businesses/${businessId}/services/${id}`, body);
    return data;
  },

  deleteForBusiness: async (businessId: string, id: string): Promise<void> => {
    await apiClient.delete(`/businesses/${businessId}/services/${id}`);
  },
};
