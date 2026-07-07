'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Truck, Plus, Pencil, Trash2, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getSuppliersAction,
  createSupplierAction,
  updateSupplierAction,
  deleteSupplierAction,
} from '@/app/actions/suppliers';

type Supplier = {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  paymentTerms?: string;
  gstNumber?: string;
  isPreferred: boolean;
};

const PAYMENT_TERMS = ['NET_30', 'NET_60', 'NET_90', 'IMMEDIATE', 'COD'];

const emptyForm = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  paymentTerms: 'NET_30',
  gstNumber: '',
  isPreferred: false,
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getSuppliersAction();
      if (res.success) setSuppliers((res.data as any) ?? []);
      else toast.error(res.error ?? 'Failed to load suppliers');
    } catch {
      toast.error('Failed to load suppliers');
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

  const openEdit = (s: Supplier) => {
    setEditing(s);
    setForm({
      name: s.name,
      contactPerson: s.contactPerson ?? '',
      email: s.email ?? '',
      phone: s.phone ?? '',
      address: s.address ?? '',
      city: s.city ?? '',
      country: s.country ?? '',
      paymentTerms: s.paymentTerms ?? 'NET_30',
      gstNumber: s.gstNumber ?? '',
      isPreferred: s.isPreferred,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Supplier name is required'); return; }
    setSaving(true);
    try {
      const res = editing
        ? await updateSupplierAction(editing.id, form)
        : await createSupplierAction(form);
      if (res.success) {
        toast.success(editing ? 'Supplier updated' : 'Supplier created');
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
    if (!confirm('Delete this supplier? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await deleteSupplierAction(id);
      if (res.success) { toast.success('Supplier deleted'); load(); }
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
          <h1 className="text-2xl font-bold text-white">Suppliers</h1>
          <p className="text-white/40 text-sm mt-1">Manage your supply chain partners</p>
        </div>
        <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors flex items-center gap-2">
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/[0.04] rounded-xl h-12" />
            ))}
          </div>
        ) : suppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Truck size={48} className="text-white/20" />
            <p className="text-white/40 text-sm">No suppliers yet</p>
            <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors text-sm">
              Add first supplier
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Contact', 'Email', 'Phone', 'City', 'Terms', 'Preferred', 'Actions'].map(h => (
                  <th key={h} className="text-left text-white/40 text-xs font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-white/70">{s.contactPerson ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70">{s.email ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70">{s.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70">{s.city ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60">{s.paymentTerms ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    {s.isPreferred && <Star size={14} className="text-[#00D9C0]" fill="#00D9C0" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(s)} className="bg-white/[0.05] text-white/70 px-3 py-1.5 rounded-lg text-xs hover:bg-white/[0.08] flex items-center gap-1">
                        <Pencil size={11} /> Edit
                      </button>
                      <button onClick={() => handleDelete(s.id)} disabled={deletingId === s.id} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/20 flex items-center gap-1">
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
            <DialogTitle>{editing ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
            <div>
              <label className={labelCls}>Supplier Name *</label>
              <input className={inputCls} placeholder="Company name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Contact Person</label>
              <input className={inputCls} placeholder="Primary contact" value={form.contactPerson} onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" className={inputCls} placeholder="email@supplier.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
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
            <div>
              <label className={labelCls}>Payment Terms</label>
              <select className={inputCls} value={form.paymentTerms} onChange={e => setForm(f => ({ ...f, paymentTerms: e.target.value }))}>
                {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>GST / Tax Number</label>
              <input className={inputCls} placeholder="GST number" value={form.gstNumber} onChange={e => setForm(f => ({ ...f, gstNumber: e.target.value }))} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isPreferred} onChange={e => setForm(f => ({ ...f, isPreferred: e.target.checked }))} className="accent-[#00D9C0] w-4 h-4" />
              <span className="text-white/70 text-sm">Mark as preferred supplier</span>
            </label>
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
