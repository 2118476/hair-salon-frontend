import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet } from '../../hooks/useBusinessOutlet';
import { useToast } from '../../context/toast-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Trash2 } from 'lucide-react';

export function SchedulesPage() {
  const { businessId } = useBusinessOutlet();
  const qc = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState({ stylistId: '', startDate: '', endDate: '', startTime: '', endTime: '', reason: '' });

  const stylists = useQuery({ queryKey: ['ba-stylists', businessId], queryFn: () => businessAdminApi.listStylists(businessId) });
  const timeOff = useQuery({ queryKey: ['ba-timeoff', businessId], queryFn: () => businessAdminApi.listTimeOff(businessId) });
  const name = (id: string) => { const s = stylists.data?.find((x) => x.id === id); return s ? `${s.firstName} ${s.lastName}` : 'Professional'; };
  const invalidate = () => qc.invalidateQueries({ queryKey: ['ba-timeoff', businessId] });

  const add = useMutation({
    mutationFn: () => businessAdminApi.addTimeOff(businessId, {
      stylistId: form.stylistId, startDate: form.startDate, endDate: form.endDate,
      startTime: form.startTime || undefined, endTime: form.endTime || undefined, reason: form.reason,
    }),
    onSuccess: () => { toast.show('Time off added', 'success'); setForm({ stylistId: '', startDate: '', endDate: '', startTime: '', endTime: '', reason: '' }); invalidate(); },
    onError: () => toast.show('Could not add time off (owner/manager only)', 'error'),
  });
  const remove = useMutation({ mutationFn: (id: string) => businessAdminApi.deleteTimeOff(businessId, id), onSuccess: () => { toast.show('Removed', 'info'); invalidate(); } });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Schedules &amp; time off</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {timeOff.data?.length === 0 && <p className="text-text-secondary">No time off recorded.</p>}
          {timeOff.data?.map((t) => (
            <Card key={t.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-ink">{name(t.stylistId)}</p>
                  <p className="text-sm text-text-secondary">
                    {t.startDate}{t.endDate !== t.startDate ? `–${t.endDate}` : ''}
                    {t.startTime ? ` · ${t.startTime.slice(0, 5)}–${t.endTime?.slice(0, 5)}` : ' · all day'}
                    {t.reason ? ` · ${t.reason}` : ''}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => remove.mutate(t.id)} aria-label="Remove time off">
                  <Trash2 className="h-4 w-4 text-error" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Add time off</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); add.mutate(); }} className="space-y-3">
              <div>
                <label htmlFor="tos" className="mb-1 block text-sm font-medium text-text-primary">Professional</label>
                <select id="tos" required value={form.stylistId} onChange={(e) => setForm({ ...form, stylistId: e.target.value })} className="h-10 w-full rounded-md border border-gray-300 px-2 text-sm">
                  <option value="">Select…</option>
                  {stylists.data?.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input id="tsd" label="From" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                <Input id="ted" label="To" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input id="tst" label="From (optional)" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                <Input id="tet" label="To (optional)" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              </div>
              <Input id="tr" label="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Holiday, training…" />
              <Button type="submit" className="w-full" isLoading={add.isPending}>Add time off</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
