import { Booking } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import { Calendar, Clock, Scissors, User, XCircle } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const statusVariant =
    booking.status === 'CONFIRMED'
      ? 'success'
      : booking.status === 'PENDING'
      ? 'warning'
      : booking.status === 'CANCELLED'
      ? 'error'
      : 'default';

  const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant}>{booking.status}</Badge>
              <span className="text-sm text-text-secondary">{formatCurrency(booking.totalPricePence)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-primary">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-accent" />
                {formatDate(booking.appointmentDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-accent" />
                {formatTime(booking.startTime)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <Scissors className="h-4 w-4" />
                {booking.service?.name || 'Unknown service'}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {booking.stylist ? `${booking.stylist.firstName} ${booking.stylist.lastName}` : 'Unknown stylist'}
              </span>
            </div>
            {booking.notes && (
              <p className="text-sm text-text-secondary italic">"{booking.notes}"</p>
            )}
          </div>
          {onCancel && canCancel && (
            <Button
              variant="outline"
              size="sm"
              className="border-error text-error hover:bg-error hover:text-white"
              onClick={() => onCancel(booking.id)}
            >
              <XCircle className="mr-1 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
