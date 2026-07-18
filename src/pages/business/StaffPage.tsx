import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessAdminApi } from '../../api/businessAdmin';
import { useBusinessOutlet } from '../../hooks/useBusinessOutlet';
import { useToast } from '../../context/toast-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const ROLES = ['BUSINESS_OWNER', 'LOCATION_MANAGER', 'RECEPTIONIST', 'STYLIST', 'SELF_EMPLOYED_PROFESSIONAL'];

export function StaffPage() {
  const { businessId } = useBusinessOutlet();
  const qc = useQueryClient();
  const toast = useToast();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['ba-staff', businessId] });

  const members = useQuery({ queryKey: ['ba-staff', businessId, 'members'], queryFn: () => businessAdminApi.listMembers(businessId) });
  const invitations = useQuery({ queryKey: ['ba-staff', businessId, 'invites'], queryFn: () => businessAdminApi.listInvitations(businessId) });
  const stylists = useQuery({ queryKey: ['ba-staff', businessId, 'stylists'], queryFn: () => businessAdminApi.listStylists(businessId) });

  const [invite, setInvite] = useState({ email: '', role: 'STYLIST' });
  const [stylist, setStylist] = useState({ firstName: '', lastName: '', specialization: '' });

  const inviteMut = useMutation({
    mutationFn: () => businessAdminApi.invite(businessId, invite.email, invite.role),
    onSuccess: (inv) => { toast.show(`Invitation sent${inv.acceptUrl ? ' (dev link copied to console)' : ''}`, 'success'); if (inv.acceptUrl) console.info('Accept URL:', inv.acceptUrl); setInvite({ email: '', role: 'STYLIST' }); invalidate(); },
    onError: () => toast.show('Could not invite (owner/manager only)', 'error'),
  });
  const revokeMut = useMutation({ mutationFn: (id: string) => businessAdminApi.revokeInvitation(businessId, id), onSuccess: () => { toast.show('Invitation revoked', 'info'); invalidate(); } });
  const roleMut = useMutation({ mutationFn: ({ id, role }: { id: string; role: string }) => businessAdminApi.changeRole(businessId, id, role), onSuccess: () => { toast.show('Role updated', 'success'); invalidate(); }, onError: () => toast.show('Only the owner can change roles', 'error') });
  const deactivateMut = useMutation({ mutationFn: (id: string) => businessAdminApi.deactivateMember(businessId, id), onSuccess: () => { toast.show('Member deactivated', 'info'); invalidate(); }, onError: () => toast.show('Cannot deactivate the last owner', 'error') });
  const stylistMut = useMutation({
    mutationFn: () => businessAdminApi.createStylist(businessId, stylist),
    onSuccess: () => { toast.show('Professional added', 'success'); setStylist({ firstName: '', lastName: '', specialization: '' }); invalidate(); },
    onError: () => toast.show('Could not add professional', 'error'),
  });

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl font-semibold text-ink">Staff</h1>

      <section>
        <h2 className="mb-3 font-serif text-xl font-semibold text-ink">Team members</h2>
        <Card>
          <CardContent className="p-0">
            {members.data?.length === 0 && <p className="p-6 text-text-secondary">No members yet.</p>}
            <ul className="divide-y divide-gray-100">
              {members.data?.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <div>
                    <p className="font-medium text-ink">{m.firstName} {m.lastName}</p>
                    <p className="text-sm text-text-secondary">{m.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={m.role} onChange={(e) => roleMut.mutate({ id: m.id, role: e.target.value })}
                      aria-label={`Role for ${m.email}`} className="h-9 rounded-md border border-gray-300 px-2 text-sm">
                      {ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                    </select>
                    <Button variant="ghost" size="sm" onClick={() => deactivateMut.mutate(m.id)}>Deactivate</Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-serif text-xl font-semibold text-ink">Invitations</h2>
          <Card>
            <CardHeader>
              <CardTitle>Invite a colleague</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); inviteMut.mutate(); }} className="mb-4 flex flex-wrap items-end gap-2">
                <Input id="ie" label="Email" type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} required className="min-w-[12rem] flex-1" />
                <select value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })} aria-label="Invite role" className="h-10 rounded-md border border-gray-300 px-2 text-sm">
                  {ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                </select>
                <Button type="submit" isLoading={inviteMut.isPending}>Invite</Button>
              </form>
              <ul className="divide-y divide-gray-100">
                {invitations.data?.filter((i) => i.status === 'PENDING').map((i) => (
                  <li key={i.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-ink">{i.email} · {i.role.replace(/_/g, ' ')}</span>
                    <Button variant="ghost" size="sm" onClick={() => revokeMut.mutate(i.id)}>Revoke</Button>
                  </li>
                ))}
                {invitations.data?.filter((i) => i.status === 'PENDING').length === 0 && (
                  <li className="py-2 text-sm text-text-secondary">No pending invitations.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-xl font-semibold text-ink">Bookable professionals</h2>
          <Card>
            <CardHeader><CardTitle>Add a professional</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); stylistMut.mutate(); }} className="mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input id="pf" label="First name" value={stylist.firstName} onChange={(e) => setStylist({ ...stylist, firstName: e.target.value })} required />
                  <Input id="pl" label="Last name" value={stylist.lastName} onChange={(e) => setStylist({ ...stylist, lastName: e.target.value })} required />
                </div>
                <Input id="ps" label="Specialisation" value={stylist.specialization} onChange={(e) => setStylist({ ...stylist, specialization: e.target.value })} placeholder="Colour, braids, barbering…" />
                <Button type="submit" isLoading={stylistMut.isPending}>Add professional</Button>
              </form>
              <ul className="divide-y divide-gray-100">
                {stylists.data?.map((s) => (
                  <li key={s.id} className="py-2 text-sm text-ink">{s.firstName} {s.lastName}{s.specialization ? ` · ${s.specialization}` : ''}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
