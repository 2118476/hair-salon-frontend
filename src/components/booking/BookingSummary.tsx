import { Service, Stylist } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingNotesSchema } from '../../utils/validators';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Scissors, User, Calendar, Clock } from 'lucide-react';

interface BookingSummaryProps {
  service: Service;
  stylist: Stylist;
  date: string;
  time: string;
  onConfirm: (notes: string) => void;
  isLoading: boolean;
}

export function BookingSummary({ service, stylist, date, time, onConfirm, isLoading }: BookingSummaryProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ notes: string }>({
    resolver: zodResolver(bookingNotesSchema),
  });

  const onSubmit = (data: { notes: string }) => {
    onConfirm(data.notes || '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Scissors className="mt-0.5 h-5 w-5 text-accent" />
            <div>
              <p className="font-medium text-text-primary">{service.name}</p>
              <p className="text-sm text-text-secondary">{service.description}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-5 w-5 text-accent" />
            <div>
              <p className="font-medium text-text-primary">
                {stylist.firstName} {stylist.lastName}
              </p>
              <p className="text-sm text-text-secondary">{stylist.specialization}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-5 w-5 text-accent" />
            <p className="font-medium text-text-primary">{formatDate(date)}</p>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-accent" />
            <p className="font-medium text-text-primary">{time}</p>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-accent">{formatCurrency(service.pricePence)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Textarea
          {...register('notes')}
          label="Additional Notes (optional)"
          placeholder="Any special requests or notes for your stylist..."
          error={errors.notes?.message}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Confirm Booking
      </Button>
    </form>
  );
}
