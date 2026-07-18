import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet } from '../../hooks/useBusinessOutlet';
import { useToast } from '../../context/toast-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { MapPin } from 'lucide-react';

export function LocationsPage() {
  const { businessId } = useBusinessOutlet();
  const qc = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', addressLine1: '', city: 'London', postcode: '', londonArea: '', phone: '' });

  const { data } = useQuery({ queryKey: ['ba-locations', businessId], queryFn: () => businessAdminApi.listLocations(businessId) });

  const add = useMutation({
    mutationFn: () => businessAdminApi.addLocation(businessId, form),
    onSuccess: () => { toast.show('Location added', 'success'); setForm({ name: '', addressLine1: '', city: 'London', postcode: '', londonArea: '', phone: '' }); qc.invalidateQueries({ queryKey: ['ba-locations', businessId] }); },
    onError: () => toast.show('Could not add location (owner/manager only)', 'error'),
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Locations</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {data?.length === 0 && <p className="text-text-secondary">No locations yet.</p>}
          {data?.map((l) => (
            <Card key={l.id}>
              <CardContent className="flex items-start gap-3 p-4">
                <MapPin className="mt-1 h-5 w-5 text-bronze" aria-hidden />
                <div>
                  <p className="font-medium text-ink">{l.name}</p>
                  <p className="text-sm text-text-secondary">{[l.addressLine1, l.city, l.postcode].filter(Boolean).join(', ')}</p>
                  {l.phone && <p className="text-sm text-text-secondary">{l.phone}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><CardTitle>Add a location</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); add.mutate(); }} className="space-y-3">
              <Input id="ln" label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input id="la" label="Address" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input id="lc" label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <Input id="lp" label="Postcode" value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} />
              </div>
              <Input id="lar" label="London area" value={form.londonArea} onChange={(e) => setForm({ ...form, londonArea: e.target.value })} />
              <Input id="lph" label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Button type="submit" className="w-full" isLoading={add.isPending}>Add location</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
