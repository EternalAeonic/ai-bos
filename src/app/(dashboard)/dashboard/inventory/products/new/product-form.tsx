"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction } from "@/app/actions/inventory";
import { Loader2 } from "lucide-react";

export default function ProductForm({ businessId, categories, suppliers }: { businessId: string, categories: any[], suppliers: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      sku: formData.get("sku") as string,
      name: formData.get("name") as string,
      categoryId: (formData.get("categoryId") as string) || undefined,
      supplierId: (formData.get("supplierId") as string) || undefined,
      unit: (formData.get("unit") as string) || "pcs",
      costPrice: Number(formData.get("costPrice")),
      sellPrice: Number(formData.get("sellPrice")),
      reorderLevel: Number(formData.get("reorderLevel")),
    };

    try {
      await createProductAction(businessId, "demo-user-123", data);
      router.push("/dashboard/inventory/products");
    } catch (err: any) {
      console.error("Failed to create product", err);
      setError("Failed to create product. SKU might already exist.");
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
          <label className="text-sm font-medium text-white/70">SKU (Required)</label>
          <input 
            required 
            name="sku" 
            placeholder="e.g. WID-001" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Product Name (Required)</label>
          <input 
            required 
            name="name" 
            placeholder="e.g. Steel Widget" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Category</label>
          <select 
            name="categoryId" 
            className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Supplier</label>
          <select 
            name="supplierId" 
            className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50"
          >
            <option value="">None</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Cost Price</label>
          <input 
            required 
            type="number" 
            step="0.01" 
            name="costPrice" 
            defaultValue={0}
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Selling Price</label>
          <input 
            required 
            type="number" 
            step="0.01" 
            name="sellPrice" 
            defaultValue={0}
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Unit (e.g. pcs, kg, boxes)</label>
          <input 
            name="unit" 
            defaultValue="pcs"
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Reorder Level</label>
          <input 
            required 
            type="number" 
            name="reorderLevel" 
            defaultValue={5}
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
          Save Product
        </button>
      </div>
    </form>
  );
}
