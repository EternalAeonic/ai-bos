import { StockCalculationService } from "@/modules/inventory/services/stock-service";
import { prisma } from "@/lib/prisma";
import { AIResponsePriority } from "../providers/ai-provider";

export class BusinessAnalysisService {
  /**
   * Analyzes the business and calculates Health Score + Warnings + Recommendations
   */
  static async analyzeBusiness(businessId: string) {
    const recommendations: string[] = [];
    const warnings: string[] = [];
    const actions: string[] = [];
    let priority: AIResponsePriority = "LOW";
    
    // 1. Inventory Analysis (30% weight)
    let inventoryScore = 30;
    const stockBalances = await StockCalculationService.getAllStockBalances(businessId);
    
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalValue = 0;

    for (const item of stockBalances) {
      const stock = item.currentStock;
      totalValue += Number(item.product.costPrice) * stock;

      if (stock <= 0) {
        outOfStockCount++;
        inventoryScore -= 5; // Penalty
      } else if (stock <= item.product.reorderLevel) {
        lowStockCount++;
        inventoryScore -= 2; // Penalty
      }
    }

    if (inventoryScore < 0) inventoryScore = 0;

    if (outOfStockCount > 0) {
      warnings.push(`${outOfStockCount} products are completely out of stock.`);
      recommendations.push("Immediately reorder out-of-stock products.");
      priority = "CRITICAL";
    }

    if (lowStockCount > 0) {
      warnings.push(`${lowStockCount} products are running low on stock.`);
      recommendations.push("Review and restock low inventory items.");
      if (priority !== "CRITICAL") priority = "MEDIUM";
    }

    // 2. Finance & Setup (25% weight)
    let financeScore = 25;
    const settings = await prisma.businessSettings.findUnique({ where: { businessId } });
    if (!settings) {
      financeScore = 0;
      warnings.push("Finance settings are not configured.");
      recommendations.push("Complete finance configuration in onboarding.");
      actions.push("/dashboard/settings/finance");
    }

    // 3. Suppliers (15% weight)
    let supplierScore = 15;
    const supplierCount = await prisma.supplier.count({ where: { businessId, deletedAt: null } });
    if (supplierCount === 0) {
      supplierScore = 0;
      warnings.push("No suppliers added yet.");
      recommendations.push("Add suppliers to enable purchase automation.");
    }

    // 4. Customers (10% weight)
    let customerScore = 10;
    const customerCount = await prisma.customer.count({ where: { businessId, deletedAt: null } });
    if (customerCount === 0) {
      customerScore = 0;
    }

    // 5. Employees (10% weight)
    let employeeScore = 10;
    const employeeCount = await prisma.employee.count({ where: { businessId, deletedAt: null } });
    if (employeeCount === 0) {
      employeeScore = 0;
    }

    // 6. Open Risks (10% weight)
    let riskScore = 10;
    // For now, no external risks implemented, so assume perfect score for this chunk.

    const totalScore = inventoryScore + financeScore + supplierScore + customerScore + employeeScore + riskScore;
    
    let status: "Excellent" | "Good" | "Warning" | "Critical" = "Excellent";
    if (totalScore < 50) status = "Critical";
    else if (totalScore < 75) status = "Warning";
    else if (totalScore < 90) status = "Good";

    return {
      score: Math.round(totalScore),
      status,
      inventory: { totalValue, lowStockCount, outOfStockCount, productCount: stockBalances.length },
      entities: { supplierCount, customerCount, employeeCount },
      warnings,
      recommendations,
      actions,
      priority,
    };
  }
}
