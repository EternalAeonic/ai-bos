import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "@/modules/audit/audit-service";

export type TaxConfigData = {
  taxType: string; name: string; rate: number;
  hsnCode?: string; region?: string; invoiceFormat?: string; isDefault?: boolean;
};

export class TaxService {
  static async list(businessId: string) {
    return withBusinessContext(businessId, async (tx) =>
      tx.taxConfiguration.findMany({ where: { businessId, deletedAt: null }, orderBy: [{ isDefault: "desc" }, { taxType: "asc" }] })
    );
  }

  static async create(businessId: string, userId: string, data: TaxConfigData) {
    return withBusinessContext(businessId, async (tx) => {
      if (data.isDefault) {
        await tx.taxConfiguration.updateMany({ where: { businessId, deletedAt: null }, data: { isDefault: false } });
      }
      const tax = await tx.taxConfiguration.create({ data: { businessId, ...data } });
      await AuditService.log(tx, { businessId, userId, action: "CREATE", entity: "TAX_CONFIGURATION", entityId: tax.id, details: { name: data.name, rate: data.rate } });
      return tax;
    });
  }

  static async update(businessId: string, userId: string, id: string, data: Partial<TaxConfigData>) {
    return withBusinessContext(businessId, async (tx) => {
      if (data.isDefault) {
        await tx.taxConfiguration.updateMany({ where: { businessId, deletedAt: null }, data: { isDefault: false } });
      }
      const tax = await tx.taxConfiguration.update({ where: { id }, data });
      await AuditService.log(tx, { businessId, userId, action: "UPDATE", entity: "TAX_CONFIGURATION", entityId: id, details: data });
      return tax;
    });
  }

  static async delete(businessId: string, userId: string, id: string) {
    return withBusinessContext(businessId, async (tx) => {
      await tx.taxConfiguration.update({ where: { id }, data: { deletedAt: new Date() } });
      await AuditService.log(tx, { businessId, userId, action: "DELETE", entity: "TAX_CONFIGURATION", entityId: id, details: {} });
    });
  }
}

export const TAX_TYPES = ["GST", "VAT", "SALES_TAX", "SERVICE_TAX", "EXCISE", "CUSTOM"];
