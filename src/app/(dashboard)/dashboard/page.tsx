import { Bot, LayoutDashboard, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Users",
    value: "—",
    description: "Registered accounts",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    title: "AI Actions",
    value: "—",
    description: "Completed this month",
    icon: Bot,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    title: "Revenue",
    value: "—",
    description: "Available in Milestone 4",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    title: "Modules",
    value: "1 / 5",
    description: "Milestones complete",
    icon: LayoutDashboard,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome to AI-BOS — your AI-native Business Operating System.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-colors duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Milestone roadmap */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Product Milestones</CardTitle>
          <CardDescription>Track your AI-BOS build progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { milestone: "Milestone 1", name: "Foundation", status: "active" },
              { milestone: "Milestone 2", name: "AI CEO", status: "upcoming" },
              { milestone: "Milestone 3", name: "Inventory Intelligence", status: "upcoming" },
              { milestone: "Milestone 4", name: "Finance Intelligence", status: "upcoming" },
              { milestone: "Milestone 5", name: "Purchase Automation", status: "upcoming" },
            ].map((m) => (
              <div
                key={m.milestone}
                className="flex items-center gap-4 p-3 rounded-lg border border-border/30 bg-background/30"
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    m.status === "active" ? "bg-primary shadow-[0_0_8px] shadow-primary/60" : "bg-muted-foreground/30"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.milestone}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                    m.status === "active"
                      ? "text-primary border-primary/30 bg-primary/10"
                      : "text-muted-foreground border-border/30 bg-muted/20"
                  }`}
                >
                  {m.status === "active" ? "In Progress" : "Planned"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
