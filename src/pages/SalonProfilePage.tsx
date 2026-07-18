import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { businessesApi } from '../api/businesses';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MapPin, Clock, Star, ShieldCheck } from 'lucide-react';

const price = (pence: number) => `£${(pence / 100).toFixed(2)}`;
const duration = (mins: number) => (mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60 ? `${mins % 60}m` : ''}`.trim() : `${mins}m`);

export function SalonProfilePage() {
  const { id = '' } = useParams();

  const businessQ = useQuery({ queryKey: ['business', id], queryFn: () => businessesApi.getById(id) });
  const servicesQ = useQuery({ queryKey: ['business-services', id], queryFn: () => businessesApi.getServices(id) });
  const reviewsQ = useQuery({ queryKey: ['business-reviews', id], queryFn: () => businessesApi.getReviews(id) });

  if (businessQ.isLoading) return <p className="mx-auto max-w-5xl px-4 py-10 text-text-secondary">Loading…</p>;
  if (businessQ.isError || !businessQ.data)
    return <p className="mx-auto max-w-5xl px-4 py-10 text-error">Salon not found.</p>;

  const b = businessQ.data;
  const services = servicesQ.data ?? [];
  const reviews = reviewsQ.data ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 overflow-hidden rounded-xl">
        <div className="flex h-48 items-end bg-gradient-to-br from-burgundy to-ink p-6">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-ivory">{b.name}</h1>
            {b.londonArea && (
              <p className="mt-1 flex items-center gap-1 text-ivory/80">
                <MapPin className="h-4 w-4" aria-hidden /> {b.londonArea}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {b.description && <p className="mb-8 text-text-secondary">{b.description}</p>}

          <h2 className="mb-4 font-serif text-2xl font-semibold text-ink">Services</h2>
          <div className="space-y-3">
            {services.length === 0 && <p className="text-text-secondary">No services listed yet.</p>}
            {services.map((s) => (
              <Card key={s.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-ink">{s.name}</p>
                    {s.category && <p className="text-sm text-text-secondary">{s.category}</p>}
                    <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                      <Clock className="h-4 w-4" aria-hidden /> {duration(s.durationMinutes)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ink">{price(s.pricePence)}</p>
                    <Link to="/booking">
                      <Button size="sm" className="mt-2">Book</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="mb-4 mt-10 font-serif text-2xl font-semibold text-ink">Reviews</h2>
          <div className="space-y-3">
            {reviews.length === 0 && <p className="text-text-secondary">No reviews yet.</p>}
            {reviews.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex" aria-label={`${r.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-4 w-4 ${n <= r.rating ? 'fill-bronze text-bronze' : 'text-gray-300'}`}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-ink">{r.reviewerName}</span>
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-text-secondary">{r.comment}</p>}
                  {r.businessResponse && (
                    <p className="mt-2 rounded bg-ivory p-2 text-sm text-ink">
                      <span className="font-medium">Response:</span> {r.businessResponse}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle>Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-text-secondary">
              <p><span className="font-medium text-ink">Deposit:</span> {b.depositType === 'NONE' ? 'None' : b.depositType}</p>
              <p><span className="font-medium text-ink">Cancellation:</span> {b.cancellationNoticeHours}h notice</p>
              <p><span className="font-medium text-ink">Min. notice:</span> {b.minBookingNoticeMinutes} min</p>
              <ul className="mt-3 space-y-1">
                {b.hijabFriendly && <li className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-sage" /> Hijab-friendly</li>}
                {b.privateTreatmentRoom && <li className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-sage" /> Private treatment room</li>}
                {b.childrenAccepted && <li className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-sage" /> Children welcome</li>}
                {b.mobileService && <li className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-sage" /> Mobile service</li>}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
