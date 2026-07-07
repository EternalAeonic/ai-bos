"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { recordMovementAction } from "@/app/actions/inventory";
import { Loader2 } from "lucide-react";

export default function AdjustmentForm({ businessId, products, warehouses }: { businessId: string, products: any[], warehouses: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const productId = formData.get("productId") as string;
    const warehouseId = formData.get("warehouseId") as string;
    const movementType = formData.get("movementType") as string;
    const quantity = Number(formData.get("quantity"));
    const referenceType = (formData.get("referenceType") as string) || undefined;
    const referenceId = (formData.get("referenceId") as string) || undefined;

    if (!productId || !warehouseId || !movementType || !quantity) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      await recordMovementAction(businessId, "demo-user-123", {
        productId,
        warehouseId,
        movementType,
        quantity: movementType.includes('out') ? -Math.abs(quantity) : Math.abs(quantity),
        referenceType,
        referenceId
      });
      router.push("/dashboard/inventory/movements");
    } catch (err: any) {
      console.error("Failed to record adjustment", err);
      setError("Failed to record adjustment. Please check your inputs.");
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Product</label>
          <select 
            required
            name="productId" 
            className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50"
          >
            <option value="">Select Product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Warehouse</label>
          <select 
            required
            name="warehouseId" 
            className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50"
          >
            <option value="">Select Warehouse...</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Movement Type</label>
          <select 
            required
            name="movementType" 
            className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50"
          >
            <option value="">Select Type...</option>
            <option value="purchase_in">Purchase In (+)</option>
            <option value="sale_out">Sale Out (-)</option>
            <option value="adjustment">Adjustment (+/-)</option>
            <option value="return">Return In (+)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Quantity (Absolute Value)</label>
          <input 
            required 
            type="number" 
            min="1"
            name="quantity" 
            placeholder="e.g. 50"
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Reference Type (Optional)</label>
          <input 
            name="referenceType" 
            placeholder="e.g. PO, Invoice, Audit"
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Reference ID (Optional)</label>
          <input 
            name="referenceId" 
            placeholder="e.g. PO-2023-001"
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
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
          Record Adjustment
        </button>
      </div>
    </form>
  );
}
