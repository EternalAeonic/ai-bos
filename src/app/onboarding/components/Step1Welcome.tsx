"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Step1Welcome() {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex flex-col items-center text-center pt-10">
      <motion.div 
        className="w-40 h-40 bg-gradient-to-tr from-[#141B41] to-[#00D9C0]/80 rounded-full blur-3xl opacity-20 absolute -z-10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="w-24 h-24 bg-[#141B41] rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-[#141B41]/20">
        <Sparkles className="w-12 h-12 text-[#00D9C0]" />
      </div>

      <h1 className="text-5xl font-bold tracking-tight text-[#141B41] mb-6">
        Welcome to AI-BOS
      </h1>
      
      <p className="text-xl text-[#8A8F98] max-w-lg mx-auto mb-12 leading-relaxed">
        Let's configure your business so your AI CEO understands exactly how your company works.
      </p>

      <Button 
        onClick={nextStep} 
        size="lg"
        className="bg-[#141B41] hover:bg-[#00D9C0] text-white px-8 h-14 text-lg rounded-xl shadow-[0_8px_30px_rgba(0,217,192,0.2)] transition-all hover:shadow-[0_8px_40px_rgba(0,217,192,0.4)] group"
      >
        Start Configuration
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>

      <p className="mt-6 text-sm text-[#8A8F98]">
        Estimated setup time: 10-15 minutes
      </p>
    </div>
  );
}
