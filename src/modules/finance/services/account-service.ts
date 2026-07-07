import { withBusinessContext } from "@/lib/prisma";

export class AccountService {
  /**
   * Initializes the standard Chart of Accounts for a new business.
   */
  static async seedStandardAccounts(businessId: string) {
    const defaultAccounts = [
      { code: "1000", name: "Cash", type: "ASSET" },
      { code: "1100", name: "Accounts Receivable", type: "ASSET" },
      { code: "1200", name: "Inventory", type: "ASSET" },
      { code: "2000", name: "Accounts Payable", type: "LIABILITY" },
      { code: "3000", name: "Owner's Equity", type: "EQUITY" },
      { code: "4000", name: "Sales Revenue", type: "REVENUE" },
      { code: "5000", name: "Cost of Goods Sold", type: "EXPENSE" },
      { code: "6000", name: "Operating Expenses", type: "EXPENSE" },
    ];

    return await withBusinessContext(businessId, async (tx) => {
      // Check if they already exist
      const existing = await tx.ledgerAccount.findFirst({
        where: { businessId, code: "1000" },
      });

      if (existing) return;

      await tx.ledgerAccount.createMany({
        data: defaultAccounts.map((acc) => ({
          businessId,
          code: acc.code,
          name: acc.name,
          type: acc.type,
          isSystemAccount: true,
        })),
        skipDuplicates: true,
      });
    });
  }

  static async createAccount(
    businessId: string,
    data: { code: string; name: string; type: string; parentAccountId?: string }
  ) {
    return await withBusinessContext(businessId, async (tx) => {
      return await tx.ledgerAccount.create({
        data: {
          businessId,
          code: data.code,
          name: data.name,
          type: data.type,
          parentAccountId: data.parentAccountId,
          isSystemAccount: false,
        },
      });
    });
  }

  static async listAccounts(businessId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      return await tx.ledgerAccount.findMany({
        where: { deletedAt: null },
        orderBy: { code: "asc" },
      });
    });
  }

  static async getAccountByCode(businessId: string, code: string) {
    return await withBusinessContext(businessId, async (tx) => {
      return await tx.ledgerAccount.findUnique({
        where: {
          businessId_code: {
            businessId,
            code,
          },
        },
      });
    });
  }
}
