import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet, gbp } from '../../hooks/useBusinessOutlet';
import { Card, CardContent } from '../../components/ui/Card';
import { Calendar, TrendingUp, XCircle, UserX } from 'lucide-react';

const today = () => new Date().toISOString().slice(0, 10);
const monthAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
};

export function OverviewPage() {
  const { businessId } = useBusinessOutlet();
  const report = useQuery({
    queryKey: ['report', businessId, monthAgo(), today()],
    queryFn: () => businessAdminApi.report(businessId, monthAgo(), today()),
  });
  const calendar = useQuery({
    queryKey: ['calendar', businessId, today()],
    queryFn: () => businessAdminApi.calendar(businessId, today(), today()),
  });

  const r = report.data;
  const stats = [
    { label: 'Revenue (30d)', value: r ? gbp(r.revenuePence) : '—', icon: TrendingUp },
    { label: 'Appointments (30d)', value: r?.totalBookings ?? '—', icon: Calendar },
    { label: 'Cancellations', value: r?.cancelled ?? '—', icon: XCircle },
    { label: 'No-shows', value: r?.noShows ?? '—', icon: UserX },
  ];

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold text-ink">Overview</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <s.icon className="mb-2 h-5 w-5 text-bronze" aria-hidden />
              <p className="text-2xl font-semibold text-ink">{s.value}</p>
              <p className="text-sm text-text-secondary">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-ink">Today's appointments</h2>
        <Link to="calendar" className="text-sm font-medium text-bronze hover:underline">Open calendar →</Link>
      </div>
      <Card>
        <CardContent className="p-0">
          {calendar.isLoading && <p className="p-6 text-text-secondary">Loading…</p>}
          {calendar.data && calendar.data.length === 0 && (
            <p className="p-6 text-text-secondary">No appointments today.</p>
          )}
          <ul className="divide-y divide-gray-100">
            {calendar.data?.map((a) => (
              <li key={a.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="font-medium text-ink">{a.startTime.slice(0, 5)} · {a.serviceName}</p>
                  <p className="text-sm text-text-secondary">{a.customerName} · {a.stylistName}</p>
                </div>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink">{a.status}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
