"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";

export function Step14Review() {
  const { data, setStep } = useOnboarding();

  const Widget = ({ title, value, stepToEdit, subtitle }: any) => (
    <div className="bg-[#F7F8F9] rounded-2xl p-6 border border-[#EAEAEA] relative group">
      <button 
        onClick={() => setStep(stepToEdit)}
        className="absolute top-4 right-4 text-[#8A8F98] hover:text-[#00D9C0] opacity-0 group-hover:opacity-100 transition-all"
      >
        <PencilLine className="w-4 h-4" />
      </button>
      <div className="text-xs font-semibold text-[#8A8F98] uppercase tracking-wider mb-2">{title}</div>
      <div className="text-2xl font-bold text-[#141B41]">{value}</div>
      {subtitle && <div className="text-sm text-[#8A8F98] mt-1">{subtitle}</div>}
    </div>
  );

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Final Review</h2>
        <p className="text-[#8A8F98]">Ensure everything looks correct before initializing your AI CEO.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Widget 
          title="Business" 
          value={data.businessName || "Unnamed Business"} 
          subtitle={data.industry || "No industry"}
          stepToEdit={2} 
        />
        
        <Widget 
          title="Team Size" 
          value={`${data.employees.length} Employees`}
          subtitle={`${data.departments.length} Departments`}
          stepToEdit={5} 
        />
        
        <Widget 
          title="Locations" 
          value={`${data.locations.length} Locations`}
          stepToEdit={3} 
        />
        
        <Widget 
          title="Catalog" 
          value={`${data.inventory.length} Products`}
          stepToEdit={7} 
        />
        
        <Widget 
          title="Network" 
          value={`${data.suppliers.length} Suppliers & ${data.customers.length} Customers`}
          stepToEdit={8} 
        />
        
        <div className="bg-[#0B0F24] rounded-2xl p-6 relative overflow-hidden group">
          <button 
            onClick={() => setStep(12)}
            className="absolute top-4 right-4 text-white/50 hover:text-[#00D9C0] opacity-0 group-hover:opacity-100 transition-all z-10"
          >
            <PencilLine className="w-4 h-4" />
          </button>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D9C0] rounded-full blur-[60px] opacity-20 pointer-events-none" />
          
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 relative z-10">AI Engine</div>
          <div className="text-2xl font-bold text-white relative z-10">{data.aiPreferences.autonomy} Mode</div>
          <div className="text-sm text-white/70 mt-1 relative z-10">Approval: {data.aiPreferences.approvalThreshold}</div>
        </div>
      </div>
    </div>
  );
}
