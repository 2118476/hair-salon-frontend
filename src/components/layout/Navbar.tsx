import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { Scissors, Menu, X, User, LogOut, LayoutDashboard, Calendar } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, isAdmin, isModerator, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Scissors className="h-6 w-6 text-accent" />
          <span className="hidden sm:inline">London Hair</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/services" className="text-sm font-medium text-text-primary hover:text-accent">
            Services
          </Link>
          <Link to="/stylists" className="text-sm font-medium text-text-primary hover:text-accent">
            Stylists
          </Link>
          <Link to="/booking" className="text-sm font-medium text-text-primary hover:text-accent">
            Book Now
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-gray-200"
              >
                <User className="h-4 w-4" />
                {user?.firstName}
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-surface py-1 shadow-lg">
                  {(isAdmin || isModerator) && (
                    <button
                      onClick={() => { navigate('/admin'); setProfileOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Admin
                    </button>
                  )}
                  <button
                    onClick={() => { navigate('/dashboard'); setProfileOpen(false); }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-gray-50"
                  >
                    <Calendar className="h-4 w-4" /> My Bookings
                  </button>
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-text-primary hover:text-accent">
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          className="rounded-md p-2 text-text-primary hover:bg-gray-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/services" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-text-primary">
              Services
            </Link>
            <Link to="/stylists" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-text-primary">
              Stylists
            </Link>
            <Link to="/booking" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-text-primary">
              Book Now
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-text-primary">
                  My Bookings
                </Link>
                {(isAdmin || isModerator) && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-text-primary">
                    Admin
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-sm font-medium text-error">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-text-primary">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-accent">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
