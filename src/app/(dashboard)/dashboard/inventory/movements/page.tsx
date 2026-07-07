import { prisma } from "@/lib/prisma";
import { ArrowRightLeft, Search } from "lucide-react";
import Link from "next/link";

const DEMO_BUSINESS_ID = "demo-business-123";

export default async function MovementsPage() {
  const movements = await prisma.inventoryMovement.findMany({
    where: { businessId: DEMO_BUSINESS_ID },
    include: { product: true, warehouse: true },
    orderBy: { createdAt: "desc" },
    take: 100 // limit for demo
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stock Movements</h2>
          <p className="text-muted-foreground mt-1">Append-only ledger of all inventory transactions.</p>
        </div>
        <Link
          href="/dashboard/inventory/adjustments"
          className="flex items-center gap-2 px-4 py-2 bg-[#00D9C0] hover:bg-[#00c2ab] text-[#0B0F1A] text-sm font-bold rounded-xl transition-all shadow-[0_8px_24px_rgba(0,217,192,0.25)] hover:shadow-[0_8px_32px_rgba(0,217,192,0.4)]"
        >
          Adjust Stock
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] p-2 rounded-xl mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by product name, SKU, or reference..." 
            className="w-full pl-9 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm outline-none"
          />
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden mt-6">
        {movements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-4">
               <ArrowRightLeft className="w-8 h-8 text-white/40" />
             </div>
             <h3 className="text-lg font-bold text-white mb-2">No Movements Found</h3>
             <p className="text-sm text-white/50 max-w-sm mb-6">Stock movements will appear here when inventory is purchased, sold, or adjusted.</p>
             <Link href="/dashboard/inventory/adjustments" className="flex items-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-bold rounded-xl transition-all border border-white/[0.1]">
                Adjust Stock
             </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-white/50 uppercase bg-white/[0.02] border-b border-white/[0.06]">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium text-right">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {movements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-white/70">
                      {new Date(movement.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${movement.movementType === 'purchase_in' ? 'bg-[#00D9C0]/10 text-[#00D9C0]' : movement.movementType === 'sale_out' ? 'bg-amber-500/10 text-amber-500' : 'bg-white/10 text-white/70'}`}>
                        {movement.movementType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/inventory/products/${movement.productId}`} className="font-bold text-white hover:text-[#00D9C0] transition-colors">
                        {movement.product.name}
                      </Link>
                      <p className="text-[10px] text-white/40 mt-0.5">SKU: {movement.product.sku}</p>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {movement.warehouse.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold text-lg ${movement.quantity > 0 ? 'text-[#00D9C0]' : 'text-destructive'}`}>
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
