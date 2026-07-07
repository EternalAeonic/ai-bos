import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "@/modules/audit/audit-service";

export type SupplierData = {
  name: string; contactPerson?: string; email?: string; phone?: string;
  address?: string; city?: string; country?: string; postalCode?: string;
  gstNumber?: string; paymentTerms?: string; leadTimeDays?: number; isPreferred?: boolean;
};

export class BusinessSupplierService {
  static async list(businessId: string) {
    return withBusinessContext(businessId, async (tx) =>
      tx.supplier.findMany({ where: { businessId, deletedAt: null }, orderBy: [{ isPreferred: "desc" }, { name: "asc" }] })
    );
  }

  static async create(businessId: string, userId: string, data: SupplierData) {
    return withBusinessContext(businessId, async (tx) => {
      const supplier = await tx.supplier.create({ data: { businessId, ...data } });
      await AuditService.log(tx, { businessId, userId, action: "CREATE", entity: "SUPPLIER", entityId: supplier.id, details: { name: data.name } });
      return supplier;
    });
  }

  static async update(businessId: string, userId: string, id: string, data: Partial<SupplierData>) {
    return withBusinessContext(businessId, async (tx) => {
      const supplier = await tx.supplier.update({ where: { id }, data });
      await AuditService.log(tx, { businessId, userId, action: "UPDATE", entity: "SUPPLIER", entityId: id, details: data });
      return supplier;
    });
  }

  static async delete(businessId: string, userId: string, id: string) {
    return withBusinessContext(businessId, async (tx) => {
      await tx.supplier.update({ where: { id }, data: { deletedAt: new Date() } });
      await AuditService.log(tx, { businessId, userId, action: "DELETE", entity: "SUPPLIER", entityId: id, details: {} });
    });
  }
}
