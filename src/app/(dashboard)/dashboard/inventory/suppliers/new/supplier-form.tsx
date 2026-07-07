"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupplierAction } from "@/app/actions/inventory";
import { Loader2 } from "lucide-react";

export default function SupplierForm({ businessId }: { businessId: string }) {
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
      contactPerson: (formData.get("contactPerson") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      city: (formData.get("city") as string) || undefined,
      country: (formData.get("country") as string) || undefined,
      postalCode: (formData.get("postalCode") as string) || undefined,
      gstNumber: (formData.get("gstNumber") as string) || undefined,
      paymentTerms: (formData.get("paymentTerms") as string) || undefined,
      leadTimeDays: formData.get("leadTimeDays") ? Number(formData.get("leadTimeDays")) : undefined,
      isPreferred: formData.get("isPreferred") === "on",
    };

    try {
      await createSupplierAction(businessId, "demo-user-123", data);
      router.push("/dashboard/inventory/suppliers");
    } catch (err: any) {
      console.error("Failed to create supplier", err);
      setError("Failed to create supplier. Please check your inputs.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-white/70">Supplier Name (Required)</label>
          <input 
            required 
            name="name" 
            placeholder="e.g. Acme Corporation" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Contact Person</label>
          <input 
            name="contactPerson" 
            placeholder="e.g. Jane Doe" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Email Address</label>
          <input 
            type="email"
            name="email" 
            placeholder="e.g. contact@acme.com" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Phone Number</label>
          <input 
            type="tel"
            name="phone" 
            placeholder="e.g. +1 234 567 890" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Lead Time (Days)</label>
          <input 
            type="number"
            min="0"
            name="leadTimeDays" 
            placeholder="e.g. 7" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>

        <div className="space-y-2 col-span-2 mt-2">
          <h3 className="text-sm font-semibold text-white/90 border-b border-white/[0.06] pb-2">Business Details</h3>
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-white/70">Address</label>
          <input 
            name="address" 
            placeholder="e.g. 123 Factory Lane" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">City</label>
          <input 
            name="city" 
            placeholder="e.g. Metropolis" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Country</label>
          <input 
            name="country" 
            placeholder="e.g. USA" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">GST / Tax Number</label>
          <input 
            name="gstNumber" 
            placeholder="e.g. TAX123456" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Payment Terms</label>
          <select 
            name="paymentTerms" 
            className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50"
          >
            <option value="">Select terms...</option>
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="NET30">Net 30</option>
            <option value="NET60">Net 60</option>
            <option value="NET90">Net 90</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mt-4 col-span-2">
          <input 
            type="checkbox" 
            id="isPreferred"
            name="isPreferred" 
            className="w-4 h-4 rounded border-white/[0.06] bg-white/[0.02] text-[#00D9C0] focus:ring-[#00D9C0]" 
          />
          <label htmlFor="isPreferred" className="text-sm font-medium text-white/70">
            Mark as Preferred Supplier
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
          Save Supplier
        </button>
      </div>
    </form>
  );
}
