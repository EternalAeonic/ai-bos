export type AIResponsePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AIResponse {
  title: string;
  summary: string;
  priority: AIResponsePriority;
  businessHealth: {
    score: number;
    status: "Excellent" | "Good" | "Warning" | "Critical";
  };
  recommendations: string[];
  warnings: string[];
  actions: string[];
}

export interface AIResponseProvider {
  /**
   * Generates a daily brief summarizing the business state
   */
  generateDashboardBrief(businessId: string): Promise<AIResponse>;

  /**
   * Answers a specific question using business data
   */
  askQuestion(businessId: string, query: string): Promise<AIResponse>;
}
