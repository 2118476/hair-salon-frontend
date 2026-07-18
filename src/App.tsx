import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { StylistPage } from './pages/StylistPage';
import { BookingPage } from './pages/BookingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { SalonProfilePage } from './pages/SalonProfilePage';
import { BusinessOnboardingPage } from './pages/BusinessOnboardingPage';
import { MyBusinessesPage } from './pages/MyBusinessesPage';
import { DashboardLayout } from './components/business/DashboardLayout';
import { OverviewPage } from './pages/business/OverviewPage';
import { CalendarPage } from './pages/business/CalendarPage';
import { ServicesPage as BizServicesPage } from './pages/business/ServicesPage';
import { StaffPage } from './pages/business/StaffPage';
import { SchedulesPage } from './pages/business/SchedulesPage';
import { LocationsPage } from './pages/business/LocationsPage';
import { CustomersPage } from './pages/business/CustomersPage';
import { WaitlistPage } from './pages/business/WaitlistPage';
import { ReviewsPage } from './pages/business/ReviewsPage';
import { PortfolioPage } from './pages/business/PortfolioPage';
import { PaymentsPage } from './pages/business/PaymentsPage';
import { ReportsPage } from './pages/business/ReportsPage';
import { SettingsPage } from './pages/business/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isModerator, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isModerator) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!adminOnly && isModerator) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isModerator } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={isModerator ? '/admin' : '/dashboard'} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/salons/:id" element={<SalonProfilePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/stylists" element={<StylistPage />} />
        <Route path="/booking" element={<BookingPage />} />

        <Route path="/business" element={<ProtectedRoute><MyBusinessesPage /></ProtectedRoute>} />
        <Route path="/business/new" element={<ProtectedRoute><BusinessOnboardingPage /></ProtectedRoute>} />

        <Route path="/business/:businessId" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<OverviewPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="services" element={<BizServicesPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="schedules" element={<SchedulesPage />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="waitlist" element={<WaitlistPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
