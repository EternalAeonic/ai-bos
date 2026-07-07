import { NextResponse } from "next/server";
import { InventoryMovementService } from "@/modules/inventory/services/movement-service";
import { getAuthSession } from "@/lib/session";

export async function GET(req: Request) {
  const { error, businessId } = await getAuthSession();
  if (error) return error;

  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId") || undefined;
    const warehouseId = url.searchParams.get("warehouseId") || undefined;

    const movements = await InventoryMovementService.listMovements(businessId!, { productId, warehouseId });
    return NextResponse.json(movements);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error, businessId, user } = await getAuthSession();
  if (error) return error;

  try {
    const body = await req.json();
    const movement = await InventoryMovementService.recordMovement(businessId!, user!.id, body);
    return NextResponse.json(movement, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
