import { NextResponse } from "next/server";
import { ProductService } from "@/modules/inventory/services/product-service";
import { getAuthSession } from "@/lib/session";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error, businessId } = await getAuthSession();
  if (error) return error;

  try {
    const { id } = await params;
    const product = await ProductService.getProduct(businessId!, id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    
    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error, businessId, user } = await getAuthSession();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const product = await ProductService.updateProduct(businessId!, user!.id, id, body);
    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error, businessId, user } = await getAuthSession();
  if (error) return error;

  try {
    const { id } = await params;
    await ProductService.deleteProduct(businessId!, user!.id, id);
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
