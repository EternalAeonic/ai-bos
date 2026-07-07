import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-white/40">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p className="text-sm">Loading inventory data...</p>
    </div>
  );
}
