import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet, gbp } from '../../hooks/useBusinessOutlet';
import { useToast } from '../../context/toast-context';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function CustomersPage() {
  const { businessId } = useBusinessOutlet();
  const qc = useQueryClient();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const list = useQuery({ queryKey: ['ba-customers', businessId, search], queryFn: () => businessAdminApi.listCustomers(businessId, search) });
  const detail = useQuery({
    queryKey: ['ba-customer', businessId, selected],
    queryFn: () => businessAdminApi.getCustomer(businessId, selected as string),
    enabled: !!selected,
  });

  const saveNote = useMutation({
    mutationFn: () => businessAdminApi.saveNote(businessId, selected as string, note),
    onSuccess: () => { toast.show('Note saved', 'success'); qc.invalidateQueries({ queryKey: ['ba-customer', businessId, selected] }); },
    onError: () => toast.show('Could not save note', 'error'),
  });

  const open = (userId: string, existingNote?: string) => { setSelected(userId); setNote(existingNote ?? ''); };

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Customers</h1>
      <div className="mb-4 max-w-sm">
        <Input id="cq" label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or email" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-0">
            {list.isLoading && <p className="p-6 text-text-secondary">Loading…</p>}
            {list.data?.length === 0 && <p className="p-6 text-text-secondary">No customers yet.</p>}
            <ul className="divide-y divide-gray-100">
              {list.data?.map((c) => (
                <li key={c.userId}>
                  <button onClick={() => open(c.userId)} className="flex w-full items-center justify-between px-6 py-3 text-left hover:bg-ink/5">
                    <div>
                      <p className="font-medium text-ink">{c.firstName} {c.lastName}</p>
                      <p className="text-sm text-text-secondary">{c.email}</p>
                    </div>
                    <div className="text-right text-sm text-text-secondary">
                      <p>{c.totalVisits} visits</p>
                      <p>{gbp(c.totalSpendPence)}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {!selected && <p className="text-text-secondary">Select a customer to see their profile.</p>}
            {detail.data && (
              <>
                <h2 className="font-serif text-xl font-semibold text-ink">{detail.data.summary.firstName} {detail.data.summary.lastName}</h2>
                <p className="text-sm text-text-secondary">{detail.data.summary.email}{detail.data.summary.phone ? ` · ${detail.data.summary.phone}` : ''}</p>
                <div className="my-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  {[['Visits', detail.data.summary.totalVisits], ['Completed', detail.data.summary.completed], ['No-shows', detail.data.summary.noShows], ['Spend', gbp(detail.data.summary.totalSpendPence)]].map(([l, v]) => (
                    <div key={l as string} className="rounded bg-ivory p-2 text-center">
                      <p className="font-semibold text-ink">{v}</p><p className="text-xs text-text-secondary">{l}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-text-secondary">Marketing consent: {detail.data.summary.marketingConsent ? 'Yes' : 'No'}</p>

                <h3 className="mt-4 text-sm font-semibold text-ink">Upcoming</h3>
                {detail.data.upcoming.length === 0 ? <p className="text-sm text-text-secondary">None</p> : (
                  <ul className="text-sm text-text-secondary">
                    {detail.data.upcoming.map((a) => <li key={a.id}>{a.appointmentDate} {a.startTime.slice(0, 5)} · {a.serviceName}</li>)}
                  </ul>
                )}

                <h3 className="mt-4 text-sm font-semibold text-ink">Internal note</h3>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  placeholder={detail.data.note ?? 'Add a private note…'} />
                <Button size="sm" className="mt-2" onClick={() => saveNote.mutate()} isLoading={saveNote.isPending}>Save note</Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
