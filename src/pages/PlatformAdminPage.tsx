import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { platformApi } from '../api/platform';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { gbp } from '../hooks/useBusinessOutlet';
import { useToast } from '../context/toast-context';
import { ShieldCheck, Building2, Users, TrendingUp } from 'lucide-react';

export function PlatformAdminPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const stats = useQuery({ queryKey: ['pf-stats'], queryFn: () => platformApi.stats() });
  const businesses = useQuery({ queryKey: ['pf-businesses'], queryFn: () => platformApi.businesses() });
  const reported = useQuery({ queryKey: ['pf-reported'], queryFn: () => platformApi.reportedReviews() });
  const audit = useQuery({ queryKey: ['pf-audit'], queryFn: () => platformApi.audit() });

  const refreshBiz = () => qc.invalidateQueries({ queryKey: ['pf-businesses'] });
  const verify = useMutation({ mutationFn: ({ id, v }: { id: string; v: boolean }) => platformApi.verifyBusiness(id, v), onSuccess: () => { toast.show('Updated', 'success'); refreshBiz(); } });
  const active = useMutation({ mutationFn: ({ id, a }: { id: string; a: boolean }) => platformApi.setBusinessActive(id, a), onSuccess: () => { toast.show('Updated', 'success'); refreshBiz(); } });
  const moderate = useMutation({ mutationFn: ({ id, s }: { id: string; s: string }) => platformApi.moderateReview(id, s), onSuccess: () => { toast.show('Moderated', 'success'); qc.invalidateQueries({ queryKey: ['pf-reported'] }); } });

  const cards = [
    { label: 'Revenue', value: stats.data ? gbp(stats.data.totalRevenuePence) : '—', icon: TrendingUp },
    { label: 'Businesses', value: stats.data?.totalBusinesses ?? '—', icon: Building2 },
    { label: 'Verified', value: stats.data?.verifiedBusinesses ?? '—', icon: ShieldCheck },
    { label: 'Users', value: stats.data?.totalUsers ?? '—', icon: Users },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 font-serif text-3xl font-semibold text-ink">Platform administration</h1>
      <p className="mb-8 text-text-secondary">Oversight across all businesses — separate from individual salon management.</p>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}><CardContent className="p-5">
            <c.icon className="mb-2 h-5 w-5 text-bronze" aria-hidden />
            <p className="text-2xl font-semibold text-ink">{c.value}</p>
            <p className="text-sm text-text-secondary">{c.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <h2 className="mb-3 font-serif text-xl font-semibold text-ink">Businesses</h2>
      <Card className="mb-10"><CardContent className="p-0">
        <ul className="divide-y divide-gray-100">
          {businesses.data?.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
              <div>
                <p className="font-medium text-ink">{b.name} {b.verified && <ShieldCheck className="inline h-4 w-4 text-sage" />}</p>
                <p className="text-sm text-text-secondary">{b.londonArea} · {b.myRole}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => verify.mutate({ id: b.id, v: !b.verified })}>
                  {b.verified ? 'Unverify' : 'Verify'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => active.mutate({ id: b.id, a: b.myRole === 'SUSPENDED' })}>
                  {b.myRole === 'SUSPENDED' ? 'Reinstate' : 'Suspend'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent></Card>

      <h2 className="mb-3 font-serif text-xl font-semibold text-ink">Reported reviews</h2>
      <Card className="mb-10"><CardContent className="p-0">
        {reported.data?.length === 0 && <p className="p-6 text-text-secondary">Nothing reported.</p>}
        <ul className="divide-y divide-gray-100">
          {reported.data?.map((r) => (
            <li key={r.id} className="flex items-center justify-between px-6 py-3">
              <p className="text-sm text-ink">★{r.rating} · {r.comment}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => moderate.mutate({ id: r.id, s: 'HIDDEN' })}>Hide</Button>
                <Button size="sm" variant="outline" onClick={() => moderate.mutate({ id: r.id, s: 'PUBLISHED' })}>Approve</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent></Card>

      <h2 className="mb-3 font-serif text-xl font-semibold text-ink">Audit log</h2>
      <Card><CardContent className="p-0">
        <ul className="divide-y divide-gray-100 text-sm">
          {audit.data?.slice(0, 20).map((e) => (
            <li key={e.id} className="flex justify-between px-6 py-2">
              <span className="text-ink">{e.action}{e.detail ? ` · ${e.detail}` : ''}</span>
              <span className="text-text-secondary">{new Date(e.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </CardContent></Card>
    </div>
  );
}
