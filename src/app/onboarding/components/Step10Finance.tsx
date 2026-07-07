"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark, ArrowRight } from "lucide-react";

export function Step10Finance() {
  const { data, updateData } = useOnboarding();
  const finance = data.finance || {};

  const updateFinance = (field: string, value: string) => {
    updateData({ finance: { ...finance, [field]: value } });
  };

  return (
    <div className="flex gap-12">
      {/* Left side: Context */}
      <div className="w-1/3 pt-4">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Financial Foundations</h2>
        <p className="text-[#8A8F98] leading-relaxed mb-8">
          To maintain an accurate double-entry ledger, AI-BOS needs your starting balances. 
          You can connect your bank account directly or enter balances manually.
        </p>
        
        <Button className="w-full h-14 bg-[#141B41] hover:bg-[#00D9C0] text-white rounded-xl shadow-lg flex items-center justify-between px-6 group">
          <div className="flex items-center gap-3">
            <Landmark className="w-5 h-5 text-[#00D9C0] group-hover:text-white transition-colors" />
            <span className="font-semibold">Connect Bank</span>
          </div>
          <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Button>
      </div>

      {/* Right side: Manual Entry */}
      <div className="w-2/3 bg-[#F7F8F9] rounded-3xl p-8 border border-[#EAEAEA]">
        <h3 className="font-semibold text-[#141B41] mb-6">Or enter manually</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Opening Cash</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8F98]">$</span>
                <Input 
                  type="number"
                  value={finance.openingCash || ""}
                  onChange={e => updateFinance("openingCash", e.target.value)}
                  className="pl-7 bg-white border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0]" 
                  placeholder="0.00" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bank Account Balance</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8F98]">$</span>
                <Input 
                  type="number"
                  value={finance.bankBalance || ""}
                  onChange={e => updateFinance("bankBalance", e.target.value)}
                  className="pl-7 bg-white border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0]" 
                  placeholder="0.00" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Opening Receivables <span className="text-[#8A8F98] font-normal">(Money owed to you)</span></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8F98]">$</span>
                <Input 
                  type="number"
                  value={finance.receivables || ""}
                  onChange={e => updateFinance("receivables", e.target.value)}
                  className="pl-7 bg-white border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0]" 
                  placeholder="0.00" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Opening Payables <span className="text-[#8A8F98] font-normal">(Money you owe)</span></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8F98]">$</span>
                <Input 
                  type="number"
                  value={finance.payables || ""}
                  onChange={e => updateFinance("payables", e.target.value)}
                  className="pl-7 bg-white border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0]" 
                  placeholder="0.00" 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Accounting Method</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="accountingMethod" 
                  value="Accrual"
                  checked={(finance.method || "Accrual") === "Accrual"}
                  onChange={e => updateFinance("method", e.target.value)}
                  className="accent-[#00D9C0]" 
                />
                <span className="text-sm">Accrual (Recommended)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="accountingMethod" 
                  value="Cash"
                  checked={finance.method === "Cash"}
                  onChange={e => updateFinance("method", e.target.value)}
                  className="accent-[#00D9C0]" 
                />
                <span className="text-sm">Cash</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
