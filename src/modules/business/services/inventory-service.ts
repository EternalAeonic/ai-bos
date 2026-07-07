import { withBusinessContext } from "@/lib/prisma";
import { InvalidQuantityException } from "@/lib/exceptions";
import { AuditService } from "@/modules/audit/audit-service";

export class InventoryService {
  static async adjustStock(businessId: string, userId: string, productId: string, warehouseId: string, quantity: number) {
    if (quantity < 0) {
      throw new InvalidQuantityException("Cannot adjust stock by a negative amount directly");
    }

    return withBusinessContext(businessId, async (tx) => {
      // Logic for adjusting stock
      const movement = await tx.inventoryMovement.create({
        data: {
          businessId,
          productId,
          warehouseId,
          quantity,
          movementType: "ADJUSTMENT",
          createdBy: userId,
        }
      });

      await AuditService.log(tx, {
        businessId,
        userId,
        action: "ADJUST_STOCK",
        entity: "INVENTORY",
        entityId: movement.id,
        details: { productId, quantity }
      });

      return movement;
    });
  }
}
