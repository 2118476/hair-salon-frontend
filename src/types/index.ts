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

export type AppointmentStatus =
  | 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS'
  | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  userId: string;
  customerName?: string;
  businessId?: string;
  stylistId: string;
  stylistName: string;
  serviceId: string;
  serviceName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  channel?: string;
  notes?: string;
  totalPricePence: number;
  createdAt: string;
}

export interface Invitation {
  id: string;
  businessId: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  acceptToken?: string;
  acceptUrl?: string;
}

export interface CustomerSummary {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  totalVisits: number;
  completed: number;
  cancellations: number;
  noShows: number;
  totalSpendPence: number;
  marketingConsent: boolean;
}

export interface CustomerDetail {
  summary: CustomerSummary;
  upcoming: Appointment[];
  history: Appointment[];
  note?: string;
}

export interface Payment {
  id: string;
  bookingId?: string;
  type: string;
  amountPence: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface TimeOff {
  id: string;
  stylistId: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface ReportSummary {
  from: string;
  to: string;
  totalBookings: number;
  completed: number;
  cancelled: number;
  noShows: number;
  revenuePence: number;
  refundsPence: number;
  averageAppointmentValuePence: number;
  noShowRate: number;
  cancellationRate: number;
  topServices: { name: string; count: number }[];
}

export interface WaitlistEntry {
  id: string;
  businessId: string;
  serviceId?: string;
  stylistId?: string;
  status: string;
  preferredDateFrom?: string;
  preferredDateTo?: string;
  offeredSlotStart?: string;
  offerExpiresAt?: string;
  createdAt: string;
}

export interface PortfolioImage {
  id: string;
  businessId: string;
  stylistId?: string;
  serviceId?: string;
  url: string;
  caption?: string;
  contentType?: string;
  sizeBytes?: number;
  consentGiven: boolean;
  sortOrder: number;
  archived: boolean;
  createdAt: string;
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
