import { Stylist } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Modal } from '../ui/Modal';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stylistFormSchema } from '../../utils/validators';
import { Search, Plus, Pencil, Trash2, UserCheck } from 'lucide-react';

interface StylistsManagerProps {
  stylists: Stylist[] | undefined;
  isLoading: boolean;
  onCreate: (data: Omit<Stylist, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Stylist>) => void;
  onDelete: (id: string) => void;
}

type StylistFormData = {
  firstName: string;
  lastName: string;
  bio: string;
  specialization: string;
  active: boolean;
};

export function StylistsManager({ stylists, isLoading, onCreate, onUpdate, onDelete }: StylistsManagerProps) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStylist, setEditingStylist] = useState<Stylist | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StylistFormData>({
    resolver: zodResolver(stylistFormSchema),
  });

  const openCreate = () => {
    setEditingStylist(null);
    reset({ firstName: '', lastName: '', bio: '', specialization: '', active: true });
    setModalOpen(true);
  };

  const openEdit = (stylist: Stylist) => {
    setEditingStylist(stylist);
    reset({
      firstName: stylist.firstName,
      lastName: stylist.lastName,
      bio: stylist.bio,
      specialization: stylist.specialization,
      active: stylist.active,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: StylistFormData) => {
    if (editingStylist) {
      onUpdate(editingStylist.id, data);
    } else {
      onCreate(data);
    }
    setModalOpen(false);
  };

  const filtered = (stylists || []).filter((s) =>
    `${s.firstName} ${s.lastName} ${s.specialization}`.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-md bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search stylists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" /> Add Stylist
        </Button>
      </div>

      {(!stylists || stylists.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
          <UserCheck className="mb-2 h-8 w-8" />
          <p>No stylists found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-text-secondary">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Specialization</th>
                <th className="px-4 py-3 font-medium">Bio</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((stylist) => (
                <tr key={stylist.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">
                    {stylist.firstName} {stylist.lastName}
                  </td>
                  <td className="px-4 py-3">{stylist.specialization}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{stylist.bio}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${stylist.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {stylist.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(stylist)} className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(stylist.id)} className="rounded-md p-1.5 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStylist ? 'Edit Stylist' : 'Add Stylist'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)}>{editingStylist ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input {...register('firstName')} label="First Name" error={errors.firstName?.message} />
            <Input {...register('lastName')} label="Last Name" error={errors.lastName?.message} />
          </div>
          <Input {...register('specialization')} label="Specialization" error={errors.specialization?.message} />
          <Textarea {...register('bio')} label="Bio" error={errors.bio?.message} rows={4} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('active')} />
            Active
          </label>
        </form>
      </Modal>
    </div>
  );
}
