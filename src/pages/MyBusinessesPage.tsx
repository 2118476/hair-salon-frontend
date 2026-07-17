import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { businessesApi } from '../api/businesses';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Building2 } from 'lucide-react';

export function MyBusinessesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['my-businesses'], queryFn: () => businessesApi.mine() });
  const businesses = data ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-ink">Your businesses</h1>
        <Link to="/business/new">
          <Button><Plus className="mr-1 h-4 w-4" /> New business</Button>
        </Link>
      </div>

      {isLoading && <p className="text-text-secondary">Loading…</p>}

      {!isLoading && businesses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Building2 className="mb-3 h-10 w-10 text-bronze" aria-hidden />
            <p className="text-lg font-medium text-ink">You don’t manage any salons yet</p>
            <p className="mt-1 max-w-md text-text-secondary">
              Onboard your salon to manage services, invite staff and take bookings.
            </p>
            <Link to="/business/new" className="mt-5">
              <Button>Onboard your salon</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {businesses.map((b) => (
          <Card key={b.id}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold text-ink">{b.name}</h2>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink">{b.myRole}</span>
              </div>
              {b.londonArea && <p className="mt-1 text-sm text-text-secondary">{b.londonArea}</p>}
              <Link to={`/salons/${b.id}`} className="mt-4 inline-block">
                <Button variant="outline" size="sm">View public profile</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
