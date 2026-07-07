import { NextResponse } from "next/server";
import { WarehouseService } from "@/modules/inventory/services/warehouse-service";
import { getAuthSession } from "@/lib/session";

export async function GET() {
  const { error, businessId } = await getAuthSession();
  if (error) return error;

  try {
    const warehouses = await WarehouseService.list(businessId!);
    return NextResponse.json(warehouses);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error, businessId, user } = await getAuthSession();
  if (error) return error;

  try {
    const body = await req.json();
    const warehouse = await WarehouseService.create(businessId!, user!.id, body);
    return NextResponse.json(warehouse, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
