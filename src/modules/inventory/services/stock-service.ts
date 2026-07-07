import { withBusinessContext } from "@/lib/prisma";

export class StockCalculationService {
  /**
   * Calculates the total stock for a specific product across all warehouses.
   * Always calculated from the InventoryMovement ledger — never from mutable state.
   */
  static async getProductTotalStock(businessId: string, productId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      const result = await tx.inventoryMovement.aggregate({
        where: { businessId, productId }, // businessId properly applied
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
        where: { businessId, productId, warehouseId }, // businessId properly applied
        _sum: { quantity: true },
      });
      return result._sum.quantity || 0;
    });
  }

  /**
   * Retrieves stock balances for all active products, checking reorder levels.
   * Source of truth: InventoryMovement ledger.
   */
  static async getAllStockBalances(businessId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      // 1. Get all active products for THIS business only
      const products = await tx.product.findMany({
        where: { businessId, deletedAt: null }, // businessId properly applied
        include: { category: true, supplier: true }, // include category for display
      });

      if (products.length === 0) return [];

      // 2. Aggregate all movements grouped by product for THIS business
      const movements = await tx.inventoryMovement.groupBy({
        by: ["productId"],
        where: { businessId }, // businessId properly applied
        _sum: { quantity: true },
      });

      // 3. Map aggregates to products
      const balances = products.map((product) => {
        const movement = movements.find((m) => m.productId === product.id);
        const currentStock = movement?._sum.quantity || 0;
        return {
          product,
          currentStock,
          isLowStock: currentStock > 0 && currentStock <= product.reorderLevel,
          isOutOfStock: currentStock <= 0,
        };
      });

      return balances;
    });
  }

  /**
   * Returns a summary of inventory health across all products for this business.
   */
  static async getInventorySummary(businessId: string) {
    const balances = await StockCalculationService.getAllStockBalances(businessId);
    return {
      totalProducts: balances.length,
      totalLowStock: balances.filter((b) => b.isLowStock).length,
      totalOutOfStock: balances.filter((b) => b.isOutOfStock).length,
      totalHealthy: balances.filter((b) => !b.isLowStock && !b.isOutOfStock).length,
      totalInventoryValue: balances.reduce(
        (sum, b) => sum + b.currentStock * Number(b.product.costPrice || 0),
        0
      ),
    };
  }
}
