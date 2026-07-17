import { useState, FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { businessesApi } from '../api/businesses';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MapPin, Search, BadgeCheck, Sparkles } from 'lucide-react';

export function DiscoverPage() {
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['discover', submitted],
    queryFn: () => businessesApi.discover(submitted),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(q.trim());
  };

  const businesses = data?.content ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="mb-2 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-bronze">
          <Sparkles className="h-4 w-4" /> Discover
        </p>
        <h1 className="font-serif text-4xl font-semibold text-ink">Find your salon in London</h1>
        <p className="mt-2 max-w-2xl text-text-secondary">
          Search by salon name, London area or the service you need — from precision fades and colour to
          braids, locs and textured-hair specialists.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mb-10 flex gap-2" role="search" aria-label="Search salons">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try “Shoreditch”, “braids” or a salon name"
            aria-label="Search term"
            className="h-12 w-full rounded-md border border-gray-300 pl-11 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <Button type="submit" size="lg">Search</Button>
      </form>

      {isLoading && <p className="text-text-secondary">Loading salons…</p>}
      {isError && <p className="text-error">We couldn’t load salons right now. Please try again.</p>}

      {!isLoading && !isError && businesses.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-lg font-medium text-ink">No salons found</p>
            <p className="mt-1 text-text-secondary">Try a different area or service.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {businesses.map((b) => (
          <Link key={b.id} to={`/salons/${b.id}`} className="group">
            <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-burgundy to-ink">
                <span className="font-serif text-3xl text-ivory">{b.name.charAt(0)}</span>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-serif text-xl font-semibold text-ink">{b.name}</h2>
                  {b.verified && <BadgeCheck className="h-4 w-4 text-sage" aria-label="Verified" />}
                </div>
                {b.londonArea && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                    <MapPin className="h-4 w-4" aria-hidden /> {b.londonArea}
                  </p>
                )}
                {b.description && <p className="mt-3 line-clamp-2 text-sm text-text-secondary">{b.description}</p>}
                {b.instantBooking && (
                  <span className="mt-4 inline-block rounded-full bg-sage/10 px-3 py-1 text-xs font-medium text-sage">
                    Instant booking
                  </span>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
