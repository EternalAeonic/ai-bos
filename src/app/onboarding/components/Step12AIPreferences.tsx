"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function Step12AIPreferences() {
  const { data, updateData } = useOnboarding();
  const ai = data.aiPreferences;

  const updateAI = (field: string, value: any) => {
    updateData({ aiPreferences: { ...ai, [field]: value } });
  };

  return (
    <div className="space-y-10 relative">
      {/* Dark mode overlay effect for this specific step to emphasize AI */}
      <div className="absolute -inset-10 bg-[#0B0F24] -z-10 rounded-[3rem] shadow-2xl overflow-hidden">
        {/* Subtle animated particles */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#00D9C0 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00D9C0] rounded-full blur-[100px] opacity-[0.03]" />
      </div>

      <div className="text-white pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00D9C0]/10 border border-[#00D9C0]/20 rounded-full text-[#00D9C0] text-xs font-semibold mb-4">
          <Sparkles className="w-3 h-3" /> Core AI Engine
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Train your AI CEO</h2>
        <p className="text-slate-400">Configure how much autonomy your AI should have when running the business.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8 backdrop-blur-md text-white">
        
        <div className="space-y-4">
          <Label className="text-slate-300">How autonomous should AI be?</Label>
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-2 px-2">
            <span className={ai.autonomy === "Manual" ? "text-white" : ""}>Manual</span>
            <span className={ai.autonomy === "Balanced" ? "text-white" : ""}>Balanced</span>
            <span className={ai.autonomy === "Autonomous" ? "text-[#00D9C0]" : ""}>Autonomous</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="3" 
            value={ai.autonomy === "Manual" ? 1 : ai.autonomy === "Balanced" ? 2 : 3}
            onChange={e => {
              const val = e.target.value;
              updateAI("autonomy", val === "1" ? "Manual" : val === "2" ? "Balanced" : "Autonomous");
            }}
            className="w-full accent-[#00D9C0] h-2 bg-white/10 rounded-full appearance-none cursor-pointer outline-none"
          />
          <p className="text-xs text-slate-400">
            {ai.autonomy === "Manual" && "AI will draft suggestions but execute nothing without your explicit approval."}
            {ai.autonomy === "Balanced" && "AI will execute routine tasks automatically but ask for approval on high-impact decisions."}
            {ai.autonomy === "Autonomous" && "AI will run maximum operations automatically. It will only notify you after the fact."}
          </p>
        </div>

        <div className="h-px bg-white/10" />

        <div className="space-y-4">
          <Label className="text-slate-300">Approval Threshold</Label>
          <div className="grid grid-cols-3 gap-4">
            {["Always Ask", "Only High Risk", "Auto Approve Low Risk"].map(threshold => (
              <button
                key={threshold}
                onClick={() => updateAI("approvalThreshold", threshold)}
                className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                  ai.approvalThreshold === threshold
                    ? "bg-[#00D9C0]/10 border-[#00D9C0] text-[#00D9C0]"
                    : "bg-white/5 border-transparent text-slate-400 hover:border-white/20"
                }`}
              >
                {threshold}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10" />

        <div className="space-y-4">
          <Label className="text-slate-300">Notification Channels</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm">Email</span>
              <Switch checked={ai.notifyEmail !== false} onCheckedChange={v => updateAI("notifyEmail", v)} className="data-[state=checked]:bg-[#00D9C0]" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm">Slack</span>
              <Switch checked={ai.notifySlack} onCheckedChange={v => updateAI("notifySlack", v)} className="data-[state=checked]:bg-[#00D9C0]" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm">WhatsApp</span>
              <Switch checked={ai.notifyWhatsApp} onCheckedChange={v => updateAI("notifyWhatsApp", v)} className="data-[state=checked]:bg-[#00D9C0]" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm">SMS</span>
              <Switch checked={ai.notifySms} onCheckedChange={v => updateAI("notifySms", v)} className="data-[state=checked]:bg-[#00D9C0]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
