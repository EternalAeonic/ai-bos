"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Plus, Star } from "lucide-react";

export function Step8Suppliers() {
  const { data, updateData } = useOnboarding();

  const addSupplier = () => {
    updateData({
      suppliers: [...data.suppliers, { id: Date.now(), name: "", company: "", email: "", terms: "Net 30", isPreferred: false }]
    });
  };

  const updateSupplier = (id: number, field: string, value: any) => {
    updateData({
      suppliers: data.suppliers.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Your supply chain</h2>
          <p className="text-[#8A8F98]">Add your vendors and suppliers. AI-BOS will automate purchase orders.</p>
        </div>
        <Button onClick={addSupplier} className="h-10 bg-[#141B41] hover:bg-[#00D9C0] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Supplier
        </Button>
      </div>

      {data.suppliers.length === 0 ? (
        <div className="border border-dashed border-[#EAEAEA] rounded-3xl h-64 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#F7F8F9] rounded-2xl flex items-center justify-center mb-4">
            <Truck className="w-8 h-8 text-[#8A8F98]" />
          </div>
          <h3 className="text-lg font-semibold text-[#141B41] mb-1">No suppliers added</h3>
          <p className="text-sm text-[#8A8F98]">Start building your supply chain network.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {data.suppliers.map((supplier, index) => (
            <div key={supplier.id} className="border border-[#EAEAEA] rounded-2xl p-6 shadow-sm bg-white relative">
              <button 
                onClick={() => updateSupplier(supplier.id, "isPreferred", !supplier.isPreferred)}
                className="absolute top-6 right-6 text-[#8A8F98] hover:text-amber-400 transition-colors"
              >
                <Star className={`w-5 h-5 ${supplier.isPreferred ? "fill-amber-400 text-amber-400" : ""}`} />
              </button>
              
              <div className="space-y-4">
                <div className="space-y-1 pr-8">
                  <Input 
                    value={supplier.name} 
                    onChange={e => updateSupplier(supplier.id, "name", e.target.value)}
                    placeholder={`Supplier ${index + 1}`} 
                    className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-8 text-lg font-semibold px-2 -ml-2"
                  />
                  <Input 
                    value={supplier.company} 
                    onChange={e => updateSupplier(supplier.id, "company", e.target.value)}
                    placeholder="Company Name" 
                    className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-6 text-sm text-[#8A8F98] px-2 -ml-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#F7F8F9]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#8A8F98] uppercase">Email</span>
                    <Input 
                      value={supplier.email} 
                      onChange={e => updateSupplier(supplier.id, "email", e.target.value)}
                      placeholder="email@company.com" 
                      className="bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-8 text-xs px-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#8A8F98] uppercase">Payment Terms</span>
                    <select
                      value={supplier.terms}
                      onChange={e => updateSupplier(supplier.id, "terms", e.target.value)}
                      className="w-full bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] rounded-md px-2 h-8 text-xs outline-none"
                    >
                      <option value="CIA">Cash in Advance</option>
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 60">Net 60</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
