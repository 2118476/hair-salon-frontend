import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Service, Stylist } from '../types';
import { servicesApi } from '../api/services';
import { stylistsApi } from '../api/stylists';
import { bookingsApi } from '../api/bookings';
import { ServiceSelector } from '../components/booking/ServiceSelector';
import { StylistSelector } from '../components/booking/StylistSelector';
import { DatePicker } from '../components/booking/DatePicker';
import { TimeSlotPicker } from '../components/booking/TimeSlotPicker';
import { BookingSummary } from '../components/booking/BookingSummary';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle, ChevronLeft, ChevronRight, Scissors, User, Calendar, Clock } from 'lucide-react';

type Step = 'service' | 'stylist' | 'datetime' | 'confirm';

export function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const preselectedServiceId = searchParams.get('serviceId');

  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getAll(),
  });

  const { data: stylists, isLoading: stylistsLoading } = useQuery({
    queryKey: ['stylists', selectedService?.id],
    queryFn: () => stylistsApi.getByService(selectedService!.id),
    enabled: !!selectedService,
  });

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', selectedStylist?.id, selectedService?.id, selectedDate],
    queryFn: () =>
      bookingsApi.getAvailableSlots(selectedStylist!.id, selectedService!.id, selectedDate!),
    enabled: !!selectedStylist && !!selectedService && !!selectedDate,
  });

  useEffect(() => {
    if (preselectedServiceId && services) {
      const svc = services.find((s) => s.id === preselectedServiceId);
      if (svc) {
        setSelectedService(svc);
        setStep('stylist');
      }
    }
  }, [preselectedServiceId, services]);

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: 'service', label: 'Service', icon: Scissors },
    { key: 'stylist', label: 'Stylist', icon: User },
    { key: 'datetime', label: 'Date & Time', icon: Calendar },
    { key: 'confirm', label: 'Confirm', icon: Clock },
  ];

  const handleNext = () => {
    if (step === 'service' && selectedService) setStep('stylist');
    else if (step === 'stylist' && selectedStylist) setStep('datetime');
    else if (step === 'datetime' && selectedDate && selectedTime) setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'stylist') setStep('service');
    else if (step === 'datetime') setStep('stylist');
    else if (step === 'confirm') setStep('datetime');
  };

  const handleConfirm = async (notes: string) => {
    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/booking' } });
      return;
    }
    setIsSubmitting(true);
    try {
      await bookingsApi.create({
        stylistId: selectedStylist.id,
        serviceId: selectedService.id,
        appointmentDate: selectedDate,
        startTime: selectedTime,
        notes,
      });
      setToast({ message: 'Booking confirmed successfully!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setToast({ message: err?.response?.data?.message || 'Booking failed. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary">Book Your Appointment</h1>
        <p className="mt-2 text-text-secondary">Follow the steps below to schedule your visit</p>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => {
            const isActive = s.key === step;
            const isCompleted =
              (s.key === 'service' && selectedService) ||
              (s.key === 'stylist' && selectedStylist) ||
              (s.key === 'datetime' && selectedDate && selectedTime) ||
              (s.key === 'confirm' && false);
            return (
              <div key={s.key} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium ${
                      isActive
                        ? 'border-accent bg-accent text-white'
                        : isCompleted
                        ? 'border-success bg-success text-white'
                        : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                  </div>
                  <span className={`mt-2 hidden text-xs font-medium sm:block ${isActive ? 'text-accent' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`mx-2 h-0.5 flex-1 ${isCompleted ? 'bg-success' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-lg border border-gray-200 bg-surface p-6">
        {step === 'service' && (
          <ServiceSelector
            services={(services || []).filter((s) => s.active)}
            selectedId={selectedService?.id || null}
            onSelect={(s) => { setSelectedService(s); setSelectedStylist(null); }}
            isLoading={servicesLoading}
          />
        )}

        {step === 'stylist' && (
          <StylistSelector
            stylists={stylists || []}
            selectedId={selectedStylist?.id || null}
            onSelect={setSelectedStylist}
            isLoading={stylistsLoading}
            selectedService={selectedService}
          />
        )}

        {step === 'datetime' && (
          <div className="space-y-6">
            <DatePicker selectedDate={selectedDate} onSelectDate={(d) => { setSelectedDate(d); setSelectedTime(null); }} />
            {selectedDate && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-text-primary">Available Times</h3>
                <TimeSlotPicker
                  slots={slots || []}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  isLoading={slotsLoading}
                />
              </div>
            )}
          </div>
        )}

        {step === 'confirm' && selectedService && selectedStylist && selectedDate && selectedTime && (
          <BookingSummary
            service={selectedService}
            stylist={selectedStylist}
            date={selectedDate}
            time={selectedTime}
            onConfirm={handleConfirm}
            isLoading={isSubmitting}
          />
        )}
      </div>

      {/* Navigation */}
      {step !== 'confirm' && (
        <div className="mt-6 flex justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={step === 'service'}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (step === 'service' && !selectedService) ||
              (step === 'stylist' && !selectedStylist) ||
              (step === 'datetime' && (!selectedDate || !selectedTime))
            }
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
