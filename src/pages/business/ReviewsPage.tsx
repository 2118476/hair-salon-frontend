import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet } from '../../hooks/useBusinessOutlet';
import { useToast } from '../../context/toast-context';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Star } from 'lucide-react';

export function ReviewsPage() {
  const { businessId } = useBusinessOutlet();
  const qc = useQueryClient();
  const toast = useToast();
  const [replies, setReplies] = useState<Record<string, string>>({});
  const { data, isLoading } = useQuery({ queryKey: ['ba-reviews', businessId], queryFn: () => businessAdminApi.listReviews(businessId) });

  const reply = useMutation({
    mutationFn: ({ id, response }: { id: string; response: string }) => businessAdminApi.replyReview(id, response),
    onSuccess: () => { toast.show('Reply posted', 'success'); qc.invalidateQueries({ queryKey: ['ba-reviews', businessId] }); },
    onError: () => toast.show('Could not reply (owner/manager only)', 'error'),
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Reviews</h1>
      {isLoading && <p className="text-text-secondary">Loading…</p>}
      {data?.length === 0 && <p className="text-text-secondary">No reviews yet.</p>}
      <div className="space-y-4">
        {data?.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex" aria-label={`${r.rating} of 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`h-4 w-4 ${n <= r.rating ? 'fill-bronze text-bronze' : 'text-gray-300'}`} aria-hidden />
                  ))}
                </div>
                <span className="text-sm font-medium text-ink">{r.reviewerName}</span>
              </div>
              {r.comment && <p className="text-sm text-text-secondary">{r.comment}</p>}
              {r.businessResponse ? (
                <p className="mt-3 rounded bg-ivory p-3 text-sm text-ink"><span className="font-medium">Your reply:</span> {r.businessResponse}</p>
              ) : (
                <form
                  className="mt-3 flex gap-2"
                  onSubmit={(e) => { e.preventDefault(); reply.mutate({ id: r.id, response: replies[r.id] ?? '' }); }}
                >
                  <input
                    value={replies[r.id] ?? ''}
                    onChange={(e) => setReplies({ ...replies, [r.id]: e.target.value })}
                    placeholder="Write a public reply…"
                    aria-label="Reply"
                    className="h-10 flex-1 rounded-md border border-gray-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  <Button type="submit" size="sm" disabled={!replies[r.id]}>Reply</Button>
                </form>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
