import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface DatePickerProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const formatDate = (day: number) => {
    const d = new Date(year, month, day);
    return d.toISOString().split('T')[0];
  };

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isSelected = (day: number) => selectedDate === formatDate(day);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold text-text-primary">
          {monthNames[month]} {year}
        </h3>
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d) => (
          <div key={d} className="text-xs font-medium text-text-secondary py-2">
            {d}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = isDisabled(day);
          return (
            <button
              key={day}
              onClick={() => !disabled && onSelectDate(formatDate(day))}
              disabled={disabled}
              className={`h-10 w-full rounded-md text-sm font-medium transition-colors ${
                disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : isSelected(day)
                  ? 'bg-accent text-white'
                  : 'hover:bg-gray-100 text-text-primary'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
