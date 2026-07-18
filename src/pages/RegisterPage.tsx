import { RegisterForm } from '../components/auth/RegisterForm';
import { Card, CardContent } from '../components/ui/Card';
import { Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-accent/10 p-3">
            <Scissors className="h-8 w-8 text-accent" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text-primary">Create Account</h1>
          <p className="mt-1 text-sm text-text-secondary">Join us and book your first appointment</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <RegisterForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
