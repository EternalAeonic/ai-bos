import { NextResponse } from "next/server";
import { ProductService } from "@/modules/inventory/services/product-service";
import { getAuthSession } from "@/lib/session";

export async function GET() {
  const { error, businessId } = await getAuthSession();
  if (error) return error;

  try {
    const products = await ProductService.listProducts(businessId!);
    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error, businessId, user } = await getAuthSession();
  if (error) return error;

  try {
    const body = await req.json();
    const product = await ProductService.createProduct(businessId!, user!.id, body);
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
