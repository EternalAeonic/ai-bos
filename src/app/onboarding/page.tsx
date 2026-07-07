"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Save, HelpCircle } from "lucide-react";
import { Step1Welcome } from "./components/Step1Welcome";
import { Step2BusinessIdentity } from "./components/Step2BusinessIdentity";
import { Step3Locations } from "./components/Step3Locations";
import { Step4OrgStructure } from "./components/Step4OrgStructure";
import { Step5Employees } from "./components/Step5Employees";
import { Step6Roles } from "./components/Step6Roles";
import { Step7Inventory } from "./components/Step7Inventory";
import { Step8Suppliers } from "./components/Step8Suppliers";
import { Step9Customers } from "./components/Step9Customers";
import { Step10Finance } from "./components/Step10Finance";
import { Step11Taxes } from "./components/Step11Taxes";
import { Step12AIPreferences } from "./components/Step12AIPreferences";
import { Step13Integrations } from "./components/Step13Integrations";
import { Step14Review } from "./components/Step14Review";
import { Step15Success } from "./components/Step15Success";

import { Loader2 } from "lucide-react";

const TOTAL_STEPS = 15;

export default function OnboardingPage() {
  const { step, nextStep, prevStep, saving } = useOnboarding();

  const progress = (step / TOTAL_STEPS) * 100;

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Welcome />;
      case 2: return <Step2BusinessIdentity />;
      case 3: return <Step3Locations />;
      case 4: return <Step4OrgStructure />;
      case 5: return <Step5Employees />;
      case 6: return <Step6Roles />;
      case 7: return <Step7Inventory />;
      case 8: return <Step8Suppliers />;
      case 9: return <Step9Customers />;
      case 10: return <Step10Finance />;
      case 11: return <Step11Taxes />;
      case 12: return <Step12AIPreferences />;
      case 13: return <Step13Integrations />;
      case 14: return <Step14Review />;
      case 15: return <Step15Success />;
      default: return <div className="text-center py-20">Step {step} Coming Soon</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EAEAEA]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-lg tracking-tight">AI-BOS</div>
          
          <div className="flex items-center gap-4">
            {saving && (
              <div className="flex items-center gap-1.5 text-xs text-[#00D9C0] font-medium">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving…
              </div>
            )}
            <Button variant="ghost" size="icon" className="text-[#8A8F98] hover:text-[#141B41]">
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-0.5 w-full bg-[#F7F8F9]">
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
        <div className="mb-8 text-sm text-[#8A8F98] font-medium">
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
      {step !== 1 && step !== 15 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAEAEA] shadow-[0_-4px_24px_rgba(0,0,0,0.02)] z-50">
          <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
            <Button variant="ghost" onClick={prevStep} className="text-[#8A8F98]">
              Back
            </Button>
            
            <div className="text-xs text-[#8A8F98]">
              Estimated completion: {15 - step} mins remaining
            </div>

            <Button onClick={nextStep} disabled={saving} className="bg-[#141B41] hover:bg-[#00D9C0] text-white px-8 transition-colors disabled:opacity-60">
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
              ) : step === 14 ? "Finish Setup" : "Continue"}
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
