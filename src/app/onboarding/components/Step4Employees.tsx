"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Step4Employees() {
  const { data, updateData, nextStep } = useOnboarding();

  const addEmployee = () => {
    updateData({
      employees: [...data.employees, { name: "", email: "", jobTitle: "" }]
    });
  };

  const removeEmployee = (index: number) => {
    updateData({
      employees: data.employees.filter((_, i) => i !== index)
    });
  };

  const updateEmployee = (index: number, field: string, value: string) => {
    const newEmp = [...data.employees];
    newEmp[index] = { ...newEmp[index], [field]: value };
    updateData({ employees: newEmp });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">Employees</h2>
          <p className="text-white/60">Invite your team to AI-BOS (Optional)</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={nextStep}
            className="bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] rounded-lg"
          >
            Skip this step for now
          </Button>
          <Button 
            onClick={addEmployee}
            className="bg-[#00D9C0] hover:bg-[#00D9C0]/90 text-[#0B0F1A] rounded-lg gap-2"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </Button>
        </div>
      </div>

      {data.employees.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No employees added</h3>
          <p className="text-white/60 mb-6">You can invite team members later from the dashboard.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.employees.map((emp, index) => (
            <div key={index} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 relative group">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEmployee(index)}
                className="absolute top-4 right-4 text-white/40 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Name</label>
                  <input
                    type="text"
                    value={emp.name}
                    onChange={(e) => updateEmployee(index, "name", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Email</label>
                  <input
                    type="email"
                    value={emp.email}
                    onChange={(e) => updateEmployee(index, "email", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Job Title</label>
                  <input
                    type="text"
                    value={emp.jobTitle}
                    onChange={(e) => updateEmployee(index, "jobTitle", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                    placeholder="e.g. Software Engineer"
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
