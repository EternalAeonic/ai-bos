'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Brain, Save, Zap, Scale, Hand, Bell, Clock } from 'lucide-react';
import {
  getAISettingsAction,
  updateAISettingsAction,
} from '@/app/actions/ai-settings';

type RiskAction = 'AUTO' | 'NOTIFY' | 'APPROVE' | 'OWNER' | 'OWNER_MANAGER';
type AutonomyLevel = 'MANUAL' | 'BALANCED' | 'AUTONOMOUS';

type AISettings = {
  autonomyLevel: AutonomyLevel;
  riskLow: RiskAction;
  riskMedium: RiskAction;
  riskHigh: RiskAction;
  riskCritical: RiskAction;
  notifyEmail: boolean;
  notifySlack: boolean;
  notifyWhatsApp: boolean;
  notifySms: boolean;
  dailyBriefTime: string;
  weeklyReport: boolean;
  monthlyReport: boolean;
  workStart: string;
  workEnd: string;
};

const defaultSettings: AISettings = {
  autonomyLevel: 'BALANCED',
  riskLow: 'AUTO',
  riskMedium: 'NOTIFY',
  riskHigh: 'APPROVE',
  riskCritical: 'OWNER',
  notifyEmail: true,
  notifySlack: false,
  notifyWhatsApp: false,
  notifySms: false,
  dailyBriefTime: '09:00',
  weeklyReport: true,
  monthlyReport: true,
  workStart: '09:00',
  workEnd: '18:00',
};

const autonomyOptions: { value: AutonomyLevel; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'MANUAL', label: 'Manual', description: 'AI suggests, you approve every action', icon: <Hand size={20} /> },
  { value: 'BALANCED', label: 'Balanced', description: 'AI handles routine tasks, escalates important ones', icon: <Scale size={20} /> },
  { value: 'AUTONOMOUS', label: 'Autonomous', description: 'AI acts independently within defined risk parameters', icon: <Zap size={20} /> },
];

const riskRows: { level: string; key: keyof AISettings; options: RiskAction[] }[] = [
  { level: 'Low', key: 'riskLow', options: ['AUTO', 'NOTIFY', 'APPROVE'] },
  { level: 'Medium', key: 'riskMedium', options: ['AUTO', 'NOTIFY', 'APPROVE', 'OWNER'] },
  { level: 'High', key: 'riskHigh', options: ['NOTIFY', 'APPROVE', 'OWNER', 'OWNER_MANAGER'] },
  { level: 'Critical', key: 'riskCritical', options: ['OWNER', 'OWNER_MANAGER'] },
];

const riskLevelColor: Record<string, string> = {
  Low: 'text-emerald-400',
  Medium: 'text-amber-400',
  High: 'text-orange-400',
  Critical: 'text-red-400',
};

const riskDotColor: Record<string, string> = {
  Low: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  High: 'bg-orange-400',
  Critical: 'bg-red-400',
};

