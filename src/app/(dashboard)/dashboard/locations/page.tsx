'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getLocationsAction,
  createLocationAction,
  updateLocationAction,
  deleteLocationAction,
} from '@/app/actions/locations';

type Location = {
  id: string;
  name: string;
  type: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  isDefault: boolean;
};

const LOCATION_TYPES = ['WAREHOUSE', 'STORE', 'OFFICE', 'FACTORY'];

const emptyForm = {
  name: '',
  type: 'WAREHOUSE',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  phone: '',
  isDefault: false,
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getLocationsAction();
      if (res.success) setLocations((res.data as any) ?? []);
      else toast.error(res.error ?? 'Failed to load locations');
    } catch {
      toast.error('Failed to load locations');
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

  const openEdit = (loc: Location) => {
    setEditing(loc);
    setForm({
      name: loc.name,
      type: loc.type,
      address: loc.address ?? '',
      city: loc.city ?? '',
      state: loc.state ?? '',
      country: loc.country ?? '',
      postalCode: loc.postalCode ?? '',
      phone: loc.phone ?? '',
      isDefault: loc.isDefault,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const res = editing
        ? await updateLocationAction(editing.id, form)
        : await createLocationAction(form);
      if (res.success) {
        toast.success(editing ? 'Location updated' : 'Location created');
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
    if (!confirm('Delete this location? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await deleteLocationAction(id);
      if (res.success) {
        toast.success('Location deleted');
        load();
      } else {
        toast.error(res.error ?? 'Delete failed');
      }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Locations</h1>
          <p className="text-white/40 text-sm mt-1">Manage warehouses, stores, offices and factories</p>
        </div>
        <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors flex items-center gap-2">
          <Plus size={16} /> Add Location
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/[0.04] rounded-xl h-12" />
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <MapPin size={48} className="text-white/20" />
            <p className="text-white/40 text-sm">No locations yet</p>
            <button onClick={openCreate} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors text-sm">
              Add first location
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Type', 'City', 'Country', 'Phone', 'Default', 'Actions'].map(h => (
                  <th key={h} className="text-left text-white/40 text-xs font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locations.map(loc => (
                <tr key={loc.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{loc.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60">{loc.type}</span>
                  </td>
                  <td className="px-4 py-3 text-white/70">{loc.city ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70">{loc.country ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70">{loc.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    {loc.isDefault && <Star size={14} className="text-[#00D9C0]" fill="#00D9C0" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(loc)} className="bg-white/[0.05] text-white/70 px-3 py-1.5 rounded-lg text-xs hover:bg-white/[0.08] flex items-center gap-1">
                        <Pencil size={11} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(loc.id)}
                        disabled={deletingId === loc.id}
                        className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/20 flex items-center gap-1"
                      >
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

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0B0F1A] border border-white/[0.08] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Location' : 'Add Location'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
            <div>
              <label className={labelCls}>Name *</label>
              <input className={inputCls} placeholder="Location name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {LOCATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
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
                <label className={labelCls}>State</label>
                <input className={inputCls} placeholder="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Country</label>
                <input className={inputCls} placeholder="Country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Postal Code</label>
                <input className={inputCls} placeholder="Postal code" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="accent-[#00D9C0] w-4 h-4" />
              <span className="text-white/70 text-sm">Set as default location</span>
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
