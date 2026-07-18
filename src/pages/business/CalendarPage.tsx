import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet, gbp } from '../../hooks/useBusinessOutlet';
import { useToast } from '../../context/toast-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AppointmentStatus } from '../../types';

const iso = (d: Date) => d.toISOString().slice(0, 10);

const statusColour: Record<string, string> = {
  PENDING: 'border-l-bronze', CONFIRMED: 'border-l-sage', CHECKED_IN: 'border-l-ink',
  IN_PROGRESS: 'border-l-burgundy', COMPLETED: 'border-l-success', CANCELLED: 'border-l-gray-300', NO_SHOW: 'border-l-error',
};

// Next actions allowed from each status (mirrors the backend state machine).
const actions: Record<string, { label: string; to: AppointmentStatus }[]> = {
  PENDING: [{ label: 'Check in', to: 'CHECKED_IN' }, { label: 'No-show', to: 'NO_SHOW' }, { label: 'Cancel', to: 'CANCELLED' }],
  CONFIRMED: [{ label: 'Check in', to: 'CHECKED_IN' }, { label: 'No-show', to: 'NO_SHOW' }, { label: 'Cancel', to: 'CANCELLED' }],
  CHECKED_IN: [{ label: 'Start', to: 'IN_PROGRESS' }, { label: 'No-show', to: 'NO_SHOW' }],
  IN_PROGRESS: [{ label: 'Complete', to: 'COMPLETED' }],
};

export function CalendarPage() {
  const { businessId } = useBusinessOutlet();
  const qc = useQueryClient();
  const toast = useToast();
  const [date, setDate] = useState(iso(new Date()));
  const [stylistFilter, setStylistFilter] = useState('');
  const [search, setSearch] = useState('');
  const [walkIn, setWalkIn] = useState({ stylistId: '', serviceId: '', startTime: '10:00', customerEmail: '', customerFirstName: '', channel: 'WALK_IN' });

  const key = ['calendar', businessId, date, stylistFilter];
  const appts = useQuery({ queryKey: key, queryFn: () => businessAdminApi.calendar(businessId, date, date, stylistFilter || undefined) });
  const stylists = useQuery({ queryKey: ['ba-stylists', businessId], queryFn: () => businessAdminApi.listStylists(businessId) });
  const services = useQuery({ queryKey: ['ba-services', businessId], queryFn: () => businessAdminApi.listServices(businessId) });

  const refresh = () => qc.invalidateQueries({ queryKey: ['calendar', businessId] });

  const setStatus = useMutation({
    mutationFn: ({ id, to }: { id: string; to: AppointmentStatus }) => businessAdminApi.setStatus(businessId, id, to),
    onSuccess: () => { toast.show('Updated', 'success'); refresh(); },
    onError: () => toast.show('That change is not allowed', 'error'),
  });

  const create = useMutation({
    mutationFn: () => businessAdminApi.staffCreate(businessId, { ...walkIn, appointmentDate: date }),
    onSuccess: () => { toast.show('Appointment booked', 'success'); setWalkIn({ ...walkIn, customerEmail: '', customerFirstName: '' }); refresh(); },
    onError: () => toast.show('Could not book (check time conflicts)', 'error'),
  });

  const visible = (appts.data ?? []).filter((a) =>
    !search || a.customerName?.toLowerCase().includes(search.toLowerCase()) || a.serviceName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Calendar</h1>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <Input id="date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
        <div>
          <label htmlFor="staff" className="mb-1 block text-sm font-medium text-text-primary">Professional</label>
          <select id="staff" value={stylistFilter} onChange={(e) => setStylistFilter(e.target.value)} className="h-10 rounded-md border border-gray-300 px-2 text-sm">
            <option value="">All</option>
            {stylists.data?.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
          </select>
        </div>
        <Input id="search" label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Customer or service" className="w-auto" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {appts.isLoading && <p className="text-text-secondary">Loading…</p>}
          {appts.isError && <p className="text-error">You need calendar access for this business.</p>}
          {visible.length === 0 && !appts.isLoading && <p className="text-text-secondary">No appointments.</p>}
          {visible.map((a) => (
            <Card key={a.id} className={`border-l-4 ${statusColour[a.status] ?? 'border-l-gray-300'}`}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-ink">{a.startTime.slice(0, 5)}–{a.endTime.slice(0, 5)} · {a.serviceName}</p>
                  <p className="text-sm text-text-secondary">{a.customerName} · {a.stylistName} · {gbp(a.totalPricePence)} · {a.channel}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text-secondary">{a.status.replace('_', ' ')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(actions[a.status] ?? []).map((act) => (
                    <Button key={act.to} size="sm" variant={act.label === 'Cancel' || act.label === 'No-show' ? 'ghost' : 'outline'}
                      onClick={() => setStatus.mutate({ id: a.id, to: act.to })}>
                      {act.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>New appointment</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="space-y-3">
              <div>
                <label htmlFor="ws" className="mb-1 block text-sm font-medium text-text-primary">Professional</label>
                <select id="ws" required value={walkIn.stylistId} onChange={(e) => setWalkIn({ ...walkIn, stylistId: e.target.value })} className="h-10 w-full rounded-md border border-gray-300 px-2 text-sm">
                  <option value="">Select…</option>
                  {stylists.data?.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="wsv" className="mb-1 block text-sm font-medium text-text-primary">Service</label>
                <select id="wsv" required value={walkIn.serviceId} onChange={(e) => setWalkIn({ ...walkIn, serviceId: e.target.value })} className="h-10 w-full rounded-md border border-gray-300 px-2 text-sm">
                  <option value="">Select…</option>
                  {services.data?.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes}m)</option>)}
                </select>
              </div>
              <Input id="wt" label="Time" type="time" value={walkIn.startTime} onChange={(e) => setWalkIn({ ...walkIn, startTime: e.target.value })} required />
              <Input id="we" label="Customer email" type="email" value={walkIn.customerEmail} onChange={(e) => setWalkIn({ ...walkIn, customerEmail: e.target.value })} required />
              <Input id="wn" label="Customer name" value={walkIn.customerFirstName} onChange={(e) => setWalkIn({ ...walkIn, customerFirstName: e.target.value })} />
              <div>
                <label htmlFor="wc" className="mb-1 block text-sm font-medium text-text-primary">Channel</label>
                <select id="wc" value={walkIn.channel} onChange={(e) => setWalkIn({ ...walkIn, channel: e.target.value })} className="h-10 w-full rounded-md border border-gray-300 px-2 text-sm">
                  <option value="WALK_IN">Walk-in</option>
                  <option value="PHONE">Phone</option>
                </select>
              </div>
              <Button type="submit" className="w-full" isLoading={create.isPending}>Book appointment</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
