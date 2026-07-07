import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getAITools } from "../tools/registry";
import { BusinessContext } from "./context-builder";

export class Planner {
  
  /**
   * Plans and executes the necessary data-gathering tools for the user intent.
   */
  static async planAndExecute(
    businessId: string, 
    intent: string, 
    context: BusinessContext, 
    history: any[]
  ) {
    const tools = getAITools(businessId);

    const systemPrompt = `
    You are the AI-BOS Planner.
    You have access to a set of business tools to gather data or prepare actions.
    
    Current Business Context:
    ${JSON.stringify(context, null, 2)}
    
    Your job is to analyze the user's intent, decide which tools to call, and execute them.
    If the user is asking to create, update, or delete something, use the appropriate PREPARE tool (like createPurchaseOrderTool).
    Do NOT invent data. Use the tools.
    `;

    const result = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: [
        ...history,
        { role: "user", content: intent }
      ],
      tools: tools as any,
    });

    return {
      text: result.text,
      toolResults: result.toolResults,
      toolCalls: result.toolCalls,
    };
  }
}
