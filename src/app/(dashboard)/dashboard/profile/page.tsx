"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Building2, MapPin, Users, Package, Truck, UserCheck,
  Banknote, Bot, ArrowRight, CheckCircle2, AlertCircle,
  Pencil, X, Save, Globe, Phone, Loader2,
} from "lucide-react";
import { getBusinessAction, updateBusinessAction } from "@/app/actions/business";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type Business = {
  name: string; legalName?: string; industry?: string; businessType?: string;
  country?: string; currency?: string; timezone?: string; website?: string;
  phone?: string; logoUrl?: string; address?: string; city?: string; state?: string;
  postalCode?: string; gstNumber?: string; vatNumber?: string; registrationNumber?: string;
  setupScore?: number; onboardingComplete?: boolean;
};

const INDUSTRIES = [
  "Retail", "Manufacturing", "Software & IT", "Healthcare", "Finance",
  "Food & Beverage", "Logistics", "Real Estate", "Education", "Consulting", "Other",
];

export default function BusinessProfilePage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Business>>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await getBusinessAction();
      if (res.success) setBusiness((res.data as any) ?? null);
      else toast.error("Failed to load business profile");
    } catch (e) {
      toast.error("Failed to load business profile");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEdit = () => {
    setForm({ ...business });
    setEditOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateBusinessAction({
        name: form.name,
        legalName: form.legalName,
        industry: form.industry,
        businessType: form.businessType,
        country: form.country,
        currency: form.currency,
        timezone: form.timezone,
        website: form.website,
        phone: form.phone,
        logoUrl: form.logoUrl,
        address: form.address,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        gstNumber: form.gstNumber,
        vatNumber: form.vatNumber,
        registrationNumber: form.registrationNumber,
      });
      if (res.success) {
        toast.success("Business profile updated");
        setEditOpen(false);
        await load();
      } else {
        toast.error("Failed to save", { description: (res as any).error });
      }
    } catch (e: any) {
      toast.error("Failed to save", { description: e.message });
    }
    setSaving(false);
  };

  const score = business?.setupScore ?? 0;
  const scoreColor = score >= 80 ? "#00D9C0" : score >= 50 ? "#F59E0B" : "#EF4444";
  const scoreLabel = score >= 80 ? "Healthy" : score >= 50 ? "In Progress" : "Needs Setup";

  const f = (v: string) => `bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-0 rounded-lg px-3 py-2 w-full outline-none transition-colors text-sm ${v}`;

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-10 w-48 bg-white/[0.05] animate-pulse rounded-xl" />
        <div className="h-40 bg-white/[0.02] animate-pulse rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-white/[0.02] animate-pulse rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Business Profile</h1>
          <p className="text-white/40 text-sm mt-0.5">Your company identity and setup progress.</p>
        </div>
        <div className="flex gap-3">
          {business && (
            <button
              onClick={openEdit}
              className="flex items-center gap-2 px-4 py-2 bg-[#00D9C0] text-[#0B0F1A] font-bold text-sm rounded-xl hover:bg-[#00c2ab] transition-all shadow-[0_4px_16px_rgba(0,217,192,0.2)]"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] text-white/70 font-medium text-sm rounded-xl hover:bg-white/[0.08] transition-all border border-white/[0.08]"
          >
            <Bot className="w-3.5 h-3.5" /> Setup Wizard
          </Link>
        </div>
      </div>

      {business ? (
        <>
          {/* Business card */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D9C0]/20 to-[#141B41]/50 border border-[#00D9C0]/20 flex items-center justify-center shrink-0 text-2xl font-bold text-[#00D9C0]">
                {business.logoUrl ? (
                  <img src={business.logoUrl} alt="logo" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  business.name?.charAt(0)?.toUpperCase() ?? "B"
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{business.name}</h2>
                {business.legalName && <p className="text-sm text-white/40 mt-0.5">{business.legalName}</p>}
                <div className="flex flex-wrap gap-2 mt-3">
                  {business.industry && <span className="text-xs bg-white/[0.06] text-white/60 px-2.5 py-1 rounded-full">{business.industry}</span>}
                  {business.country && <span className="text-xs bg-white/[0.06] text-white/60 px-2.5 py-1 rounded-full">🌍 {business.country}</span>}
                  {business.currency && <span className="text-xs bg-white/[0.06] text-white/60 px-2.5 py-1 rounded-full">{business.currency}</span>}
                  {business.timezone && <span className="text-xs bg-white/[0.06] text-white/60 px-2.5 py-1 rounded-full">⏰ {business.timezone}</span>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/[0.05]">
                  {business.phone && <div><p className="text-[10px] text-white/25 uppercase tracking-wider">Phone</p><p className="text-sm text-white/70 mt-0.5">{business.phone}</p></div>}
                  {business.website && <div><p className="text-[10px] text-white/25 uppercase tracking-wider">Website</p><p className="text-sm text-white/70 mt-0.5">{business.website}</p></div>}
                  {business.city && <div><p className="text-[10px] text-white/25 uppercase tracking-wider">Location</p><p className="text-sm text-white/70 mt-0.5">{[business.city, business.state].filter(Boolean).join(", ")}</p></div>}
                  {business.gstNumber && <div><p className="text-[10px] text-white/25 uppercase tracking-wider">GST / Tax ID</p><p className="text-sm text-white/70 mt-0.5">{business.gstNumber}</p></div>}
                  {business.registrationNumber && <div><p className="text-[10px] text-white/25 uppercase tracking-wider">Registration</p><p className="text-sm text-white/70 mt-0.5">{business.registrationNumber}</p></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Health score */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Business Health Score</h2>
                <p className="text-xs text-white/30 mt-0.5">Based on your setup completeness</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: scoreColor }}>{score}%</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: scoreColor }}>{scoreLabel}</p>
              </div>
            </div>
            <div className="h-1 bg-white/[0.04]">
              <div className="h-full transition-all duration-700" style={{ width: `${score}%`, background: scoreColor }} />
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Business Info", done: !!(business.industry && business.country), href: "#" },
                  { label: "Locations", done: false, href: "/dashboard/locations" },
                  { label: "Employees", done: false, href: "/dashboard/employees" },
                  { label: "Suppliers", done: false, href: "/dashboard/suppliers" },
                  { label: "Customers", done: false, href: "/dashboard/customers" },
                  { label: "Finance Config", done: false, href: "/dashboard/settings/finance" },
                  { label: "Tax Setup", done: false, href: "/dashboard/settings/tax" },
                  { label: "AI Settings", done: false, href: "/dashboard/settings/ai" },
                ].map((check) => (
                  <Link
                    key={check.label}
                    href={check.done ? "#" : check.href}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      check.done
                        ? "border-[#00D9C0]/15 bg-[#00D9C0]/5 cursor-default"
                        : "border-white/[0.05] hover:border-[#00D9C0]/25 hover:bg-[#00D9C0]/5 group"
                    }`}
                  >
                    {check.done
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9C0] shrink-0" />
                      : <AlertCircle className="w-3.5 h-3.5 text-white/20 shrink-0 group-hover:text-[#00D9C0]" />
                    }
                    <span className={`text-xs ${check.done ? "text-white/70" : "text-white/30 group-hover:text-white/60"}`}>
                      {check.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
            <Building2 className="w-6 h-6 text-white/20" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No business profile yet</h3>
          <p className="text-sm text-white/40 max-w-sm mb-6">Complete the onboarding wizard to set up your business.</p>
          <Link href="/onboarding" className="flex items-center gap-2 px-5 py-2.5 bg-[#00D9C0] text-[#0B0F1A] font-bold rounded-xl hover:bg-[#00c2ab] transition-all">
            Start Setup <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-[#0D1117] border border-white/[0.08] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-bold">Edit Business Profile</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            {[
              { label: "Business Name *", key: "name", placeholder: "Acme Corp" },
              { label: "Legal Entity Name", key: "legalName", placeholder: "Acme Corp LLC" },
              { label: "Website", key: "website", placeholder: "https://acme.com" },
              { label: "Phone", key: "phone", placeholder: "+1 555 000 0000" },
              { label: "Logo URL", key: "logoUrl", placeholder: "https://..." },
              { label: "Country", key: "country", placeholder: "United States" },
              { label: "Currency", key: "currency", placeholder: "USD" },
              { label: "Timezone", key: "timezone", placeholder: "America/New_York" },
              { label: "Address", key: "address", placeholder: "123 Main St" },
              { label: "City", key: "city", placeholder: "New York" },
              { label: "State", key: "state", placeholder: "NY" },
              { label: "Postal Code", key: "postalCode", placeholder: "10001" },
              { label: "GST / VAT Number", key: "gstNumber", placeholder: "GST..." },
              { label: "Registration No.", key: "registrationNumber", placeholder: "REG..." },
            ].map((field) => (
              <div key={field.key} className={field.key === "address" ? "col-span-2" : ""}>
                <label className="text-xs text-white/50 mb-1.5 block">{field.label}</label>
                <input
                  className={f("")}
                  placeholder={field.placeholder}
                  value={(form as any)[field.key] ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-xs text-white/50 mb-1.5 block">Industry</label>
              <select
                className={f("appearance-none")}
                value={form.industry ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
              >
                <option value="">Select industry...</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <DialogFooter>
            <button onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-lg bg-white/[0.05] text-white/60 text-sm hover:bg-white/[0.08] transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-[#00D9C0] text-[#0B0F1A] font-bold text-sm rounded-lg hover:bg-[#00c2ab] transition-colors disabled:opacity-60">
              {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</> : <><Save className="w-3.5 h-3.5" />Save</>}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
