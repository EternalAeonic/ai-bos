"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, recordMovementAction } from "@/app/actions/inventory";
import { Loader2, Package } from "lucide-react";

export default function ProductForm({ 
  businessId, 
  categories, 
  suppliers,
  warehouses
}: { 
  businessId: string; 
  categories: any[]; 
  suppliers: any[];
  warehouses: any[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const initialStock = Number(formData.get("initialStock") || 0);
    const warehouseId = formData.get("warehouseId") as string;
    
    const productData = {
      sku: formData.get("sku") as string,
      name: formData.get("name") as string,
      barcode: (formData.get("barcode") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      categoryId: (formData.get("categoryId") as string) || undefined,
      supplierId: (formData.get("supplierId") as string) || undefined,
      unit: (formData.get("unit") as string) || "pcs",
      costPrice: Number(formData.get("costPrice")),
      sellPrice: Number(formData.get("sellPrice")),
      reorderLevel: Number(formData.get("reorderLevel") || 0),
    };

    try {
      // Step 1: Create the product
      const product = await createProductAction(businessId, "demo-user-123", productData);
      
      // Step 2: If initial stock > 0 and warehouse selected, create INITIAL_STOCK movement
      if (initialStock > 0 && warehouseId) {
        await recordMovementAction(businessId, "demo-user-123", {
          productId: product.id,
          warehouseId,
          movementType: "INITIAL_STOCK",
          quantity: initialStock,
          referenceType: "initial_stock",
          referenceId: product.id,
        });
      }

      router.push("/dashboard/inventory/products");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to create product", err);
      setError(err?.message || "Failed to create product. SKU might already exist.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div>
        <h3 className="text-sm font-semibold text-white/90 border-b border-white/[0.06] pb-2 mb-4">Product Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">SKU <span className="text-red-400">*</span></label>
            <input 
              required 
              name="sku" 
              placeholder="e.g. WID-001" 
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#00D9C0]/50 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Product Name <span className="text-red-400">*</span></label>
            <input 
              required 
              name="name" 
              placeholder="e.g. Steel Widget" 
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#00D9C0]/50 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Barcode</label>
            <input 
              name="barcode" 
              placeholder="e.g. 8901234567890" 
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#00D9C0]/50 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Unit</label>
            <select name="unit" className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors">
              <option value="pcs">Pieces (pcs)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="g">Grams (g)</option>
              <option value="litre">Litres</option>
              <option value="box">Boxes</option>
              <option value="carton">Cartons</option>
              <option value="pair">Pairs</option>
              <option value="set">Sets</option>
            </select>
          </div>
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-white/70">Description</label>
            <textarea 
              name="description" 
              rows={2}
              placeholder="Brief product description..."
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#00D9C0]/50 transition-colors resize-none" 
            />
          </div>
        </div>
      </div>

      {/* Categorization */}
      <div>
        <h3 className="text-sm font-semibold text-white/90 border-b border-white/[0.06] pb-2 mb-4">Categorization</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Category</label>
            <select name="categoryId" className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors">
              <option value="">No Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {categories.length === 0 && <p className="text-[11px] text-amber-400/70">No categories yet. <a href="/dashboard/inventory/categories/new" className="underline">Create one first.</a></p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Primary Supplier</label>
            <select name="supplierId" className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors">
              <option value="">No Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {suppliers.length === 0 && <p className="text-[11px] text-amber-400/70">No suppliers yet. <a href="/dashboard/inventory/suppliers/new" className="underline">Create one first.</a></p>}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-sm font-semibold text-white/90 border-b border-white/[0.06] pb-2 mb-4">Pricing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Cost Price <span className="text-red-400">*</span></label>
            <input 
              required 
              type="number" 
              step="0.01" 
              min="0"
              name="costPrice" 
              defaultValue={0}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Selling Price <span className="text-red-400">*</span></label>
            <input 
              required 
              type="number" 
              step="0.01" 
              min="0"
              name="sellPrice" 
              defaultValue={0}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Reorder Level</label>
            <input 
              type="number" 
              min="0"
              name="reorderLevel" 
              defaultValue={5}
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors" 
            />
          </div>
        </div>
      </div>

      {/* Initial Stock — CRITICAL: Creates INITIAL_STOCK movement */}
      <div className="rounded-xl border border-[#00D9C0]/20 bg-[#00D9C0]/[0.03] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-4 h-4 text-[#00D9C0]" />
          <h3 className="text-sm font-semibold text-[#00D9C0]">Initial Stock</h3>
          <span className="text-xs text-white/40 ml-1">(Creates an INITIAL_STOCK movement — never stored as mutable state)</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Initial Quantity</label>
            <input 
              type="number" 
              min="0"
              name="initialStock" 
              defaultValue={0}
              placeholder="0"
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Warehouse</label>
            <select name="warehouseId" className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50 transition-colors">
              <option value="">Select Warehouse...</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            {warehouses.length === 0 && <p className="text-[11px] text-amber-400/70">No warehouses yet. <a href="/dashboard/inventory/warehouses/new" className="underline">Create one first.</a></p>}
          </div>
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
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00D9C0] hover:bg-[#00c2ab] text-[#0B0F1A] text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
