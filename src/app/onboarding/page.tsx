"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Save, HelpCircle, Loader2, ArrowRight } from "lucide-react";
import { Step1BusinessInfo } from "./components/Step1BusinessInfo";
import { Step2Locations } from "./components/Step2Locations";
import { Step3Departments } from "./components/Step3Departments";
import { Step4Employees } from "./components/Step4Employees";
import { Step5Suppliers } from "./components/Step5Suppliers";
import { Step6Customers } from "./components/Step6Customers";
import { Step7Finance } from "./components/Step7Finance";
import { Step8Tax } from "./components/Step8Tax";
import { Step9AIConfig } from "./components/Step9AIConfig";
import { Step10Review } from "./components/Step10Review";

const TOTAL_STEPS = 10;

export default function OnboardingPage() {
  const { step, nextStep, prevStep, saving } = useOnboarding();

  const progress = (step / TOTAL_STEPS) * 100;

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1BusinessInfo />;
      case 2: return <Step2Locations />;
      case 3: return <Step3Departments />;
      case 4: return <Step4Employees />;
      case 5: return <Step5Suppliers />;
      case 6: return <Step6Customers />;
      case 7: return <Step7Finance />;
      case 8: return <Step8Tax />;
      case 9: return <Step9AIConfig />;
      case 10: return <Step10Review />;
      default: return <div className="text-center py-20 text-white">Step {step} Not Found</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F1A] text-white">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-[#0B0F1A]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-lg tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D9C0] to-[#009988] flex items-center justify-center text-white">
              AI
            </div>
            AI-BOS Setup
          </div>
          
          <div className="flex items-center gap-4">
            {saving && (
              <div className="flex items-center gap-1.5 text-xs text-[#00D9C0] font-medium">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving…
              </div>
            )}
            <Button variant="ghost" size="icon" className="text-white/40 hover:text-white">
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-0.5 w-full bg-white/[0.04]">
          <motion.div 
            className="h-full bg-[#00D9C0]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 pb-32">
        <div className="mb-8 text-sm text-white/40 font-medium uppercase tracking-wider">
          Step {step} of {TOTAL_STEPS}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0B0F1A] border-t border-white/[0.06] shadow-[0_-4px_24px_rgba(0,0,0,0.2)] z-50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={step === 1 || saving}
            className="text-white/40 hover:text-white hover:bg-white/[0.04]"
          >
            Back
          </Button>
          
          <div className="text-xs text-white/40 hidden sm:block">
            Estimated completion: {Math.max(1, (10 - step) * 2)} mins remaining
          </div>

          <Button 
            onClick={nextStep} 
            disabled={saving} 
            className="bg-[#00D9C0] hover:bg-[#00D9C0]/90 text-[#0B0F1A] font-medium px-8 transition-colors disabled:opacity-60 rounded-lg flex items-center gap-2"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
            ) : step === 10 ? (
              "Finish Setup"
            ) : (
              <><ArrowRight className="w-4 h-4" />Continue</>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
