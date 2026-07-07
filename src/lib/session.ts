import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function getAuthSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const businessId = (session.user as any).businessId;
  if (!businessId) {
    return { error: NextResponse.json({ error: "No active business context" }, { status: 403 }) };
  }

  return { session, user: session.user, businessId };
}
