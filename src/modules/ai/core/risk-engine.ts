import { prisma } from "@/lib/prisma";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RiskEvaluationContext {
  llmRisk: RiskLevel;
  estimatedCost: number;
  isReversible: boolean;
  affectedModules: string[];
  numberOfRecords: number;
  workflowType: string;
}

export class RiskEngine {
  /**
   * Deterministically calculates final risk based on business rules and AI settings.
   * NEVER relies solely on the LLM.
   */
  static async evaluate(businessId: string, context: RiskEvaluationContext): Promise<RiskLevel> {
    const settings = await prisma.aISettings.findUnique({
      where: { businessId }
    });

    if (!settings) {
      return "CRITICAL"; // Fail safe
    }

    let calculatedRisk: RiskLevel = "LOW";

    // Rule 1: Financial Impact
    const cost = context.estimatedCost || 0;
    if (cost > Number(settings.riskThresholdHigh)) {
      calculatedRisk = "CRITICAL";
    } else if (cost > Number(settings.riskThresholdMedium)) {
      calculatedRisk = this.maxRisk(calculatedRisk, "HIGH");
    } else if (cost > Number(settings.riskThresholdLow)) {
      calculatedRisk = this.maxRisk(calculatedRisk, "MEDIUM");
    }

    // Rule 2: Reversibility
    if (!context.isReversible) {
      calculatedRisk = this.maxRisk(calculatedRisk, "HIGH");
    }

    // Rule 3: Cross-module impact
    if (context.affectedModules.length > 2) {
      calculatedRisk = this.maxRisk(calculatedRisk, "HIGH");
    } else if (context.affectedModules.length > 1) {
      calculatedRisk = this.maxRisk(calculatedRisk, "MEDIUM");
    }

    // Rule 4: Volume impact
    if (context.numberOfRecords > 100) {
      calculatedRisk = this.maxRisk(calculatedRisk, "CRITICAL");
    } else if (context.numberOfRecords > 10) {
      calculatedRisk = this.maxRisk(calculatedRisk, "MEDIUM");
    }

    return calculatedRisk;
  }

  private static maxRisk(r1: RiskLevel, r2: RiskLevel): RiskLevel {
    const levels = { "LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4 };
    return levels[r1] > levels[r2] ? r1 : r2;
  }
}
