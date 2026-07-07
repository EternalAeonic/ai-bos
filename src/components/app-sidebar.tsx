"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Settings, Bot, Package, Banknote,
  Building2, Users, ShoppingCart, ChevronRight, Truck,
  LogOut, Sparkles, MapPin, UserCheck, Receipt, Brain,
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
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Business Profile", href: "/dashboard/profile", icon: Building2 },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Inventory", href: "/dashboard/inventory", icon: Package },
      { label: "Finance", href: "/dashboard/finance", icon: Banknote },
      { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
      { label: "Customers", href: "/dashboard/customers", icon: UserCheck },
    ],
  },
  {
    label: "Organization",
    items: [
      { label: "Employees", href: "/dashboard/employees", icon: Users },
      { label: "Roles", href: "/dashboard/roles", icon: Receipt },
      { label: "Locations", href: "/dashboard/locations", icon: MapPin },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "AI CEO", href: "#", icon: Bot, soon: true },
      { label: "Purchases", href: "#", icon: ShoppingCart, soon: true },
    ],
  },
  {
    label: "Configuration",
    items: [
      { label: "Finance Setup", href: "/dashboard/settings/finance", icon: Banknote },
      { label: "Tax Config", href: "/dashboard/settings/tax", icon: Receipt },
      { label: "AI Settings", href: "/dashboard/settings/ai", icon: Brain },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-[220px] h-screen flex flex-col bg-[#0B0F1A] border-r border-white/[0.06] shrink-0">
      {/* Brand */}
      <div className="px-4 py-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00D9C0] to-[#141B41] flex items-center justify-center shadow-lg shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-tight">AI-BOS</p>
          <p className="text-[10px] text-white/40 font-medium">Business OS</p>
        </div>
      </div>

      <div className="h-px bg-white/[0.06] mx-4" />

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                      item.soon && "pointer-events-none opacity-35",
                      active
                        ? "bg-[#00D9C0]/10 text-[#00D9C0]"
                        : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
                    )}
                  >
                    <item.icon className={cn("w-3.5 h-3.5 shrink-0", active ? "text-[#00D9C0]" : "")} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.soon && (
                      <span className="text-[8px] font-bold bg-white/[0.08] text-white/30 px-1 py-0.5 rounded">
                        SOON
                      </span>
                    )}
                    {active && <ChevronRight className="w-2.5 h-2.5 text-[#00D9C0]/50 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="h-px bg-white/[0.06] mx-4" />

      {/* Onboarding CTA */}
      <Link
        href="/onboarding"
        className="mx-3 my-3 p-3 rounded-xl bg-gradient-to-br from-[#00D9C0]/8 to-transparent border border-[#00D9C0]/15 hover:border-[#00D9C0]/35 transition-all group"
      >
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D9C0] animate-pulse" />
          <span className="text-[10px] font-semibold text-[#00D9C0]">Setup Wizard</span>
          <Sparkles className="w-2.5 h-2.5 text-[#00D9C0] ml-auto opacity-50 group-hover:opacity-100" />
        </div>
        <p className="text-[9px] text-white/30 leading-snug">Configure your AI business</p>
      </Link>

      {/* User footer */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00D9C0] to-[#141B41] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
            D
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[11px] font-semibold text-white/60 truncate">Demo User</p>
            <p className="text-[9px] text-white/25">Owner · Demo Mode</p>
          </div>
          <Link href="/login" title="Sign out">
            <LogOut className="w-3 h-3 text-white/20 hover:text-red-400 transition-colors" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
