import { Stylist, Service } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { User } from 'lucide-react';

interface StylistSelectorProps {
  stylists: Stylist[];
  selectedId: string | null;
  onSelect: (stylist: Stylist) => void;
  isLoading: boolean;
  selectedService?: Service | null;
}

export function StylistSelector({ stylists, selectedId, onSelect, isLoading, selectedService }: StylistSelectorProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (stylists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
        <User className="mb-2 h-8 w-8" />
        <p>No stylists available for {selectedService?.name || 'this service'}.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stylists.map((stylist) => (
        <Card
          key={stylist.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedId === stylist.id ? 'ring-2 ring-accent' : ''
          }`}
          onClick={() => onSelect(stylist)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100">
                {stylist.imageUrl ? (
                  <img src={stylist.imageUrl} alt={stylist.firstName} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">
                  {stylist.firstName} {stylist.lastName}
                </h3>
                <p className="text-sm text-accent">{stylist.specialization}</p>
                <p className="mt-1 text-sm text-text-secondary line-clamp-2">{stylist.bio}</p>
              </div>
            </div>
            {selectedId === stylist.id && (
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
