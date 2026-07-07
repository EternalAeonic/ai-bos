import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "../../audit/audit-service";
import { JournalEntryService } from "../../finance/services/journal-service";
import { prisma } from "@/lib/prisma";

/**
 * Movement types that ADD stock (positive quantity in ledger)
 */
export const INBOUND_MOVEMENT_TYPES = [
  "INITIAL_STOCK",
  "PURCHASE",
  "TRANSFER_IN",
  "RETURN",
  "ADJUSTMENT_IN",
];

/**
 * Movement types that REMOVE stock (negative quantity in ledger)
 */
export const OUTBOUND_MOVEMENT_TYPES = [
  "SALE",
  "TRANSFER_OUT",
  "DAMAGE",
  "EXPIRED",
  "ADJUSTMENT_OUT",
];

export type MovementType =
  | "INITIAL_STOCK"
  | "PURCHASE"
  | "SALE"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "RETURN"
  | "DAMAGE"
  | "EXPIRED"
  | "ADJUSTMENT_IN"
  | "ADJUSTMENT_OUT"
  // Legacy aliases from older form values (kept for backward compat)
  | "purchase_in"
  | "sale_out"
  | "adjustment"
  | "return"
  | "transfer";

/**
 * Normalize legacy snake_case movement types to the canonical UPPER_SNAKE_CASE format.
 */
function normalizeMovementType(raw: string): string {
  const map: Record<string, string> = {
    purchase_in: "PURCHASE",
    sale_out: "SALE",
    adjustment: "ADJUSTMENT_IN",
    return: "RETURN",
    transfer: "TRANSFER_IN",
  };
  return map[raw] || raw;
}

/**
 * Determines whether a movement type adds or removes stock.
 * Positive quantity = stock IN.
 * Negative quantity = stock OUT.
 */
function resolveQuantity(movementType: string, absQuantity: number): number {
  const normalized = normalizeMovementType(movementType);
  if (OUTBOUND_MOVEMENT_TYPES.includes(normalized)) {
    return -Math.abs(absQuantity);
  }
  return Math.abs(absQuantity);
}

export class InventoryMovementService {
  static async recordMovement(
    businessId: string,
    userId: string,
    data: {
      productId: string;
      warehouseId: string;
      movementType: string;
      quantity: number; // always pass absolute value — sign resolved here
      referenceType?: string;
      referenceId?: string;
      notes?: string;
    }
  ) {
    const normalizedType = normalizeMovementType(data.movementType);
    const signedQuantity = resolveQuantity(data.movementType, Math.abs(data.quantity));

    return await withBusinessContext(businessId, async (tx) => {
      // 1. Create movement record (append-only ledger)
      const movement = await tx.inventoryMovement.create({
        data: {
          businessId,
          productId: data.productId,
          warehouseId: data.warehouseId,
          movementType: normalizedType,
          quantity: signedQuantity,
          referenceType: data.referenceType,
          referenceId: data.referenceId,
          createdBy: userId,
        },
      });

      // 2. Audit log — every mutation is audited
      await AuditService.log(tx, {
        businessId,
        userId,
        action: "STOCK_MOVEMENT",
        entity: "INVENTORY_MOVEMENT",
        entityId: movement.id,
        details: {
          movementType: normalizedType,
          quantity: signedQuantity,
          productId: data.productId,
          warehouseId: data.warehouseId,
          notes: data.notes,
        },
      });

      // 3. Finance Integration (Double-Entry) for PURCHASE and SALE
      if (normalizedType === "PURCHASE" || normalizedType === "SALE") {
        const inventoryAccount = await tx.ledgerAccount.findFirst({ where: { businessId, code: "1200" } });
        const apAccount = await tx.ledgerAccount.findFirst({ where: { businessId, code: "2000" } });
        const cogsAccount = await tx.ledgerAccount.findFirst({ where: { businessId, code: "5000" } });
        
        const product = await tx.product.findUnique({ where: { id: data.productId } });
        const totalValue = Number(product?.costPrice || 0) * Math.abs(signedQuantity);

        if (inventoryAccount && totalValue > 0) {
          if (normalizedType === "PURCHASE" && apAccount) {
            // Debit Inventory, Credit AP
            await JournalEntryService.postTransaction(
              businessId,
              userId,
              {
                entryDate: new Date(),
                description: `Inventory Purchase - ${product?.sku || data.productId}`,
                sourceType: "inventory_movement",
                sourceId: movement.id,
              },
              [
                { accountId: inventoryAccount.id, debit: totalValue, credit: 0 },
                { accountId: apAccount.id, debit: 0, credit: totalValue },
              ]
            );
          } else if (normalizedType === "SALE" && cogsAccount) {
            // Debit COGS, Credit Inventory
            await JournalEntryService.postTransaction(
              businessId,
              userId,
              {
                entryDate: new Date(),
                description: `COGS - Sale of ${product?.sku || data.productId}`,
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

  /**
   * Transfer stock between two warehouses.
   * Creates two ledger entries: TRANSFER_OUT from source, TRANSFER_IN to destination.
   */
  static async transferStock(
    businessId: string,
    userId: string,
    data: {
      productId: string;
      fromWarehouseId: string;
      toWarehouseId: string;
      quantity: number;
      notes?: string;
    }
  ) {
    const absQty = Math.abs(data.quantity);
    
    // OUT movement from source warehouse
    await InventoryMovementService.recordMovement(businessId, userId, {
      productId: data.productId,
      warehouseId: data.fromWarehouseId,
      movementType: "TRANSFER_OUT",
      quantity: absQty,
      referenceType: "transfer",
      referenceId: data.toWarehouseId,
      notes: data.notes,
    });

    // IN movement to destination warehouse
    await InventoryMovementService.recordMovement(businessId, userId, {
      productId: data.productId,
      warehouseId: data.toWarehouseId,
      movementType: "TRANSFER_IN",
      quantity: absQty,
      referenceType: "transfer",
      referenceId: data.fromWarehouseId,
      notes: data.notes,
    });
  }

  static async listMovements(businessId: string, filters?: { productId?: string; warehouseId?: string; movementType?: string }) {
    return await withBusinessContext(businessId, async (tx) => {
      return await tx.inventoryMovement.findMany({
        where: { businessId, ...filters },
        include: { product: true, warehouse: true },
        orderBy: { createdAt: "desc" },
        take: 500,
      });
    });
  }
}
