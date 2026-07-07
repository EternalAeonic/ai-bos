'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UserCheck, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getCustomersAction,
  createCustomerAction,
  updateCustomerAction,
  deleteCustomerAction,
} from '@/app/actions/customers';

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  category?: string;
  paymentTerms?: string;
  creditLimit?: number;
  gstNumber?: string;
};

const CATEGORIES = ['RETAIL', 'WHOLESALE', 'VIP'];
const PAYMENT_TERMS = ['NET_30', 'NET_60', 'NET_90', 'IMMEDIATE', 'COD'];

const categoryBadge: Record<string, string> = {
  RETAIL: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  WHOLESALE: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  VIP: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  category: 'RETAIL',
  paymentTerms: 'NET_30',
  creditLimit: '',
  gstNumber: '',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCustomersAction();
      if (res.success) setCustomers((res.data as any) ?? []);
      else toast.error(res.error ?? 'Failed to load customers');
    } catch {
      toast.error('Failed to load customers');
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

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({
      name: c.name,
      email: c.email ?? '',
      phone: c.phone ?? '',
      address: c.address ?? '',
      city: c.city ?? '',
      country: c.country ?? '',
      category: c.category ?? 'RETAIL',
      paymentTerms: c.paymentTerms ?? 'NET_30',
      creditLimit: c.creditLimit?.toString() ?? '',
      gstNumber: c.gstNumber ?? '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Customer name is required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        creditLimit: form.creditLimit ? parseFloat(form.creditLimit) : undefined,
      };
      const res = editing
        ? await updateCustomerAction(editing.id, payload)
        : await createCustomerAction(payload);
      if (res.success) {
        toast.success(editing ? 'Customer updated' : 'Customer created');
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
    if (!confirm('Delete this customer? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await deleteCustomerAction(id);
      if (res.success) { toast.success('Customer deleted'); load(); }
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
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-white/40 text-sm mt-1">Manage your customer relationships</p>
        </div>
        <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors flex items-center gap-2">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/[0.04] rounded-xl h-12" />
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <UserCheck size={48} className="text-white/20" />
            <p className="text-white/40 text-sm">No customers yet</p>
            <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors text-sm">
              Add first customer
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Email', 'Phone', 'City', 'Category', 'Credit Limit', 'Actions'].map(h => (
                  <th key={h} className="text-left text-white/40 text-xs font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-white/70">{c.email ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70">{c.city ?? '—'}</td>
                  <td className="px-4 py-3">
                    {c.category ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${categoryBadge[c.category] ?? 'bg-white/[0.06] text-white/40'}`}>
                        {c.category}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-white/70">
                    {c.creditLimit != null ? `$${c.creditLimit.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="bg-white/[0.05] text-white/70 px-3 py-1.5 rounded-lg text-xs hover:bg-white/[0.08] flex items-center gap-1">
                        <Pencil size={11} /> Edit
                      </button>
                      <button onClick={() => handleDelete(c.id)} disabled={deletingId === c.id} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/20 flex items-center gap-1">
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
        <DialogContent className="bg-[#0B0F1A] border border-white/[0.08] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
            <div>
              <label className={labelCls}>Name *</label>
              <input className={inputCls} placeholder="Customer / company name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" className={inputCls} placeholder="email@customer.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input className={inputCls} placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Address</label>
              <input className={inputCls} placeholder="Street address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>City</label>
                <input className={inputCls} placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <input className={inputCls} placeholder="Country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Payment Terms</label>
                <select className={inputCls} value={form.paymentTerms} onChange={e => setForm(f => ({ ...f, paymentTerms: e.target.value }))}>
                  {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Credit Limit ($)</label>
              <input type="number" min={0} className={inputCls} placeholder="0.00" value={form.creditLimit} onChange={e => setForm(f => ({ ...f, creditLimit: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>GST / Tax Number</label>
              <input className={inputCls} placeholder="GST number" value={form.gstNumber} onChange={e => setForm(f => ({ ...f, gstNumber: e.target.value }))} />
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
