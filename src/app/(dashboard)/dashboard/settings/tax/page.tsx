'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Receipt, Plus, Pencil, Trash2, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getTaxesAction,
  createTaxAction,
  updateTaxAction,
  deleteTaxAction,
} from '@/app/actions/tax';

type Tax = {
  id: string;
  taxType: string;
  name: string;
  rate: number;
  hsnCode?: string;
  region?: string;
  invoiceFormat?: string;
  isDefault: boolean;
};

const TAX_TYPES = ['GST', 'VAT', 'SALES_TAX', 'SERVICE_TAX', 'EXCISE', 'CUSTOM'];

const taxTypeBadge: Record<string, string> = {
  GST: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  VAT: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  SALES_TAX: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  SERVICE_TAX: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  EXCISE: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  CUSTOM: 'bg-white/[0.06] text-white/50',
};

const emptyForm = {
  taxType: 'GST',
  name: '',
  rate: '',
  hsnCode: '',
  region: '',
  invoiceFormat: '',
  isDefault: false,
};

export default function TaxSettingsPage() {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tax | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getTaxesAction();
      if (res.success) setTaxes((res.data as any) ?? []);
      else toast.error(res.error ?? 'Failed to load taxes');
    } catch {
      toast.error('Failed to load taxes');
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

  const openEdit = (tax: Tax) => {
    setEditing(tax);
    setForm({
      taxType: tax.taxType,
      name: tax.name,
      rate: tax.rate.toString(),
      hsnCode: tax.hsnCode ?? '',
      region: tax.region ?? '',
      invoiceFormat: tax.invoiceFormat ?? '',
      isDefault: tax.isDefault,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Tax name is required'); return; }
    const rate = parseFloat(form.rate);
    if (isNaN(rate) || rate < 0 || rate > 100) { toast.error('Rate must be between 0 and 100'); return; }
    setSaving(true);
    try {
      const payload = { ...form, rate };
      const res = editing
        ? await updateTaxAction(editing.id, payload)
        : await createTaxAction(payload);
      if (res.success) {
        toast.success(editing ? 'Tax updated' : 'Tax created');
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
    if (!confirm('Delete this tax? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await deleteTaxAction(id);
      if (res.success) { toast.success('Tax deleted'); load(); }
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
          <h1 className="text-2xl font-bold text-white">Tax Configuration</h1>
          <p className="text-white/40 text-sm mt-1">Configure GST, VAT, and other tax rates</p>
        </div>
        <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors flex items-center gap-2">
          <Plus size={16} /> Add Tax
        </button>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/[0.04] rounded-xl h-12" />
            ))}
          </div>
        ) : taxes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Receipt size={48} className="text-white/20" />
            <p className="text-white/40 text-sm">No taxes configured yet</p>
            <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors text-sm">
              Add first tax
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Type', 'Name', 'Rate %', 'HSN', 'Region', 'Default', 'Actions'].map(h => (
                  <th key={h} className="text-left text-white/40 text-xs font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {taxes.map(tax => (
                <tr key={tax.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${taxTypeBadge[tax.taxType] ?? 'bg-white/[0.06] text-white/40'}`}>
                      {tax.taxType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{tax.name}</td>
                  <td className="px-4 py-3 text-white/70">{tax.rate}%</td>
                  <td className="px-4 py-3 text-white/70 font-mono text-xs">{tax.hsnCode ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70">{tax.region ?? '—'}</td>
                  <td className="px-4 py-3">
                    {tax.isDefault && <Star size={14} className="text-[#00D9C0]" fill="#00D9C0" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(tax)} className="bg-white/[0.05] text-white/70 px-3 py-1.5 rounded-lg text-xs hover:bg-white/[0.08] flex items-center gap-1">
                        <Pencil size={11} /> Edit
                      </button>
                      <button onClick={() => handleDelete(tax.id)} disabled={deletingId === tax.id} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/20 flex items-center gap-1">
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
            <DialogTitle>{editing ? 'Edit Tax' : 'Add Tax'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className={labelCls}>Tax Type</label>
              <select className={inputCls} value={form.taxType} onChange={e => setForm(f => ({ ...f, taxType: e.target.value }))}>
                {TAX_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Name *</label>
              <input className={inputCls} placeholder="e.g. GST 18%" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Rate (0–100)</label>
                <input type="number" min={0} max={100} step={0.01} className={inputCls} placeholder="18" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>HSN Code</label>
                <input className={inputCls} placeholder="HSN code" value={form.hsnCode} onChange={e => setForm(f => ({ ...f, hsnCode: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Region</label>
              <input className={inputCls} placeholder="e.g. India, EU" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Invoice Format</label>
              <input className={inputCls} placeholder="e.g. CGST+SGST" value={form.invoiceFormat} onChange={e => setForm(f => ({ ...f, invoiceFormat: e.target.value }))} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="accent-[#00D9C0] w-4 h-4" />
              <span className="text-white/70 text-sm">Set as default tax</span>
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
