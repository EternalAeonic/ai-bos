"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAIPageDataAction(businessId: string) {
  try {
    const interactions = await prisma.aIInteraction.findMany({
      where: { businessId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    const pendingRecommendations = await prisma.aIRecommendation.findMany({
      where: { businessId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    const context = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        _count: {
          select: { employees: true, customers: true, suppliers: true, locations: true }
        },
        aiSettings: true,
      }
    });

    // Fetch Inventory Health
    const { InventoryIntelligenceService } = await import("@/modules/business/services/inventory-intelligence-service");
    const inventoryHealth = await InventoryIntelligenceService.analyzeInventoryHealth(businessId);
    
    // Fetch Top Suppliers
    const suppliers = await InventoryIntelligenceService.scoreSuppliers(businessId);
    const topSuppliers = suppliers.slice(0, 3);

    return { success: true, interactions, pendingRecommendations, context, inventoryHealth, topSuppliers };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resolveRecommendationAction(recommendationId: string, status: "APPROVED" | "REJECTED") {
  try {
    const recommendation = await prisma.aIRecommendation.findUnique({
      where: { id: recommendationId }
    });

    if (!recommendation) throw new Error("Recommendation not found");
    if (recommendation.status !== "PENDING") throw new Error("Already resolved");

    // First update the status to APPROVED or REJECTED
    await prisma.aIRecommendation.update({
      where: { id: recommendationId },
      data: {
        status,
        resolvedAt: new Date(),
        resolvedBy: "demo-user-123", // mocked user
      }
    });

    // If approved, orchestrate the workflow
    if (status === "APPROVED") {
      const { ExecutionEngine } = await import("@/modules/ai/core/execution-engine");
      const result = await ExecutionEngine.execute(recommendationId, "demo-user-123");
      
      if (!result.success) {
        // Even if workflow failed, the decision was approved, but execution failed.
        // We throw so the UI can show a toast error for the execution part.
        throw new Error(result.error || "Workflow execution failed");
      }
    }
    
    revalidatePath("/dashboard/ai");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
