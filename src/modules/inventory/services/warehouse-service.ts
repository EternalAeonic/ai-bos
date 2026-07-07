import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "../../audit/audit-service";

export class WarehouseService {
  static async create(
    businessId: string,
    userId: string,
    data: { name: string; address?: string; isDefault?: boolean }
  ) {
    return await withBusinessContext(businessId, async (tx) => {
      const warehouse = await tx.warehouse.create({
        data: {
          businessId,
          ...data,
        },
      });

      await AuditService.log(tx, {
        businessId,
        userId,
        action: "CREATE",
        entity: "WAREHOUSE",
        entityId: warehouse.id,
        details: { name: warehouse.name },
      });

      return warehouse;
    });
  }

  static async list(businessId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      return await tx.warehouse.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
      });
    });
  }
}
