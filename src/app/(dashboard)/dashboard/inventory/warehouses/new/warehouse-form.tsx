"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWarehouseAction } from "@/app/actions/inventory";
import { Loader2 } from "lucide-react";

export default function WarehouseForm({ businessId }: { businessId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      address: (formData.get("address") as string) || undefined,
      isDefault: formData.get("isDefault") === "on",
    };

    try {
      await createWarehouseAction(businessId, "demo-user-123", data);
      router.push("/dashboard/inventory/warehouses");
    } catch (err: any) {
      console.error("Failed to create warehouse", err);
      setError("Failed to create warehouse. Please check your inputs.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Warehouse Name (Required)</label>
          <input 
            required 
            name="name" 
            placeholder="e.g. Main Distribution Center" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Address (Optional)</label>
          <textarea 
            name="address" 
            placeholder="123 Storage Lane..."
            rows={3}
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 resize-none" 
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input 
            type="checkbox" 
            id="isDefault"
            name="isDefault" 
            className="w-4 h-4 rounded border-white/[0.06] bg-white/[0.02] text-[#00D9C0] focus:ring-[#00D9C0]" 
          />
          <label htmlFor="isDefault" className="text-sm font-medium text-white/70">
            Set as Primary/Default Warehouse
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors text-white/70"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-[#00D9C0] hover:bg-[#00c2ab] text-[#0B0F1A] text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Warehouse
        </button>
      </div>
    </form>
  );
}
