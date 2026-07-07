import { prisma } from "@/lib/prisma";
import AdjustmentForm from "./adjustment-form";

const DEMO_BUSINESS_ID = "demo-business-123";

export default async function AdjustmentsPage() {
  const [products, warehouses] = await Promise.all([
    prisma.product.findMany({ where: { businessId: DEMO_BUSINESS_ID, deletedAt: null }, orderBy: { name: "asc" } }),
    prisma.warehouse.findMany({ where: { businessId: DEMO_BUSINESS_ID, deletedAt: null }, orderBy: { name: "asc" } })
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Adjust Stock</h2>
      </div>
      
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <AdjustmentForm 
          businessId={DEMO_BUSINESS_ID}
          products={products}
          warehouses={warehouses}
        />
      </div>
    </div>
  );
}
