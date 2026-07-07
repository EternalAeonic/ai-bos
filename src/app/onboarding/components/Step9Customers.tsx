"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus } from "lucide-react";

export function Step9Customers() {
  const { data, updateData } = useOnboarding();

  const addCustomer = () => {
    updateData({
      customers: [...data.customers, { id: Date.now(), name: "", company: "", email: "", limit: "" }]
    });
  };

  const updateCustomer = (id: number, field: string, value: any) => {
    updateData({
      customers: data.customers.map(c => c.id === id ? { ...c, [field]: value } : c)
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Manage your clientele</h2>
          <p className="text-[#8A8F98]">Add your top customers. You can import the rest later.</p>
        </div>
        <Button onClick={addCustomer} className="h-10 bg-[#141B41] hover:bg-[#00D9C0] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </div>

      {data.customers.length === 0 ? (
        <div className="border border-dashed border-[#EAEAEA] rounded-3xl h-64 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#F7F8F9] rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-[#8A8F98]" />
          </div>
          <h3 className="text-lg font-semibold text-[#141B41] mb-1">No customers added</h3>
          <p className="text-sm text-[#8A8F98]">Start building your CRM database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {data.customers.map((customer, index) => (
            <div key={customer.id} className="border border-[#EAEAEA] rounded-2xl p-6 shadow-sm bg-white">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Input 
                    value={customer.name} 
                    onChange={e => updateCustomer(customer.id, "name", e.target.value)}
                    placeholder={`Customer ${index + 1}`} 
                    className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-8 text-lg font-semibold px-2 -ml-2"
                  />
                  <Input 
                    value={customer.company} 
                    onChange={e => updateCustomer(customer.id, "company", e.target.value)}
                    placeholder="Company Name" 
                    className="bg-transparent border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-6 text-sm text-[#8A8F98] px-2 -ml-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#F7F8F9]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#8A8F98] uppercase">Email</span>
                    <Input 
                      value={customer.email} 
                      onChange={e => updateCustomer(customer.id, "email", e.target.value)}
                      placeholder="email@company.com" 
                      className="bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-8 text-xs px-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#8A8F98] uppercase">Credit Limit</span>
                    <Input 
                      value={customer.limit} 
                      onChange={e => updateCustomer(customer.id, "limit", e.target.value)}
                      placeholder="$ 0.00" type="number"
                      className="bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] h-8 text-xs px-2"
                    />
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
