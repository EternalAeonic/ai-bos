import { NextResponse } from "next/server";
import { LocalBusinessAI } from "@/modules/ai/providers/local-ai-provider";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessId, query } = body;

    if (!businessId) {
      return NextResponse.json({ error: "Missing businessId" }, { status: 400 });
    }

    const aiProvider = new LocalBusinessAI();
    let response;

    if (query) {
      response = await aiProvider.askQuestion(businessId, query);
    } else {
      response = await aiProvider.generateDashboardBrief(businessId);
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[AI CEO Route] Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
