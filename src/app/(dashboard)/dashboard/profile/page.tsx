import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Building2, MapPin, Users, Package, Truck, UserCheck,
  Banknote, Bot, ArrowRight, CheckCircle2, AlertCircle, Pencil
} from "lucide-react";

const DEMO_BUSINESS_ID = "demo-business-123";

async function getBusinessHealth() {
  try {
    const [business, locationCount, deptCount, employeeCount,
      supplierCount, customerCount, settings, aiSettings] = await Promise.all([
      prisma.business.findUnique({
        where: { id: DEMO_BUSINESS_ID },
        select: {
          name: true, legalName: true, industry: true, country: true,
          currency: true, phone: true, website: true, logoUrl: true,
          address: true, city: true, state: true,
          setupScore: true, onboardingComplete: true, onboardingStep: true,
        },
      }),
      prisma.businessLocation.count({ where: { businessId: DEMO_BUSINESS_ID, deletedAt: null } }),
      prisma.department.count({ where: { businessId: DEMO_BUSINESS_ID, deletedAt: null } }),
      prisma.employee.count({ where: { businessId: DEMO_BUSINESS_ID, deletedAt: null } }),
      prisma.supplier.count({ where: { businessId: DEMO_BUSINESS_ID, deletedAt: null } }),
      prisma.customer.count({ where: { businessId: DEMO_BUSINESS_ID, deletedAt: null } }),
      prisma.businessSettings.findUnique({ where: { businessId: DEMO_BUSINESS_ID } }),
      prisma.aISettings.findUnique({ where: { businessId: DEMO_BUSINESS_ID } }),
    ]);

    return {
      business,
      stats: { locationCount, deptCount, employeeCount, supplierCount, customerCount },
      settings,
      aiSettings,
    };
  } catch {
    return { business: null, stats: null, settings: null, aiSettings: null };
  }
}

const setupChecks = [
  { key: "business", label: "Business information", icon: Building2 },
  { key: "locations", label: "Locations added", icon: MapPin },
  { key: "departments", label: "Departments set up", icon: Users },
  { key: "employees", label: "Employees added", icon: UserCheck },
  { key: "suppliers", label: "Suppliers added", icon: Truck },
  { key: "customers", label: "Customers added", icon: Package },
  { key: "finance", label: "Finance configured", icon: Banknote },
  { key: "ai", label: "AI preferences set", icon: Bot },
];

