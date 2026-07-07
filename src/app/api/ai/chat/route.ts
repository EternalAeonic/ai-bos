import { NextResponse } from "next/server";
import { AICEO } from "@/modules/ai/core/ai-ceo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, businessId } = body;

    if (!message || !businessId) {
      return NextResponse.json({ error: "Missing message or businessId" }, { status: 400 });
    }

    // In a real app, userId comes from session. We mock it for the demo.
    const userId = "demo-user-123";

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: "OPENAI_API_KEY is not set in your environment variables. Please add it to your .env.local file to use the AI CEO." 
      }, { status: 401 });
    }

    const result = await AICEO.processMessage(businessId, userId, message);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI CEO Error:", error);
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
  }
}
