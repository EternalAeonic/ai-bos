import { prisma, withBusinessContext } from "@/lib/prisma";
import { AuditService } from "@/modules/audit/audit-service";

export class BusinessService {
  static async get(businessId: string) {
    return prisma.business.findUnique({ where: { id: businessId } });
  }

  static async update(
    businessId: string,
    userId: string,
    data: {
      name?: string; legalName?: string; industry?: string; businessType?: string;
      currency?: string; timezone?: string; country?: string; website?: string;
      phone?: string; logoUrl?: string; address?: string; city?: string;
      state?: string; postalCode?: string; gstNumber?: string; vatNumber?: string;
      registrationNumber?: string;
    }
  ) {
    return withBusinessContext(businessId, async (tx) => {
      const business = await tx.business.update({
        where: { id: businessId },
        data,
      });
      await AuditService.log(tx, { businessId, userId, action: "UPDATE", entity: "BUSINESS", entityId: businessId, details: data });
      return business;
    });
  }

  static async getSetupScore(businessId: string): Promise<number> {
    const [business, locs, depts, emps, suppliers, customers, settings, aiSettings] =
      await Promise.all([
        prisma.business.findUnique({ where: { id: businessId }, select: { name: true, industry: true, country: true, currency: true } }),
        prisma.businessLocation.count({ where: { businessId, deletedAt: null } }),
        prisma.department.count({ where: { businessId, deletedAt: null } }),
        prisma.employee.count({ where: { businessId, deletedAt: null } }),
        prisma.supplier.count({ where: { businessId, deletedAt: null } }),
        prisma.customer.count({ where: { businessId, deletedAt: null } }),
        prisma.businessSettings.findUnique({ where: { businessId } }),
        prisma.aISettings.findUnique({ where: { businessId } }),
      ]);
    let score = 0;
    if (business?.name) score += 15;
    if (business?.industry) score += 10;
    if (business?.country) score += 5;
    if (business?.currency) score += 5;
    if (locs > 0) score += 10;
    if (depts > 0) score += 10;
    if (emps > 0) score += 10;
    if (suppliers > 0) score += 10;
    if (customers > 0) score += 10;
    if (settings) score += 10;
    if (aiSettings) score += 5;
    return Math.min(score, 100);
  }

  static async refreshScore(businessId: string) {
    const score = await BusinessService.getSetupScore(businessId);
    await prisma.business.update({ where: { id: businessId }, data: { setupScore: score } });
    return score;
  }
}
