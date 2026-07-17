import { apiClient } from './client';
import { Booking, TimeSlot } from '../types';

interface CreateBookingData {
  stylistId: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  notes?: string;
}

interface AvailabilityResponse {
  availableSlots: string[]; // "HH:mm:ss"
}

export const bookingsApi = {
  getMyBookings: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get<Booking[]>('/bookings/my-bookings');
    return data;
  },

  // Admin/moderator paged list — returns the page content.
  getAll: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get<{ content: Booking[] }>('/bookings?page=0&size=100');
    return data.content ?? [];
  },

  getAvailableSlots: async (stylistId: string, serviceId: string, date: string): Promise<TimeSlot[]> => {
    const { data } = await apiClient.get<AvailabilityResponse>(
      `/bookings/available-slots?stylistId=${stylistId}&serviceId=${serviceId}&date=${date}`
    );
    return (data.availableSlots ?? []).map((t) => ({ time: t.slice(0, 5), available: true }));
  },

  create: async (body: CreateBookingData): Promise<Booking> => {
    const { data } = await apiClient.post<Booking>('/bookings', body);
    return data;
  },

  reschedule: async (id: string, body: CreateBookingData): Promise<Booking> => {
    const { data } = await apiClient.put<Booking>(`/bookings/${id}`, body);
    return data;
  },

  cancel: async (id: string): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },

  createPaymentIntent: async (bookingId: string): Promise<{ paymentId: string; clientSecret: string; amountPence: number; currency: string; type: string }> => {
    const { data } = await apiClient.post(`/bookings/${bookingId}/payment-intent`);
    return data;
  },
};
