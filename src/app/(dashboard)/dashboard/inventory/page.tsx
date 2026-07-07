import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, ArrowRightLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StockCalculationService } from "@/modules/inventory/services/stock-service";

const DEMO_BUSINESS_ID = "demo-business-123";

export default async function InventoryDashboard() {
  // Fetch actual data
  const [productsCount, warehousesCount, movementsCount, categoriesCount] = await Promise.all([
    prisma.product.count({ where: { businessId: DEMO_BUSINESS_ID, deletedAt: null } }),
    prisma.warehouse.count({ where: { businessId: DEMO_BUSINESS_ID, deletedAt: null } }),
    prisma.inventoryMovement.count({ where: { businessId: DEMO_BUSINESS_ID } }),
    prisma.category.count({ where: { businessId: DEMO_BUSINESS_ID, deletedAt: null } }),
  ]);

  // Dynamic Stock Calculation for Low Stock Alerts
  const stockBalances = await StockCalculationService.getAllStockBalances(DEMO_BUSINESS_ID);
  const lowStockItems = stockBalances.filter(item => item.isLowStock);
  const lowStockCount = lowStockItems.length;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/[0.02] border-white/[0.06]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount}</div>
            <p className="text-xs text-muted-foreground">Across {categoriesCount} categories</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/[0.02] border-white/[0.06]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Items below reorder level</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/[0.06]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Movements</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movementsCount}</div>
            <p className="text-xs text-muted-foreground">All-time movements</p>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.02] border-white/[0.06]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warehouses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehousesCount}</div>
            <p className="text-xs text-muted-foreground">Locations managing stock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4 bg-white/[0.02] border-white/[0.06]">
          <CardHeader>
            <CardTitle>Inventory Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/dashboard/inventory/products" className="flex items-center justify-center p-4 bg-[#00D9C0]/10 border border-[#00D9C0]/20 text-[#00D9C0] hover:bg-[#00D9C0]/20 rounded-lg transition-colors w-40 text-center font-bold">
              Manage Products
            </Link>
            <Link href="/dashboard/inventory/categories" className="flex items-center justify-center p-4 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] rounded-lg transition-colors w-40 text-center font-medium">
              Categories
            </Link>
            <Link href="/dashboard/inventory/warehouses" className="flex items-center justify-center p-4 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] rounded-lg transition-colors w-40 text-center font-medium">
              Warehouses
            </Link>
            <Link href="/dashboard/inventory/movements" className="flex items-center justify-center p-4 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] rounded-lg transition-colors w-40 text-center font-medium">
              Stock Movements
            </Link>
            <Link href="/dashboard/inventory/adjustments" className="flex items-center justify-center p-4 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] rounded-lg transition-colors w-40 text-center font-medium text-amber-500 border-amber-500/20">
              Adjust Stock
            </Link>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-white/[0.02] border-white/[0.06]">
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
            <CardDescription>Products that need to be reordered soon.</CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                 <Package className="w-8 h-8 text-white/20 mb-3" />
                 <p className="text-sm font-medium text-white/60">No low stock items</p>
                 <p className="text-xs text-white/40">All products are adequately stocked.</p>
              </div>
            ) : (
              <div className="space-y-4">
                 {lowStockItems.slice(0, 5).map((item) => (
                   <div key={item.product.id} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.05] bg-white/[0.02]">
                      <div className="space-y-1">
                        <Link href={`/dashboard/inventory/products/${item.product.id}`} className="text-sm font-bold leading-none hover:text-[#00D9C0] transition-colors">{item.product.name}</Link>
                        <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-destructive">
                          {item.currentStock} left
                        </div>
                        <p className="text-[10px] text-white/40">Reorder: {item.product.reorderLevel}</p>
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
