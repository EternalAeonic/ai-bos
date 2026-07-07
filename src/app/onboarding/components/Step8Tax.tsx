"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Plus, Trash2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Step8Tax() {
  const { data, updateData } = useOnboarding();

  const addRule = () => {
    updateData({
      taxes: { ...data.taxes, rules: [...data.taxes.rules, { taxType: "SALES_TAX", rate: "0", region: "" }] }
    });
  };

  const removeRule = (index: number) => {
    const newRules = data.taxes.rules.filter((_, i) => i !== index);
    updateData({ taxes: { ...data.taxes, rules: newRules } });
  };

  const updateRule = (index: number, field: string, value: string) => {
    const newRules = [...data.taxes.rules];
    newRules[index] = { ...newRules[index], [field]: value };
    updateData({ taxes: { ...data.taxes, rules: newRules } });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">Tax Configuration</h2>
          <p className="text-white/60">Set up your tax rules and invoice format.</p>
        </div>
        <Button 
          onClick={addRule}
          className="bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-lg gap-2"
        >
          <Plus className="w-4 h-4" /> Add Tax Rule
        </Button>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-medium text-white flex items-center gap-2">
          <Receipt className="w-5 h-5 text-[#00D9C0]" /> Document Format
        </h3>
        <div className="space-y-2 max-w-md">
          <label className="text-sm font-medium text-white/80">Invoice Format</label>
          <input
            type="text"
            value={data.taxes.invoiceFormat}
            onChange={(e) => updateData({ taxes: { ...data.taxes, invoiceFormat: e.target.value } })}
            className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
            placeholder="INV-[YYYY]-[0000]"
          />
          <p className="text-xs text-white/40">Use placeholders like [YYYY] and [0000] for auto-incrementing numbers.</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.taxes.rules.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center text-white/60">
            No tax rules configured. You can set them up later.
          </div>
        ) : (
          data.taxes.rules.map((rule, index) => (
            <div key={index} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative group">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRule(index)}
                className="absolute top-4 right-4 text-white/40 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Tax Type</label>
                  <input
                    type="text"
                    value={rule.taxType}
                    onChange={(e) => updateRule(index, "taxType", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="e.g. VAT, GST"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Rate (%)</label>
                  <input
                    type="number"
                    value={rule.rate}
                    onChange={(e) => updateRule(index, "rate", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Region (Optional)</label>
                  <input
                    type="text"
                    value={rule.region}
                    onChange={(e) => updateRule(index, "region", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="e.g. New York, EU"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
