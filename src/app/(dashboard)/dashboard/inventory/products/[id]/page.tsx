import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StockCalculationService } from "@/modules/inventory/services/stock-service";
import { Bot, Package, ArrowRightLeft, Building2, MapPin, Edit } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEMO_BUSINESS_ID = "demo-business-123";

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id, businessId: DEMO_BUSINESS_ID, deletedAt: null },
    include: {
      category: true,
      supplier: true,
      movements: {
        include: { warehouse: true },
        orderBy: { createdAt: "desc" },
      },
    }
  });

  if (!product) return notFound();

  const currentStock = await StockCalculationService.getProductTotalStock(DEMO_BUSINESS_ID, product.id);
  const isLowStock = currentStock <= product.reorderLevel;

  // Extremely basic AI mock insights as requested by the user
  // (In a real scenario, this would come from the AIRecommendation table or live inference)
  const daysUntilStockout = currentStock > 0 ? Math.floor(Math.random() * 20) + 2 : 0;
  const recommendedReorder = Math.max(100, product.reorderLevel * 2);
  const estimatedSavings = Math.floor(Math.random() * 5000) + 1000;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Link href="/dashboard/inventory/products" className="hover:text-white">Products</Link>
            <span>/</span>
            <span>{product.sku}</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            {product.name}
            {isLowStock && <span className="px-2.5 py-1 text-xs font-bold bg-destructive/10 text-destructive rounded-full">Low Stock</span>}
          </h2>
        </div>
        <Link
          href={`/dashboard/inventory/products/${product.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Product Info & Insights */}
        <div className="space-y-6 col-span-2">
          
          <div className="grid grid-cols-2 gap-4">
             <Card className="bg-white/[0.02] border-white/[0.06]">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-white/50 flex items-center justify-between">
                      Current Stock
                      <Package className="w-4 h-4" />
                   </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="text-3xl font-bold">{currentStock} <span className="text-lg font-normal text-white/50">{product.unit}</span></div>
                   <p className="text-xs text-white/40 mt-1">Reorder Level: {product.reorderLevel}</p>
                </CardContent>
             </Card>
             <Card className="bg-white/[0.02] border-white/[0.06]">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-white/50 flex items-center justify-between">
                      Pricing (Cost / Sell)
                      <span className="text-white/30">$</span>
                   </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="text-xl font-bold">
                     <span className="text-white/60">${Number(product.costPrice).toFixed(2)}</span> / ${Number(product.sellPrice).toFixed(2)}
                   </div>
                   <p className="text-xs text-white/40 mt-1">Margin: {(((Number(product.sellPrice) - Number(product.costPrice)) / Number(product.sellPrice)) * 100).toFixed(1)}%</p>
                </CardContent>
             </Card>
          </div>

          <Card className="bg-gradient-to-br from-[#00D9C0]/10 to-[#141B41]/30 border-[#00D9C0]/20">
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-[#00D9C0]">
                 <Bot className="w-5 h-5" />
                 AI Inventory Insight
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <p className="text-white/80">
                  Stock will likely run out in <span className="font-bold text-white">{daysUntilStockout} days</span> based on recent sales velocity.
                </p>
                <div className="grid grid-cols-3 gap-4">
                   <div className="bg-black/20 rounded-lg p-3 border border-[#00D9C0]/10">
                     <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1">Recommended Reorder</p>
                     <p className="text-lg font-bold text-white">{recommendedReorder} units</p>
                   </div>
                   <div className="bg-black/20 rounded-lg p-3 border border-[#00D9C0]/10">
                     <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1">Best Supplier</p>
                     <p className="text-sm font-bold text-white truncate">{product.supplier?.name || "Multiple Candidates"}</p>
                   </div>
                   <div className="bg-black/20 rounded-lg p-3 border border-[#00D9C0]/10">
                     <p className="text-[10px] text-[#00D9C0]/70 uppercase font-bold tracking-wider mb-1">Estimated Savings</p>
                     <p className="text-lg font-bold text-[#00D9C0]">${estimatedSavings}</p>
                   </div>
                </div>
                <div className="pt-2">
                   <button className="px-4 py-2 bg-[#00D9C0]/10 hover:bg-[#00D9C0]/20 text-[#00D9C0] text-sm font-bold rounded-lg transition-colors border border-[#00D9C0]/30 w-full">
                     Generate Draft Purchase Order
                   </button>
                </div>
             </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/[0.06]">
            <CardHeader>
               <CardTitle className="text-base flex items-center gap-2">
                 <ArrowRightLeft className="w-4 h-4 text-white/50" />
                 Complete Movement History
               </CardTitle>
            </CardHeader>
            <CardContent>
               {product.movements.length === 0 ? (
                 <div className="text-center py-8 text-white/40 text-sm">No movements recorded yet.</div>
               ) : (
                 <div className="space-y-4">
                   {product.movements.map(m => (
                     <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.quantity > 0 ? 'bg-[#00D9C0]/10 text-[#00D9C0]' : 'bg-destructive/10 text-destructive'}`}>
                             {m.quantity > 0 ? '+' : '-'}
                           </div>
                           <div>
                             <p className="text-sm font-medium capitalize text-white/80">{m.movementType.replace('_', ' ')}</p>
                             <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                               <MapPin className="w-3 h-3" /> {m.warehouse.name}
                             </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={`font-bold ${m.quantity > 0 ? 'text-[#00D9C0]' : 'text-destructive'}`}>
                             {m.quantity > 0 ? '+' : ''}{m.quantity}
                           </p>
                           <p className="text-[10px] text-white/30">{new Date(m.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Metadata */}
        <div className="space-y-6">
           <Card className="bg-white/[0.02] border-white/[0.06]">
             <CardHeader>
               <CardTitle className="text-base text-white/80">Details</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div>
                   <p className="text-xs text-white/40 uppercase font-semibold mb-1">Category</p>
                   <p className="text-sm font-medium">{product.category?.name || "Uncategorized"}</p>
                </div>
                <div>
                   <p className="text-xs text-white/40 uppercase font-semibold mb-1">Primary Supplier</p>
                   {product.supplier ? (
                     <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                        <Building2 className="w-4 h-4 text-white/50" />
                        <span className="text-sm">{product.supplier.name}</span>
                     </div>
                   ) : (
                     <p className="text-sm text-white/50">No supplier assigned</p>
                   )}
                </div>
                <div>
                   <p className="text-xs text-white/40 uppercase font-semibold mb-1">Added On</p>
                   <p className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</p>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
