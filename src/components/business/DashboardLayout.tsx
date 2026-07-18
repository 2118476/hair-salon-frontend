import { NavLink, Outlet, useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { businessesApi } from '../../api/businesses';
import {
  LayoutDashboard, Calendar, Scissors, Users, MapPin, UserCircle, Clock,
  ListChecks, Star, Image, CreditCard, BarChart3, Settings,
} from 'lucide-react';

const nav = [
  { to: '', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: 'calendar', label: 'Calendar', icon: Calendar },
  { to: 'services', label: 'Services', icon: Scissors },
  { to: 'staff', label: 'Staff', icon: Users },
  { to: 'schedules', label: 'Schedules', icon: Clock },
  { to: 'locations', label: 'Locations', icon: MapPin },
  { to: 'customers', label: 'Customers', icon: UserCircle },
  { to: 'waitlist', label: 'Waitlist', icon: ListChecks },
  { to: 'reviews', label: 'Reviews', icon: Star },
  { to: 'portfolio', label: 'Portfolio', icon: Image },
  { to: 'payments', label: 'Payments', icon: CreditCard },
  { to: 'reports', label: 'Reports', icon: BarChart3 },
  { to: 'settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout() {
  const { businessId = '' } = useParams();
  const { data: mine, isLoading } = useQuery({ queryKey: ['my-businesses'], queryFn: () => businessesApi.mine() });

  if (isLoading) {
    return <div className="p-10 text-text-secondary">Loading…</div>;
  }
  const membership = mine?.find((b) => b.id === businessId);
  if (!membership) {
    // Not a member of this business — send back to the picker.
    return <Navigate to="/business" replace />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row">
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="mb-4">
          <p className="font-serif text-lg font-semibold text-ink">{membership.name}</p>
          <p className="text-xs uppercase tracking-wide text-bronze">{membership.myRole}</p>
        </div>
        <nav className="space-y-1" aria-label="Business dashboard">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-ink text-ivory' : 'text-text-primary hover:bg-ink/5'
                }`
              }
            >
              <Icon className="h-4 w-4" aria-hidden /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden">
        <nav className="mb-4 flex gap-1 overflow-x-auto pb-2" aria-label="Business dashboard">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${
                  isActive ? 'bg-ink text-ivory' : 'bg-ink/5 text-text-primary'
                }`
              }
            >
              <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <main className="min-w-0 flex-1">
        <Outlet context={{ businessId, role: membership.myRole }} />
      </main>
    </div>
  );
}
