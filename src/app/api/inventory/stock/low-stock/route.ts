import { NextResponse } from "next/server";
import { StockCalculationService } from "@/modules/inventory/services/stock-service";
import { getAuthSession } from "@/lib/session";

export async function GET() {
  const { error, businessId } = await getAuthSession();
  if (error) return error;

  try {
    const balances = await StockCalculationService.getAllStockBalances(businessId!);
    const lowStock = balances.filter(b => b.isLowStock);
    
    return NextResponse.json(lowStock);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
