import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your workspace configuration.
        </p>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Business Profile</CardTitle>
          <CardDescription>Available in a future update.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Business profile management will be configured during Milestone 1 completion.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
