import { prisma } from "@/lib/prisma";
import { DecisionRecommendation } from "./decision-engine";
import { RiskEngine } from "./risk-engine";

export class VerificationEngine {

  /**
   * Verifies if an action can be executed automatically or requires human approval based on business AI Settings.
   */
  static async verify(businessId: string, recommendation: DecisionRecommendation) {
    const settings = await prisma.aISettings.findUnique({
      where: { businessId }
    });

    if (!settings) {
      throw new Error("AI Settings not found. Cannot verify action.");
    }

    // Pass through deterministic RiskEngine (OVERRIDE LLM)
    const calculatedRisk = await RiskEngine.evaluate(businessId, {
      llmRisk: recommendation.riskLevel as any,
      estimatedCost: recommendation.estimatedCost || 0,
      isReversible: recommendation.isReversible ?? true,
      affectedModules: recommendation.affectedModules || [],
      numberOfRecords: recommendation.numberOfRecords ?? 1,
      workflowType: recommendation.actionType
    });

    const finalRisk = calculatedRisk; // RiskEngine overrides

    // Determine the required approval level based on the risk
    let requiredLevel = "APPROVE";
    if (finalRisk === "LOW") requiredLevel = settings.riskLow;
    else if (finalRisk === "MEDIUM") requiredLevel = settings.riskMedium;
    else if (finalRisk === "HIGH") requiredLevel = settings.riskHigh;
    else if (finalRisk === "CRITICAL") requiredLevel = settings.riskCritical;

    if (settings.autonomyLevel === "MANUAL" || requiredLevel !== "AUTO") {
      // It requires human approval. Save it to the database as PENDING.
      const savedRecommendation = await prisma.aIRecommendation.create({
        data: {
          businessId,
          title: recommendation.title,
          summary: recommendation.summary,
          confidence: recommendation.confidence,
          llmRisk: recommendation.riskLevel,
          calculatedRisk,
          finalRisk,
          sourceModule: recommendation.sourceModule,
          status: "PENDING",
          executionStatus: "PENDING",
          requiresApproval: true,
          actionPayload: {
            actionType: recommendation.actionType,
            payload: recommendation.actionPayload
          },
          why: recommendation.why,
          evidence: {
            dataPoints: recommendation.evidence,
            whatHappened: recommendation.whatHappened,
            stockoutPrediction: recommendation.stockoutPrediction,
            recommendedQuantity: recommendation.recommendedQuantity,
            supplierComparison: recommendation.supplierComparison,
            consequencesOfInaction: recommendation.consequencesOfInaction,
          } as any,
          alternatives: recommendation.alternatives as any,
          expectedResult: recommendation.expectedResult,
          businessImpact: recommendation.businessImpact,
          estimatedCost: recommendation.estimatedCost || 0,
          estimatedSavings: recommendation.estimatedSavings || 0,
          affectedModules: recommendation.affectedModules as any,
        }
      });

      return {
        status: "REQUIRES_APPROVAL",
        recommendation: savedRecommendation
      };
    }

    // If AUTO, we can execute immediately (Implementation for execution skipped for this exact file, handled by Orchestrator)
    return {
      status: "APPROVED_FOR_AUTO_EXECUTION",
      recommendation: {
        ...recommendation,
        llmRisk: recommendation.riskLevel,
        calculatedRisk,
        finalRisk
      }
    };
  }
}
