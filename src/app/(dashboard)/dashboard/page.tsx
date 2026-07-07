import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Bot, Zap, Package, Banknote, Clock, CheckCircle2, ArrowUpRight, MapPin, Users, Truck } from "lucide-react";

const DEMO_BUSINESS_ID = "demo-business-123";

async function getDashboardData() {
  try {
    const [business, locationCount, deptCount, employeeCount,
      supplierCount, customerCount, settings, aiSettings] = await Promise.all([
      prisma.business.findUnique({
        where: { id: DEMO_BUSINESS_ID },
        select: {
          name: true, industry: true, country: true,
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

    return { business, locationCount, deptCount, employeeCount, supplierCount, customerCount, settings, aiSettings };
  } catch {
    return {
      business: null, locationCount: 0, deptCount: 0, employeeCount: 0,
      supplierCount: 0, customerCount: 0, settings: null, aiSettings: null
    };
  }
}

const milestones = [
  { name: "Foundation & Infrastructure", tag: "Sprint 1–3", status: "done", desc: "Auth, multi-tenant RLS, audit logging, soft delete" },
  { name: "Inventory Intelligence", tag: "Sprint 2", status: "done", desc: "Stock tracking, warehouses, movements, low-stock alerts" },
  { name: "Finance Module", tag: "Sprint 3", status: "done", desc: "Double-entry accounting, journal entries, trial balance" },
  { name: "Business Foundation", tag: "Sprint 4", status: "active", desc: "Onboarding wizard, business profile, org setup" },
  { name: "AI CEO Engine", tag: "Sprint 5", status: "upcoming", desc: "Autonomous business operations & decision making" },
  { name: "Purchase Automation", tag: "Sprint 6", status: "upcoming", desc: "Supplier orders, PO management, auto-reorder" },
];

const setupChecks = [
  { key: "info", label: "Business information", href: "/onboarding" },
  { key: "locations", label: "Add locations", href: "/onboarding" },
  { key: "employees", label: "Add employees", href: "/onboarding" },
  { key: "suppliers", label: "Add suppliers", href: "/onboarding" },
  { key: "customers", label: "Add customers", href: "/onboarding" },
  { key: "finance", label: "Configure finance", href: "/onboarding" },
];

export default async function DashboardPage() {
  const { business, locationCount, deptCount, employeeCount, supplierCount, customerCount, settings, aiSettings } =
    await getDashboardData();

  const score = business?.setupScore ?? 0;
  const scoreColor = score >= 80 ? "#00D9C0" : score >= 50 ? "#F59E0B" : "#EF4444";

  const checks: Record<string, boolean> = {
    info: !!(business?.industry && business?.country),
    locations: locationCount > 0,
    employees: employeeCount > 0,
    suppliers: supplierCount > 0,
    customers: customerCount > 0,
    finance: !!settings,
  };
  const missingItems = setupChecks.filter((c) => !checks[c.key]);

  const kpis = [
    { label: "Active Modules", value: "3", sub: "+2 this sprint", icon: Zap, color: "from-[#00D9C0]/20 to-[#00D9C0]/5", border: "border-[#00D9C0]/20", iconColor: "text-[#00D9C0]" },
    { label: "Employees", value: String(employeeCount || "—"), sub: employeeCount ? "Team members" : "Add via onboarding", icon: Users, color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20", iconColor: "text-blue-400" },
    { label: "Suppliers", value: String(supplierCount || "—"), sub: supplierCount ? "Active suppliers" : "Add via onboarding", icon: Truck, color: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/20", iconColor: "text-violet-400" },
    { label: "AI CEO", value: aiSettings?.autonomyLevel ?? "—", sub: aiSettings ? "Configured" : "Setup needed", icon: Bot, color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20", iconColor: "text-amber-400" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Hero */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D9C0] animate-pulse" />
            <span className="text-xs font-semibold text-[#00D9C0] uppercase tracking-wider">AI-BOS Live</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {business?.name ? (
              <><span className="text-[#00D9C0]">{business.name}</span> — Dashboard</>
            ) : (
              <>Good morning, <span className="text-[#00D9C0]">Demo</span></>
            )}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {business?.industry && business?.country
              ? `${business.industry} · ${business.country}`
              : "Complete onboarding to personalize your dashboard."}
          </p>
        </div>
        <Link
          href="/onboarding"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00D9C0] hover:bg-[#00c2ab] text-[#0B0F1A] text-sm font-bold rounded-xl transition-all shadow-[0_8px_24px_rgba(0,217,192,0.25)] hover:shadow-[0_8px_32px_rgba(0,217,192,0.4)]"
        >
          <Bot className="w-4 h-4" />
          {business?.onboardingComplete ? "Edit Setup" : "Complete Setup"}
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`relative overflow-hidden rounded-2xl border ${kpi.border} bg-gradient-to-br ${kpi.color} p-5 hover:scale-[1.01] transition-all duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{kpi.label}</p>
              <div className={`w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center ${kpi.iconColor}`}>
                <kpi.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{kpi.value}</p>
            <p className="text-xs text-white/30">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Health Score + Roadmap */}
        <div className="col-span-2 space-y-6">

          {/* Business Health Score */}
          {score > 0 || missingItems.length > 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">Business Health</h2>
                  <p className="text-xs text-white/30 mt-0.5">Setup completion progress</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: scoreColor }}>{score}%</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: scoreColor }}>
                    {score >= 80 ? "Healthy" : score >= 50 ? "In Progress" : "Needs Setup"}
                  </p>
                </div>
              </div>
              <div className="h-1 w-full bg-white/[0.04]">
                <div className="h-full transition-all duration-700 rounded-full" style={{ width: `${score}%`, background: scoreColor }} />
              </div>
              {missingItems.length > 0 && (
                <div className="px-6 py-4">
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Missing Setup</p>
                  <div className="grid grid-cols-2 gap-2">
                    {missingItems.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] hover:border-[#00D9C0]/30 hover:bg-[#00D9C0]/5 transition-all group"
                      >
                        <span className="text-xs text-white/50 group-hover:text-white/80">{item.label}</span>
                        <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-[#00D9C0]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Roadmap */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-sm font-bold text-white">Build Roadmap</h2>
                <p className="text-xs text-white/30 mt-0.5">Sprint progress tracker</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="w-2 h-2 rounded-full bg-[#00D9C0]" />3 / 6 complete
              </div>
            </div>
            <div className="px-6 pt-4">
              <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-[#00D9C0] to-[#00D9C0]/50 rounded-full" />
              </div>
            </div>
            <div className="p-6 space-y-3">
              {milestones.map((m) => (
                <div key={m.name} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${m.status === "active" ? "bg-[#00D9C0]/5 border-[#00D9C0]/20" : m.status === "done" ? "bg-white/[0.02] border-transparent" : "bg-transparent border-transparent opacity-50"}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${m.status === "done" ? "bg-[#00D9C0] border-[#00D9C0]" : m.status === "active" ? "border-[#00D9C0] bg-[#00D9C0]/20" : "border-white/10"}`}>
                    {m.status === "done" && <svg className="w-2.5 h-2.5 text-[#0B0F1A]" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    {m.status === "active" && <div className="w-1.5 h-1.5 rounded-full bg-[#00D9C0] animate-pulse" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{m.name}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${m.status === "active" ? "bg-[#00D9C0]/20 text-[#00D9C0]" : m.status === "done" ? "bg-white/10 text-white/40" : "bg-white/5 text-white/20"}`}>{m.tag}</span>
                    </div>
                    <p className="text-xs text-white/30 mt-0.5">{m.desc}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${m.status === "done" ? "text-[#00D9C0] bg-[#00D9C0]/10" : m.status === "active" ? "text-amber-400 bg-amber-500/10" : "text-white/20 bg-white/[0.03]"}`}>
                    {m.status === "done" ? "Done" : m.status === "active" ? "Active" : "Planned"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Activity + AI */}
        <div className="space-y-4">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Business Snapshot</h2>
            <div className="space-y-3">
              {[
                { label: "Business Name", value: business?.name || "—", icon: Bot },
                { label: "Industry", value: business?.industry || "—", icon: Zap },
                { label: "Country", value: business?.country || "—", icon: MapPin },
                { label: "Today's Date", value: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), icon: Clock },
                { label: "Setup Completion", value: `${score}%`, icon: CheckCircle2 },
                { label: "Business Health", value: score >= 80 ? "Healthy" : score >= 50 ? "In Progress" : "Needs Setup", icon: Users },
                { label: "Next Step", value: business?.onboardingComplete ? "Operate Business" : "Complete Wizard", icon: ArrowUpRight },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-white/40">
                    <s.icon className="w-3.5 h-3.5" />
                    {s.label}
                  </div>
                  <span className={`font-bold ${s.value && s.value !== "—" ? "text-white" : "text-white/20"}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-br from-[#00D9C0]/10 to-[#141B41]/30 border border-[#00D9C0]/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-[#00D9C0]" />
              <span className="text-xs font-bold text-[#00D9C0] uppercase tracking-wider">AI Insight</span>
            </div>
            {business?.onboardingComplete ? (
              <p className="text-xs text-white/50 leading-relaxed">
                Business profile complete. AI CEO will activate once Purchase Automation is configured in Sprint 5.
              </p>
            ) : (
              <p className="text-xs text-white/50 leading-relaxed">
                Your business setup is {score}% complete. Add {missingItems.length} more items to unlock full AI CEO capabilities.
              </p>
            )}
            <Link
              href={business?.onboardingComplete ? "/dashboard/profile" : "/onboarding"}
              className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold text-[#00D9C0] bg-[#00D9C0]/10 hover:bg-[#00D9C0]/20 rounded-lg transition-colors"
            >
              {business?.onboardingComplete ? "View Profile" : "Complete Setup"} <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Activity */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-bold text-white">Recent Activity</h2>
            </div>
            <div className="p-5 space-y-3">
              {[
                { text: "Business Foundation sprint started", time: "Now" },
                { text: "Finance module deployed", time: "1h ago" },
                { text: "Onboarding wizard built", time: "2h ago" },
                { text: "Demo login enabled", time: "3h ago" },
              ].map((a) => (
                <div key={a.text} className="flex items-start gap-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9C0] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/60 leading-snug">{a.text}</p>
                    <p className="text-[10px] text-white/25 mt-0.5 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />{a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
