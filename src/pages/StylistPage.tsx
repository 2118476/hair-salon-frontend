import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { stylistsApi } from '../api/stylists';
import { Stylist } from '../types';
import { User, Star, X } from 'lucide-react';

export function StylistPage() {
  const { data: stylists, isLoading } = useQuery({
    queryKey: ['stylists'],
    queryFn: () => stylistsApi.getAll(),
  });

  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);

  const activeStylists = (stylists || []).filter((s) => s.active);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary">Our Stylists</h1>
        <p className="mt-2 text-text-secondary">Meet the talented professionals behind every great style</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : activeStylists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
          <User className="mb-2 h-10 w-10" />
          <p>No stylists available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeStylists.map((stylist) => (
            <Card key={stylist.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                    {stylist.imageUrl ? (
                      <img src={stylist.imageUrl} alt={stylist.firstName} className="h-24 w-24 rounded-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">
                    {stylist.firstName} {stylist.lastName}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-accent">{stylist.specialization}</p>
                  <p className="mt-3 text-sm text-text-secondary line-clamp-3">{stylist.bio}</p>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => setSelectedStylist(stylist)}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedStylist}
        onClose={() => setSelectedStylist(null)}
        title={selectedStylist ? `${selectedStylist.firstName} ${selectedStylist.lastName}` : ''}
        footer={
          <Button variant="ghost" onClick={() => setSelectedStylist(null)}>
            <X className="mr-1 h-4 w-4" /> Close
          </Button>
        }
      >
        {selectedStylist && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                {selectedStylist.imageUrl ? (
                  <img src={selectedStylist.imageUrl} alt={selectedStylist.firstName} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-accent font-medium">{selectedStylist.specialization}</p>
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>4.9 (120+ reviews)</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-text-primary leading-relaxed">{selectedStylist.bio}</p>
            {selectedStylist.services && selectedStylist.services.length > 0 && (
              <div>
                <p className="font-medium text-text-primary mb-2">Services Offered</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStylist.services.map((svc) => (
                    <span key={svc.id} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      {svc.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
