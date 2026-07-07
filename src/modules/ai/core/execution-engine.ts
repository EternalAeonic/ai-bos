import { prisma } from "@/lib/prisma";
import { WorkflowRegistry } from "./workflows";
import { AuditService } from "@/modules/audit/audit-service";

export class ExecutionEngine {
  
  /**
   * Orchestrates the execution of a workflow based on an approved AI Recommendation.
   */
  static async execute(recommendationId: string, userId: string) {
    const recommendation = await prisma.aIRecommendation.findUnique({
      where: { id: recommendationId }
    });

    if (!recommendation) throw new Error("Recommendation not found");
    if (recommendation.status !== "APPROVED" && recommendation.status !== "PENDING") {
      throw new Error("Cannot execute recommendation in current status: " + recommendation.status);
    }

    const payloadObj = recommendation.actionPayload as any;
    const actionType = payloadObj.actionType;
    const context = payloadObj.payload;
    const workflow = WorkflowRegistry[actionType];

    if (!workflow) {
      await prisma.aIRecommendation.update({
        where: { id: recommendationId },
        data: { executionStatus: "FAILED" }
      });
      throw new Error(`No workflow registered for actionType: ${actionType}`);
    }

    // Create a globally unique execution record
    const workflowExecution = await prisma.workflowExecution.create({
      data: {
        businessId: recommendation.businessId,
        workflowName: workflow.name,
        triggerType: "AI",
        recommendationId,
        context,
        logs: []
      }
    });

    const executionId = workflowExecution.id;

    // Mark as IN_PROGRESS and attach executionId
    await prisma.aIRecommendation.update({
      where: { id: recommendationId },
      data: { executionStatus: "IN_PROGRESS", executionId }
    });

    try {
      const stepResults: any[] = [];

      for (const step of workflow.steps) {
        console.log(`[ExecutionEngine] Executing Step: ${step.name} (Execution ID: ${executionId})`);
        // Domain services throw exceptions if guardrails fail
        const result = await step.execute(recommendation.businessId, userId, context);
        stepResults.push({ step: step.name, result });
      }

      // Mark as COMPLETED and log audit for workflow completion
      await prisma.$transaction(async (tx) => {
        await tx.aIRecommendation.update({
          where: { id: recommendationId },
          data: { executionStatus: "COMPLETED", status: "EXECUTED" }
        });

        await tx.workflowExecution.update({
          where: { id: executionId },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
            logs: stepResults as any
          }
        });

        await AuditService.log(tx, {
          businessId: recommendation.businessId,
          userId,
          actorType: "AI",
          action: "EXECUTE_WORKFLOW",
          entity: "AI_RECOMMENDATION",
          entityId: recommendationId,
          details: {
            workflow: workflow.name,
            stepsCompleted: stepResults.length
          },
          executionId,
          workflowName: workflow.name,
          recommendationId
        });
      });

      return { success: true, executionId, results: stepResults };
    } catch (error: any) {
      console.error(`[ExecutionEngine] Workflow failed: ${error.message}`);
      await prisma.$transaction(async (tx) => {
        await tx.aIRecommendation.update({
          where: { id: recommendationId },
          data: { executionStatus: "FAILED" }
        });
        
        await tx.workflowExecution.update({
          where: { id: executionId },
          data: {
            status: "FAILED",
            completedAt: new Date(),
            logs: [{ error: error.message }]
          }
        });
      });
      throw error; // Rethrow to let caller or tests catch it
    }
  }
}
