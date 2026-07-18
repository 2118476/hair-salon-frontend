import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet, gbp } from '../../hooks/useBusinessOutlet';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

const iso = (d: Date) => d.toISOString().slice(0, 10);

export function ReportsPage() {
  const { businessId } = useBusinessOutlet();
  const [from, setFrom] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 30); return iso(d); });
  const [to, setTo] = useState(iso(new Date()));

  const { data, isLoading, isError } = useQuery({
    queryKey: ['report', businessId, from, to],
    queryFn: () => businessAdminApi.report(businessId, from, to),
  });

  const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Reports</h1>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <Input id="from" label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-auto" />
        <Input id="to" label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-auto" />
      </div>

      {isLoading && <p className="text-text-secondary">Loading…</p>}
      {isError && <p className="text-error">Only owners and managers can view reports.</p>}

      {data && (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[
              ['Revenue', gbp(data.revenuePence)],
              ['Refunds', gbp(data.refundsPence)],
              ['Appointments', data.totalBookings],
              ['Completed', data.completed],
              ['Cancelled', data.cancelled],
              ['No-shows', data.noShows],
              ['Avg. value', gbp(data.averageAppointmentValuePence)],
              ['No-show rate', pct(data.noShowRate)],
            ].map(([label, value]) => (
              <Card key={label as string}>
                <CardContent className="p-5">
                  <p className="text-2xl font-semibold text-ink">{value}</p>
                  <p className="text-sm text-text-secondary">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="mb-3 font-serif text-xl font-semibold text-ink">Top services</h2>
          <Card>
            <CardContent className="p-0">
              {data.topServices.length === 0 && <p className="p-6 text-text-secondary">No data for this period.</p>}
              <ul className="divide-y divide-gray-100">
                {data.topServices.map((s) => (
                  <li key={s.name} className="flex justify-between px-6 py-3">
                    <span className="text-ink">{s.name}</span>
                    <span className="font-medium text-text-secondary">{s.count} bookings</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
