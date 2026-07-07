import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "../../audit/audit-service";

export class SupplierService {
  static async create(
    businessId: string,
    userId: string,
    data: { name: string; email?: string; phone?: string; address?: string }
  ) {
    return await withBusinessContext(businessId, async (tx) => {
      const supplier = await tx.supplier.create({
        data: {
          businessId,
          ...data,
        },
      });

      await AuditService.log(tx, {
        businessId,
        userId,
        action: "CREATE",
        entity: "SUPPLIER",
        entityId: supplier.id,
        details: { name: supplier.name },
      });

      return supplier;
    });
  }

  static async list(businessId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      return await tx.supplier.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
      });
    });
  }
}
