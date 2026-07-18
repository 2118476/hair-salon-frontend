import { Booking } from '../../types';
import { BookingCard } from './BookingCard';
import { Calendar } from 'lucide-react';

interface BookingListProps {
  bookings: Booking[] | undefined;
  isLoading: boolean;
  title: string;
  emptyMessage: string;
  onCancel?: (id: string) => void;
}

export function BookingList({ bookings, isLoading, title, emptyMessage, onCancel }: BookingListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 py-10 text-text-secondary">
          <Calendar className="mb-2 h-8 w-8" />
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} onCancel={onCancel} />
        ))}
      </div>
    </div>
  );
}
