import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "../../audit/audit-service";

export class InventoryMovementService {
  static async recordMovement(
    businessId: string,
    userId: string,
    data: {
      productId: string;
      warehouseId: string;
      movementType: "purchase_in" | "sale_out" | "adjustment" | "return" | "transfer";
      quantity: number; // positive for IN, negative for OUT
      referenceType?: string;
      referenceId?: string;
    }
  ) {
    return await withBusinessContext(businessId, async (tx) => {
      // 1. Create movement record (append-only ledger)
      const movement = await tx.inventoryMovement.create({
        data: {
          businessId,
          productId: data.productId,
          warehouseId: data.warehouseId,
          movementType: data.movementType,
          quantity: data.quantity,
          referenceType: data.referenceType,
          referenceId: data.referenceId,
          createdBy: userId,
        },
      });

      // 2. Audit log
      await AuditService.log(tx, {
        businessId,
        userId,
        action: "STOCK_MOVEMENT",
        entity: "INVENTORY_MOVEMENT",
        entityId: movement.id,
        details: {
          movementType: data.movementType,
          quantity: data.quantity,
          productId: data.productId,
          warehouseId: data.warehouseId,
        },
      });

      return movement;
    });
  }

  static async listMovements(businessId: string, filters?: { productId?: string; warehouseId?: string }) {
    return await withBusinessContext(businessId, async (tx) => {
      return await tx.inventoryMovement.findMany({
        where: filters,
        include: { product: true, warehouse: true },
        orderBy: { createdAt: "desc" },
      });
    });
  }
}
