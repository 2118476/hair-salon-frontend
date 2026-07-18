import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema } from '../../utils/validators';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User } from '../../types';
import { User as UserIcon } from 'lucide-react';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  phone: string;
};

interface ProfileFormProps {
  user: User;
  onSubmit: (data: ProfileFormData) => void;
  isLoading: boolean;
}

export function ProfileForm({ user, onSubmit, isLoading }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <UserIcon className="h-8 w-8 text-accent" />
        </div>
        <div>
          <p className="text-lg font-semibold text-text-primary">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-text-secondary">{user.email}</p>
          <p className="text-xs font-medium text-accent uppercase">{user.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input {...register('firstName')} label="First Name" error={errors.firstName?.message} />
        <Input {...register('lastName')} label="Last Name" error={errors.lastName?.message} />
      </div>
      <Input {...register('phone')} label="Phone" error={errors.phone?.message} />

      <Button type="submit" isLoading={isLoading}>
        Update Profile
      </Button>
    </form>
  );
}
