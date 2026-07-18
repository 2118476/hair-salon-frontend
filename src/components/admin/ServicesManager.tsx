import { Service } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Modal } from '../ui/Modal';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceFormSchema } from '../../utils/validators';
import { Search, Plus, Pencil, Trash2, Scissors } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface ServicesManagerProps {
  services: Service[] | undefined;
  isLoading: boolean;
  onCreate: (data: Omit<Service, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Service>) => void;
  onDelete: (id: string) => void;
}

type ServiceFormData = {
  name: string;
  description: string;
  pricePence: number;
  durationMinutes: number;
  category: string;
  active: boolean;
};

export function ServicesManager({ services, isLoading, onCreate, onUpdate, onDelete }: ServicesManagerProps) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
  });

  const openCreate = () => {
    setEditingService(null);
    reset({ name: '', description: '', pricePence: 0, durationMinutes: 30, category: '', active: true });
    setModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    reset({
      name: service.name,
      description: service.description,
      pricePence: service.pricePence,
      durationMinutes: service.durationMinutes,
      category: service.category,
      active: service.active,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: ServiceFormData) => {
    if (editingService) {
      onUpdate(editingService.id, data);
    } else {
      onCreate(data);
    }
    setModalOpen(false);
  };

  const filtered = (services || []).filter((s) =>
    `${s.name} ${s.description} ${s.category}`.toLowerCase().includes(search.toLowerCase())
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
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" /> Add Service
        </Button>
      </div>

      {(!services || services.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
          <Scissors className="mb-2 h-8 w-8" />
          <p>No services found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-text-secondary">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((service) => (
                <tr key={service.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{service.name}</td>
                  <td className="px-4 py-3">{service.category}</td>
                  <td className="px-4 py-3">{formatCurrency(service.pricePence)}</td>
                  <td className="px-4 py-3">{service.durationMinutes} min</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${service.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(service)} className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(service.id)} className="rounded-md p-1.5 text-red-600 hover:bg-red-50">
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
        title={editingService ? 'Edit Service' : 'Add Service'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)}>{editingService ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input {...register('name')} label="Name" error={errors.name?.message} />
          <Textarea {...register('description')} label="Description" error={errors.description?.message} />
          <div className="grid grid-cols-2 gap-3">
            <Input {...register('pricePence', { valueAsNumber: true })} type="number" label="Price (pence)" error={errors.pricePence?.message} />
            <Input {...register('durationMinutes', { valueAsNumber: true })} type="number" label="Duration (min)" error={errors.durationMinutes?.message} />
          </div>
          <Input {...register('category')} label="Category" error={errors.category?.message} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('active')} />
            Active
          </label>
        </form>
      </Modal>
    </div>
  );
}
