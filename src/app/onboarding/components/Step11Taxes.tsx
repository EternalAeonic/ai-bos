"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export function Step11Taxes() {
  const { data, updateData } = useOnboarding();
  const taxes = data.taxes || { rules: [], invoiceFormat: "INV-[YYYY]-[0000]" };

  const updateTaxes = (field: string, value: any) => {
    updateData({ taxes: { ...taxes, [field]: value } });
  };

  const addRule = () => {
    updateTaxes("rules", [...(taxes.rules || []), { id: Date.now(), region: "", taxType: "", rate: "" }]);
  };

  const removeRule = (id: number) => {
    updateTaxes("rules", (taxes.rules || []).filter((r: any) => r.id !== id));
  };

  const updateRule = (id: number, field: string, value: string) => {
    updateTaxes("rules", (taxes.rules || []).map((r: any) => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Compliance & Taxes</h2>
        <p className="text-[#8A8F98]">Set up your regional tax rules and invoice numbering formats.</p>
      </div>

      <div className="bg-[#F7F8F9] rounded-3xl p-8 border border-[#EAEAEA] space-y-6">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
          <h3 className="font-semibold text-[#141B41]">Tax Rules</h3>
          <Button variant="outline" size="sm" onClick={addRule} className="h-8 border-[#EAEAEA] bg-white text-[#8A8F98] hover:text-[#141B41]">
            <Plus className="w-4 h-4 mr-1" /> Add Rule
          </Button>
        </div>
        
        {(!taxes.rules || taxes.rules.length === 0) ? (
          <div className="text-sm text-[#8A8F98] text-center py-4">No tax rules defined. Add a rule to calculate taxes automatically.</div>
        ) : (
          <div className="space-y-3">
            {taxes.rules.map((rule: any) => (
              <div key={rule.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#EAEAEA] shadow-sm">
                <span className="text-sm font-medium text-[#141B41] shrink-0">If region is</span>
                <Input 
                  value={rule.region}
                  onChange={e => updateRule(rule.id, "region", e.target.value)}
                  placeholder="California"
                  className="h-9 w-32 border-[#EAEAEA] focus:border-[#00D9C0]"
                />
                <span className="text-sm font-medium text-[#141B41] shrink-0">apply</span>
                <Input 
                  value={rule.taxType}
                  onChange={e => updateRule(rule.id, "taxType", e.target.value)}
                  placeholder="Sales Tax"
                  className="h-9 flex-1 border-[#EAEAEA] focus:border-[#00D9C0]"
                />
                <span className="text-sm font-medium text-[#141B41] shrink-0">at</span>
                <Input 
                  value={rule.rate}
                  onChange={e => updateRule(rule.id, "rate", e.target.value)}
                  placeholder="7.25"
                  className="h-9 w-20 border-[#EAEAEA] focus:border-[#00D9C0] text-right"
                  type="number"
                />
                <span className="text-sm font-medium text-[#141B41] shrink-0">%</span>
                <button onClick={() => removeRule(rule.id)} className="ml-2 text-[#8A8F98] hover:text-red-500 transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#F7F8F9] rounded-3xl p-8 border border-[#EAEAEA] space-y-6">
        <h3 className="font-semibold text-[#141B41] border-b border-[#EAEAEA] pb-4">Invoice Number Format</h3>
        
        <div className="space-y-2">
          <Label>Format Pattern</Label>
          <Input 
            value={taxes.invoiceFormat}
            onChange={e => updateTaxes("invoiceFormat", e.target.value)}
            className="bg-white border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] font-mono"
            placeholder="INV-[YYYY]-[0000]"
          />
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EAEAEA] shadow-sm flex items-center justify-between">
          <span className="text-sm text-[#8A8F98]">Live Preview</span>
          <span className="font-mono font-medium text-[#141B41] bg-[#F7F8F9] px-3 py-1 rounded">
            {taxes.invoiceFormat.replace("[YYYY]", new Date().getFullYear().toString()).replace("[0000]", "0001").replace("[MM]", "07")}
          </span>
        </div>
      </div>
    </div>
  );
}
