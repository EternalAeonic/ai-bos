"use client";

import { useState, useEffect } from "react";
import { Bot, Mic, Send, AlertTriangle, AlertCircle, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { AIResponse } from "@/modules/ai/providers/ai-provider";

export function AICeoPanel({ businessId }: { businessId: string }) {
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const fetchBrief = async (q?: string) => {
    setLoading(true);
    setIsTyping(true);
    try {
      const res = await fetch("/api/ai/ceo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, query: q }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, [businessId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchBrief(query);
    setQuery("");
  };

  const handleQuickQuestion = (q: string) => {
    fetchBrief(q);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#00D9C0]";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="bg-gradient-to-br from-[#141B41] to-[#0D1117] border border-[#00D9C0]/20 rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_8px_32px_rgba(0,217,192,0.05)]">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00D9C0]/10 border border-[#00D9C0]/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#00D9C0]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              AI CEO
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#00D9C0]/10 text-[#00D9C0] border border-[#00D9C0]/20">
                Local Engine
              </span>
            </h2>
            <p className="text-[10px] text-white/40">Deterministic business intelligence</p>
          </div>
        </div>
        
        {response && (
          <div className="text-right">
            <p className={`text-xl font-bold ${getScoreColor(response.businessHealth.score)}`}>
              {response.businessHealth.score}%
            </p>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Health</p>
          </div>
        )}
      </div>

      {/* Response Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {loading && !response ? (
          <div className="flex flex-col items-center justify-center h-full text-white/20 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#00D9C0]" />
            <p className="text-xs">Analyzing business data...</p>
          </div>
        ) : response ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-5">
            
            {/* Title & Summary */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2">{response.title}</h3>
              <div className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                {response.summary}
              </div>
            </div>

            {/* Warnings */}
            {response.warnings.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Warnings</span>
                </div>
                <ul className="space-y-1.5">
                  {response.warnings.map((w, i) => (
                    <li key={i} className="text-xs text-red-200/80 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {response.recommendations.length > 0 && (
              <div className="bg-[#00D9C0]/5 border border-[#00D9C0]/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#00D9C0]" />
                  <span className="text-xs font-bold text-[#00D9C0] uppercase tracking-wider">Recommendations</span>
                </div>
                <ul className="space-y-2">
                  {response.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-white/80">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
          </div>
        ) : null}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/[0.06] bg-white/[0.01] shrink-0">
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            "How is my business?",
            "Today's Summary",
            "Inventory Health",
            "Finance Status",
            "Supplier Status"
          ].map((q) => (
            <button
              key={q}
              onClick={() => handleQuickQuestion(q)}
              disabled={isTyping}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/50 hover:bg-white/[0.06] hover:text-white/80 transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your question..."
            disabled={isTyping}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-4 pr-24 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00D9C0]/50 transition-colors disabled:opacity-50"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.05] text-white/30 group"
              title="Voice mode coming soon"
            >
              <Mic className="w-4 h-4 group-hover:text-white/60 transition-colors" />
            </button>
            <button
              type="submit"
              disabled={isTyping || !query.trim()}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#00D9C0] text-[#0B0F1A] disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30 hover:bg-[#00c2ab] transition-colors"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
