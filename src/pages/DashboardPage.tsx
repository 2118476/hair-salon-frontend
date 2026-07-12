import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings';
import { BookingList } from '../components/customer/BookingList';
import { ProfileForm } from '../components/customer/ProfileForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Toast } from '../components/ui/Toast';
import { useState } from 'react';
import { Plus, User } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsApi.getMyBookings(),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      setToast({ message: 'Booking cancelled', type: 'success' });
    },
    onError: (err: any) => {
      setToast({ message: err?.response?.data?.message || 'Failed to cancel', type: 'error' });
    },
  });

  const today = new Date().toISOString().split('T')[0];
  const upcoming = (bookings || []).filter((b) => b.appointmentDate >= today && b.status !== 'CANCELLED');
  const past = (bookings || []).filter((b) => b.appointmentDate < today || b.status === 'CANCELLED');

  const handleProfileUpdate = (_data: { firstName: string; lastName: string; phone: string }) => {
    // In a real app, call API here
    setToast({ message: 'Profile updated (mock)', type: 'success' });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">
          Welcome back, {user?.firstName || 'Guest'}!
        </h1>
        <p className="mt-1 text-text-secondary">Manage your bookings and profile</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <Button onClick={() => navigate('/booking')} className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> New Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <BookingList
            bookings={upcoming}
            isLoading={isLoading}
            title="Upcoming Bookings"
            emptyMessage="No upcoming bookings. Book your first appointment!"
            onCancel={(id) => cancelMutation.mutate(id)}
          />
          <BookingList
            bookings={past}
            isLoading={isLoading}
            title="Past Bookings"
            emptyMessage="No past bookings yet."
          />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-accent" /> My Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user && <ProfileForm user={user} onSubmit={handleProfileUpdate} isLoading={false} />}
            </CardContent>
          </Card>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
