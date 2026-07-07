import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { StockCalculationService } from "@/modules/inventory/services/stock-service";

const DEMO_BUSINESS_ID = "demo-business-123";

export default async function ProductsPage() {
  const stockBalances = await StockCalculationService.getAllStockBalances(DEMO_BUSINESS_ID);
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground mt-1">Manage your product catalog and view stock levels.</p>
        </div>
        <Link
          href="/dashboard/inventory/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#00D9C0] hover:bg-[#00c2ab] text-[#0B0F1A] text-sm font-bold rounded-xl transition-all shadow-[0_8px_24px_rgba(0,217,192,0.25)] hover:shadow-[0_8px_32px_rgba(0,217,192,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] p-2 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            className="w-full pl-9 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm outline-none"
          />
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {stockBalances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-4">
               <Package className="w-8 h-8 text-white/40" />
             </div>
             <h3 className="text-lg font-bold text-white mb-2">No Products Yet</h3>
             <p className="text-sm text-white/50 max-w-sm mb-6">You haven't added any products to your inventory. Create your first product to start tracking stock.</p>
             <Link
                href="/dashboard/inventory/products/new"
                className="flex items-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-bold rounded-xl transition-all border border-white/[0.1]"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-white/50 uppercase bg-white/[0.02] border-b border-white/[0.06]">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {stockBalances.map((item) => (
                  <tr key={item.product.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-white/40" />
                        </div>
                        <div>
                          <Link href={`/dashboard/inventory/products/${item.product.id}`} className="font-bold text-white group-hover:text-[#00D9C0] transition-colors">
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-white/40 mt-0.5">SKU: {item.product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white/70">{(item.product as any).category?.name || <span className="text-white/30">Uncategorized</span>}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`font-bold ${
                          (item as any).isOutOfStock ? 'text-red-400' : 
                          item.isLowStock ? 'text-amber-400' : 'text-white'
                        }`}>
                          {item.currentStock} {item.product.unit}
                        </span>
                        {(item as any).isOutOfStock && <span className="text-[10px] text-red-400">Out of Stock</span>}
                        {!((item as any).isOutOfStock) && item.isLowStock && <span className="text-[10px] text-amber-400">Low Stock</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/90 font-medium">
                      ₹{Number(item.product.sellPrice).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        (item as any).isOutOfStock ? 'bg-red-500/10 text-red-400' :
                        item.isLowStock ? 'bg-amber-500/10 text-amber-400' : 
                        'bg-[#00D9C0]/10 text-[#00D9C0]'
                      }`}>
                        {(item as any).isOutOfStock ? 'Out of Stock' : item.isLowStock ? 'Reorder' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/inventory/products/${item.product.id}`} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
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
