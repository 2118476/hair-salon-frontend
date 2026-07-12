import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validators';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm() {
  const { register: authRegister } = useAuth();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setIsLoading(true);
    try {
      await authRegister(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-error">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input {...register('firstName')} placeholder="First name" className="pl-10" error={errors.firstName?.message} />
        </div>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input {...register('lastName')} placeholder="Last name" className="pl-10" error={errors.lastName?.message} />
        </div>
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input {...register('email')} type="email" placeholder="Email address" className="pl-10" error={errors.email?.message} />
      </div>

      <div className="relative">
        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input {...register('phone')} type="tel" placeholder="Phone number" className="pl-10" error={errors.phone?.message} />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password (min 8 characters)"
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
          placeholder="Confirm password"
          className="pl-10 pr-10"
          error={errors.confirmPassword?.message}
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
