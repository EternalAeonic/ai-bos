import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";

export const recommendationSchema = z.object({
  title: z.string().describe("A concise title for the recommendation (e.g., 'Reorder Laptops')"),
  summary: z.string().describe("A human-readable summary of the problem and the proposed solution"),
  confidence: z.number().min(0).max(100).describe("Confidence level in this decision from 0 to 100"),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).describe("Assessed risk level of executing this action automatically"),
  
  whatHappened: z.string().describe("What exactly happened or was detected (e.g. low stock, dead stock)?"),
  why: z.string().describe("Why did this happen (e.g. recent sales spike, supplier delay)?"),
  stockoutPrediction: z.string().optional().describe("Prediction of when stock will run out, if applicable"),
  recommendedQuantity: z.number().optional().describe("Recommended quantity to act upon (e.g. restock quantity)"),
  supplierComparison: z.string().optional().describe("Comparison of alternative suppliers considered"),
  consequencesOfInaction: z.string().describe("What happens if the business takes no action?"),

  evidence: z.array(z.string()).describe("List of facts or data points supporting this recommendation"),
  alternatives: z.array(z.string()).optional().describe("Alternative actions if this one is rejected"),
  expectedResult: z.string().describe("What is the expected outcome if this is approved?"),
  businessImpact: z.string().describe("What is the business impact (e.g., 'Prevents stockout', 'High Risk')?"),
  estimatedCost: z.number().optional().describe("Estimated monetary cost of this action"),
  estimatedSavings: z.number().optional().describe("Estimated monetary savings of this action"),

  actionType: z.string().describe("The internal key for the workflow to execute (e.g. 'CREATE_SUPPLIER_WORKFLOW')"),
  sourceModule: z.string().describe("The business module this action belongs to (e.g. 'SUPPLIERS', 'HR', 'FINANCE')"),
  affectedModules: z.array(z.string()).describe("List of modules affected by this workflow"),
  actionPayload: z.any().describe("The exact arguments to pass to the tool upon approval"),
  
  isReversible: z.boolean().describe("Whether this action is easily reversible"),
  numberOfRecords: z.number().describe("Number of records affected by this action"),
});

export type DecisionRecommendation = z.infer<typeof recommendationSchema>;

export class DecisionEngine {
  
  /**
   * Evaluates the outcome of a planner's tool calls and produces a structured recommendation.
   */
  static async evaluate(
    intent: string, 
    context: any, 
    toolResults: any[]
  ): Promise<DecisionRecommendation | null> {
    
    // We filter for tools that "PREPARED" an action, meaning they intend to write/mutate.
    const preparedActions = toolResults.filter(r => r.result?.status === "PREPARED");

    if (preparedActions.length === 0) {
      // If no write actions were prepared, there's nothing to recommend/approve. 
      // It was just a read-only query (e.g., "What is our cash balance?").
      return null;
    }

    const primaryAction = preparedActions[0]; // For simplicity, handle one primary write action

    const prompt = `
    You are the AI-BOS Decision Engine.
    The user's intent was: "${intent}".
    
    The AI Planner executed tools to investigate the business context.
    Business Context: ${JSON.stringify(context)}
    
    Tool Results: ${JSON.stringify(toolResults)}
    
    The planner has prepared the following action/workflow to execute:
    Action Type: ${primaryAction.result.actionType}
    Source Module: ${primaryAction.result.sourceModule}
    Payload: ${JSON.stringify(primaryAction.result.payload)}
    Is Reversible: ${primaryAction.result.isReversible}
    Number Of Records Affected: ${primaryAction.result.numberOfRecords}
    
    Evaluate the risk and confidence of this workflow. 
    Explain exactly WHAT HAPPENED, WHY this is recommended, the EXPECTED RESULT, and the BUSINESS IMPACT.
    Include a STOCK-OUT PREDICTION, RECOMMENDED QUANTITY, SUPPLIER COMPARISON, and CONSEQUENCES OF INACTION where applicable.
    Include estimated costs (e.g. 0 if none) and savings.
    List the affected modules based on the action.
    Pass through the 'Is Reversible' and 'Number Of Records Affected' values exactly as provided.
    Output a structured recommendation.
    `;

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: recommendationSchema,
      prompt,
    });

    return object;
  }
}
