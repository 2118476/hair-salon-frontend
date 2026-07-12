import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import { servicesApi } from '../api/services';
import { stylistsApi } from '../api/stylists';
import { StatsCards } from '../components/admin/StatsCards';
import { UpcomingAppointments } from '../components/admin/UpcomingAppointments';
import { RecentActivity } from '../components/admin/RecentActivity';
import { UsersTable } from '../components/admin/UsersTable';
import { ServicesManager } from '../components/admin/ServicesManager';
import { StylistsManager } from '../components/admin/StylistsManager';
import { Toast } from '../components/ui/Toast';
import { LayoutDashboard, Calendar, Users, Scissors, UserCheck } from 'lucide-react';

type Tab = 'dashboard' | 'bookings' | 'users' | 'services' | 'stylists';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats(),
  });

  const { data: upcoming, isLoading: upcomingLoading } = useQuery({
    queryKey: ['admin-upcoming'],
    queryFn: () => adminApi.getUpcomingAppointments(),
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: () => adminApi.getRecentActivity(),
  });

  const { data: allBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => adminApi.getAllBookings(),
    enabled: activeTab === 'bookings',
  });

  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getAllUsers(),
    enabled: activeTab === 'users',
  });

  const { data: allServices, isLoading: servicesLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => adminApi.getAllServices(),
    enabled: activeTab === 'services',
  });

  const { data: allStylists, isLoading: stylistsLoading } = useQuery({
    queryKey: ['admin-stylists'],
    queryFn: () => adminApi.getAllStylists(),
    enabled: activeTab === 'stylists',
  });

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'bookings', label: 'Bookings', icon: Calendar },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'services', label: 'Services', icon: Scissors },
    { key: 'stylists', label: 'Stylists', icon: UserCheck },
  ];

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setToast({ message: 'User role updated', type: 'success' });
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: (data: any) => servicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setToast({ message: 'Service created', type: 'success' });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => servicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setToast({ message: 'Service updated', type: 'success' });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setToast({ message: 'Service deleted', type: 'success' });
    },
  });

  const createStylistMutation = useMutation({
    mutationFn: (data: any) => stylistsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stylists'] });
      queryClient.invalidateQueries({ queryKey: ['stylists'] });
      setToast({ message: 'Stylist created', type: 'success' });
    },
  });

  const updateStylistMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => stylistsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stylists'] });
      queryClient.invalidateQueries({ queryKey: ['stylists'] });
      setToast({ message: 'Stylist updated', type: 'success' });
    },
  });

  const deleteStylistMutation = useMutation({
    mutationFn: (id: string) => stylistsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stylists'] });
      queryClient.invalidateQueries({ queryKey: ['stylists'] });
      setToast({ message: 'Stylist deleted', type: 'success' });
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="mt-1 text-text-secondary">Manage your salon operations</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <StatsCards stats={stats} isLoading={statsLoading} />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <UpcomingAppointments bookings={upcoming} isLoading={upcomingLoading} />
            </div>
            <div>
              <RecentActivity activities={activity} isLoading={activityLoading} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">All Bookings</h2>
          {bookingsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-md bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-text-secondary">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Stylist</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {(allBookings || []).map((b) => (
                    <tr key={b.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">{b.appointmentDate}</td>
                      <td className="px-4 py-3">{b.startTime}</td>
                      <td className="px-4 py-3">{b.service?.name}</td>
                      <td className="px-4 py-3">{b.stylist?.firstName} {b.stylist?.lastName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          b.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          b.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>{b.status}</span>
                      </td>
                      <td className="px-4 py-3">£{(b.totalPricePence / 100).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">User Management</h2>
          <UsersTable
            users={allUsers}
            isLoading={usersLoading}
            onUpdateRole={(userId, role) => updateRoleMutation.mutate({ userId, role })}
          />
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Service Management</h2>
          <ServicesManager
            services={allServices}
            isLoading={servicesLoading}
            onCreate={(data) => createServiceMutation.mutate(data)}
            onUpdate={(id, data) => updateServiceMutation.mutate({ id, data })}
            onDelete={(id) => deleteServiceMutation.mutate(id)}
          />
        </div>
      )}

      {activeTab === 'stylists' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">Stylist Management</h2>
          <StylistsManager
            stylists={allStylists}
            isLoading={stylistsLoading}
            onCreate={(data) => createStylistMutation.mutate(data)}
            onUpdate={(id, data) => updateStylistMutation.mutate({ id, data })}
            onDelete={(id) => deleteStylistMutation.mutate(id)}
          />
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
