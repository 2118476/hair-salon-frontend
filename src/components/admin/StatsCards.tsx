import { AdminStats } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Calendar, Users, Scissors, UserCheck, ClipboardList } from 'lucide-react';

interface StatsCardsProps {
  stats: AdminStats | undefined;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  const items = [
    { label: 'Total Bookings', value: stats?.totalBookings ?? 0, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Today's Bookings", value: stats?.todayBookings ?? 0, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Services', value: stats?.totalServices ?? 0, icon: Scissors, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Stylists', value: stats?.totalStylists ?? 0, icon: UserCheck, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`rounded-full p-2.5 ${item.bg}`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{item.value}</p>
              <p className="text-sm text-text-secondary">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
