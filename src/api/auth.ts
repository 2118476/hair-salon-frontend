import { apiClient } from './client';
import { LoginCredentials, RegisterData, User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

// The backend returns flat DTOs (no { data } envelope); these functions adapt them
// to the shapes the app uses.
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return {
      token: data.token,
      user: {
        id: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
    };
  },

  register: async (data: RegisterData): Promise<void> => {
    await apiClient.post('/auth/register', {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, newPassword: password });
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },
};
