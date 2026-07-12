import { User } from '../../types';
import { Badge } from '../ui/Badge';
import { Select } from '../ui/Select';
import { useState } from 'react';
import { Search, Users } from 'lucide-react';

interface UsersTableProps {
  users: User[] | undefined;
  isLoading: boolean;
  onUpdateRole: (userId: string, role: string) => void;
}

export function UsersTable({ users, isLoading, onUpdateRole }: UsersTableProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-md bg-gray-200" />
        ))}
      </div>
    );
  }

  const filtered = (users || []).filter((u) => {
    const matchSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
        <Users className="mb-2 h-8 w-8" />
        <p>No users found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Roles' },
            { value: 'USER', label: 'User' },
            { value: 'MODERATOR', label: 'Moderator' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
          className="w-40"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-text-secondary">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-text-primary">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone || '—'}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      user.role === 'ADMIN' ? 'error' : user.role === 'MODERATOR' ? 'warning' : 'info'
                    }
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={user.role}
                    onChange={(e) => onUpdateRole(user.id, e.target.value)}
                    options={[
                      { value: 'USER', label: 'User' },
                      { value: 'MODERATOR', label: 'Moderator' },
                      { value: 'ADMIN', label: 'Admin' },
                    ]}
                    className="w-32"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
