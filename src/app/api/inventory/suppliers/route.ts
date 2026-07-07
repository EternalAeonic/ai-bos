import { NextResponse } from "next/server";
import { SupplierService } from "@/modules/inventory/services/supplier-service";
import { getAuthSession } from "@/lib/session";

export async function GET() {
  const { error, businessId } = await getAuthSession();
  if (error) return error;

  try {
    const suppliers = await SupplierService.list(businessId!);
    return NextResponse.json(suppliers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error, businessId, user } = await getAuthSession();
  if (error) return error;

  try {
    const body = await req.json();
    const supplier = await SupplierService.create(businessId!, user!.id, body);
    return NextResponse.json(supplier, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
