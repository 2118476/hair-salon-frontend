import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../../utils/validators';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { authApi } from '../../api/auth';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

type ResetPasswordFormData = { password: string; confirmPassword: string };

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    setError('');
    setIsLoading(true);
    try {
      await authApi.resetPassword(token, data.password);
      setSubmitted(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-sm text-success">
        Password reset successfully. Redirecting to login...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-error">{error}</div>}

      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder="New password"
          className="pl-10 pr-10"
          error={errors.password?.message}
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          {...register('confirmPassword')}
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm new password"
          className="pl-10 pr-10"
          error={errors.confirmPassword?.message}
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading} disabled={!token}>
        Reset Password
      </Button>

      <p className="text-center text-sm text-text-secondary">
        <Link to="/login" className="text-accent hover:underline">
          Back to Sign In
        </Link>
      </p>
    </form>
  );
}
