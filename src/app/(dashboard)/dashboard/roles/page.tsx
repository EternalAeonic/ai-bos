'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Shield, Plus, Pencil, Trash2, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getRolesAction,
  createRoleAction,
  updateRoleAction,
  deleteRoleAction,
} from '@/app/actions/roles';

type Role = {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystemRole: boolean;
  _count?: { employees: number };
};

const ALL_PERMISSIONS = [
  'inventory.view','inventory.create','inventory.edit','inventory.delete',
  'finance.view','finance.create','finance.edit',
  'customers.view','customers.create','customers.edit','customers.delete',
  'suppliers.view','suppliers.create','suppliers.edit','suppliers.delete',
  'employees.view','employees.create','employees.edit',
  'reports.view','reports.export',
  'ai.view','ai.configure',
  'settings.view','settings.edit',
];

const groupedPerms = ALL_PERMISSIONS.reduce<Record<string, string[]>>((acc, p) => {
  const mod = p.split('.')[0];
  if (!acc[mod]) acc[mod] = [];
  acc[mod].push(p);
  return acc;
}, {});

const emptyForm = { name: '', description: '', permissions: [] as string[] };

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [form, setForm] = useState({ ...emptyForm, permissions: [] as string[] });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getRolesAction();
      if (res.success) setRoles((res.data as any) ?? []);
      else toast.error(res.error ?? 'Failed to load roles');
    } catch {
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', permissions: [] });
    setDialogOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditing(role);
    setForm({ name: role.name, description: role.description ?? '', permissions: [...role.permissions] });
    setDialogOpen(true);
  };

  const togglePerm = (perm: string) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter(p => p !== perm)
        : [...f.permissions, perm],
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Role name is required'); return; }
    setSaving(true);
    try {
      const res = editing
        ? await updateRoleAction(editing.id, form)
        : await createRoleAction(form);
      if (res.success) {
        toast.success(editing ? 'Role updated' : 'Role created');
        setDialogOpen(false);
        load();
      } else {
        toast.error(res.error ?? 'Operation failed');
      }
    } catch {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this role? Employees assigned to it will lose permissions.')) return;
    setDeletingId(id);
    try {
      const res = await deleteRoleAction(id);
      if (res.success) { toast.success('Role deleted'); load(); }
      else toast.error(res.error ?? 'Delete failed');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const inputCls = 'bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] rounded-lg px-3 py-2 w-full outline-none transition-colors';
  const labelCls = 'text-white/60 text-xs mb-1 block';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
          <p className="text-white/40 text-sm mt-1">Control what each role can access</p>
        </div>
        <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors flex items-center gap-2">
          <Plus size={16} /> Add Role
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white/[0.04] rounded-xl h-40" />
          ))}
        </div>
      ) : roles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Shield size={48} className="text-white/20" />
          <p className="text-white/40 text-sm">No roles defined yet</p>
          <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors text-sm">
            Add first role
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map(role => (
            <div key={role.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-[#00D9C0] shrink-0" />
                  <h3 className="text-white font-semibold text-base leading-tight">{role.name}</h3>
                </div>
                {role.isSystemRole && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 shrink-0">System</span>
                )}
              </div>

              {role.description && (
                <p className="text-white/50 text-xs leading-relaxed">{role.description}</p>
              )}

              <div className="flex items-center gap-1.5 text-white/40 text-xs">
                <Users size={12} />
                <span>{role._count?.employees ?? 0} employees</span>
              </div>

              {role.permissions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.slice(0, 6).map(p => (
                    <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D9C0]/10 text-[#00D9C0]">{p}</span>
                  ))}
                  {role.permissions.length > 6 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40">+{role.permissions.length - 6} more</span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1 mt-auto">
                <button onClick={() => openEdit(role)} className="bg-white/[0.05] text-white/70 px-3 py-1.5 rounded-lg text-xs hover:bg-white/[0.08] flex items-center gap-1">
                  <Pencil size={11} /> Edit
                </button>
                {!role.isSystemRole && (
                  <button onClick={() => handleDelete(role.id)} disabled={deletingId === role.id} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/20 flex items-center gap-1">
                    <Trash2 size={11} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0B0F1A] border border-white/[0.08] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Role' : 'Create Role'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2 max-h-[65vh] overflow-y-auto pr-1">
            <div>
              <label className={labelCls}>Role Name *</label>
              <input className={inputCls} placeholder="e.g. Store Manager" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea className={`${inputCls} resize-none`} rows={2} placeholder="What does this role do?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-4">
              <label className={labelCls}>Permissions</label>
              {Object.entries(groupedPerms).map(([mod, perms]) => (
                <div key={mod} className="space-y-2">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">{mod}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {perms.map(perm => (
                      <label key={perm} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.permissions.includes(perm)}
                          onChange={() => togglePerm(perm)}
                          className="accent-[#00D9C0] w-3.5 h-3.5"
                        />
                        <span className="text-white/60 text-xs group-hover:text-white/80 transition-colors">
                          {perm.split('.')[1]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="pt-2">
            <button onClick={() => setDialogOpen(false)} className="bg-white/[0.05] text-white/70 px-4 py-2 rounded-lg text-sm hover:bg-white/[0.08]">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors text-sm">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
