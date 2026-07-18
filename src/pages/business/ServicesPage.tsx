import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet, gbp } from '../../hooks/useBusinessOutlet';
import { useToast } from '../../context/toast-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Trash2 } from 'lucide-react';

export function ServicesPage() {
  const { businessId } = useBusinessOutlet();
  const qc = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', category: '', price: '', minutes: '', description: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['ba-services', businessId],
    queryFn: () => businessAdminApi.listServices(businessId),
  });

  const create = useMutation({
    mutationFn: () => businessAdminApi.createService(businessId, {
      name: form.name, category: form.category, description: form.description,
      pricePence: Math.round(Number(form.price) * 100), durationMinutes: Number(form.minutes),
    }),
    onSuccess: () => { toast.show('Service created', 'success'); setForm({ name: '', category: '', price: '', minutes: '', description: '' }); qc.invalidateQueries({ queryKey: ['ba-services', businessId] }); },
    onError: () => toast.show('Could not create service (owner/manager only)', 'error'),
  });

  const archive = useMutation({
    mutationFn: (id: string) => businessAdminApi.deleteService(businessId, id),
    onSuccess: () => { toast.show('Service archived', 'success'); qc.invalidateQueries({ queryKey: ['ba-services', businessId] }); },
    onError: () => toast.show('Could not archive', 'error'),
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Services</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {isLoading && <p className="p-6 text-text-secondary">Loading…</p>}
              {data?.length === 0 && <p className="p-6 text-text-secondary">No services yet. Add one →</p>}
              <ul className="divide-y divide-gray-100">
                {data?.map((s) => (
                  <li key={s.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="font-medium text-ink">{s.name}</p>
                      <p className="text-sm text-text-secondary">{s.category} · {s.durationMinutes} min · {gbp(s.pricePence)}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => archive.mutate(s.id)} aria-label={`Archive ${s.name}`}>
                      <Trash2 className="h-4 w-4 text-error" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Add a service</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="space-y-3">
              <Input id="sn" label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input id="sc" label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Braids, Fades, Colour…" />
              <div className="grid grid-cols-2 gap-3">
                <Input id="sp" label="Price (£)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                <Input id="sm" label="Minutes" type="number" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} required />
              </div>
              <Input id="sd" label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Button type="submit" className="w-full" isLoading={create.isPending}>Create</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
