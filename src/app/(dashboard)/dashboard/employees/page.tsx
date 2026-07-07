'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Users, Plus, Pencil, Trash2, UserX } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getEmployeesAction,
  createEmployeeAction,
  updateEmployeeAction,
  deleteEmployeeAction,
  deactivateEmployeeAction,
} from '@/app/actions/employees';

type Employee = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  status: 'INVITED' | 'ACTIVE' | 'INACTIVE';
  employmentType: string;
  department?: { name: string };
  role?: { name: string };
};

const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT'];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  jobTitle: '',
  employmentType: 'FULL_TIME',
};

const statusBadge: Record<string, string> = {
  INVITED: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  ACTIVE: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  INACTIVE: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getEmployeesAction();
      if (res.success) setEmployees((res.data as any) ?? []);
      else toast.error(res.error ?? 'Failed to load employees');
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setDialogOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditing(emp);
    setForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone ?? '',
      jobTitle: emp.jobTitle ?? '',
      employmentType: emp.employmentType,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error('Name and email are required'); return; }
    setSaving(true);
    try {
      const res = editing
        ? await updateEmployeeAction(editing.id, form)
        : await createEmployeeAction(form);
      if (res.success) {
        toast.success(editing ? 'Employee updated' : 'Employee created');
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

  const handleDeactivate = async (id: string) => {
    if (!confirm('Deactivate this employee?')) return;
    setActionId(id);
    try {
      const res = await deactivateEmployeeAction(id);
      if (res.success) { toast.success('Employee deactivated'); load(); }
      else toast.error(res.error ?? 'Deactivate failed');
    } catch {
      toast.error('Deactivate failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this employee? This cannot be undone.')) return;
    setActionId(id);
    try {
      const res = await deleteEmployeeAction(id);
      if (res.success) { toast.success('Employee deleted'); load(); }
      else toast.error(res.error ?? 'Delete failed');
    } catch {
      toast.error('Delete failed');
    } finally {
      setActionId(null);
    }
  };

  const inputCls = 'bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] rounded-lg px-3 py-2 w-full outline-none transition-colors';
  const labelCls = 'text-white/60 text-xs mb-1 block';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-white/40 text-sm mt-1">Manage your workforce</p>
        </div>
        <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors flex items-center gap-2">
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/[0.04] rounded-xl h-12" />
            ))}
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Users size={48} className="text-white/20" />
            <p className="text-white/40 text-sm">No employees yet</p>
            <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors text-sm">
              Add first employee
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Email', 'Job Title', 'Dept', 'Status', 'Type', 'Actions'].map(h => (
                  <th key={h} className="text-left text-white/40 text-xs font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{emp.name}</td>
                  <td className="px-4 py-3 text-white/70">{emp.email}</td>
                  <td className="px-4 py-3 text-white/70">{emp.jobTitle ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70">{emp.department?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[emp.status] ?? 'text-white/40'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/70 text-xs">{emp.employmentType.replace('_', ' ')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(emp)} className="bg-white/[0.05] text-white/70 px-3 py-1.5 rounded-lg text-xs hover:bg-white/[0.08] flex items-center gap-1">
                        <Pencil size={11} /> Edit
                      </button>
                      {emp.status === 'ACTIVE' && (
                        <button onClick={() => handleDeactivate(emp.id)} disabled={actionId === emp.id} className="bg-white/[0.05] text-amber-400 px-3 py-1.5 rounded-lg text-xs hover:bg-white/[0.08] flex items-center gap-1">
                          <UserX size={11} /> Deactivate
                        </button>
                      )}
                      <button onClick={() => handleDelete(emp.id)} disabled={actionId === emp.id} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/20 flex items-center gap-1">
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0B0F1A] border border-white/[0.08] text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className={labelCls}>Name *</label>
              <input className={inputCls} placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input type="email" className={inputCls} placeholder="email@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Job Title</label>
              <input className={inputCls} placeholder="e.g. Senior Developer" value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Employment Type</label>
              <select className={inputCls} value={form.employmentType} onChange={e => setForm(f => ({ ...f, employmentType: e.target.value }))}>
                {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <button onClick={() => setDialogOpen(false)} className="bg-white/[0.05] text-white/70 px-4 py-2 rounded-lg text-sm hover:bg-white/[0.08]">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors text-sm">
              {saving ? 'Saving…' : editing ? 'Update' : 'Invite'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
