import { buildBusinessContext } from "./context-builder";
import { AIMemoryStore } from "./memory-store";
import { Planner } from "./planner";
import { DecisionEngine } from "./decision-engine";
import { VerificationEngine } from "./verification-engine";

export class AICEO {
  
  /**
   * Main entry point for a user message to the AI CEO.
   * Processes the intent through the full AI Pipeline.
   */
  static async processMessage(businessId: string, userId: string, intent: string) {
    // 1. Build Context
    const context = await buildBusinessContext(businessId);
    if (!context) throw new Error("Business not found");

    // 2. Fetch Memory (History + Past Decisions)
    const history = await AIMemoryStore.getHistory(businessId, 5);
    // (Optional: fetch past decisions to inject into planner system prompt)

    // Save user's message to DB
    await AIMemoryStore.appendInteraction(businessId, "user", intent, userId);

    // 3. Planner executes tools to gather data or prepare actions
    const planResult = await Planner.planAndExecute(businessId, intent, context, history);

    // 4. Decision Engine evaluates the outcome
    const recommendation = await DecisionEngine.evaluate(intent, context, planResult.toolResults);

    let finalResponse = planResult.text;
    let pendingRecommendation = null;

    // 5. Verification Engine intercepts if a recommendation was produced
    if (recommendation) {
      const verification = await VerificationEngine.verify(businessId, recommendation);
      
      if (verification.status === "REQUIRES_APPROVAL") {
        pendingRecommendation = verification.recommendation;
        finalResponse += `\n\nI have prepared a recommendation for this action, but it requires your approval because it triggers the Risk Level: ${recommendation.riskLevel}. Please review the pending actions on your dashboard.`;
      } else if (verification.status === "APPROVED_FOR_AUTO_EXECUTION") {
        // Execute immediately (Execution engine logic here)
        finalResponse += `\n\nI have automatically executed this action as per your autonomy settings (Risk Level: ${recommendation.riskLevel}).`;
      }
    }

    // Save AI's response to DB
    await AIMemoryStore.appendInteraction(businessId, "assistant", finalResponse);

    return {
      message: finalResponse,
      recommendation: pendingRecommendation,
    };
  }
}
