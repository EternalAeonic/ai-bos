import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "../../audit/audit-service";

export type JournalLineInput = {
  accountId: string;
  debit: number;
  credit: number;
};

export class JournalEntryService {
  /**
   * Posts a new journal entry, enforcing double-entry accounting rules.
   */
  static async postTransaction(
    businessId: string,
    userId: string,
    data: {
      entryDate: Date;
      description: string;
      sourceType?: string;
      sourceId?: string;
    },
    lines: JournalLineInput[]
  ) {
    if (lines.length < 2) {
      throw new Error("A journal entry must have at least two lines.");
    }

    const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);

    // Using a small epsilon to avoid floating point issues, though Decimal handles this better,
    // we use number in JS for inputs here.
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new Error(`Unbalanced journal entry: Debits (${totalDebit}) != Credits (${totalCredit})`);
    }

    return await withBusinessContext(businessId, async (tx) => {
      const entry = await tx.journalEntry.create({
        data: {
          businessId,
          entryDate: data.entryDate,
          description: data.description,
          sourceType: data.sourceType,
          sourceId: data.sourceId,
          createdBy: userId,
          lines: {
            create: lines.map((line) => ({
              businessId,
              accountId: line.accountId,
              debit: line.debit,
              credit: line.credit,
            })),
          },
        },
        include: { lines: true },
      });

      // Audit log
      await AuditService.log(tx, {
        businessId,
        userId,
        action: "POST_JOURNAL_ENTRY",
        entity: "JOURNAL_ENTRY",
        entityId: entry.id,
        details: {
          description: data.description,
          totalDebit,
          totalCredit,
          sourceType: data.sourceType,
          sourceId: data.sourceId,
        },
      });

      return entry;
    });
  }

  static async listEntries(businessId: string, limit: number = 50, offset: number = 0) {
    return await withBusinessContext(businessId, async (tx) => {
      return await tx.journalEntry.findMany({
        orderBy: { entryDate: "desc" },
        take: limit,
        skip: offset,
        include: {
          lines: {
            include: { account: true },
          },
        },
      });
    });
  }
}
