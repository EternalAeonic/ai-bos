"use server";

import { prisma } from "@/lib/prisma";
import { AuditService } from "@/modules/audit/audit-service";
import {
  BusinessIdentityInput,
  LocationInput,
  DepartmentInput,
  EmployeeInput,
  RoleInput,
  SupplierInput,
  CustomerInput,
  FinanceConfigInput,
  TaxRuleInput,
  AISettingsInput,
} from "@/schemas/onboarding";
import { revalidatePath } from "next/cache";

// Demo mode: fixed business ID
const DEMO_BUSINESS_ID = "demo-business-123";
const DEMO_USER_ID = "demo-user-123";

// ── Utility: calculate setup score ──────────────────────────
async function recalculateSetupScore(businessId: string): Promise<number> {
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

// ── Step 2: Business Identity ────────────────────────────────
export async function saveBusinessIdentityAction(data: BusinessIdentityInput) {
  try {
    const business = await prisma.business.upsert({
      where: { id: DEMO_BUSINESS_ID },
      update: {
        name: data.name,
        legalName: data.legalName,
        industry: data.industry,
        businessType: data.businessType,
        currency: data.currency,
        timezone: data.timezone,
        country: data.country,
        website: data.website || null,
        phone: data.phone,
        logoUrl: data.logoUrl || null,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        gstNumber: data.gstNumber,
        vatNumber: data.vatNumber,
        registrationNumber: data.registrationNumber,
        onboardingStep: 3,
      },
      create: {
        id: DEMO_BUSINESS_ID,
        name: data.name,
        legalName: data.legalName,
        industry: data.industry,
        businessType: data.businessType,
        currency: data.currency || "USD",
        timezone: data.timezone || "UTC",
        country: data.country,
        website: data.website || null,
        phone: data.phone,
        logoUrl: data.logoUrl || null,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        gstNumber: data.gstNumber,
        vatNumber: data.vatNumber,
        registrationNumber: data.registrationNumber,
        onboardingStep: 3,
      },
    });

    await prisma.auditLog.create({
      data: {
        businessId: DEMO_BUSINESS_ID,
        userId: DEMO_USER_ID,
        action: "UPDATE",
        entity: "BUSINESS",
        entityId: business.id,
        details: { step: "BUSINESS_IDENTITY", name: data.name },
      },
    });

    const score = await recalculateSetupScore(DEMO_BUSINESS_ID);
    await prisma.business.update({ where: { id: DEMO_BUSINESS_ID }, data: { setupScore: score } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("[saveBusinessIdentityAction]", error);
    return { success: false, error: error.message };
  }
}

// ── Step 3: Locations ────────────────────────────────────────
export async function saveLocationsAction(locations: LocationInput[]) {
  try {
    // Upsert locations — replace all existing non-deleted for this business
    await prisma.businessLocation.updateMany({
      where: { businessId: DEMO_BUSINESS_ID, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (locations.length > 0) {
      await prisma.businessLocation.createMany({
        data: locations.map((loc) => ({
          businessId: DEMO_BUSINESS_ID,
          name: loc.name,
          type: loc.type,
          address: loc.address,
          city: loc.city,
          state: loc.state,
          country: loc.country,
          postalCode: loc.postalCode,
          phone: loc.phone,
          isDefault: loc.isDefault,
        })),
      });
    }

    await prisma.business.update({
      where: { id: DEMO_BUSINESS_ID },
      data: { onboardingStep: 4 },
    });

    const score = await recalculateSetupScore(DEMO_BUSINESS_ID);
    await prisma.business.update({ where: { id: DEMO_BUSINESS_ID }, data: { setupScore: score } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("[saveLocationsAction]", error);
    return { success: false, error: error.message };
  }
}

// ── Step 4: Departments ──────────────────────────────────────
export async function saveDepartmentsAction(departments: DepartmentInput[]) {
  try {
    await prisma.department.updateMany({
      where: { businessId: DEMO_BUSINESS_ID, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (departments.length > 0) {
      await prisma.department.createMany({
        data: departments.map((d) => ({
          businessId: DEMO_BUSINESS_ID,
          name: d.name,
        })),
      });
    }

    await prisma.business.update({
      where: { id: DEMO_BUSINESS_ID },
      data: { onboardingStep: 5 },
    });

    const score = await recalculateSetupScore(DEMO_BUSINESS_ID);
    await prisma.business.update({ where: { id: DEMO_BUSINESS_ID }, data: { setupScore: score } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("[saveDepartmentsAction]", error);
    return { success: false, error: error.message };
  }
}

// ── Step 5: Employees ────────────────────────────────────────
export async function saveEmployeesAction(employees: EmployeeInput[]) {
  try {
    await prisma.employee.updateMany({
      where: { businessId: DEMO_BUSINESS_ID, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (employees.length > 0) {
      await prisma.employee.createMany({
        data: employees.map((e) => ({
          businessId: DEMO_BUSINESS_ID,
          name: e.name,
          email: e.email,
          jobTitle: e.jobTitle,
          employmentType: e.employmentType,
          status: "INVITED",
        })),
      });
    }

    await prisma.business.update({
      where: { id: DEMO_BUSINESS_ID },
      data: { onboardingStep: 6 },
    });

    const score = await recalculateSetupScore(DEMO_BUSINESS_ID);
    await prisma.business.update({ where: { id: DEMO_BUSINESS_ID }, data: { setupScore: score } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("[saveEmployeesAction]", error);
    return { success: false, error: error.message };
  }
}

// ── Step 6: Roles ────────────────────────────────────────────
export async function saveRolesAction(roles: RoleInput[]) {
  try {
    await prisma.role.updateMany({
      where: { businessId: DEMO_BUSINESS_ID, isSystemRole: false, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (roles.length > 0) {
      await prisma.role.createMany({
        data: roles.map((r) => ({
          businessId: DEMO_BUSINESS_ID,
          name: r.name,
          description: r.description,
          permissions: r.permissions,
        })),
      });
    }

    await prisma.business.update({
      where: { id: DEMO_BUSINESS_ID },
      data: { onboardingStep: 7 },
    });

    return { success: true };
  } catch (error: any) {
    console.error("[saveRolesAction]", error);
    return { success: false, error: error.message };
  }
}

// ── Step 8: Suppliers ────────────────────────────────────────
export async function saveSuppliersAction(suppliers: SupplierInput[]) {
  try {
    await prisma.supplier.updateMany({
      where: { businessId: DEMO_BUSINESS_ID, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (suppliers.length > 0) {
      await prisma.supplier.createMany({
        data: suppliers.map((s) => ({
          businessId: DEMO_BUSINESS_ID,
          name: s.name,
          contactPerson: s.contactPerson,
          email: s.email || null,
          phone: s.phone,
          address: s.address,
          city: s.city,
          country: s.country,
          gstNumber: s.gstNumber,
          paymentTerms: s.paymentTerms,
          leadTimeDays: s.leadTimeDays,
          isPreferred: s.isPreferred,
        })),
      });
    }

    await prisma.business.update({
      where: { id: DEMO_BUSINESS_ID },
      data: { onboardingStep: 9 },
    });

    const score = await recalculateSetupScore(DEMO_BUSINESS_ID);
    await prisma.business.update({ where: { id: DEMO_BUSINESS_ID }, data: { setupScore: score } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("[saveSuppliersAction]", error);
    return { success: false, error: error.message };
  }
}

// ── Step 9: Customers ────────────────────────────────────────
export async function saveCustomersAction(customers: CustomerInput[]) {
  try {
    await prisma.customer.updateMany({
      where: { businessId: DEMO_BUSINESS_ID, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (customers.length > 0) {
      await prisma.customer.createMany({
        data: customers.map((c) => ({
          businessId: DEMO_BUSINESS_ID,
          name: c.name,
          email: c.email || null,
          phone: c.phone,
          address: c.address,
          city: c.city,
          country: c.country,
          category: c.category,
          paymentTerms: c.paymentTerms,
          creditLimit: c.creditLimit,
          gstNumber: c.gstNumber,
        })),
      });
    }

    await prisma.business.update({
      where: { id: DEMO_BUSINESS_ID },
      data: { onboardingStep: 10 },
    });

    const score = await recalculateSetupScore(DEMO_BUSINESS_ID);
    await prisma.business.update({ where: { id: DEMO_BUSINESS_ID }, data: { setupScore: score } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("[saveCustomersAction]", error);
    return { success: false, error: error.message };
  }
}

// ── Step 10: Finance Config ──────────────────────────────────
export async function saveFinanceConfigAction(data: FinanceConfigInput) {
  try {
    await prisma.businessSettings.upsert({
      where: { businessId: DEMO_BUSINESS_ID },
      update: {
        fiscalYearStart: data.fiscalYearStart,
        accountingMethod: data.accountingMethod,
        invoicePrefix: data.invoicePrefix,
        defaultCurrency: data.defaultCurrency,
        openingCash: data.openingCash,
        openingBank: data.openingBank,
        openingReceivables: data.openingReceivables,
        openingPayables: data.openingPayables,
      },
      create: {
        businessId: DEMO_BUSINESS_ID,
        fiscalYearStart: data.fiscalYearStart,
        accountingMethod: data.accountingMethod,
        invoicePrefix: data.invoicePrefix,
        defaultCurrency: data.defaultCurrency,
        openingCash: data.openingCash,
        openingBank: data.openingBank,
        openingReceivables: data.openingReceivables,
        openingPayables: data.openingPayables,
      },
    });

    // Save bank accounts
    if (data.banks && data.banks.length > 0) {
      await prisma.bankAccount.updateMany({
        where: { businessId: DEMO_BUSINESS_ID, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      await prisma.bankAccount.createMany({
        data: data.banks.map((b) => ({
          businessId: DEMO_BUSINESS_ID,
          name: b.name,
          bankName: b.bankName,
          accountNumber: b.accountNumber,
          currency: b.currency,
          openingBalance: b.openingBalance,
          isDefault: b.isDefault,
        })),
      });
    }

    await prisma.business.update({
      where: { id: DEMO_BUSINESS_ID },
      data: { onboardingStep: 11 },
    });

    const score = await recalculateSetupScore(DEMO_BUSINESS_ID);
    await prisma.business.update({ where: { id: DEMO_BUSINESS_ID }, data: { setupScore: score } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("[saveFinanceConfigAction]", error);
    return { success: false, error: error.message };
  }
}

// ── Step 11: Taxes ───────────────────────────────────────────
export async function saveTaxesAction(taxes: TaxRuleInput[]) {
  try {
    await prisma.taxConfiguration.updateMany({
      where: { businessId: DEMO_BUSINESS_ID, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (taxes.length > 0) {
      await prisma.taxConfiguration.createMany({
        data: taxes.map((t) => ({
          businessId: DEMO_BUSINESS_ID,
          taxType: t.taxType,
          name: t.name,
          rate: t.rate,
          hsnCode: t.hsnCode,
          region: t.region,
          invoiceFormat: t.invoiceFormat,
          isDefault: t.isDefault,
        })),
      });
    }

    await prisma.business.update({
      where: { id: DEMO_BUSINESS_ID },
      data: { onboardingStep: 12 },
    });

    return { success: true };
  } catch (error: any) {
    console.error("[saveTaxesAction]", error);
    return { success: false, error: error.message };
  }
}

// ── Step 12: AI Settings ─────────────────────────────────────
export async function saveAISettingsAction(data: AISettingsInput) {
  try {
    await prisma.aISettings.upsert({
      where: { businessId: DEMO_BUSINESS_ID },
      update: {
        autonomyLevel: data.autonomyLevel,
        riskLow: data.riskLow,
        riskMedium: data.riskMedium,
        riskHigh: data.riskHigh,
        riskCritical: data.riskCritical,
        notifyEmail: data.notifyEmail,
        notifySlack: data.notifySlack,
        notifyWhatsApp: data.notifyWhatsApp,
        notifySms: data.notifySms,
        dailyBriefTime: data.dailyBriefTime,
        weeklyReport: data.weeklyReport,
        monthlyReport: data.monthlyReport,
        language: data.language,
        workStart: data.workStart,
        workEnd: data.workEnd,
      },
      create: {
        businessId: DEMO_BUSINESS_ID,
        autonomyLevel: data.autonomyLevel,
        riskLow: data.riskLow,
        riskMedium: data.riskMedium,
        riskHigh: data.riskHigh,
        riskCritical: data.riskCritical,
        notifyEmail: data.notifyEmail,
        notifySlack: data.notifySlack,
        notifyWhatsApp: data.notifyWhatsApp,
        notifySms: data.notifySms,
        dailyBriefTime: data.dailyBriefTime,
        weeklyReport: data.weeklyReport,
        monthlyReport: data.monthlyReport,
        language: data.language,
        workStart: data.workStart,
        workEnd: data.workEnd,
      },
    });

    await prisma.business.update({
      where: { id: DEMO_BUSINESS_ID },
      data: { onboardingStep: 13, onboardingComplete: true },
    });

    const score = await recalculateSetupScore(DEMO_BUSINESS_ID);
    await prisma.business.update({ where: { id: DEMO_BUSINESS_ID }, data: { setupScore: score } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("[saveAISettingsAction]", error);
    return { success: false, error: error.message };
  }
}

// ── Complete Onboarding ──────────────────────────────────────
export async function completeOnboardingAction() {
  try {
    const score = await recalculateSetupScore(DEMO_BUSINESS_ID);
    await prisma.business.update({
      where: { id: DEMO_BUSINESS_ID },
      data: { onboardingComplete: true, onboardingStep: 15, setupScore: score },
    });

    await prisma.auditLog.create({
      data: {
        businessId: DEMO_BUSINESS_ID,
        userId: DEMO_USER_ID,
        action: "COMPLETE",
        entity: "ONBOARDING",
        entityId: DEMO_BUSINESS_ID,
        details: { setupScore: score },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, setupScore: score };
  } catch (error: any) {
    console.error("[completeOnboardingAction]", error);
    return { success: false, error: error.message };
  }
}
