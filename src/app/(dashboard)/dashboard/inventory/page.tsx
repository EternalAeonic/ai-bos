import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, ArrowRightLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

export default async function InventoryDashboard() {
  // Normally we would fetch the stock totals and low stock here.
  // For the UI placeholder we will mock the display until DB connection is solid.

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">Across 5 categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">4</div>
            <p className="text-xs text-muted-foreground">Items below reorder level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Movements</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24</div>
            <p className="text-xs text-muted-foreground">Movements this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warehouses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Locations managing stock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Inventory Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/dashboard/inventory/products" className="flex items-center justify-center p-4 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90 transition-colors w-40 text-center font-medium">
              Manage Products
            </Link>
            <Link href="/dashboard/inventory/warehouses" className="flex items-center justify-center p-4 border border-border rounded-lg shadow-sm hover:bg-muted transition-colors w-40 text-center font-medium">
              Warehouses
            </Link>
            <Link href="/dashboard/inventory/suppliers" className="flex items-center justify-center p-4 border border-border rounded-lg shadow-sm hover:bg-muted transition-colors w-40 text-center font-medium">
              Suppliers
            </Link>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
            <CardDescription>Products that need to be reordered soon.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
               <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Steel Widget v2</p>
                    <p className="text-sm text-muted-foreground">SKU: WID-002</p>
                  </div>
                  <div className="ml-auto font-medium text-destructive">
                    5 left
                  </div>
               </div>
               <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Copper Wiring 50m</p>
                    <p className="text-sm text-muted-foreground">SKU: WIR-050</p>
                  </div>
                  <div className="ml-auto font-medium text-destructive">
                    2 left
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
