import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "../../audit/audit-service";
import { JournalEntryService } from "../../finance/services/journal-service";
import { AccountService } from "../../finance/services/account-service";
import { prisma } from "@/lib/prisma";

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

      // 3. Finance Integration (Double-Entry)
      if (data.movementType === "purchase_in" || data.movementType === "sale_out") {
        // Fetch accounts
        const inventoryAccount = await tx.ledgerAccount.findFirst({ where: { businessId, code: "1200" } });
        const apAccount = await tx.ledgerAccount.findFirst({ where: { businessId, code: "2000" } });
        const cogsAccount = await tx.ledgerAccount.findFirst({ where: { businessId, code: "5000" } });
        
        // Need cost price
        const product = await tx.product.findUnique({ where: { id: data.productId } });
        const totalValue = Number(product?.costPrice || 0) * Math.abs(data.quantity);

        if (inventoryAccount && totalValue > 0) {
          if (data.movementType === "purchase_in" && apAccount) {
            // Debit Inventory, Credit AP
            await JournalEntryService.postTransaction(
              businessId,
              userId,
              {
                entryDate: new Date(),
                description: `Inventory Purchase - Product ${product?.sku || data.productId}`,
                sourceType: "inventory_movement",
                sourceId: movement.id,
              },
              [
                { accountId: inventoryAccount.id, debit: totalValue, credit: 0 },
                { accountId: apAccount.id, debit: 0, credit: totalValue },
              ]
            );
          } else if (data.movementType === "sale_out" && cogsAccount) {
            // Debit COGS, Credit Inventory (cost of goods sold)
            await JournalEntryService.postTransaction(
              businessId,
              userId,
              {
                entryDate: new Date(),
                description: `Inventory Sale - COGS - Product ${product?.sku || data.productId}`,
                sourceType: "inventory_movement",
                sourceId: movement.id,
              },
              [
                { accountId: cogsAccount.id, debit: totalValue, credit: 0 },
                { accountId: inventoryAccount.id, debit: 0, credit: totalValue },
              ]
            );
          }
        }
      }

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
