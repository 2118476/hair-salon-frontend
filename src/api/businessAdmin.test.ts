import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the shared axios client so we can assert on URLs/methods without a network call.
vi.mock('./client', () => {
  const client = {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
  };
  return { apiClient: client };
});

import { apiClient } from './client';
import { businessAdminApi } from './businessAdmin';

const mocked = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn>;
};

describe('businessAdmin API contract', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('calendar uses the calendar endpoint with date range', async () => {
    await businessAdminApi.calendar('biz1', '2026-01-01', '2026-01-02', 'sty1');
    expect(mocked.get).toHaveBeenCalledWith('/businesses/biz1/calendar?from=2026-01-01&to=2026-01-02&stylistId=sty1');
  });

  it('setStatus posts the target status', async () => {
    await businessAdminApi.setStatus('biz1', 'appt1', 'CHECKED_IN', 'arrived');
    expect(mocked.post).toHaveBeenCalledWith('/businesses/biz1/appointments/appt1/status', { status: 'CHECKED_IN', reason: 'arrived' });
  });

  it('refund posts to the payments endpoint', async () => {
    await businessAdminApi.refund('pay1', 500, 'goodwill');
    expect(mocked.post).toHaveBeenCalledWith('/payments/pay1/refund', { amountPence: 500, reason: 'goodwill' });
  });

  it('deleteService issues a DELETE', async () => {
    await businessAdminApi.deleteService('biz1', 'svc1');
    expect(mocked.delete).toHaveBeenCalledWith('/businesses/biz1/services/svc1');
  });
});
