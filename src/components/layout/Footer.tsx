import { Scissors, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Scissors className="h-6 w-6 text-accent" />
              <span>London Hair</span>
            </div>
            <p className="mt-4 text-sm text-gray-300">
              London's Premier Hair Experience. Top stylists across barbering, braiding, and textured hair care.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 123 Strand, London WC2R 0AA</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +44 20 7123 4567</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@londonhair.com</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Hours</h3>
            <div className="mt-4 space-y-1 text-sm text-gray-300">
              <p>Mon – Fri: 9:00 AM – 8:00 PM</p>
              <p>Saturday: 9:00 AM – 6:00 PM</p>
              <p>Sunday: 10:00 AM – 4:00 PM</p>
            </div>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-gray-300 hover:text-accent"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-300 hover:text-accent"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-300 hover:text-accent"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} London Hair Salon. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
