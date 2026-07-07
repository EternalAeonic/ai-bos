import { NextResponse } from "next/server";
import { StockCalculationService } from "@/modules/inventory/services/stock-service";
import { getAuthSession } from "@/lib/session";

export async function GET(req: Request) {
  const { error, businessId } = await getAuthSession();
  if (error) return error;

  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");
    const warehouseId = url.searchParams.get("warehouseId");

    if (productId && warehouseId) {
      const stock = await StockCalculationService.getProductStockInWarehouse(businessId!, productId, warehouseId);
      return NextResponse.json({ stock });
    } else if (productId) {
      const stock = await StockCalculationService.getProductTotalStock(businessId!, productId);
      return NextResponse.json({ stock });
    } else {
      const balances = await StockCalculationService.getAllStockBalances(businessId!);
      return NextResponse.json(balances);
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
