import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { Card, CardContent } from '../components/ui/Card';
import { KeyRound } from 'lucide-react';

export function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-accent/10 p-3">
            <KeyRound className="h-8 w-8 text-accent" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text-primary">Forgot Password?</h1>
          <p className="mt-1 text-sm text-text-secondary">Enter your email and we'll send you a reset link</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
