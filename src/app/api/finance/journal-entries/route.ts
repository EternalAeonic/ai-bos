import { NextRequest, NextResponse } from "next/server";
import { JournalEntryService } from "@/modules/finance/services/journal-service";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await JournalEntryService.listEntries(session.user.businessId);
    return NextResponse.json(entries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { entryDate, description, sourceType, sourceId, lines } = body;

    const entry = await JournalEntryService.postTransaction(
      session.user.businessId,
      session.user.id,
      { entryDate: new Date(entryDate || Date.now()), description, sourceType, sourceId },
      lines
    );

    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 }); // usually validation errors
  }
}