export default async function BusinessProfilePage() {
  const { business, stats, settings, aiSettings } = await getBusinessHealth();

  const checks: Record<string, boolean> = {
    business: !!(business?.industry && business?.country),
    locations: (stats?.locationCount ?? 0) > 0,
    departments: (stats?.deptCount ?? 0) > 0,
    employees: (stats?.employeeCount ?? 0) > 0,
    suppliers: (stats?.supplierCount ?? 0) > 0,
    customers: (stats?.customerCount ?? 0) > 0,
    finance: !!settings,
    ai: !!aiSettings,
  };

  const score = business?.setupScore ?? 0;
  const completedChecks = Object.values(checks).filter(Boolean).length;

  const scoreColor = score >= 80 ? "#00D9C0" : score >= 50 ? "#F59E0B" : "#EF4444";
  const scoreLabel = score >= 80 ? "Healthy" : score >= 50 ? "In Progress" : "Needs Setup";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Business Profile</h1>
          <p className="text-white/40 text-sm mt-1">Manage your company information and configuration.</p>
        </div>
        <Link
          href="/onboarding"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00D9C0] hover:bg-[#00c2ab] text-[#0B0F1A] text-sm font-bold rounded-xl transition-all shadow-[0_8px_24px_rgba(0,217,192,0.25)]"
        >
          <Pencil className="w-4 h-4" />
          Edit via Onboarding
        </Link>
      </div>

      {business ? (
        <>
          {/* Business card */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-start gap-5">
              {/* Logo */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D9C0]/20 to-[#141B41]/50 border border-[#00D9C0]/20 flex items-center justify-center shrink-0 text-2xl font-bold text-[#00D9C0]">
                {business.logoUrl ? (
                  <img src={business.logoUrl} alt="logo" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  business.name?.charAt(0)?.toUpperCase() ?? "B"
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{business.name}</h2>
                {business.legalName && <p className="text-sm text-white/40">{business.legalName}</p>}
                <div className="flex flex-wrap gap-3 mt-3">
                  {business.industry && (
                    <span className="text-xs bg-white/[0.06] text-white/60 px-2.5 py-1 rounded-full">{business.industry}</span>
                  )}
                  {business.country && (
                    <span className="text-xs bg-white/[0.06] text-white/60 px-2.5 py-1 rounded-full">🌍 {business.country}</span>
                  )}
                  {business.currency && (
                    <span className="text-xs bg-white/[0.06] text-white/60 px-2.5 py-1 rounded-full">{business.currency}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/[0.06]">
                  {business.phone && (
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Phone</p>
                      <p className="text-sm text-white/70 mt-0.5">{business.phone}</p>
                    </div>
                  )}
                  {business.website && (
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Website</p>
                      <p className="text-sm text-white/70 mt-0.5">{business.website}</p>
                    </div>
                  )}
                  {(business.city || business.address) && (
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Address</p>
                      <p className="text-sm text-white/70 mt-0.5">{[business.city, business.state].filter(Boolean).join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Locations", value: stats?.locationCount ?? 0, icon: MapPin, color: "text-blue-400" },
              { label: "Departments", value: stats?.deptCount ?? 0, icon: Users, color: "text-violet-400" },
              { label: "Employees", value: stats?.employeeCount ?? 0, icon: UserCheck, color: "text-amber-400" },
              { label: "Suppliers", value: stats?.supplierCount ?? 0, icon: Truck, color: "text-emerald-400" },
              { label: "Customers", value: stats?.customerCount ?? 0, icon: Package, color: "text-pink-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/30 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Business Health */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Business Health Score</h2>
                <p className="text-xs text-white/30 mt-0.5">{completedChecks}/8 setup items complete</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: scoreColor }}>{score}%</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: scoreColor }}>{scoreLabel}</p>
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-white/[0.04]">
              <div
                className="h-full transition-all duration-700"
                style={{ width: `${score}%`, background: scoreColor }}
              />
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {setupChecks.map((check) => {
                const done = checks[check.key];
                return (
                  <div
                    key={check.key}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      done ? "border-[#00D9C0]/15 bg-[#00D9C0]/5" : "border-white/[0.05] bg-transparent"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      done ? "bg-[#00D9C0]/15" : "bg-white/[0.05]"
                    }`}>
                      <check.icon className={`w-3.5 h-3.5 ${done ? "text-[#00D9C0]" : "text-white/20"}`} />
                    </div>
                    <span className={`text-sm flex-1 ${done ? "text-white/80" : "text-white/30"}`}>{check.label}</span>
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00D9C0]" />
                    ) : (
                      <Link
                        href="/onboarding"
                        className="flex items-center gap-1 text-[10px] font-semibold text-[#00D9C0] hover:underline"
                      >
                        Setup <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Settings summary */}
          {settings && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-violet-400" /> Finance Settings
                </h3>
                <div className="space-y-2">
                  {[
                    ["Fiscal Year Start", settings.fiscalYearStart],
                    ["Accounting Method", settings.accountingMethod],
                    ["Invoice Prefix", settings.invoicePrefix],
                    ["Default Currency", settings.defaultCurrency],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-white/30">{k}</span>
                      <span className="text-white/70 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {aiSettings && (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#00D9C0]" /> AI Settings
                  </h3>
                  <div className="space-y-2">
                    {[
                      ["Autonomy Level", aiSettings.autonomyLevel],
                      ["Low Risk", aiSettings.riskLow],
                      ["Medium Risk", aiSettings.riskMedium],
                      ["High Risk", aiSettings.riskHigh],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-white/30">{k}</span>
                        <span className="text-white/70 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
            <Building2 className="w-7 h-7 text-white/20" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No business profile yet</h3>
          <p className="text-sm text-white/40 max-w-sm mb-6">
            Complete the onboarding wizard to set up your business and unlock all AI-BOS features.
          </p>
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00D9C0] text-[#0B0F1A] font-bold rounded-xl hover:bg-[#00c2ab] transition-all"
          >
            Start Business Setup <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
