"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Wallet, Landmark, Calendar, FileText, Settings, Coins } from "lucide-react";

export function Step7Finance() {
  const { data, updateData } = useOnboarding();

  const updateFinance = (field: string, value: string) => {
    updateData({ finance: { ...data.finance, [field]: value } });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">Financial Settings</h2>
        <p className="text-white/60">Configure your starting balances and accounting preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-medium text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#00D9C0]" /> Opening Balances
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Cash Balance</label>
              <input
                type="number"
                value={data.finance.openingCash}
                onChange={(e) => updateFinance("openingCash", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Bank Balance</label>
              <input
                type="number"
                value={data.finance.bankBalance}
                onChange={(e) => updateFinance("bankBalance", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-medium text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#00D9C0]" /> Preferences
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00D9C0]" /> Fiscal Year Start
              </label>
              <select
                value={data.finance.fiscalYearStart}
                onChange={(e) => updateFinance("fiscalYearStart", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none [&>option]:bg-[#0B0F1A]"
              >
                <option value="01-01">January 1st</option>
                <option value="04-01">April 1st</option>
                <option value="07-01">July 1st</option>
                <option value="10-01">October 1st</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00D9C0]" /> Invoice Prefix
              </label>
              <input
                type="text"
                value={data.finance.invoicePrefix}
                onChange={(e) => updateFinance("invoicePrefix", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                placeholder="INV"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#00D9C0]" /> Base Currency
              </label>
              <select
                value={data.finance.currency}
                onChange={(e) => updateFinance("currency", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none [&>option]:bg-[#0B0F1A]"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Accounting Method</label>
              <select
                value={data.finance.accountingMethod}
                onChange={(e) => updateFinance("accountingMethod", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none [&>option]:bg-[#0B0F1A]"
              >
                <option value="Accrual">Accrual Base</option>
                <option value="Cash">Cash Base</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
