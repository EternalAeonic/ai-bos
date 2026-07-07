import { NextResponse } from "next/server";
import { CategoryService } from "@/modules/inventory/services/category-service";
import { getAuthSession } from "@/lib/session";

export async function GET() {
  const { error, businessId } = await getAuthSession();
  if (error) return error;

  try {
    const categories = await CategoryService.list(businessId!);
    return NextResponse.json(categories);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error, businessId, user } = await getAuthSession();
  if (error) return error;

  try {
    const body = await req.json();
    const category = await CategoryService.create(businessId!, user!.id, body);
    return NextResponse.json(category, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
