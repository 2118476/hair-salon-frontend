export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  pricePence: number;
  durationMinutes: number;
  category: string;
  imageUrl?: string;
  active: boolean;
}

export interface Stylist {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  specialization: string;
  imageUrl?: string;
  active: boolean;
  services?: Service[];
}

export interface Booking {
  id: string;
  userId: string;
  stylistId: string;
  serviceId: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  totalPricePence: number;
  createdAt: string;
  stylist?: Stylist;
  service?: Service;
}

export interface AdminStats {
  totalBookings: number;
  todayBookings: number;
  totalUsers: number;
  totalServices: number;
  totalStylists: number;
  upcomingAppointmentsCount: number;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
