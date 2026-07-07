import { withBusinessContext } from "@/lib/prisma";

export class StockCalculationService {
  /**
   * Calculates the total stock for a specific product across all warehouses.
   */
  static async getProductTotalStock(businessId: string, productId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      const result = await tx.inventoryMovement.aggregate({
        where: { productId },
        _sum: { quantity: true },
      });
      return result._sum.quantity || 0;
    });
  }

  /**
   * Calculates stock for a product in a specific warehouse.
   */
  static async getProductStockInWarehouse(businessId: string, productId: string, warehouseId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      const result = await tx.inventoryMovement.aggregate({
        where: { productId, warehouseId },
        _sum: { quantity: true },
      });
      return result._sum.quantity || 0;
    });
  }

  /**
   * Retrieves stock balances for all active products, checking reorder levels.
   */
  static async getAllStockBalances(businessId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      // 1. Get all active products
      const products = await tx.product.findMany({
        where: { deletedAt: null },
      });

      // 2. Aggregate all movements grouped by product
      const movements = await tx.inventoryMovement.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
      });

      // 3. Map aggregates to products
      const balances = products.map((product) => {
        const movement = movements.find((m) => m.productId === product.id);
        const currentStock = movement?._sum.quantity || 0;
        return {
          product,
          currentStock,
          isLowStock: currentStock <= product.reorderLevel,
        };
      });

      return balances;
    });
  }
}
