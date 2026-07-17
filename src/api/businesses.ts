import { apiClient } from './client';
import { Business, BusinessSummary, Location, Membership, Page, Review, Service } from '../types';

export interface CreateBusinessData {
  name: string;
  description?: string;
  businessType?: string;
  email?: string;
  phone?: string;
  londonArea?: string;
  locationName?: string;
  addressLine1?: string;
  postcode?: string;
}

export const businessesApi = {
  discover: async (q = '', page = 0, size = 12): Promise<Page<BusinessSummary>> => {
    const { data } = await apiClient.get<Page<BusinessSummary>>(
      `/businesses/discover?q=${encodeURIComponent(q)}&page=${page}&size=${size}`
    );
    return data;
  },

  getById: async (id: string): Promise<Business> => {
    const { data } = await apiClient.get<Business>(`/businesses/${id}`);
    return data;
  },

  getServices: async (id: string): Promise<Service[]> => {
    const { data } = await apiClient.get<Service[]>(`/businesses/${id}/services`);
    return data;
  },

  getReviews: async (id: string): Promise<Review[]> => {
    const { data } = await apiClient.get<Review[]>(`/businesses/${id}/reviews`);
    return data;
  },

  mine: async (): Promise<BusinessSummary[]> => {
    const { data } = await apiClient.get<BusinessSummary[]>('/businesses/mine');
    return data;
  },

  create: async (body: CreateBusinessData): Promise<Business> => {
    const { data } = await apiClient.post<Business>('/businesses', body);
    return data;
  },

  members: async (id: string): Promise<Membership[]> => {
    const { data } = await apiClient.get<Membership[]>(`/businesses/${id}/members`);
    return data;
  },

  addLocation: async (id: string, body: Partial<Location>): Promise<Location> => {
    const { data } = await apiClient.post<Location>(`/businesses/${id}/locations`, body);
    return data;
  },

  invite: async (id: string, email: string, role: string): Promise<{ acceptUrl: string; email: string; role: string }> => {
    const { data } = await apiClient.post(`/businesses/${id}/invitations`, { email, role });
    return data;
  },
};
