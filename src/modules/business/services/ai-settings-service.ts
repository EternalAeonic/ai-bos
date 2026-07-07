import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "@/modules/audit/audit-service";

export type AISettingsData = {
  autonomyLevel?: string; riskLow?: string; riskMedium?: string;
  riskHigh?: string; riskCritical?: string; notifyEmail?: boolean;
  notifySlack?: boolean; notifyWhatsApp?: boolean; notifySms?: boolean;
  dailyBriefTime?: string; weeklyReport?: boolean; monthlyReport?: boolean;
  language?: string; workStart?: string; workEnd?: string;
};

export class AISettingsService {
  static async get(businessId: string) {
    return withBusinessContext(businessId, async (tx) => tx.aISettings.findUnique({ where: { businessId } }));
  }

  static async upsert(businessId: string, userId: string, data: AISettingsData) {
    return withBusinessContext(businessId, async (tx) => {
      const settings = await tx.aISettings.upsert({
        where: { businessId },
        update: data,
        create: {
          businessId,
          autonomyLevel: data.autonomyLevel ?? "BALANCED",
          riskLow: data.riskLow ?? "AUTO",
          riskMedium: data.riskMedium ?? "APPROVE",
          riskHigh: data.riskHigh ?? "OWNER",
          riskCritical: data.riskCritical ?? "OWNER_MANAGER",
          notifyEmail: data.notifyEmail ?? true,
          notifySlack: data.notifySlack ?? false,
          notifyWhatsApp: data.notifyWhatsApp ?? false,
          notifySms: data.notifySms ?? false,
          dailyBriefTime: data.dailyBriefTime ?? "09:00",
          weeklyReport: data.weeklyReport ?? true,
          monthlyReport: data.monthlyReport ?? true,
          language: data.language ?? "en",
          workStart: data.workStart ?? "09:00",
          workEnd: data.workEnd ?? "18:00",
        },
      });
      await AuditService.log(tx, { businessId, userId, action: "UPDATE", entity: "AI_SETTINGS", entityId: businessId, details: data });
      return settings;
    });
  }
}
