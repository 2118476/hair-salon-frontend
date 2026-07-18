import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet } from '../../hooks/useBusinessOutlet';
import { useToast } from '../../context/toast-context';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function WaitlistPage() {
  const { businessId } = useBusinessOutlet();
  const qc = useQueryClient();
  const toast = useToast();
  const [slots, setSlots] = useState<Record<string, string>>({});
  const { data, isLoading } = useQuery({ queryKey: ['ba-waitlist', businessId], queryFn: () => businessAdminApi.listWaitlist(businessId) });

  const offer = useMutation({
    mutationFn: ({ id, slotStart }: { id: string; slotStart: string }) => businessAdminApi.offerSlot(id, new Date(slotStart).toISOString()),
    onSuccess: () => { toast.show('Slot offered to customer', 'success'); qc.invalidateQueries({ queryKey: ['ba-waitlist', businessId] }); },
    onError: () => toast.show('Could not offer slot', 'error'),
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Waitlist</h1>
      {isLoading && <p className="text-text-secondary">Loading…</p>}
      {data?.length === 0 && <p className="text-text-secondary">No active waitlist entries.</p>}
      <div className="space-y-3">
        {data?.map((w) => (
          <Card key={w.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-ink">{w.status}</p>
                <p className="text-sm text-text-secondary">
                  {w.preferredDateFrom ? `Prefers ${w.preferredDateFrom}${w.preferredDateTo ? `–${w.preferredDateTo}` : ''}` : 'Any date'}
                  {w.offerExpiresAt ? ` · offer expires ${new Date(w.offerExpiresAt).toLocaleString()}` : ''}
                </p>
              </div>
              {w.status === 'ACTIVE' && (
                <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); offer.mutate({ id: w.id, slotStart: slots[w.id] }); }}>
                  <input type="datetime-local" required value={slots[w.id] ?? ''} onChange={(e) => setSlots({ ...slots, [w.id]: e.target.value })}
                    aria-label="Offered slot" className="h-9 rounded-md border border-gray-300 px-2 text-sm" />
                  <Button type="submit" size="sm" disabled={!slots[w.id]}>Offer slot</Button>
                </form>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
