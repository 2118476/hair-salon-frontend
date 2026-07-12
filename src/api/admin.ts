import { apiClient } from './client';
import { AdminStats, ApiResponse, Booking, User, Service, Stylist } from '../types';

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get<ApiResponse<AdminStats>>('/admin/stats');
    return response.data.data;
  },

  getUpcomingAppointments: async (): Promise<Booking[]> => {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/admin/upcoming-appointments');
    return response.data.data;
  },

  getRecentActivity: async (): Promise<{ id: string; description: string; timestamp: string }[]> => {
    const response = await apiClient.get<ApiResponse<{ id: string; description: string; timestamp: string }[]>>(
      '/admin/recent-activity'
    );
    return response.data.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/admin/users');
    return response.data.data;
  },

  updateUserRole: async (userId: string, role: string): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>(`/admin/users/${userId}/role`, { role });
    return response.data.data;
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/admin/bookings');
    return response.data.data;
  },

  getAllServices: async (): Promise<Service[]> => {
    const response = await apiClient.get<ApiResponse<Service[]>>('/admin/services');
    return response.data.data;
  },

  getAllStylists: async (): Promise<Stylist[]> => {
    const response = await apiClient.get<ApiResponse<Stylist[]>>('/admin/stylists');
    return response.data.data;
  },
};
