import { prisma } from "@/lib/prisma";

export interface BusinessContext {
  business: {
    id: string;
    name: string;
    industry: string | null;
    currency: string;
  };
  metrics: {
    employeeCount: number;
    locationCount: number;
    customerCount: number;
    supplierCount: number;
  };
  finance: {
    cashBalance: number;
    bankBalance: number;
    receivables: number;
    payables: number;
  };
  knowledgeBase: string | null;
  aiSettings: {
    assistantName: string;
    autonomyLevel: string;
    riskLow: string;
    riskMedium: string;
    riskHigh: string;
    riskCritical: string;
  } | null;
}

export async function buildBusinessContext(businessId: string): Promise<BusinessContext | null> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      businessSettings: true,
      aiSettings: true,
      knowledgeBase: true,
      _count: {
        select: {
          employees: true,
          locations: true,
          customers: true,
          suppliers: true,
        },
      },
    },
  });

  if (!business) return null;

  // Calculate finance (Placeholder for now, read from LedgerAccount in real scenario)
  const cashBalance = business.businessSettings?.openingCash ? Number(business.businessSettings.openingCash) : 0;
  const bankBalance = business.businessSettings?.openingBank ? Number(business.businessSettings.openingBank) : 0;
  const receivables = business.businessSettings?.openingReceivables ? Number(business.businessSettings.openingReceivables) : 0;
  const payables = business.businessSettings?.openingPayables ? Number(business.businessSettings.openingPayables) : 0;

  return {
    business: {
      id: business.id,
      name: business.name,
      industry: business.industry,
      currency: business.currency,
    },
    metrics: {
      employeeCount: business._count.employees,
      locationCount: business._count.locations,
      customerCount: business._count.customers,
      supplierCount: business._count.suppliers,
    },
    finance: {
      cashBalance,
      bankBalance,
      receivables,
      payables,
    },
    knowledgeBase: business.knowledgeBase?.content || null,
    aiSettings: business.aiSettings ? {
      assistantName: business.aiSettings.assistantName,
      autonomyLevel: business.aiSettings.autonomyLevel,
      riskLow: business.aiSettings.riskLow,
      riskMedium: business.aiSettings.riskMedium,
      riskHigh: business.aiSettings.riskHigh,
      riskCritical: business.aiSettings.riskCritical,
    } : null,
  };
}