export default function AISettingsPage() {
  const [settings, setSettings] = useState<AISettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAISettingsAction();
        if (res.success && res.data) {
          setSettings({ ...defaultSettings, ...(res.data as any) });
        } else if (!res.success) {
          toast.error(res.error ?? 'Failed to load AI settings');
        }
      } catch {
        toast.error('Failed to load AI settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateAISettingsAction(settings);
      if (res.success) toast.success('AI settings saved');
      else toast.error(res.error ?? 'Save failed');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof AISettings>(key: K, value: AISettings[K]) => {
    setSettings(s => ({ ...s, [key]: value }));
  };

  const inputCls = 'bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] rounded-lg px-3 py-2 outline-none transition-colors';
  const labelCls = 'text-white/60 text-xs mb-1 block';
  const sectionCls = 'bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5';

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse bg-white/[0.04] rounded-xl h-10 w-48" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white/[0.04] rounded-xl h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain size={22} className="text-[#00D9C0]" /> AI Settings
          </h1>
          <p className="text-white/40 text-sm mt-1">Configure how the AI agent behaves and communicates</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-4 py-2 rounded-lg hover:bg-[#00c2ab] transition-colors flex items-center gap-2">
          <Save size={15} /> {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      {/* Section 1: Autonomy Level */}
      <div className={sectionCls}>
        <h2 className="text-white font-semibold">Autonomy Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {autonomyOptions.map(opt => {
            const active = settings.autonomyLevel === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => set('autonomyLevel', opt.value)}
                className={`flex flex-col gap-2 p-4 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-[#00D9C0]/10 border-[#00D9C0]/40 text-white'
                    : 'bg-white/[0.02] border-white/[0.06] text-white/60 hover:bg-white/[0.04]'
                }`}
              >
                <div className={active ? 'text-[#00D9C0]' : 'text-white/40'}>{opt.icon}</div>
                <p className={`font-semibold text-sm ${active ? 'text-white' : 'text-white/70'}`}>{opt.label}</p>
                <p className="text-xs text-white/40 leading-relaxed">{opt.description}</p>
                {active && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#00D9C0]" />
                    <span className="text-[#00D9C0] text-xs font-medium">Active</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Risk Matrix */}
      <div className={sectionCls}>
        <h2 className="text-white font-semibold">Risk Action Matrix</h2>
        <p className="text-white/40 text-xs">Define how the AI handles decisions at each risk level</p>
        <div className="space-y-3">
          {riskRows.map(({ level, key, options }) => (
            <div key={key} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-24 shrink-0">
                <div className={`w-2 h-2 rounded-full ${riskDotColor[level]}`} />
                <span className={`text-sm font-medium ${riskLevelColor[level]}`}>{level}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {options.map(opt => {
                  const active = settings[key] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => set(key, opt as AISettings[typeof key])}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                        active
                          ? 'bg-[#00D9C0]/15 border-[#00D9C0]/40 text-[#00D9C0]'
                          : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white/70'
                      }`}
                    >
                      {opt.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Notifications */}
      <div className={sectionCls}>
        <h2 className="text-white font-semibold flex items-center gap-2"><Bell size={16} className="text-[#00D9C0]" /> Notifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'notifyEmail', label: 'Email' },
            { key: 'notifySlack', label: 'Slack' },
            { key: 'notifyWhatsApp', label: 'WhatsApp' },
            { key: 'notifySms', label: 'SMS' },
          ].map(({ key, label }) => (
            <label key={key} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
              settings[key as keyof AISettings]
                ? 'bg-[#00D9C0]/10 border-[#00D9C0]/30'
                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
            }`}>
              <input
                type="checkbox"
                checked={!!settings[key as keyof AISettings]}
                onChange={e => set(key as keyof AISettings, e.target.checked as AISettings[keyof AISettings])}
                className="accent-[#00D9C0] w-4 h-4"
              />
              <span className="text-white/70 text-sm">{label}</span>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className={labelCls}>Daily Brief Time</label>
            <input type="time" className={`${inputCls} w-full`} value={settings.dailyBriefTime} onChange={e => set('dailyBriefTime', e.target.value)} />
          </div>
          <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all self-end ${
            settings.weeklyReport ? 'bg-[#00D9C0]/10 border-[#00D9C0]/30' : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
          }`}>
            <input type="checkbox" checked={settings.weeklyReport} onChange={e => set('weeklyReport', e.target.checked)} className="accent-[#00D9C0] w-4 h-4" />
            <span className="text-white/70 text-sm">Weekly Report</span>
          </label>
          <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all self-end ${
            settings.monthlyReport ? 'bg-[#00D9C0]/10 border-[#00D9C0]/30' : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
          }`}>
            <input type="checkbox" checked={settings.monthlyReport} onChange={e => set('monthlyReport', e.target.checked)} className="accent-[#00D9C0] w-4 h-4" />
            <span className="text-white/70 text-sm">Monthly Report</span>
          </label>
        </div>
      </div>

      {/* Section 4: Work Hours */}
      <div className={sectionCls}>
        <h2 className="text-white font-semibold flex items-center gap-2"><Clock size={16} className="text-[#00D9C0]" /> Work Hours</h2>
        <p className="text-white/40 text-xs">AI will only initiate non-critical actions within these hours</p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className={labelCls}>Start Time</label>
            <input type="time" className={`${inputCls} w-full`} value={settings.workStart} onChange={e => set('workStart', e.target.value)} />
          </div>
          <div className="text-white/30 text-sm mt-4">to</div>
          <div className="flex-1">
            <label className={labelCls}>End Time</label>
            <input type="time" className={`${inputCls} w-full`} value={settings.workEnd} onChange={e => set('workEnd', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end pb-4">
        <button onClick={handleSave} disabled={saving} className="bg-[#00D9C0] text-[#0B0F1A] font-bold px-6 py-2.5 rounded-lg hover:bg-[#00c2ab] transition-colors flex items-center gap-2">
          <Save size={15} /> {saving ? 'Saving…' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
