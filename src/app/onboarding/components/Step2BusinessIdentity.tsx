"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export function Step2BusinessIdentity() {
  const { data, updateData } = useOnboarding();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Tell us about your business</h2>
        <p className="text-[#8A8F98]">This helps AI-BOS configure your compliance, currency, and locale settings automatically.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="w-32 h-32 rounded-full border border-dashed border-[#EAEAEA] bg-[#F7F8F9] flex flex-col items-center justify-center text-[#8A8F98] cursor-pointer hover:border-[#00D9C0] hover:text-[#00D9C0] transition-colors group relative overflow-hidden">
          <Upload className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
          <span className="text-xs font-medium">Upload Logo</span>
          <div className="absolute inset-0 bg-[#00D9C0]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-2">
          <Label className="text-[#141B41]">Business Name</Label>
          <Input 
            value={data.businessName}
            onChange={(e) => updateData({ businessName: e.target.value })}
            placeholder="Acme Corp"
            className="bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] focus:ring-0 transition-colors h-12"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[#141B41]">Legal Entity Name</Label>
          <Input 
            value={data.legalName}
            onChange={(e) => updateData({ legalName: e.target.value })}
            placeholder="Acme Corporation LLC"
            className="bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] focus:ring-0 transition-colors h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#141B41]">Industry</Label>
          <select 
            value={data.industry}
            onChange={(e) => updateData({ industry: e.target.value })}
            className="w-full bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] rounded-md px-3 h-12 text-sm outline-none transition-colors"
          >
            <option value="">Select industry...</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Software">Software & IT</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-[#141B41]">Company Size</Label>
          <div className="flex gap-2 h-12">
            {["1-10", "11-50", "50+"].map((size) => (
              <button
                key={size}
                onClick={() => updateData({ companySize: size })}
                className={`flex-1 rounded-md border text-sm font-medium transition-colors ${
                  data.companySize === size
                    ? "bg-[#141B41] text-white border-[#141B41]"
                    : "bg-[#F7F8F9] border-transparent text-[#8A8F98] hover:border-[#EAEAEA]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[#141B41]">Website</Label>
          <Input 
            value={data.website}
            onChange={(e) => updateData({ website: e.target.value })}
            placeholder="acme.com"
            className="bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] focus:ring-0 transition-colors h-12"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[#141B41]">Business Email</Label>
          <Input 
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="hello@acme.com"
            className="bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] focus:ring-0 transition-colors h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#141B41]">Phone Number</Label>
          <Input 
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
            className="bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] focus:ring-0 transition-colors h-12"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[#141B41]">Country</Label>
          <Input 
            value={data.country}
            onChange={(e) => updateData({ country: e.target.value })}
            placeholder="United States"
            className="bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] focus:ring-0 transition-colors h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#141B41]">Currency</Label>
          <Input 
            value={data.currency}
            onChange={(e) => updateData({ currency: e.target.value })}
            placeholder="USD ($)"
            className="bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] focus:ring-0 transition-colors h-12"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[#141B41]">Timezone</Label>
          <Input 
            value={data.timezone}
            onChange={(e) => updateData({ timezone: e.target.value })}
            placeholder="America/Los_Angeles"
            className="bg-[#F7F8F9] border-transparent hover:border-[#EAEAEA] focus:border-[#00D9C0] focus:ring-0 transition-colors h-12"
          />
        </div>
      </div>
    </div>
  );
}
