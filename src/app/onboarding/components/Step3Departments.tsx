"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Plus, Trash2, Network } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Step3Departments() {
  const { data, updateData, nextStep } = useOnboarding();

  const addDepartment = () => {
    updateData({
      departments: [...data.departments, { name: "" }]
    });
  };

  const removeDepartment = (index: number) => {
    updateData({
      departments: data.departments.filter((_, i) => i !== index)
    });
  };

  const updateDepartment = (index: number, name: string) => {
    const newDepts = [...data.departments];
    newDepts[index] = { name };
    updateData({ departments: newDepts });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">Departments</h2>
          <p className="text-white/60">Organize your business (Optional)</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            onClick={nextStep}
            className="text-white/60 hover:text-white"
          >
            Skip
          </Button>
          <Button 
            onClick={addDepartment}
            className="bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-lg gap-2"
          >
            <Plus className="w-4 h-4" /> Add Dept
          </Button>
        </div>
      </div>

      {data.departments.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center">
          <Network className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No departments defined</h3>
          <p className="text-white/60 mb-6">Departments help you manage teams and track costs.</p>
          <Button 
            onClick={addDepartment}
            className="bg-[#00D9C0] hover:bg-[#00D9C0]/90 text-[#0B0F1A]"
          >
            Create Department
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.departments.map((dept, index) => (
            <div key={index} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
              <input
                type="text"
                value={dept.name}
                onChange={(e) => updateDepartment(index, e.target.value)}
                className="flex-1 bg-transparent border-none text-white placeholder:text-white/20 focus:ring-0 outline-none p-0 text-lg font-medium"
                placeholder="e.g. Engineering, Sales"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeDepartment(index)}
                className="text-white/40 hover:text-red-400 hover:bg-red-400/10 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
