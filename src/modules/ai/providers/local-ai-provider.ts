import { AIResponse, AIResponseProvider } from "./ai-provider";
import { BusinessAnalysisService } from "../services/business-analysis-service";
import { prisma } from "@/lib/prisma";

export class LocalBusinessAI implements AIResponseProvider {
  
  async generateDashboardBrief(businessId: string): Promise<AIResponse> {
    const analysis = await BusinessAnalysisService.analyzeBusiness(businessId);
    
    let summary = "";
    if (analysis.status === "Excellent" || analysis.status === "Good") {
      summary = "Everything is operating normally.";
    } else {
      summary = "There are issues requiring your attention.";
    }

    const highlights: string[] = [];
    if (analysis.inventory.outOfStockCount > 0) highlights.push(`${analysis.inventory.outOfStockCount} products are completely out of stock.`);
    if (analysis.inventory.lowStockCount > 0) highlights.push(`${analysis.inventory.lowStockCount} products are running low on stock.`);
    if (analysis.entities.supplierCount === 0) highlights.push("No suppliers added yet.");
    if (analysis.warnings.length === 0) highlights.push("No operational risks detected.");

    // Format recommendations with numbers like the example
    const formattedRecs = analysis.recommendations.map((r, i) => `${i + 1}. ${r}`);
    if (formattedRecs.length === 0) {
      formattedRecs.push("No immediate actions required.");
    }

    // Convert bullet points for highlights to be part of the summary string
    let finalSummary = summary + "\n\nToday's Highlights\n";
    highlights.forEach(h => {
      finalSummary += `• ${h}\n`;
    });

    return {
      title: "Today's Brief",
      summary: finalSummary.trim(),
      priority: analysis.priority,
      businessHealth: {
        score: analysis.score,
        status: analysis.status,
      },
      recommendations: formattedRecs,
      warnings: analysis.warnings,
      actions: analysis.actions,
    };
  }

  async askQuestion(businessId: string, query: string): Promise<AIResponse> {
    const q = query.toLowerCase().trim();
    const analysis = await BusinessAnalysisService.analyzeBusiness(businessId);

    let title = "Response";
    let summary = "";
    let recommendations: string[] = [];
    let priority = analysis.priority;

    if (q.includes("how is my business") || q.includes("health")) {
      title = "Business Health";
      summary = `Your business health score is ${analysis.score}% (${analysis.status}).`;
      recommendations = analysis.recommendations;
    } else if (q.includes("low on stock") || q.includes("dead stock") || q.includes("reorder") || q.includes("inventory")) {
      title = "Inventory Status";
      summary = `You have ${analysis.inventory.productCount} products tracked. Total inventory value is $${analysis.inventory.totalValue.toFixed(2)}.`;
      if (analysis.inventory.outOfStockCount > 0) summary += `\n• ${analysis.inventory.outOfStockCount} products are out of stock.`;
      if (analysis.inventory.lowStockCount > 0) summary += `\n• ${analysis.inventory.lowStockCount} products are low on stock.`;
      recommendations = ["Review Inventory Dashboard for restocking."];
    } else if (q.includes("supplier") || q.includes("perform")) {
      title = "Supplier Status";
      summary = `You currently have ${analysis.entities.supplierCount} active suppliers.`;
      recommendations = analysis.entities.supplierCount === 0 ? ["Add suppliers via the dashboard."] : ["Supplier performance tracking is active."];
    } else if (q.includes("what should i do") || q.includes("today")) {
      return await this.generateDashboardBrief(businessId);
    } else if (q.includes("finance")) {
      title = "Finance Status";
      summary = `Finance integration is ${analysis.score >= 50 ? "active" : "pending"}.`;
      recommendations = ["Review Finance Dashboard for Journal Entries."];
    } else if (q.includes("employee")) {
      title = "Team Summary";
      summary = `You have ${analysis.entities.employeeCount} active employees.`;
      recommendations = [];
    } else {
      title = "Analysis";
      summary = "I am a local, deterministic AI. I can answer questions about your business health, inventory, suppliers, finance, and employees. For more complex queries, please wait for the LLM integration in an upcoming sprint.";
      recommendations = ["Try asking: 'How is my business?' or 'What products are low on stock?'"];
      priority = "LOW";
    }

    return {
      title,
      summary,
      priority,
      businessHealth: {
        score: analysis.score,
        status: analysis.status,
      },
      recommendations,
      warnings: [],
      actions: [],
    };
  }
}
