'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Landmark, Plus, Pencil, Trash2, Star, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getFinanceSettingsAction,
  updateFinanceSettingsAction,
  getBankAccountsAction,
  createBankAccountAction,
  updateBankAccountAction,
  deleteBankAccountAction,
} from '@/app/actions/finance-config';

type FinanceSettings = {
  fiscalYearStart?: string;
  accountingMethod?: string;
  invoicePrefix?: string;
  defaultCurrency?: string;
  openingCash?: number;
  openingBank?: number;
  openingReceivables?: number;
  openingPayables?: number;
};

type BankAccount = {
  id: string;
  name: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  currency?: string;
  openingBalance?: number;
  isDefault: boolean;
};

const ACCOUNTING_METHODS = ['ACCRUAL', 'CASH'];

const emptyBankForm = {
  name: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  currency: 'USD',
  openingBalance: '',
  isDefault: false,
};

export default function FinanceSettingsPage() {
  const [settings, setSettings] = useState<FinanceSettings>({});
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [bankLoading, setBankLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [bankForm, setBankForm] = useState({ ...emptyBankForm });
  const [savingBank, setSavingBank] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await getFinanceSettingsAction();
      if (res.success) setSettings((res.data as any) ?? {});
      else toast.error(res.error ?? 'Failed to load finance settings');
    } catch {
      toast.error('Failed to load finance settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const loadBankAccounts = async () => {
    setBankLoading(true);
    try {
      const res = await getBankAccountsAction();
      if (res.success) setBankAccounts((res.data as any) ?? []);
      else toast.error(res.error ?? 'Failed to load bank accounts');
    } catch {
      toast.error('Failed to load bank accounts');
    } finally {
      setBankLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
    loadBankAccounts();
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await updateFinanceSettingsAction(settings);
      if (res.success) toast.success('Finance settings saved');
      else toast.error(res.error ?? 'Save failed');
    } catch {
      toast.error('Save failed');
    } finally {
      setSavingSettings(false);
    }
  };

  const openCreateBank = () => {
    setEditingBank(null);
    setBankForm({ ...emptyBankForm });
    setDialogOpen(true);
  };

  const openEditBank = (acc: BankAccount) => {
    setEditingBank(acc);
    setBankForm({
      name: acc.name,
      bankName: acc.bankName ?? '',
      accountNumber: acc.accountNumber ?? '',
      ifscCode: acc.ifscCode ?? '',
      currency: acc.currency ?? 'USD',
      openingBalance: acc.openingBalance?.toString() ?? '',
      isDefault: acc.isDefault,
    });
    setDialogOpen(true);
  };

  const handleSaveBank = async () => {
    if (!bankForm.name.trim()) { toast.error('Account name is required'); return; }
    setSavingBank(true);
    try {
      const payload = { ...bankForm, openingBalance: bankForm.openingBalance ? parseFloat(bankForm.openingBalance) : undefined };
      const res = editingBank
        ? await updateBankAccountAction(editingBank.id, payload)
        : await createBankAccountAction(payload);
      if (res.success) {
        toast.success(editingBank ? 'Bank account updated' : 'Bank account added');
        setDialogOpen(false);
        loadBankAccounts();
      } else {
        toast.error(res.error ?? 'Operation failed');
      }
    } catch {
      toast.error('Operation failed');
    } finally {
      setSavingBank(false);
    }
  };

  const handleDeleteBank = async (id: string) => {
    if (!confirm('Delete this bank account?')) return;
    setDeletingId(id);
    try {
      const res = await deleteBankAccountAction(id);
      if (res.success) { toast.success('Bank account deleted'); loadBankAccounts(); }
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
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Finance Settings</h1>
        <p className="text-white/40 text-sm mt-1">Configure accounting, currencies, and bank accounts</p>
      </div>

      {/* Finance Settings Section */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
        <h2 className="text-white font-semibold text-base">General Finance Settings</h2>
        {settingsLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-white/[0.04] rounded-xl h-10" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Fiscal Year Start</label>
                <input type="date" className={inputCls} value={settings.fiscalYearStart ?? ''} onChange={e => setSettings(s => ({ ...s, fiscalYearStart: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Accounting Method</label>
                <select className={inputCls} value={settings.accountingMethod ?? 'ACCRUAL'} onChange={e => setSettings(s => ({ ...s, accountingMethod: e.target.value }))}>
                  {ACCOUNTING_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Invoice Prefix</label>
                <input className={inputCls} placeholder="e.g. INV-" value={settings.invoicePrefix ?? ''} onChange={e => setSettings(s => ({ ...s, invoicePrefix: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Default Currency</label>
                <input className={inputCls} placeholder="USD" value={settings.defaultCurrency ?? ''} onChange={e => setSettings(s => ({ ...s, defaultCurrency: e.target.value }))} />
              </div>
            </div>
            <div className="border-t border-white/[0.06] pt-4">
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Opening Balances</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'openingCash', label: 'Cash' },
                  { key: 'openingBank', label: 'Bank' },
                  { key: 'openingReceivables', label: 'Receivables' },
                  { key: 'openingPayables', label: 'Payables' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className={labelCls}>{label}</label>
                    <input type="number" min={0} className={inputCls} placeholder="0.00"
                      value={(settings as Record<string, unknown>)[key]?.toString() ?? ''}
                      onChange={e => setSettings(s => ({ ...s, [key]: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={handleSaveSettings} disabled={savingSettings} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors flex items-center gap-2">
                <Save size={15} /> {savingSettings ? 'Saving…' : 'Save Settings'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bank Accounts Section */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-white font-semibold text-base">Bank Accounts</h2>
          <button onClick={openCreateBank} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors flex items-center gap-2 text-sm">
            <Plus size={14} /> Add Account
          </button>
        </div>
        {bankLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse bg-white/[0.04] rounded-xl h-12" />)}
          </div>
        ) : bankAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Landmark size={40} className="text-white/20" />
            <p className="text-white/40 text-sm">No bank accounts yet</p>
            <button onClick={openCreateBank} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors text-sm">
              Add first account
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Bank', 'Account No.', 'Currency', 'Opening Balance', 'Default', 'Actions'].map(h => (
                  <th key={h} className="text-left text-white/40 text-xs font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bankAccounts.map(acc => (
                <tr key={acc.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{acc.name}</td>
                  <td className="px-4 py-3 text-white/70">{acc.bankName ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70 font-mono text-xs">{acc.accountNumber ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70">{acc.currency ?? '—'}</td>
                  <td className="px-4 py-3 text-white/70">
                    {acc.openingBalance != null ? acc.openingBalance.toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {acc.isDefault && <Star size={14} className="text-[#00D9C0]" fill="#00D9C0" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditBank(acc)} className="bg-white/[0.05] text-white/70 px-3 py-1.5 rounded-lg text-xs hover:bg-white/[0.08] flex items-center gap-1">
                        <Pencil size={11} /> Edit
                      </button>
                      <button onClick={() => handleDeleteBank(acc.id)} disabled={deletingId === acc.id} className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/20 flex items-center gap-1">
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

      {/* Bank Account Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0B0F1A] border border-white/[0.08] text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBank ? 'Edit Bank Account' : 'Add Bank Account'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className={labelCls}>Account Name *</label>
              <input className={inputCls} placeholder="e.g. Main Operating Account" value={bankForm.name} onChange={e => setBankForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Bank Name</label>
              <input className={inputCls} placeholder="e.g. Chase Bank" value={bankForm.bankName} onChange={e => setBankForm(f => ({ ...f, bankName: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Account Number</label>
                <input className={inputCls} placeholder="Account number" value={bankForm.accountNumber} onChange={e => setBankForm(f => ({ ...f, accountNumber: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>IFSC / Routing Code</label>
                <input className={inputCls} placeholder="IFSC / routing" value={bankForm.ifscCode} onChange={e => setBankForm(f => ({ ...f, ifscCode: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Currency</label>
                <input className={inputCls} placeholder="USD" value={bankForm.currency} onChange={e => setBankForm(f => ({ ...f, currency: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Opening Balance</label>
                <input type="number" min={0} className={inputCls} placeholder="0.00" value={bankForm.openingBalance} onChange={e => setBankForm(f => ({ ...f, openingBalance: e.target.value }))} />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={bankForm.isDefault} onChange={e => setBankForm(f => ({ ...f, isDefault: e.target.checked }))} className="accent-[#00D9C0] w-4 h-4" />
              <span className="text-white/70 text-sm">Set as default account</span>
            </label>
          </div>
          <DialogFooter className="pt-2">
            <button onClick={() => setDialogOpen(false)} className="bg-white/[0.05] text-white/70 px-4 py-2 rounded-lg text-sm hover:bg-white/[0.08]">Cancel</button>
            <button onClick={handleSaveBank} disabled={savingBank} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors text-sm">
              {savingBank ? 'Saving…' : editingBank ? 'Update' : 'Add'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
