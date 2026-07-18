import { Service } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ImageOff, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface ServiceSelectorProps {
  services: Service[];
  selectedId: string | null;
  onSelect: (service: Service) => void;
  isLoading: boolean;
}

export function ServiceSelector({ services, selectedId, onSelect, isLoading }: ServiceSelectorProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
        <ImageOff className="mb-2 h-8 w-8" />
        <p>No services available at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card
          key={service.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedId === service.id ? 'ring-2 ring-accent' : ''
          }`}
          onClick={() => onSelect(service)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{service.name}</CardTitle>
              <Badge>{service.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-text-secondary line-clamp-2">{service.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <Clock className="h-4 w-4" />
                {service.durationMinutes} min
              </div>
              <span className="font-semibold text-accent">{formatCurrency(service.pricePence)}</span>
            </div>
            {selectedId === service.id && (
              <div className="mt-3">
                <Button variant="secondary" size="sm" className="w-full">
                  Selected
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
