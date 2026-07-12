import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../../utils/validators';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { authApi } from '../../api/auth';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Mail } from 'lucide-react';

type ForgotPasswordFormData = { email: string };

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError('');
    setIsLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-sm text-success">
        If an account with this email exists, a password reset link has been sent. Please check your inbox.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-error">{error}</div>}

      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          {...register('email')}
          type="email"
          placeholder="Email address"
          className="pl-10"
          error={errors.email?.message}
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Send Reset Link
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Remember your password?{' '}
        <Link to="/login" className="text-accent hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
