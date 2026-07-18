import { apiClient } from './client';
import {
  Appointment, AppointmentStatus, CustomerDetail, CustomerSummary, Invitation, Location,
  Membership, Payment, PortfolioImage, ReportSummary, Review, Service, Stylist, TimeOff, WaitlistEntry,
} from '../types';

const q = (params: Record<string, string | undefined>) =>
  Object.entries(params).filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`).join('&');

/** All business-dashboard operations, each mapped to a real backend endpoint. */
export const businessAdminApi = {
  // Services (tenant-scoped)
  listServices: (b: string) => apiClient.get<Service[]>(`/businesses/${b}/services`).then((r) => r.data),
  createService: (b: string, body: Partial<Service>) =>
    apiClient.post<Service>(`/businesses/${b}/services`, body).then((r) => r.data),
  updateService: (b: string, id: string, body: Partial<Service>) =>
    apiClient.put<Service>(`/businesses/${b}/services/${id}`, body).then((r) => r.data),
  deleteService: (b: string, id: string) => apiClient.delete(`/businesses/${b}/services/${id}`).then(() => undefined),

  // Bookable stylists (tenant-scoped)
  listStylists: (b: string) => apiClient.get<Stylist[]>(`/businesses/${b}/stylists`).then((r) => r.data),
  createStylist: (b: string, body: Partial<Stylist>) =>
    apiClient.post<Stylist>(`/businesses/${b}/stylists`, body).then((r) => r.data),

  // Staff (memberships + invitations)
  listMembers: (b: string) => apiClient.get<Membership[]>(`/businesses/${b}/members`).then((r) => r.data),
  listInvitations: (b: string) => apiClient.get<Invitation[]>(`/businesses/${b}/invitations`).then((r) => r.data),
  invite: (b: string, email: string, role: string) =>
    apiClient.post<Invitation>(`/businesses/${b}/invitations`, { email, role }).then((r) => r.data),
  revokeInvitation: (b: string, id: string) =>
    apiClient.post(`/businesses/${b}/invitations/${id}/revoke`).then(() => undefined),
  changeRole: (b: string, membershipId: string, role: string) =>
    apiClient.put<Membership>(`/businesses/${b}/members/${membershipId}/role`, { role }).then((r) => r.data),
  deactivateMember: (b: string, membershipId: string) =>
    apiClient.post(`/businesses/${b}/members/${membershipId}/deactivate`).then(() => undefined),

  // Locations
  listLocations: (b: string) => apiClient.get<Location[]>(`/businesses/${b}/locations`).then((r) => r.data),
  addLocation: (b: string, body: Partial<Location>) =>
    apiClient.post<Location>(`/businesses/${b}/locations`, body).then((r) => r.data),

  // Settings
  updateSettings: (b: string, body: Record<string, unknown>) =>
    apiClient.put(`/businesses/${b}/settings`, body).then((r) => r.data),

  // Calendar + appointments
  calendar: (b: string, from: string, to: string, stylistId?: string) =>
    apiClient.get<Appointment[]>(`/businesses/${b}/calendar?${q({ from, to, stylistId })}`).then((r) => r.data),
  getAppointment: (b: string, id: string) =>
    apiClient.get<Appointment>(`/businesses/${b}/appointments/${id}`).then((r) => r.data),
  staffCreate: (b: string, body: Record<string, unknown>) =>
    apiClient.post<Appointment>(`/businesses/${b}/appointments`, body).then((r) => r.data),
  setStatus: (b: string, id: string, status: AppointmentStatus, reason?: string) =>
    apiClient.post<Appointment>(`/businesses/${b}/appointments/${id}/status`, { status, reason }).then((r) => r.data),

  // Staff time off
  listTimeOff: (b: string) => apiClient.get<TimeOff[]>(`/businesses/${b}/time-off`).then((r) => r.data),
  addTimeOff: (b: string, body: Partial<TimeOff>) =>
    apiClient.post<TimeOff>(`/businesses/${b}/time-off`, body).then((r) => r.data),
  deleteTimeOff: (b: string, id: string) => apiClient.delete(`/businesses/${b}/time-off/${id}`).then(() => undefined),

  // Customers
  listCustomers: (b: string, query?: string) =>
    apiClient.get<CustomerSummary[]>(`/businesses/${b}/customers?${q({ q: query })}`).then((r) => r.data),
  getCustomer: (b: string, userId: string) =>
    apiClient.get<CustomerDetail>(`/businesses/${b}/customers/${userId}`).then((r) => r.data),
  saveNote: (b: string, userId: string, note: string) =>
    apiClient.put<{ note: string }>(`/businesses/${b}/customers/${userId}/note`, { note }).then((r) => r.data),

  // Waitlist (business view)
  listWaitlist: (b: string) => apiClient.get<WaitlistEntry[]>(`/businesses/${b}/waitlist`).then((r) => r.data),
  offerSlot: (entryId: string, slotStart: string) =>
    apiClient.post<WaitlistEntry>(`/waitlist/${entryId}/offer`, { slotStart }).then((r) => r.data),

  // Reviews (business view)
  listReviews: (b: string) => apiClient.get<Review[]>(`/businesses/${b}/reviews`).then((r) => r.data),
  replyReview: (id: string, response: string) =>
    apiClient.post<Review>(`/reviews/${id}/reply`, { response }).then((r) => r.data),

  // Portfolio
  listPortfolio: (b: string) => apiClient.get<PortfolioImage[]>(`/businesses/${b}/portfolio`).then((r) => r.data),
  uploadPortfolio: (b: string, form: FormData) =>
    apiClient.post<PortfolioImage>(`/businesses/${b}/portfolio/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  archivePortfolio: (b: string, id: string) =>
    apiClient.post(`/businesses/${b}/portfolio/${id}/archive`).then(() => undefined),

  // Payments
  listPayments: (b: string) => apiClient.get<Payment[]>(`/businesses/${b}/payments`).then((r) => r.data),
  refund: (paymentId: string, amountPence: number, reason?: string) =>
    apiClient.post<Payment>(`/payments/${paymentId}/refund`, { amountPence, reason }).then((r) => r.data),

  // Reports
  report: (b: string, from: string, to: string) =>
    apiClient.get<ReportSummary>(`/businesses/${b}/reports/summary?${q({ from, to })}`).then((r) => r.data),
};
