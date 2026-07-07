"use client";

import { useState, useEffect, useRef } from "react";
import { getAIPageDataAction, resolveRecommendationAction } from "@/app/actions/ai";
import { toast } from "sonner";
import { Send, CheckCircle, ShieldAlert, Cpu, Check, X, TrendingUp, AlertTriangle, Activity, Target } from "lucide-react";
import clsx from "clsx";

const DEMO_BUSINESS_ID = "demo-business-123";

export default function AICEOScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contextData, setContextData] = useState<any>(null);
  const [inventoryHealth, setInventoryHealth] = useState<any>(null);
  const [topSuppliers, setTopSuppliers] = useState<any[]>([]);
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadData() {
    const res = await getAIPageDataAction(DEMO_BUSINESS_ID);
    if (res.success) {
      setMessages(res.interactions || []);
      setRecommendations(res.pendingRecommendations || []);
      setContextData(res.context);
      setInventoryHealth(res.inventoryHealth);
      setTopSuppliers(res.topSuppliers || []);
    }
  }

  async function handleSend() {
    if (!input.trim() || isLoading) return;
    const userText = input;
    setInput("");
    
    setMessages(prev => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, businessId: DEMO_BUSINESS_ID })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process message");

      await loadData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResolve(id: string, status: "APPROVED" | "REJECTED") {
    const res = await resolveRecommendationAction(id, status);
    if (res.success) {
      toast.success(`Action ${status.toLowerCase()} successfully`);
      await loadData();
    } else {
      toast.error(res.error || "Failed to resolve action");
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6 p-6 overflow-hidden">
      
      {/* Left Column: Command Center & Chat */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* Executive Briefing */}
        <div className="flex-shrink-0 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl text-white font-bold tracking-tight">Good Morning.</h1>
              <p className="text-white/40 text-sm">Here is your daily executive brief.</p>
            </div>
            <div className="bg-[#00D9C0]/10 border border-[#00D9C0]/20 text-[#00D9C0] px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Health Score: 94%
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* Inventory Health */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 col-span-2">
              <p className="text-white/40 text-xs mb-1">Inventory Health</p>
              <div className="flex items-end justify-between mt-1">
                <div>
                  <p className="text-white font-bold text-lg">{inventoryHealth?.lowStock?.length || 0} Low Stock</p>
                  <p className="text-white/40 text-xs mt-1">{inventoryHealth?.overstock?.length || 0} Overstock · {inventoryHealth?.deadStock?.length || 0} Dead Stock</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-medium text-sm">{inventoryHealth?.fastMoving?.length || 0} Fast Moving</p>
                  <p className="text-amber-400 font-medium text-sm mt-0.5">{inventoryHealth?.slowMoving?.length || 0} Slow Moving</p>
                </div>
              </div>
            </div>

            {/* Top Suppliers */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 col-span-2">
              <p className="text-white/40 text-xs mb-1">Top Suppliers (Ranked)</p>
              {topSuppliers.length === 0 ? (
                <p className="text-white/40 text-sm mt-2">No suppliers found.</p>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {topSuppliers.map((s, i) => (
                    <div key={s.supplierId} className="flex items-center justify-between">
                      <span className="text-white text-xs flex items-center gap-2">
                        <span className="text-white/30 text-[10px]">{i+1}.</span> {s.name}
                      </span>
                      <span className="text-emerald-400 text-xs font-medium">{s.totalScore} / 100</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="flex-1 flex flex-col bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden min-h-0">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#00D9C0]/10 flex items-center justify-center">
                <Cpu className="text-[#00D9C0] w-4 h-4" />
              </div>
              <h2 className="text-white font-medium text-sm">AI CEO Assistant</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Cpu className="w-10 h-10 text-white/10 mb-4" />
                <p className="text-white/40 text-sm max-w-md">
                  I am monitoring the business. Ask me to draft a purchase order, analyze inventory, or onboard a new supplier.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={clsx("flex flex-col max-w-[85%]", msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start")}>
                <span className="text-[10px] text-white/30 mb-1 px-1 uppercase tracking-wider">{msg.role}</span>
                <div className={clsx(
                  "p-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user" 
                    ? "bg-[#00D9C0] text-[#0B0F1A] rounded-tr-none font-medium" 
                    : "bg-white/[0.05] border border-white/[0.1] text-white/80 rounded-tl-none whitespace-pre-wrap"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto items-start flex flex-col max-w-[85%]">
                <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/[0.1] rounded-tl-none flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D9C0] animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D9C0] animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D9C0] animate-bounce delay-150" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-white/[0.06] bg-black/20">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="E.g. We need to onboard TechCorp as a supplier..."
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#00D9C0] rounded-xl pl-4 pr-12 py-3 text-sm outline-none transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-[#00D9C0] rounded-lg flex items-center justify-center text-[#0B0F1A] hover:bg-[#00c2ab] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Action Queue */}
      <div className="w-[420px] flex flex-col gap-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 overflow-hidden">
        <h3 className="text-white font-bold flex items-center justify-between">
          <span>Action Queue</span>
          {recommendations.length > 0 && (
            <span className="bg-[#00D9C0]/20 text-[#00D9C0] text-xs px-2 py-0.5 rounded-md font-bold">
              {recommendations.length} Pending
            </span>
          )}
        </h3>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {recommendations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-8 h-8 text-white/10 mb-3" />
              <p className="text-white/40 text-sm">Inbox Zero. No pending workflow approvals.</p>
            </div>
          ) : (
            recommendations.map(rec => (
              <div key={rec.id} className="bg-black/40 border border-white/[0.08] rounded-xl overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedRecId(expandedRecId === rec.id ? null : rec.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium text-sm leading-tight pr-2">{rec.title}</h4>
                    <span className={clsx(
                      "text-[10px] px-2 py-0.5 rounded flex-shrink-0 font-bold",
                      rec.riskLevel === "LOW" ? "bg-emerald-500/20 text-emerald-400" :
                      rec.riskLevel === "HIGH" || rec.riskLevel === "CRITICAL" ? "bg-red-500/20 text-red-400" :
                      "bg-amber-500/20 text-amber-400"
                    )}>
                      {rec.riskLevel} RISK
                    </span>
                  </div>
                  <p className="text-white/60 text-xs line-clamp-2">{rec.summary}</p>
                </div>

                {expandedRecId === rec.id && (
                  <div className="px-4 pb-4 border-t border-white/[0.06] pt-4 bg-white/[0.02] space-y-4">
                    
                    <div>
                      <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Why?</span>
                      <p className="text-white/80 text-xs mt-1">{rec.why || "No reasoning provided."}</p>
                    </div>

                    {rec.evidence?.whatHappened && (
                      <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5">
                        <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">What Happened</span>
                        <p className="text-white text-xs mt-1">{rec.evidence.whatHappened}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Expected Result</span>
                        <p className="text-emerald-400 text-xs mt-1 font-medium">{rec.expectedResult || "Workflow executed"}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Business Impact</span>
                        <p className="text-amber-400 text-xs mt-1 font-medium">{rec.businessImpact || "Standard"}</p>
                      </div>
                    </div>

                    {rec.evidence?.stockoutPrediction && (
                      <div>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500" /> Stockout Forecast</span>
                        <p className="text-red-400 font-medium text-xs mt-1">{rec.evidence.stockoutPrediction}</p>
                      </div>
                    )}

                    {rec.evidence?.supplierComparison && (
                      <div>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Supplier Rankings</span>
                        <p className="text-white/80 text-xs mt-1 whitespace-pre-wrap">{rec.evidence.supplierComparison}</p>
                      </div>
                    )}

                    {rec.evidence?.consequencesOfInaction && (
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                        <span className="text-[10px] text-red-400/80 uppercase tracking-wider font-bold">Consequences of Inaction</span>
                        <p className="text-red-400 text-xs mt-1">{rec.evidence.consequencesOfInaction}</p>
                      </div>
                    )}

                    {(rec.estimatedCost > 0 || rec.estimatedSavings > 0 || rec.evidence?.recommendedQuantity) && (
                      <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-3">
                        {rec.evidence?.recommendedQuantity && (
                          <div>
                            <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Qty</span>
                            <p className="text-white text-xs mt-1">{rec.evidence.recommendedQuantity}</p>
                          </div>
                        )}
                        {rec.estimatedCost > 0 && (
                          <div>
                            <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Est. Cost</span>
                            <p className="text-white text-xs mt-1">${rec.estimatedCost}</p>
                          </div>
                        )}
                        {rec.estimatedSavings > 0 && (
                          <div>
                            <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Est. Savings</span>
                            <p className="text-emerald-400 text-xs mt-1">+${rec.estimatedSavings}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => handleResolve(rec.id, "REJECTED")}
                        className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-colors"
                      >
                        REJECT
                      </button>
                      <button 
                        onClick={() => handleResolve(rec.id, "APPROVED")}
                        className="flex-1 py-2 rounded-lg bg-[#00D9C0] text-[#0B0F1A] hover:bg-[#00c2ab] text-xs font-bold transition-colors shadow-[0_0_15px_rgba(0,217,192,0.3)]"
                      >
                        APPROVE & EXECUTE
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}
