import { prisma } from "@/lib/prisma";
import CategoryForm from "./category-form";

const DEMO_BUSINESS_ID = "demo-business-123";

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({
    where: { businessId: DEMO_BUSINESS_ID, deletedAt: null },
    orderBy: { name: "asc" }
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add New Category</h2>
      </div>
      
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <CategoryForm 
          businessId={DEMO_BUSINESS_ID}
          categories={categories}
        />
      </div>
    </div>
  );
}
