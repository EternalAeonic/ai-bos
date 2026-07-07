"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { CheckCircle2, Building2, MapPin, Users, Coins, Bot, ArrowRight } from "lucide-react";

export function Step10Review() {
  const { data } = useOnboarding();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-[#00D9C0] to-[#009988] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(0,217,192,0.3)]">
          <CheckCircle2 className="w-10 h-10 text-[#0B0F1A]" />
        </div>
        <h2 className="text-3xl font-semibold text-white tracking-tight">You&apos;re All Set!</h2>
        <p className="text-white/60 text-lg">
          Review your business setup summary below before launching your AI-BOS workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex items-start gap-4">
          <div className="p-3 bg-white/[0.04] rounded-lg">
            <Building2 className="w-6 h-6 text-[#00D9C0]" />
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Business Identity</h4>
            <p className="text-white/60 text-sm">{data.businessName || "Not set"}</p>
            <p className="text-white/40 text-xs">{data.industry || "Industry not set"}</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex items-start gap-4">
          <div className="p-3 bg-white/[0.04] rounded-lg">
            <MapPin className="w-6 h-6 text-[#00D9C0]" />
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Locations & Operations</h4>
            <p className="text-white/60 text-sm">{data.locations.length} Locations</p>
            <p className="text-white/40 text-xs">{data.departments.length} Departments</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex items-start gap-4">
          <div className="p-3 bg-white/[0.04] rounded-lg">
            <Users className="w-6 h-6 text-[#00D9C0]" />
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Network</h4>
            <p className="text-white/60 text-sm">{data.employees.length} Employees</p>
            <p className="text-white/40 text-xs">{data.customers.length} Customers, {data.suppliers.length} Suppliers</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex items-start gap-4">
          <div className="p-3 bg-white/[0.04] rounded-lg">
            <Coins className="w-6 h-6 text-[#00D9C0]" />
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Finance & Tax</h4>
            <p className="text-white/60 text-sm">{data.finance.currency} - {data.finance.accountingMethod} base</p>
            <p className="text-white/40 text-xs">{data.taxes.rules.length} Tax rules configured</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-gradient-to-r from-white/[0.02] to-[#00D9C0]/[0.05] border border-white/[0.06] rounded-2xl p-6 flex items-start gap-4">
          <div className="p-3 bg-[#00D9C0]/10 rounded-lg">
            <Bot className="w-6 h-6 text-[#00D9C0]" />
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">AI CEO: {data.aiConfig.assistantName}</h4>
            <p className="text-white/60 text-sm">Autonomy Level: {data.aiConfig.approvalLevel}</p>
            <p className="text-white/40 text-xs">Ready to automate your business processes.</p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-white/40 mt-8 pb-8">
        Click "Finish Setup" below to complete onboarding and enter your dashboard.
      </div>
    </div>
  );
}
