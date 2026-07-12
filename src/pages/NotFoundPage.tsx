import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, AlertTriangle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-6">
        <AlertTriangle className="h-12 w-12 text-text-secondary" />
      </div>
      <h1 className="mt-6 text-4xl font-bold text-text-primary">404</h1>
      <p className="mt-2 text-lg text-text-secondary">Page not found</p>
      <p className="mt-4 max-w-md text-sm text-text-secondary">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="mt-8">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
