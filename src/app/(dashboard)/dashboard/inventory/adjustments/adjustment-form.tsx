"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { recordMovementAction, transferStockAction } from "@/app/actions/inventory";
import { Loader2, ArrowRightLeft, PackagePlus, PackageMinus, Wrench, AlertTriangle } from "lucide-react";

const MOVEMENT_TYPES = [
  { value: "PURCHASE", label: "Receive Stock (Purchase / Delivery)", icon: "📦", direction: "IN" },
  { value: "RETURN", label: "Customer Return", icon: "↩️", direction: "IN" },
  { value: "ADJUSTMENT_IN", label: "Stock Correction (+)", icon: "➕", direction: "IN" },
  { value: "SALE", label: "Issue / Dispatch (Sale)", icon: "📤", direction: "OUT" },
  { value: "DAMAGE", label: "Record Damaged Stock", icon: "💥", direction: "OUT" },
  { value: "EXPIRED", label: "Record Expired / Obsolete Stock", icon: "🗑️", direction: "OUT" },
  { value: "ADJUSTMENT_OUT", label: "Stock Correction (-)", icon: "➖", direction: "OUT" },
  { value: "TRANSFER", label: "Transfer Between Warehouses", icon: "🔄", direction: "TRANSFER" },
];

export default function AdjustmentForm({ 
  businessId, 
  products, 
  warehouses 
}: { 
  businessId: string; 
  products: any[]; 
  warehouses: any[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("");

  const isTransfer = selectedType === "TRANSFER";
  const selectedMovement = MOVEMENT_TYPES.find(m => m.value === selectedType);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData(e.currentTarget);
    const productId = formData.get("productId") as string;
    const warehouseId = formData.get("warehouseId") as string;
    const toWarehouseId = formData.get("toWarehouseId") as string;
    const movementType = formData.get("movementType") as string;
    const quantity = Math.round(Number(formData.get("quantity")));
    const notes = (formData.get("notes") as string) || undefined;
    const referenceId = (formData.get("referenceId") as string) || undefined;

    if (!productId || !movementType || quantity <= 0) {
      setError("Please fill in all required fields with a valid quantity.");
      setIsSubmitting(false);
      return;
    }

    if (!isTransfer && !warehouseId) {
      setError("Please select a warehouse.");
      setIsSubmitting(false);
      return;
    }

    if (isTransfer && (!warehouseId || !toWarehouseId)) {
      setError("Please select both source and destination warehouses.");
      setIsSubmitting(false);
      return;
    }

    if (isTransfer && warehouseId === toWarehouseId) {
      setError("Source and destination warehouses must be different.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isTransfer) {
        await transferStockAction(businessId, "demo-user-123", {
          productId,
          fromWarehouseId: warehouseId,
          toWarehouseId,
          quantity,
          notes,
        });
        setSuccess(`✓ Stock transferred successfully! ${quantity} units moved between warehouses.`);
      } else {
        await recordMovementAction(businessId, "demo-user-123", {
          productId,
          warehouseId,
          movementType,
          quantity,
          referenceType: referenceId ? "manual" : undefined,
          referenceId,
          notes,
        });
        setSuccess(`✓ Movement recorded! ${quantity} units (${selectedMovement?.label}) logged to ledger.`);
      }
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      setSelectedType("");
      
      setTimeout(() => {
        router.push("/dashboard/inventory/movements");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      console.error("Failed to record movement", err);
      setError(err?.message || "Failed to record movement. Please check your inputs.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-[#00D9C0]/10 border border-[#00D9C0]/20 text-[#00D9C0] text-sm font-medium">
          {success}
        </div>
      )}

      {/* Movement Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Operation Type <span className="text-red-400">*</span></label>
        <select 
          required
          name="movementType"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors"
        >
          <option value="">Select operation...</option>
          <optgroup label="— Add Stock —">
            {MOVEMENT_TYPES.filter(m => m.direction === "IN").map(m => (
              <option key={m.value} value={m.value}>{m.icon} {m.label}</option>
            ))}
          </optgroup>
          <optgroup label="— Remove Stock —">
            {MOVEMENT_TYPES.filter(m => m.direction === "OUT").map(m => (
              <option key={m.value} value={m.value}>{m.icon} {m.label}</option>
            ))}
          </optgroup>
          <optgroup label="— Move Stock —">
            {MOVEMENT_TYPES.filter(m => m.direction === "TRANSFER").map(m => (
              <option key={m.value} value={m.value}>{m.icon} {m.label}</option>
            ))}
          </optgroup>
        </select>
        {selectedMovement && (
          <p className="text-xs text-white/40">
            Direction: <span className={`font-bold ${selectedMovement.direction === "IN" ? "text-green-400" : selectedMovement.direction === "OUT" ? "text-red-400" : "text-amber-400"}`}>
              {selectedMovement.direction === "IN" ? "▲ Adds to stock" : selectedMovement.direction === "OUT" ? "▼ Reduces stock" : "⇄ Moves between warehouses (two ledger entries)"}
            </span>
          </p>
        )}
      </div>

      {/* Product */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Product <span className="text-red-400">*</span></label>
        <select 
          required
          name="productId" 
          className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors"
        >
          <option value="">Select Product...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
          ))}
        </select>
        {products.length === 0 && (
          <p className="text-[11px] text-amber-400/70">No products yet. <a href="/dashboard/inventory/products/new" className="underline">Add a product first.</a></p>
        )}
      </div>

      {/* Warehouse(s) */}
      {isTransfer ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">From Warehouse <span className="text-red-400">*</span></label>
            <select 
              required
              name="warehouseId" 
              className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors"
            >
              <option value="">Select source...</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">To Warehouse <span className="text-red-400">*</span></label>
            <select 
              required
              name="toWarehouseId" 
              className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors"
            >
              <option value="">Select destination...</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Warehouse <span className="text-red-400">*</span></label>
          <select 
            required
            name="warehouseId" 
            className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors"
          >
            <option value="">Select Warehouse...</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          {warehouses.length === 0 && (
            <p className="text-[11px] text-amber-400/70">No warehouses yet. <a href="/dashboard/inventory/warehouses/new" className="underline">Create one first.</a></p>
          )}
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Quantity <span className="text-red-400">*</span></label>
        <input 
          required 
          type="number" 
          min="1"
          step="1"
          name="quantity" 
          placeholder="e.g. 50"
          className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#00D9C0]/50 transition-colors" 
        />
        <p className="text-xs text-white/30">Enter whole numbers only. The direction (add/subtract) is determined by the operation type.</p>
      </div>

      {/* Notes & Reference */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Reference / PO Number</label>
          <input 
            name="referenceId" 
            placeholder="e.g. PO-2024-001"
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#00D9C0]/50 transition-colors" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Notes</label>
          <input 
            name="notes" 
            placeholder="e.g. Delivery from supplier"
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#00D9C0]/50 transition-colors" 
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
          disabled={isSubmitting || !selectedType}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00D9C0] hover:bg-[#00c2ab] text-[#0B0F1A] text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Recording..." : isTransfer ? "Transfer Stock" : "Record Movement"}
        </button>
      </div>
    </form>
  );
}
