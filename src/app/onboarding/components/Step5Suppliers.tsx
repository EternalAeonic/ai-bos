"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Plus, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Step5Suppliers() {
  const { data, updateData, nextStep } = useOnboarding();

  const addSupplier = () => {
    updateData({
      suppliers: [...data.suppliers, { name: "", contactPerson: "", email: "", phone: "" }]
    });
  };

  const removeSupplier = (index: number) => {
    updateData({
      suppliers: data.suppliers.filter((_, i) => i !== index)
    });
  };

  const updateSupplier = (index: number, field: string, value: string) => {
    const arr = [...data.suppliers];
    arr[index] = { ...arr[index], [field]: value };
    updateData({ suppliers: arr });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">Suppliers</h2>
          <p className="text-white/60">Add key suppliers or vendors (Optional)</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={nextStep}
            className="bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-lg"
          >
            Skip this step for now
          </Button>
          <Button 
            onClick={addSupplier}
            className="bg-[#00D9C0] hover:bg-[#00D9C0]/90 text-[#0B0F1A] rounded-lg gap-2"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </Button>
        </div>
      </div>

      {data.suppliers.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center">
          <Truck className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No suppliers added</h3>
          <p className="text-white/60 mb-6">You can add your suppliers later in the Procurement module.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.suppliers.map((s, index) => (
            <div key={index} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative group">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSupplier(index)}
                className="absolute top-4 right-4 text-white/40 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Company Name</label>
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => updateSupplier(index, "name", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="e.g. Global Tech Supplies"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Contact Person</label>
                  <input
                    type="text"
                    value={s.contactPerson}
                    onChange={(e) => updateSupplier(index, "contactPerson", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="e.g. Jane Smith"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Email</label>
                  <input
                    type="email"
                    value={s.email}
                    onChange={(e) => updateSupplier(index, "email", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="contact@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Phone</label>
                  <input
                    type="text"
                    value={s.phone}
                    onChange={(e) => updateSupplier(index, "phone", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
