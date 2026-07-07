import { Prisma } from "@prisma/client";

export type AuditLogInput = {
  businessId: string;
  userId?: string;
  actorType?: "USER" | "AI";
  action: string;
  entity: string;
  entityId: string;
  details: any;
  executionId?: string;
  workflowName?: string;
  recommendationId?: string;
};

export class AuditService {
  /**
   * Records an audit log entry within the provided database transaction context.
   * This ensures the audit log is recorded atomically with the mutations it describes.
   */
  static async log(tx: Prisma.TransactionClient, input: AuditLogInput) {
    return await tx.auditLog.create({
      data: {
        businessId: input.businessId,
        userId: input.userId,
        // actorType MUST be explicitly passed as 'AI' by the ExecutionEngine,
        // otherwise it defaults to 'USER' for directly-user-initiated actions.
        actorType: input.actorType ?? "USER",
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        details: input.details,
        executionId: input.executionId,
        workflowName: input.workflowName,
        recommendationId: input.recommendationId,
      },
    });
  }
}
