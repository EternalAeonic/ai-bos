import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "@/modules/audit/audit-service";

export type FinanceSettingsData = {
  fiscalYearStart?: string; accountingMethod?: string; invoicePrefix?: string;
  poPrefix?: string; quotePrefix?: string; defaultCurrency?: string;
  openingCash?: number; openingBank?: number; openingReceivables?: number; openingPayables?: number;
};

export type BankAccountData = {
  name: string; bankName?: string; accountNumber?: string; ifscCode?: string;
  branch?: string; currency?: string; openingBalance?: number; isDefault?: boolean;
};

export class FinanceConfigService {
  static async getSettings(businessId: string) {
    return withBusinessContext(businessId, async (tx) => tx.businessSettings.findUnique({ where: { businessId } }));
  }

  static async upsertSettings(businessId: string, userId: string, data: FinanceSettingsData) {
    return withBusinessContext(businessId, async (tx) => {
      const settings = await tx.businessSettings.upsert({
        where: { businessId },
        update: data,
        create: { businessId, ...data },
      });
      await AuditService.log(tx, { businessId, userId, action: "UPDATE", entity: "FINANCE_SETTINGS", entityId: businessId, details: data });
      return settings;
    });
  }

  static async listBankAccounts(businessId: string) {
    return withBusinessContext(businessId, async (tx) =>
      tx.bankAccount.findMany({ where: { businessId, deletedAt: null }, orderBy: [{ isDefault: "desc" }, { name: "asc" }] })
    );
  }

  static async createBankAccount(businessId: string, userId: string, data: BankAccountData) {
    return withBusinessContext(businessId, async (tx) => {
      if (data.isDefault) {
        await tx.bankAccount.updateMany({ where: { businessId, deletedAt: null }, data: { isDefault: false } });
      }
      const account = await tx.bankAccount.create({ data: { businessId, ...data } });
      await AuditService.log(tx, { businessId, userId, action: "CREATE", entity: "BANK_ACCOUNT", entityId: account.id, details: { name: data.name } });
      return account;
    });
  }

  static async updateBankAccount(businessId: string, userId: string, id: string, data: Partial<BankAccountData>) {
    return withBusinessContext(businessId, async (tx) => {
      if (data.isDefault) {
        await tx.bankAccount.updateMany({ where: { businessId, deletedAt: null }, data: { isDefault: false } });
      }
      const account = await tx.bankAccount.update({ where: { id }, data });
      await AuditService.log(tx, { businessId, userId, action: "UPDATE", entity: "BANK_ACCOUNT", entityId: id, details: data });
      return account;
    });
  }

  static async deleteBankAccount(businessId: string, userId: string, id: string) {
    return withBusinessContext(businessId, async (tx) => {
      await tx.bankAccount.update({ where: { id }, data: { deletedAt: new Date() } });
      await AuditService.log(tx, { businessId, userId, action: "DELETE", entity: "BANK_ACCOUNT", entityId: id, details: {} });
    });
  }
}
