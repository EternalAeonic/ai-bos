"use client";

import { Button } from "@/components/ui/button";
import { Bot, ArrowRight, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Step15Success() {
  const router = useRouter();

  // Basic Confetti effect
  useEffect(() => {
    const createConfetti = () => {
      const colors = ["#00D9C0", "#141B41", "#EAEAEA"];
      for (let i = 0; i < 100; i++) {
        const conf = document.createElement("div");
        conf.className = "absolute w-2 h-2 rounded-sm opacity-0 animate-confetti";
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.left = `${Math.random() * 100}%`;
        conf.style.top = "-5%";
        conf.style.animationDelay = `${Math.random() * 3}s`;
        conf.style.animationDuration = `${2 + Math.random() * 3}s`;
        document.getElementById("confetti-container")?.appendChild(conf);
      }
    };
    createConfetti();
  }, []);

  return (
    <div className="flex flex-col items-center text-center pt-10 relative" id="confetti-container">
      
      {/* CSS for confetti animation injected here for simplicity */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti linear forwards; }
      `}} />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-32 h-32 bg-gradient-to-tr from-[#141B41] to-[#00D9C0] rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-[#00D9C0]/30 relative"
      >
        <div className="absolute inset-0 bg-white/20 rounded-3xl mix-blend-overlay" />
        <Bot className="w-16 h-16 text-white" />
      </motion.div>

      <h1 className="text-5xl font-bold tracking-tight text-[#141B41] mb-6">
        Your AI CEO is Ready
      </h1>
      
      <p className="text-xl text-[#8A8F98] max-w-lg mx-auto mb-12 leading-relaxed">
        AI-BOS now understands your entire business operation. It is ready to manage inventory, track finances, and assist your team.
      </p>

      <div className="flex gap-6 w-full max-w-lg">
        <Button 
          onClick={() => router.push("/dashboard")}
          variant="outline"
          className="flex-1 h-14 text-lg border-[#141B41] text-[#141B41] hover:bg-[#F7F8F9] rounded-xl"
        >
          <LayoutDashboard className="w-5 h-5 mr-2" />
          Dashboard
        </Button>
        <Button 
          onClick={() => router.push("/dashboard/chat")}
          className="flex-1 h-14 text-lg bg-[#00D9C0] hover:bg-[#00c2ab] text-white rounded-xl shadow-[0_8px_30px_rgba(0,217,192,0.3)] transition-all hover:shadow-[0_8px_40px_rgba(0,217,192,0.5)]"
        >
          Talk to AI CEO
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
