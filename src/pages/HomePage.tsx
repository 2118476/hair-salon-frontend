import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { servicesApi } from '../api/services';
import { stylistsApi } from '../api/stylists';
import { formatCurrency } from '../utils/formatters';
import { ArrowRight, Calendar, Clock, ImageOff, User } from 'lucide-react';

export function HomePage() {
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getAll(),
  });

  const { data: stylists, isLoading: stylistsLoading } = useQuery({
    queryKey: ['stylists'],
    queryFn: () => stylistsApi.getAll(),
  });

  const featuredServices = (services || []).filter((s) => s.active).slice(0, 6);
  const featuredStylists = (stylists || []).filter((s) => s.active).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            London's Premier Hair Experience
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">
            Book with top stylists across barbering, braiding, and textured hair care.
            Experience the art of hair in the heart of London.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/booking">
              <Button size="lg" className="px-8">
                Book Your Appointment <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">Featured Services</h2>
              <p className="mt-2 text-text-secondary">Discover our most popular treatments</p>
            </div>
            <Link to="/services" className="hidden text-sm font-medium text-accent hover:underline sm:block">
              View all <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-lg bg-gray-200" />
              ))}
            </div>
          ) : featuredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
              <ImageOff className="mb-2 h-8 w-8" />
              <p>No services available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <Card key={service.id} className="transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{service.name}</CardTitle>
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {service.category}
                      </span>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Stylists */}
      <section className="border-t border-gray-200 py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">Meet Our Stylists</h2>
              <p className="mt-2 text-text-secondary">Expert hands, creative minds</p>
            </div>
            <Link to="/stylists" className="hidden text-sm font-medium text-accent hover:underline sm:block">
              View all <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>

          {stylistsLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-lg bg-gray-200" />
              ))}
            </div>
          ) : featuredStylists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
              <User className="mb-2 h-8 w-8" />
              <p>No stylists available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredStylists.map((stylist) => (
                <Card key={stylist.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                        {stylist.imageUrl ? (
                          <img src={stylist.imageUrl} alt={stylist.firstName} className="h-20 w-20 rounded-full object-cover" />
                        ) : (
                          <User className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <h3 className="font-semibold text-text-primary">
                        {stylist.firstName} {stylist.lastName}
                      </h3>
                      <p className="text-sm text-accent">{stylist.specialization}</p>
                      <p className="mt-2 text-sm text-text-secondary line-clamp-2">{stylist.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-accent px-6 py-12 text-center sm:px-12">
            <h2 className="text-3xl font-bold text-white">Ready for a fresh look?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/90">
              Book your appointment today and let our expert stylists transform your hair experience.
            </p>
            <div className="mt-8">
              <Link to="/booking">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
