import { Prisma } from "@prisma/client";

export type AuditLogInput = {
  businessId: string;
  userId?: string;
  actorType?: string;
  action: string;
  entity: string;
  entityId: string;
  details: any;
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
        actorType: input.actorType ?? "USER",
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        details: input.details,
      },
    });
  }
}
