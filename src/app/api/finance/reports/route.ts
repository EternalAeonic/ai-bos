import { NextRequest, NextResponse } from "next/server";
import { BalanceService } from "@/modules/finance/services/balance-service";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "trial-balance" or "pnl"
    
    if (type === "trial-balance") {
      const tb = await BalanceService.getTrialBalance(session.user.businessId);
      return NextResponse.json(tb);
    } else if (type === "pnl") {
      const pnl = await BalanceService.getProfitAndLoss(session.user.businessId);
      return NextResponse.json(pnl);
    }

    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
