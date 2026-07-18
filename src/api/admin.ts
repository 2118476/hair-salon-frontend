import { apiClient } from './client';
import { AdminStats, Booking, User, Service, Stylist } from '../types';

interface StatusHistory {
  id: string;
  status: string;
  changedAt: string;
  changedByName?: string;
  reason?: string;
}

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await apiClient.get<AdminStats>('/admin/stats');
    return data;
  },

  getUpcomingAppointments: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get<Booking[]>('/admin/upcoming-appointments');
    return data;
  },

  getRecentActivity: async (): Promise<{ id: string; description: string; timestamp: string }[]> => {
    const { data } = await apiClient.get<StatusHistory[]>('/admin/recent-activity');
    return data.map((h) => ({
      id: h.id,
      description: `${h.changedByName ?? 'System'} set status to ${h.status}${h.reason ? ` — ${h.reason}` : ''}`,
      timestamp: h.changedAt,
    }));
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get<{ content: User[] }>('/users?page=0&size=100');
    return data.content ?? [];
  },

  updateUserRole: async (userId: string, role: string): Promise<User> => {
    const { data } = await apiClient.put<User>(`/users/${userId}/role`, { role });
    return data;
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get<{ content: Booking[] }>('/bookings?page=0&size=100');
    return data.content ?? [];
  },

  getAllServices: async (): Promise<Service[]> => {
    const { data } = await apiClient.get<Service[]>('/services');
    return data;
  },

  getAllStylists: async (): Promise<Stylist[]> => {
    const { data } = await apiClient.get<Stylist[]>('/stylists');
    return data;
  },
};
