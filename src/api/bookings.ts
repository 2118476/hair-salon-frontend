import { apiClient } from './client';
import { ApiResponse, Booking, TimeSlot } from '../types';

interface CreateBookingData {
  stylistId: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  notes?: string;
}

export const bookingsApi = {
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings/my-bookings');
    return response.data.data;
  },

  getAll: async (): Promise<Booking[]> => {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/bookings');
    return response.data.data;
  },

  getAvailableSlots: async (stylistId: string, serviceId: string, date: string): Promise<TimeSlot[]> => {
    const response = await apiClient.get<ApiResponse<TimeSlot[]>>(
      `/bookings/available-slots?stylistId=${stylistId}&serviceId=${serviceId}&date=${date}`
    );
    return response.data.data;
  },

  create: async (data: CreateBookingData): Promise<Booking> => {
    const response = await apiClient.post<ApiResponse<Booking>>('/bookings', data);
    return response.data.data;
  },

  updateStatus: async (id: string, status: string): Promise<Booking> => {
    const response = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
    return response.data.data;
  },

  cancel: async (id: string): Promise<void> => {
    await apiClient.patch<ApiResponse<void>>(`/bookings/${id}/cancel`);
  },
};
