import { OnboardingProvider } from "@/context/OnboardingContext";
import { Toaster } from "@/components/ui/sonner";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#141B41] font-sans selection:bg-[#00D9C0]/30 selection:text-[#141B41]">
      <OnboardingProvider>
        {children}
      </OnboardingProvider>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
