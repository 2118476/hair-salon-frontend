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

// ---- Platform (multi-business) ----

export interface BusinessSummary {
  id: string;
  name: string;
  slug: string;
  description?: string;
  businessType?: string;
  londonArea?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  instantBooking: boolean;
  verified: boolean;
  myRole?: string;
}

export interface Location {
  id: string;
  businessId: string;
  name: string;
  addressLine1?: string;
  city?: string;
  postcode?: string;
  londonArea?: string;
  phone?: string;
}

export interface Business extends BusinessSummary {
  email?: string;
  phone?: string;
  website?: string;
  timezone?: string;
  languages?: string;
  hijabFriendly: boolean;
  homeService: boolean;
  mobileService: boolean;
  childrenAccepted: boolean;
  privateTreatmentRoom: boolean;
  consultationRequired: boolean;
  minBookingNoticeMinutes: number;
  cancellationNoticeHours: number;
  depositType: string;
  depositValue: number;
  currency: string;
  locations: Location[];
}

export interface Membership {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
}

export interface Review {
  id: string;
  businessId: string;
  bookingId: string;
  reviewerName: string;
  rating: number;
  comment?: string;
  businessResponse?: string;
  status: string;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
