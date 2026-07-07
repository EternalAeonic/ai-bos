"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Settings, Bot, Package, Banknote,
  Building2, Users, ShoppingCart, ChevronRight,
  LogOut, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Core",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Business Profile", href: "/dashboard/profile", icon: Building2 },
      { label: "Inventory", href: "/dashboard/inventory", icon: Package },
      { label: "Finance", href: "/dashboard/finance", icon: Banknote },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "AI CEO", href: "#", icon: Bot, soon: true },
      { label: "Customers", href: "#", icon: Users, soon: true },
      { label: "Purchases", href: "#", icon: ShoppingCart, soon: true },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen flex flex-col bg-[#0B0F1A] border-r border-white/[0.06] shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D9C0] to-[#141B41] flex items-center justify-center shadow-lg">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-tight">AI-BOS</p>
          <p className="text-[10px] text-white/40 font-medium">Business OS</p>
        </div>
      </div>

      <div className="h-px bg-white/[0.06] mx-5" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.href !== "#" && (
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)
                );
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
                      item.soon && "pointer-events-none opacity-40",
                      isActive
                        ? "bg-[#00D9C0]/10 text-[#00D9C0]"
                        : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#00D9C0]" : "")} />
                    <span className="flex-1">{item.label}</span>
                    {item.soon && (
                      <span className="text-[9px] font-bold bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full">
                        SOON
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3 h-3 text-[#00D9C0]/60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="h-px bg-white/[0.06] mx-5" />

      {/* Onboarding CTA */}
      <Link
        href="/onboarding"
        className="mx-3 my-3 p-3 rounded-xl bg-gradient-to-br from-[#00D9C0]/10 to-[#141B41]/50 border border-[#00D9C0]/20 hover:border-[#00D9C0]/40 transition-all group"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D9C0] animate-pulse" />
          <span className="text-[10px] font-semibold text-[#00D9C0]">Setup Wizard</span>
          <Sparkles className="w-3 h-3 text-[#00D9C0] ml-auto opacity-60 group-hover:opacity-100" />
        </div>
        <p className="text-[10px] text-white/40 leading-relaxed">Configure your AI business</p>
      </Link>

      {/* User footer */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D9C0] to-[#141B41] flex items-center justify-center text-white text-[10px] font-bold">
            D
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-semibold text-white/70">Demo User</p>
            <p className="text-[10px] text-white/30">Owner</p>
          </div>
          <Link href="/login">
            <LogOut className="w-3.5 h-3.5 text-white/20 hover:text-red-400 transition-colors" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
