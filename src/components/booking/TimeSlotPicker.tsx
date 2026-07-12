import { TimeSlot } from '../../types';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  isLoading: boolean;
}

export function TimeSlotPicker({ slots, selectedTime, onSelectTime, isLoading }: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-gray-200" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
        <Clock className="mb-2 h-8 w-8" />
        <p>No available time slots for this date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {slots.map((slot) => (
        <button
          key={slot.time}
          onClick={() => slot.available && onSelectTime(slot.time)}
          disabled={!slot.available}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            !slot.available
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : selectedTime === slot.time
              ? 'bg-accent text-white'
              : 'bg-white border border-gray-200 text-text-primary hover:border-accent hover:text-accent'
          }`}
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
}
