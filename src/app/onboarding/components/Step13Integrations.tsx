"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Check } from "lucide-react";

// Mock logos as colored boxes for now to avoid external image dependencies
const apps = [
  { id: "google", name: "Google Workspace", color: "bg-blue-500", desc: "Sync emails and calendar" },
  { id: "microsoft", name: "Microsoft 365", color: "bg-blue-600", desc: "Sync outlook and teams" },
  { id: "slack", name: "Slack", color: "bg-purple-600", desc: "Team notifications" },
  { id: "stripe", name: "Stripe", color: "bg-indigo-500", desc: "Payment processing" },
  { id: "shopify", name: "Shopify", color: "bg-green-500", desc: "E-commerce sync" },
  { id: "quickbooks", name: "QuickBooks", color: "bg-green-600", desc: "Accounting sync" },
];

export function Step13Integrations() {
  const { data, updateData } = useOnboarding();

  const toggleApp = (appId: string) => {
    if (data.integrations.includes(appId)) {
      updateData({ integrations: data.integrations.filter(id => id !== appId) });
    } else {
      updateData({ integrations: [...data.integrations, appId] });
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Connect your toolstack</h2>
        <p className="text-[#8A8F98]">AI-BOS can orchestrate actions across all your existing apps.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {apps.map((app) => {
          const isConnected = data.integrations.includes(app.id);
          
          return (
            <div 
              key={app.id} 
              onClick={() => toggleApp(app.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                isConnected 
                  ? "border-[#00D9C0] bg-[#00D9C0]/5 shadow-sm" 
                  : "border-[#EAEAEA] bg-white hover:border-[#141B41]"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isConnected ? app.color : "bg-[#F7F8F9] grayscale opacity-60"} transition-all`}>
                <span className="text-white font-bold text-xs">{app.name.substring(0, 2).toUpperCase()}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-[#141B41]">{app.name}</h3>
                <p className="text-xs text-[#8A8F98]">{app.desc}</p>
              </div>

              <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                isConnected ? "bg-[#00D9C0] border-[#00D9C0]" : "border-[#EAEAEA]"
              }`}>
                {isConnected && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
