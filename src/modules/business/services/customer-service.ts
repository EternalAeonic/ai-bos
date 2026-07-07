import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "@/modules/audit/audit-service";

export type CustomerData = {
  name: string; email?: string; phone?: string; address?: string;
  city?: string; state?: string; country?: string; postalCode?: string;
  category?: string; paymentTerms?: string; creditLimit?: number;
  gstNumber?: string; notes?: string;
};

export class CustomerService {
  static async list(businessId: string) {
    return withBusinessContext(businessId, async (tx) =>
      tx.customer.findMany({ where: { businessId, deletedAt: null }, orderBy: [{ category: "asc" }, { name: "asc" }] })
    );
  }

  static async create(businessId: string, userId: string, data: CustomerData) {
    return withBusinessContext(businessId, async (tx) => {
      const customer = await tx.customer.create({ data: { businessId, ...data } });
      await AuditService.log(tx, { businessId, userId, action: "CREATE", entity: "CUSTOMER", entityId: customer.id, details: { name: data.name } });
      return customer;
    });
  }

  static async update(businessId: string, userId: string, id: string, data: Partial<CustomerData>) {
    return withBusinessContext(businessId, async (tx) => {
      const customer = await tx.customer.update({ where: { id }, data });
      await AuditService.log(tx, { businessId, userId, action: "UPDATE", entity: "CUSTOMER", entityId: id, details: data });
      return customer;
    });
  }

  static async delete(businessId: string, userId: string, id: string) {
    return withBusinessContext(businessId, async (tx) => {
      await tx.customer.update({ where: { id }, data: { deletedAt: new Date() } });
      await AuditService.log(tx, { businessId, userId, action: "DELETE", entity: "CUSTOMER", entityId: id, details: {} });
    });
  }
}
