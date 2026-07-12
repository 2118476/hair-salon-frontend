import { Booking } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Calendar } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatters';

interface UpcomingAppointmentsProps {
  bookings: Booking[] | undefined;
  isLoading: boolean;
}

export function UpcomingAppointments({ bookings, isLoading }: UpcomingAppointmentsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-md bg-gray-200" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
            <Calendar className="mb-2 h-8 w-8" />
            <p>No upcoming appointments.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-text-secondary">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Time</th>
                <th className="pb-2 font-medium">Service</th>
                <th className="pb-2 font-medium">Stylist</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3">{formatDate(booking.appointmentDate)}</td>
                  <td className="py-3">{formatTime(booking.startTime)}</td>
                  <td className="py-3">{booking.service?.name || 'Unknown'}</td>
                  <td className="py-3">
                    {booking.stylist ? `${booking.stylist.firstName} ${booking.stylist.lastName}` : 'Unknown'}
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={
                        booking.status === 'CONFIRMED'
                          ? 'success'
                          : booking.status === 'PENDING'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {booking.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
