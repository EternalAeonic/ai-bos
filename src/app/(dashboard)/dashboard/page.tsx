"use client";

import { Bot, TrendingUp, Package, Banknote, ArrowUpRight, Activity, Zap, Users, Clock, CheckCircle2 } from "lucide-react";

const kpis = [
  {
    label: "Active Modules",
    value: "3",
    change: "+2 this sprint",
    up: true,
    icon: Zap,
    color: "from-[#00D9C0]/20 to-[#00D9C0]/5",
    iconColor: "text-[#00D9C0]",
    border: "border-[#00D9C0]/20",
  },
  {
    label: "Inventory Items",
    value: "—",
    change: "Connect inventory",
    up: null,
    icon: Package,
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    label: "Open Accounts",
    value: "—",
    change: "Connect finance",
    up: null,
    icon: Banknote,
    color: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
    border: "border-violet-500/20",
  },
  {
    label: "AI Actions Today",
    value: "0",
    change: "AI CEO coming soon",
    up: null,
    icon: Bot,
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
    border: "border-amber-500/20",
  },
];

const milestones = [
  { name: "Foundation & Infrastructure", tag: "Sprint 1–3", status: "done", desc: "Auth, multi-tenant RLS, audit logging, soft delete" },
  { name: "Inventory Intelligence", tag: "Sprint 2", status: "done", desc: "Stock tracking, warehouses, movements, low-stock alerts" },
  { name: "Finance Module", tag: "Sprint 3", status: "done", desc: "Double-entry accounting, journal entries, trial balance" },
  { name: "Onboarding Wizard", tag: "Sprint 4", status: "active", desc: "15-step AI business configuration wizard" },
  { name: "AI CEO Engine", tag: "Sprint 5", status: "upcoming", desc: "Autonomous business operations & decision making" },
  { name: "Purchase Automation", tag: "Sprint 6", status: "upcoming", desc: "Supplier orders, PO management, auto-reorder" },
];

const activity = [
  { action: "Finance module deployed", time: "Just now", icon: Banknote, color: "bg-violet-500/10 text-violet-400" },
  { action: "Onboarding wizard built", time: "2 min ago", icon: CheckCircle2, color: "bg-[#00D9C0]/10 text-[#00D9C0]" },
  { action: "Build errors fixed", time: "5 min ago", icon: Zap, color: "bg-amber-500/10 text-amber-400" },
  { action: "Demo login enabled", time: "30 min ago", icon: Users, color: "bg-blue-500/10 text-blue-400" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Hero Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D9C0] animate-pulse" />
            <span className="text-xs font-semibold text-[#00D9C0] uppercase tracking-wider">AI-BOS Live</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Good evening, <span className="text-[#00D9C0]">Demo</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Your AI Business Operating System is active and monitoring.</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#00D9C0] hover:bg-[#00c2ab] text-[#0B0F1A] text-sm font-bold rounded-xl transition-all shadow-[0_8px_24px_rgba(0,217,192,0.25)] hover:shadow-[0_8px_32px_rgba(0,217,192,0.4)]">
          <Bot className="w-4 h-4" />
          Ask AI CEO
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`relative overflow-hidden rounded-2xl border ${kpi.border} bg-gradient-to-br ${kpi.color} p-5 group hover:scale-[1.01] transition-all duration-200`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{kpi.label}</p>
              <div className={`w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center ${kpi.iconColor}`}>
                <kpi.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{kpi.value}</p>
            <p className="text-xs text-white/30">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Milestone tracker */}
        <div className="col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-bold text-white">Build Roadmap</h2>
              <p className="text-xs text-white/30 mt-0.5">Sprint progress tracker</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="w-2 h-2 rounded-full bg-[#00D9C0]" />3 / 6 complete
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-6 pt-4">
            <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-[#00D9C0] to-[#00D9C0]/50 rounded-full" />
            </div>
          </div>

          <div className="p-6 space-y-3">
            {milestones.map((m) => (
              <div
                key={m.name}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  m.status === "active"
                    ? "bg-[#00D9C0]/5 border-[#00D9C0]/20"
                    : m.status === "done"
                    ? "bg-white/[0.02] border-transparent"
                    : "bg-transparent border-transparent opacity-50"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  m.status === "done"
                    ? "bg-[#00D9C0] border-[#00D9C0]"
                    : m.status === "active"
                    ? "border-[#00D9C0] bg-[#00D9C0]/20"
                    : "border-white/10 bg-transparent"
                }`}>
                  {m.status === "done" && (
                    <svg className="w-2.5 h-2.5 text-[#0B0F1A]" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {m.status === "active" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00D9C0] animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{m.name}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      m.status === "active" ? "bg-[#00D9C0]/20 text-[#00D9C0]" :
                      m.status === "done" ? "bg-white/10 text-white/40" :
                      "bg-white/5 text-white/20"
                    }`}>{m.tag}</span>
                  </div>
                  <p className="text-xs text-white/30 mt-0.5">{m.desc}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${
                  m.status === "done" ? "text-[#00D9C0] bg-[#00D9C0]/10" :
                  m.status === "active" ? "text-amber-400 bg-amber-500/10" :
                  "text-white/20 bg-white/[0.03]"
                }`}>
                  {m.status === "done" ? "Done" : m.status === "active" ? "Active" : "Planned"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-bold text-white">Recent Activity</h2>
            <p className="text-xs text-white/30 mt-0.5">Latest system events</p>
          </div>
          <div className="p-5 space-y-4">
            {activity.map((a) => (
              <div key={a.action} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
                  <a.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/70 leading-snug">{a.action}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insight Card */}
          <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-[#00D9C0]/10 to-[#141B41]/30 border border-[#00D9C0]/20">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-3.5 h-3.5 text-[#00D9C0]" />
              <span className="text-[10px] font-bold text-[#00D9C0] uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Complete the onboarding wizard to unlock full AI CEO capabilities.
            </p>
            <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold text-[#00D9C0] bg-[#00D9C0]/10 hover:bg-[#00D9C0]/20 rounded-lg transition-colors">
              Start Onboarding <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
