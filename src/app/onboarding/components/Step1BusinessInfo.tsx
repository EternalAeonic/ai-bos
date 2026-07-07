"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Building2, FileText, Globe, MapPin, Hash, Factory } from "lucide-react";

export function Step1BusinessInfo() {
  const { data, updateData } = useOnboarding();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">Business Identity</h2>
        <p className="text-white/60">Let&apos;s start with the basic details of your company.</p>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00D9C0]" /> Business Name
            </label>
            <input
              type="text"
              value={data.businessName}
              onChange={(e) => updateData({ businessName: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00D9C0]" /> Legal Name
            </label>
            <input
              type="text"
              value={data.legalName}
              onChange={(e) => updateData({ legalName: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
              placeholder="e.g. Acme Corporation LLC"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Factory className="w-4 h-4 text-[#00D9C0]" /> Industry
            </label>
            <input
              type="text"
              value={data.industry}
              onChange={(e) => updateData({ industry: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
              placeholder="e.g. Retail, Manufacturing"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Business Type</label>
            <select
              value={data.businessType}
              onChange={(e) => updateData({ businessType: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none [&>option]:bg-[#0B0F1A]"
            >
              <option value="">Select a type</option>
              <option value="LLC">LLC</option>
              <option value="Corporation">Corporation</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00D9C0]" /> Country
            </label>
            <input
              type="text"
              value={data.country}
              onChange={(e) => updateData({ country: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
              placeholder="e.g. United States"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Currency</label>
            <select
              value={data.currency}
              onChange={(e) => updateData({ currency: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none [&>option]:bg-[#0B0F1A]"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-medium text-white">Contact & Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00D9C0]" /> Street Address
            </label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => updateData({ address: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
              placeholder="123 Main St"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">City</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
              placeholder="New York"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">State / Province</label>
            <input
              type="text"
              value={data.state}
              onChange={(e) => updateData({ state: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
              placeholder="NY"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-medium text-white">Registration Details (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#00D9C0]" /> Registration / EIN Number
            </label>
            <input
              type="text"
              value={data.registrationNumber}
              onChange={(e) => updateData({ registrationNumber: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
              placeholder="XX-XXXXXXX"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">VAT / GST Number</label>
            <input
              type="text"
              value={data.vatNumber || data.gstNumber}
              onChange={(e) => updateData({ vatNumber: e.target.value, gstNumber: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
              placeholder="Optional"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
