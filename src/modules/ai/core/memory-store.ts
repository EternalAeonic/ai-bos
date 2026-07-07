import { prisma } from "@/lib/prisma";

export class AIMemoryStore {
  
  /**
   * Retrieves conversation history for the business
   */
  static async getHistory(businessId: string, limit: number = 5): Promise<any[]> {
    if (!businessId) throw new Error("businessId is strictly required for tenant isolation");
    
    const interactions = await prisma.aIInteraction.findMany({
      where: { businessId }, // GUARANTEED TENANT ISOLATION
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return interactions.reverse().map((i: any) => ({
      role: i.role as "user" | "assistant" | "system",
      content: i.content,
    }));
  }

  /**
   * Appends new interaction to the history
   */
  static async appendInteraction(businessId: string, role: string, content: string, userId?: string) {
    if (!businessId) throw new Error("businessId is strictly required for tenant isolation");
    
    return await prisma.aIInteraction.create({
      data: {
        businessId, // GUARANTEED TENANT ISOLATION
        userId,
        role,
        content
      }
    });
  }

  /**
   * Retrieves past AI recommendations that were approved or rejected
   * This provides the LLM context on past decisions to learn preferences.
   */
  static async getPastDecisions(businessId: string, limit = 5) {
    if (!businessId) throw new Error("businessId is strictly required for tenant isolation");
    
    return await prisma.aIRecommendation.findMany({
      where: {
        businessId, // GUARANTEED TENANT ISOLATION
        status: { in: ["APPROVED", "REJECTED", "EXECUTED"] }
      },
      orderBy: { resolvedAt: "desc" },
      take: limit,
      select: {
        title: true,
        summary: true,
        finalRisk: true,
        status: true,
        actionPayload: true,
        resolvedAt: true,
      }
    });
  }
}
