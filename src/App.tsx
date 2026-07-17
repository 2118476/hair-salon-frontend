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
