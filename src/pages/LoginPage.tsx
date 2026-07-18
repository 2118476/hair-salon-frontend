import { LoginForm } from '../components/auth/LoginForm';
import { Card, CardContent } from '../components/ui/Card';
import { Scissors } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toast } from '../components/ui/Toast';

export function LoginPage() {
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(location.state?.message || null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-accent/10 p-3">
            <Scissors className="h-8 w-8 text-accent" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text-primary">Welcome Back</h1>
          <p className="mt-1 text-sm text-text-secondary">Sign in to manage your appointments</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <LoginForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {message && <Toast message={message} type="success" onClose={() => setMessage(null)} />}
    </div>
  );
}
