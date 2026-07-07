"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategoryAction } from "@/app/actions/inventory";
import { Loader2 } from "lucide-react";

export default function CategoryForm({ businessId, categories }: { businessId: string, categories: any[] }) {
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
      parentCategoryId: (formData.get("parentCategoryId") as string) || undefined,
    };

    try {
      await createCategoryAction(businessId, "demo-user-123", data);
      router.push("/dashboard/inventory/categories");
    } catch (err: any) {
      console.error("Failed to create category", err);
      setError("Failed to create category. Please check your inputs.");
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
          <label className="text-sm font-medium text-white/70">Category Name (Required)</label>
          <input 
            required 
            name="name" 
            placeholder="e.g. Electronics" 
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Parent Category (Optional)</label>
          <select 
            name="parentCategoryId" 
            className="w-full bg-[#0B0F1A] border border-white/[0.06] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00D9C0]/50"
          >
            <option value="">None (Top-Level Category)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
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
          Save Category
        </button>
      </div>
    </form>
  );
}
