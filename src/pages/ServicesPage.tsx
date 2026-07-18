import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { servicesApi } from '../api/services';
import { formatCurrency } from '../utils/formatters';
import { Clock, ImageOff, Scissors } from 'lucide-react';

const categories = ['All', 'Haircut', 'Colour', 'Styling', 'Treatments', 'Barbering', 'Braiding'];

export function ServicesPage() {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getAll(),
  });

  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = (services || []).filter((s) => {
    const matchCategory = activeCategory === 'All' || s.category === activeCategory;
    return s.active && matchCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary">Our Services</h1>
        <p className="mt-2 text-text-secondary">Premium hair services tailored to you</p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-text-primary hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
          <Scissors className="mb-2 h-10 w-10" />
          <p>No services found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <Card key={service.id} className="transition-all hover:shadow-md">
              <div className="h-48 bg-gray-100 flex items-center justify-center rounded-t-lg">
                {service.imageUrl ? (
                  <img src={service.imageUrl} alt={service.name} className="h-full w-full rounded-t-lg object-cover" />
                ) : (
                  <ImageOff className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                    {service.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-text-secondary">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-text-secondary">
                    <Clock className="h-4 w-4" />
                    {service.durationMinutes} min
                  </div>
                  <span className="font-semibold text-accent">{formatCurrency(service.pricePence)}</span>
                </div>
                <div className="mt-4">
                  <Link to={`/booking?serviceId=${service.id}`}>
                    <Button className="w-full">Book Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
