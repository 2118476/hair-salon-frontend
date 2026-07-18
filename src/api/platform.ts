import { apiClient } from './client';
import { BusinessSummary, Review } from '../types';

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalBusinesses: number;
  verifiedBusinesses: number;
  totalBookings: number;
  totalRevenuePence: number;
}

export interface AuditEvent {
  id: string;
  businessId?: string;
  actorUserId?: string;
  actorRole?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  detail?: string;
  createdAt: string;
}

const base = '/admin/platform';

export const platformApi = {
  stats: () => apiClient.get<PlatformStats>(`${base}/stats`).then((r) => r.data),
  businesses: () => apiClient.get<BusinessSummary[]>(`${base}/businesses`).then((r) => r.data),
  setBusinessActive: (id: string, active: boolean) =>
    apiClient.post(`${base}/businesses/${id}/active?active=${active}`).then(() => undefined),
  verifyBusiness: (id: string, verified: boolean) =>
    apiClient.post(`${base}/businesses/${id}/verify?verified=${verified}`).then(() => undefined),
  suspendUser: (id: string, suspended: boolean) =>
    apiClient.post(`${base}/users/${id}/suspend?suspended=${suspended}`).then(() => undefined),
  reportedReviews: () => apiClient.get<Review[]>(`${base}/reviews/reported`).then((r) => r.data),
  moderateReview: (id: string, status: string) =>
    apiClient.post(`${base}/reviews/${id}/moderate?status=${status}`).then(() => undefined),
  audit: (page = 0, size = 50) =>
    apiClient.get<{ content: AuditEvent[] }>(`${base}/audit?page=${page}&size=${size}`).then((r) => r.data.content),
};
