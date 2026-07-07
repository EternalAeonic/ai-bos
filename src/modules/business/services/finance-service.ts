import { withBusinessContext } from "@/lib/prisma";
import { JournalNotBalancedException } from "@/lib/exceptions";
import { AuditService } from "@/modules/audit/audit-service";
import { Prisma } from "@prisma/client";

export class FinanceService {
  static async postJournal(businessId: string, userId: string, description: string, lines: { accountId: string, debit: number, credit: number }[]) {
    // Validation
    const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);

    if (totalDebit !== totalCredit) {
      throw new JournalNotBalancedException(`Debits (${totalDebit}) do not equal Credits (${totalCredit})`);
    }

    return withBusinessContext(businessId, async (tx) => {
      const entry = await tx.journalEntry.create({
        data: {
          businessId,
          description,
          entryDate: new Date(),
          createdBy: userId,
          lines: {
            create: lines.map(line => ({
              businessId,
              accountId: line.accountId,
              debit: line.debit,
              credit: line.credit
            }))
          }
        }
      });

      await AuditService.log(tx, {
        businessId,
        userId,
        action: "POST_JOURNAL",
        entity: "JOURNAL",
        entityId: entry.id,
        details: { description, totalDebit }
      });

      return entry;
    });
  }
}
