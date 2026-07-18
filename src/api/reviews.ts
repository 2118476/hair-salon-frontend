import { apiClient } from './client';
import { Review } from '../types';

export const reviewsApi = {
  create: async (bookingId: string, rating: number, comment?: string): Promise<Review> => {
    const { data } = await apiClient.post<Review>('/reviews', { bookingId, rating, comment });
    return data;
  },
};
