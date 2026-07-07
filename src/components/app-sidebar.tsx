"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Building2,
  LogOut,
  ChevronRight,
  Bot,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const comingSoon = [
  { label: "AI CEO", icon: Bot },
  { label: "Business Profile", icon: Building2 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <Sidebar variant="inset" className="border-sidebar-border">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15 border border-primary/25">
            <span className="text-primary font-bold text-xs">AI</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground leading-tight">AI-BOS</p>
            <p className="text-xs text-muted-foreground leading-tight">Business OS</p>
          </div>
        </div>
      </SidebarHeader>

      <Separator className="bg-sidebar-border" />

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider px-2 mb-1">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    className={cn(
                      "w-full justify-start gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3 w-full">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                      {isActive && <ChevronRight className="ml-auto h-3 w-3 opacity-60" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider px-2 mb-1">
            Coming Soon
          </SidebarGroupLabel>
          <SidebarMenu>
            {comingSoon.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  disabled
                  className="w-full justify-start gap-3 px-3 py-2 rounded-lg text-sm opacity-40 cursor-not-allowed"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                  <span className="ml-auto text-[10px] font-medium text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 py-3">
        <Separator className="bg-sidebar-border mb-3" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="w-full justify-start gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
