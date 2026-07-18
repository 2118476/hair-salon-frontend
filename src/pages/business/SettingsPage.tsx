import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessesApi } from '../../api/businesses';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet } from '../../hooks/useBusinessOutlet';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/toast-context';

export function SettingsPage() {
  const { businessId } = useBusinessOutlet();
  const qc = useQueryClient();
  const toast = useToast();
  const { data } = useQuery({ queryKey: ['business', businessId], queryFn: () => businessesApi.getById(businessId) });

  const [form, setForm] = useState<Record<string, unknown>>({});
  useEffect(() => {
    if (data) {
      setForm({
        name: data.name, description: data.description ?? '', email: data.email ?? '', phone: data.phone ?? '',
        website: data.website ?? '', londonArea: data.londonArea ?? '', languages: data.languages ?? '',
        instantBooking: data.instantBooking, hijabFriendly: data.hijabFriendly, homeService: data.homeService,
        mobileService: data.mobileService, childrenAccepted: data.childrenAccepted,
        privateTreatmentRoom: data.privateTreatmentRoom, consultationRequired: data.consultationRequired,
        minBookingNoticeMinutes: data.minBookingNoticeMinutes, maxAdvanceDays: 90,
        cancellationNoticeHours: data.cancellationNoticeHours, depositType: data.depositType, depositValue: data.depositValue,
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => businessAdminApi.updateSettings(businessId, form),
    onSuccess: () => { toast.show('Settings saved', 'success'); qc.invalidateQueries({ queryKey: ['business', businessId] }); },
    onError: () => toast.show('Could not save settings', 'error'),
  });

  const text = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const num = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: Number(e.target.value) }));
  const bool = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.checked }));

  if (!data) return <p className="text-text-secondary">Loading…</p>;

  const flags: [string, string][] = [
    ['instantBooking', 'Instant booking'], ['hijabFriendly', 'Hijab-friendly'], ['homeService', 'Home service'],
    ['mobileService', 'Mobile service'], ['childrenAccepted', 'Children welcome'],
    ['privateTreatmentRoom', 'Private treatment room'], ['consultationRequired', 'Consultation required'],
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Business settings</h1>
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input id="name" label="Name" value={String(form.name ?? '')} onChange={text('name')} />
            <Input id="londonArea" label="London area" value={String(form.londonArea ?? '')} onChange={text('londonArea')} />
            <div className="grid grid-cols-2 gap-4">
              <Input id="email" label="Email" value={String(form.email ?? '')} onChange={text('email')} />
              <Input id="phone" label="Phone" value={String(form.phone ?? '')} onChange={text('phone')} />
            </div>
            <Input id="website" label="Website" value={String(form.website ?? '')} onChange={text('website')} />
            <Input id="languages" label="Languages" value={String(form.languages ?? '')} onChange={text('languages')} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Policies</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input id="min" label="Min booking notice (min)" type="number" value={String(form.minBookingNoticeMinutes ?? 0)} onChange={num('minBookingNoticeMinutes')} />
              <Input id="cancel" label="Cancellation notice (h)" type="number" value={String(form.cancellationNoticeHours ?? 0)} onChange={num('cancellationNoticeHours')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="depositType" className="mb-1 block text-sm font-medium text-text-primary">Deposit type</label>
                <select id="depositType" value={String(form.depositType ?? 'NONE')} onChange={(e) => setForm((f) => ({ ...f, depositType: e.target.value }))}
                  className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm">
                  <option value="NONE">None</option>
                  <option value="FIXED">Fixed (pence)</option>
                  <option value="PERCENT">Percent</option>
                  <option value="FULL">Full prepayment</option>
                </select>
              </div>
              <Input id="depositValue" label="Deposit value" type="number" value={String(form.depositValue ?? 0)} onChange={num('depositValue')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Service options</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {flags.map(([k, label]) => (
              <label key={k} className="flex items-center gap-2 text-sm text-text-primary">
                <input type="checkbox" checked={Boolean(form[k])} onChange={bool(k)} /> {label}
              </label>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" isLoading={mutation.isPending}>Save settings</Button>
      </form>
    </div>
  );
}
