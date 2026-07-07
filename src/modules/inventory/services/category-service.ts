import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "../../audit/audit-service";

export class CategoryService {
  static async create(businessId: string, userId: string, data: { name: string; parentCategoryId?: string }) {
    return await withBusinessContext(businessId, async (tx) => {
      const category = await tx.category.create({
        data: {
          businessId,
          name: data.name,
          parentCategoryId: data.parentCategoryId,
        },
      });

      await AuditService.log(tx, {
        businessId,
        userId,
        action: "CREATE",
        entity: "CATEGORY",
        entityId: category.id,
        details: { name: category.name },
      });

      return category;
    });
  }

  static async list(businessId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      return await tx.category.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
      });
    });
  }
}
