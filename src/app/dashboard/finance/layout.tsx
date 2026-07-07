"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Banknote, BookText, Landmark, PieChart } from "lucide-react";

const navItems = [
  { href: "/dashboard/finance", label: "Overview", icon: Banknote },
  { href: "/dashboard/finance/accounts", label: "Chart of Accounts", icon: Landmark },
  { href: "/dashboard/finance/journals", label: "Journal Entries", icon: BookText },
  { href: "/dashboard/finance/reports", label: "Reports", icon: PieChart },
];

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground">Manage your chart of accounts, journal entries, and financial reports.</p>
      </div>

      <div className="border-b">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                  "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors duration-150"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main>{children}</main>
    </div>
  );
}
