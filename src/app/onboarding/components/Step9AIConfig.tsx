"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Bot, Bell, Shield, Sparkles } from "lucide-react";

export function Step9AIConfig() {
  const { data, updateData } = useOnboarding();

  const updateAI = (field: string, value: any) => {
    updateData({ aiConfig: { ...data.aiConfig, [field]: value } });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">AI Configuration</h2>
        <p className="text-white/60">Customize how your AI CEO operates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-medium text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#00D9C0]" /> Personality
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Assistant Name</label>
              <input
                type="text"
                value={data.aiConfig.assistantName}
                onChange={(e) => updateAI("assistantName", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 transition-all outline-none"
                placeholder="e.g. Ada"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Language</label>
              <select
                value={data.aiConfig.language}
                onChange={(e) => updateAI("language", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none [&>option]:bg-[#0B0F1A]"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-medium text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00D9C0]" /> Operations
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Approval Level</label>
              <select
                value={data.aiConfig.approvalLevel}
                onChange={(e) => updateAI("approvalLevel", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none [&>option]:bg-[#0B0F1A]"
              >
                <option value="MANUAL">Manual (Needs approval for everything)</option>
                <option value="BALANCED">Balanced (Auto for low risk tasks)</option>
                <option value="AUTONOMOUS">Autonomous (Acts independently)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#00D9C0]" /> Notification Email
              </label>
              <input
                type="email"
                value={data.aiConfig.notificationEmail}
                onChange={(e) => updateAI("notificationEmail", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] focus:ring-1 focus:ring-[#00D9C0] rounded-lg px-4 py-2.5 outline-none"
                placeholder="ceo@company.com"
              />
            </div>
            
            <label className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl cursor-pointer hover:bg-white/[0.04] transition-colors">
              <input
                type="checkbox"
                checked={data.aiConfig.autoSuggestions}
                onChange={(e) => updateAI("autoSuggestions", e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-transparent text-[#00D9C0] focus:ring-[#00D9C0] focus:ring-offset-0"
              />
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00D9C0]" /> Auto Suggestions
                </span>
                <span className="text-white/40 text-xs">Allow AI to suggest process improvements</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
