import { withBusinessContext } from "@/lib/prisma";

export class BalanceService {
  /**
   * Generates a Trial Balance report.
   * Sums all debits and credits for each account.
   */
  static async getTrialBalance(businessId: string, asOfDate?: Date) {
    return await withBusinessContext(businessId, async (tx) => {
      const dateFilter = asOfDate ? { entryDate: { lte: asOfDate } } : {};

      // Get all accounts
      const accounts = await tx.ledgerAccount.findMany({
        where: { deletedAt: null },
        orderBy: { code: "asc" },
      });

      // Get aggregate of all journal lines per account
      const lineAggregates = await tx.journalLine.groupBy({
        by: ["accountId"],
        _sum: {
          debit: true,
          credit: true,
        },
        where: {
          journalEntry: dateFilter,
        },
      });

      const aggregatesMap = new Map(
        lineAggregates.map((agg) => [
          agg.accountId,
          {
            debit: Number(agg._sum.debit || 0),
            credit: Number(agg._sum.credit || 0),
          },
        ])
      );

      return accounts.map((acc) => {
        const sums = aggregatesMap.get(acc.id) || { debit: 0, credit: 0 };
        let balance = 0;
        let balanceType = "DEBIT";

        // Natural balance logic
        if (acc.type === "ASSET" || acc.type === "EXPENSE") {
          balance = sums.debit - sums.credit;
          balanceType = balance >= 0 ? "DEBIT" : "CREDIT";
        } else {
          balance = sums.credit - sums.debit;
          balanceType = balance >= 0 ? "CREDIT" : "DEBIT";
        }

        return {
          accountId: acc.id,
          code: acc.code,
          name: acc.name,
          type: acc.type,
          totalDebit: sums.debit,
          totalCredit: sums.credit,
          balance: Math.abs(balance),
          balanceType,
        };
      });
    });
  }

  /**
   * Basic Profit & Loss calculation (Revenue - Expenses)
   */
  static async getProfitAndLoss(businessId: string, startDate?: Date, endDate?: Date) {
    const trialBalance = await this.getTrialBalance(businessId, endDate); // naive: no start date filter in this quick impl

    const revenues = trialBalance.filter((acc) => acc.type === "REVENUE");
    const expenses = trialBalance.filter((acc) => acc.type === "EXPENSE");

    const totalRevenue = revenues.reduce((sum, acc) => sum + (acc.balanceType === "CREDIT" ? acc.balance : -acc.balance), 0);
    const totalExpense = expenses.reduce((sum, acc) => sum + (acc.balanceType === "DEBIT" ? acc.balance : -acc.balance), 0);

    return {
      totalRevenue,
      totalExpense,
      netIncome: totalRevenue - totalExpense,
      revenues,
      expenses,
    };
  }
}
