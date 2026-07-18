import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { businessesApi, CreateBusinessData } from '../api/businesses';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function BusinessOnboardingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateBusinessData>({
    name: '',
    description: '',
    businessType: 'HAIR_SALON',
    londonArea: '',
    locationName: '',
    postcode: '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: (data: CreateBusinessData) => businessesApi.create(data),
    onSuccess: () => navigate('/business'),
    onError: () => setError('Could not create the business. Please check the details and try again.'),
  });

  const set = (k: keyof CreateBusinessData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Business name is required.');
      return;
    }
    mutation.mutate(form);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 font-serif text-3xl font-semibold text-ink">Onboard your salon</h1>
      <p className="mb-8 text-text-secondary">
        Create your business to manage services, staff, availability and bookings. You’ll be its owner.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Business details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input id="name" label="Business name" value={form.name} onChange={set('name')} required />
            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-text-primary">
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={set('description')}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>
            <Input id="londonArea" label="London area" value={form.londonArea} onChange={set('londonArea')} placeholder="e.g. Shoreditch" />
            <div className="grid grid-cols-2 gap-4">
              <Input id="locationName" label="First location name" value={form.locationName} onChange={set('locationName')} placeholder="e.g. Main studio" />
              <Input id="postcode" label="Postcode" value={form.postcode} onChange={set('postcode')} placeholder="E2 7DJ" />
            </div>

            {error && <p className="text-sm text-error" role="alert">{error}</p>}

            <Button type="submit" isLoading={mutation.isPending} className="w-full">
              Create business
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
