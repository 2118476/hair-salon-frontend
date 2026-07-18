import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet, gbp } from '../../hooks/useBusinessOutlet';
import { useToast } from '../../context/toast-context';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const statusColour: Record<string, string> = {
  SUCCEEDED: 'bg-success/10 text-success',
  PENDING: 'bg-bronze/10 text-bronze',
  FAILED: 'bg-error/10 text-error',
  REFUNDED: 'bg-ink/10 text-ink',
  PARTIALLY_REFUNDED: 'bg-ink/10 text-ink',
};

export function PaymentsPage() {
  const { businessId } = useBusinessOutlet();
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ['ba-payments', businessId], queryFn: () => businessAdminApi.listPayments(businessId) });

  const refund = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => businessAdminApi.refund(id, amount),
    onSuccess: () => { toast.show('Refund processed', 'success'); qc.invalidateQueries({ queryKey: ['ba-payments', businessId] }); },
    onError: () => toast.show('Refund failed', 'error'),
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Payments</h1>
      <Card>
        <CardContent className="p-0">
          {isLoading && <p className="p-6 text-text-secondary">Loading…</p>}
          {data?.length === 0 && <p className="p-6 text-text-secondary">No payments yet.</p>}
          <ul className="divide-y divide-gray-100">
            {data?.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-ink">{gbp(p.amountPence)} · {p.type}</p>
                  <p className="text-sm text-text-secondary">{new Date(p.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColour[p.status] ?? 'bg-ink/5 text-ink'}`}>
                    {p.status.replace('_', ' ')}
                  </span>
                  {p.status === 'SUCCEEDED' && (
                    <Button variant="outline" size="sm" isLoading={refund.isPending}
                      onClick={() => refund.mutate({ id: p.id, amount: p.amountPence })}>
                      Refund
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
