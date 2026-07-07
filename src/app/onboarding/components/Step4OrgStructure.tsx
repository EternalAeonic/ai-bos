"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GitCommit } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const defaultDepartments = ["Sales", "Finance", "Inventory", "Operations", "HR", "Marketing", "Purchase"];

export function Step4OrgStructure() {
  const { data, updateData } = useOnboarding();
  const [customDept, setCustomDept] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const toggleDept = (dept: string) => {
    if (data.departments.includes(dept)) {
      updateData({ departments: data.departments.filter(d => d !== dept) });
    } else {
      updateData({ departments: [...data.departments, dept] });
    }
  };

  const addCustomDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDept.trim() && !data.departments.includes(customDept.trim())) {
      updateData({ departments: [...data.departments, customDept.trim()] });
    }
    setCustomDept("");
    setIsAddingCustom(false);
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Define your departments</h2>
        <p className="text-[#8A8F98]">Select the departments that make up your organization structure.</p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Left side: Selections */}
        <div className="w-1/2 space-y-6">
          <div className="flex flex-wrap gap-3">
            {defaultDepartments.map(dept => {
              const isActive = data.departments.includes(dept);
              return (
                <button
                  key={dept}
                  onClick={() => toggleDept(dept)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isActive 
                      ? "bg-[#141B41] text-white border-[#141B41] shadow-[0_4px_12px_rgba(20,27,65,0.2)]" 
                      : "bg-white text-[#8A8F98] border-[#EAEAEA] hover:border-[#141B41] hover:text-[#141B41]"
                  }`}
                >
                  {dept}
                </button>
              );
            })}
            
            {/* Custom Departments rendered here if not in default */}
            {data.departments.filter(d => !defaultDepartments.includes(d)).map(dept => (
               <button
                 key={dept}
                 onClick={() => toggleDept(dept)}
                 className="px-4 py-2 rounded-full text-sm font-medium bg-[#141B41] text-white border border-[#141B41] shadow-[0_4px_12px_rgba(20,27,65,0.2)] flex items-center gap-2"
               >
                 {dept} <X className="w-3 h-3 opacity-60" />
               </button>
            ))}

            {isAddingCustom ? (
              <form onSubmit={addCustomDept} className="flex items-center">
                <Input 
                  autoFocus
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  placeholder="Department name..."
                  className="h-9 w-40 rounded-full bg-[#F7F8F9] border-transparent focus:border-[#00D9C0] focus:ring-0 text-sm px-4"
                  onBlur={() => {
                    if(!customDept) setIsAddingCustom(false);
                  }}
                />
              </form>
            ) : (
              <button
                onClick={() => setIsAddingCustom(true)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-[#F7F8F9] text-[#8A8F98] border border-dashed border-[#EAEAEA] hover:border-[#00D9C0] hover:text-[#00D9C0] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Custom
              </button>
            )}
          </div>
        </div>

        {/* Right side: Visual Tree Preview */}
        <div className="w-1/2 bg-[#F7F8F9] rounded-3xl p-8 border border-[#EAEAEA] min-h-[300px] flex flex-col items-center">
          <div className="text-xs font-semibold text-[#8A8F98] uppercase tracking-wider mb-6">Org Chart Preview</div>
          
          <div className="w-32 h-10 bg-[#141B41] text-white rounded-lg flex items-center justify-center text-sm font-medium shadow-lg z-10 relative">
            {data.businessName || "Your Company"}
          </div>
          
          {data.departments.length > 0 && (
            <div className="relative flex justify-center w-full mt-8">
              {/* Vertical line from company */}
              <div className="absolute -top-8 left-1/2 w-px h-8 bg-[#EAEAEA]" />
              
              {/* Horizontal line connecting departments if > 1 */}
              {data.departments.length > 1 && (
                <div className="absolute -top-4 bg-[#EAEAEA] h-px" style={{ width: `${((data.departments.length - 1) / data.departments.length) * 100}%` }} />
              )}

              <div className="flex justify-between w-full relative pt-4">
                {data.departments.map((dept, i) => (
                  <motion.div 
                    key={dept} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center flex-1 relative"
                  >
                    <div className="absolute -top-8 left-1/2 w-px h-8 bg-[#EAEAEA]" />
                    <div className="w-20 py-2 bg-white border border-[#EAEAEA] rounded-md flex items-center justify-center text-[10px] font-medium text-[#141B41] shadow-sm text-center">
                      {dept}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {data.departments.length === 0 && (
            <div className="mt-12 text-sm text-[#8A8F98] flex items-center gap-2">
              <GitCommit className="w-4 h-4" /> Select departments to build chart
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
