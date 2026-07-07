"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
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

// Import Domain Services
import { LocationService } from "@/modules/business/services/location-service";
import { DepartmentService } from "@/modules/business/services/department-service";
import { EmployeeService } from "@/modules/business/services/employee-service";
import { BusinessSupplierService } from "@/modules/business/services/supplier-service";
import { CustomerService } from "@/modules/business/services/customer-service";
import { RoleService } from "@/modules/business/services/role-service";

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

async function updateScore(businessId: string) {
  const score = await recalculateSetupScore(businessId);
  await prisma.business.update({ where: { id: businessId }, data: { setupScore: score } });
  revalidatePath("/dashboard");
  return score;
}

// ── Step 1: Business Identity ────────────────────────────────
export async function saveBusinessIdentityAction(data: BusinessIdentityInput) {
  try {
    const { businessId, userId } = await getSession();
    const business = await prisma.business.upsert({
      where: { id: businessId },
      update: {
        name: data.name, legalName: data.legalName, industry: data.industry,
        businessType: data.businessType, currency: data.currency, timezone: data.timezone,
        country: data.country, website: data.website || null, phone: data.phone,
        logoUrl: data.logoUrl || null, address: data.address, city: data.city,
        state: data.state, postalCode: data.postalCode, gstNumber: data.gstNumber,
        vatNumber: data.vatNumber, registrationNumber: data.registrationNumber, onboardingStep: 2,
      },
      create: {
        id: businessId, name: data.name, legalName: data.legalName, industry: data.industry,
        businessType: data.businessType, currency: data.currency || "USD", timezone: data.timezone || "UTC",
        country: data.country, website: data.website || null, phone: data.phone,
        logoUrl: data.logoUrl || null, address: data.address, city: data.city,
        state: data.state, postalCode: data.postalCode, gstNumber: data.gstNumber,
        vatNumber: data.vatNumber, registrationNumber: data.registrationNumber, onboardingStep: 2,
      },
    });
    await prisma.auditLog.create({ data: { businessId, userId, action: "UPDATE", entity: "BUSINESS", entityId: business.id, details: { step: "BUSINESS_IDENTITY", name: data.name } } });
    await updateScore(businessId);
    return { success: true };
  } catch (error: any) { return { success: false, error: error.message }; }
}

// ── Step 2: Locations ────────────────────────────────────────
export async function saveLocationsAction(locations: LocationInput[]) {
  try {
    const { businessId, userId } = await getSession();
    const existing = await LocationService.list(businessId);
    const inputIds = locations.filter(l => l.id).map(l => l.id as string);
    const toDelete = existing.filter((e: any) => !inputIds.includes(e.id));

    for (const loc of toDelete) await LocationService.delete(businessId, userId, loc.id);
    for (const loc of locations) {
      if (loc.id) await LocationService.update(businessId, userId, loc.id, loc);
      else await LocationService.create(businessId, userId, loc as any);
    }

    await prisma.business.update({ where: { id: businessId }, data: { onboardingStep: 3 } });
    await updateScore(businessId);
    return { success: true };
  } catch (error: any) { return { success: false, error: error.message }; }
}

// ── Step 3: Departments ──────────────────────────────────────
export async function saveDepartmentsAction(departments: DepartmentInput[]) {
  try {
    const { businessId, userId } = await getSession();
    const existing = await DepartmentService.list(businessId);
    const inputIds = departments.filter(d => d.id).map(d => d.id as string);
    const toDelete = existing.filter((e: any) => !inputIds.includes(e.id));

    for (const dept of toDelete) await DepartmentService.delete(businessId, userId, dept.id);
    for (const dept of departments) {
      if (dept.id) await DepartmentService.update(businessId, userId, dept.id, dept);
      else await DepartmentService.create(businessId, userId, dept as any);
    }

    await prisma.business.update({ where: { id: businessId }, data: { onboardingStep: 4 } });
    await updateScore(businessId);
    return { success: true };
  } catch (error: any) { return { success: false, error: error.message }; }
}

// ── Step 4: Employees ────────────────────────────────────────
export async function saveEmployeesAction(employees: EmployeeInput[]) {
  try {
    const { businessId, userId } = await getSession();
    const existing = await EmployeeService.list(businessId);
    const inputIds = employees.filter(e => e.id).map(e => e.id as string);
    const toDelete = existing.filter((e: any) => !inputIds.includes(e.id));

    for (const emp of toDelete) await EmployeeService.delete(businessId, userId, emp.id);
    for (const emp of employees) {
      if (emp.id) await EmployeeService.update(businessId, userId, emp.id, { ...emp, status: "ACTIVE" } as any);
      else await EmployeeService.create(businessId, userId, { ...emp, status: "ACTIVE" } as any);
    }

    await prisma.business.update({ where: { id: businessId }, data: { onboardingStep: 5 } });
    await updateScore(businessId);
    return { success: true };
  } catch (error: any) { return { success: false, error: error.message }; }
}

// ── Step 5: Suppliers ────────────────────────────────────────
export async function saveSuppliersAction(suppliers: SupplierInput[]) {
  try {
    const { businessId, userId } = await getSession();
    const existing = await BusinessSupplierService.list(businessId);
    const inputIds = suppliers.filter(s => s.id).map(s => s.id as string);
    const toDelete = existing.filter((e: any) => !inputIds.includes(e.id));

    for (const sup of toDelete) await BusinessSupplierService.delete(businessId, userId, sup.id);
    for (const sup of suppliers) {
      if (sup.id) await BusinessSupplierService.update(businessId, userId, sup.id, sup as any);
      else await BusinessSupplierService.create(businessId, userId, sup as any);
    }

    await prisma.business.update({ where: { id: businessId }, data: { onboardingStep: 6 } });
    await updateScore(businessId);
    return { success: true };
  } catch (error: any) { return { success: false, error: error.message }; }
}

// ── Step 6: Customers ────────────────────────────────────────
export async function saveCustomersAction(customers: CustomerInput[]) {
  try {
    const { businessId, userId } = await getSession();
    const existing = await CustomerService.list(businessId);
    const inputIds = customers.filter(c => c.id).map(c => c.id as string);
    const toDelete = existing.filter((e: any) => !inputIds.includes(e.id));

    for (const cus of toDelete) await CustomerService.delete(businessId, userId, cus.id);
    for (const cus of customers) {
      if (cus.id) await CustomerService.update(businessId, userId, cus.id, cus as any);
      else await CustomerService.create(businessId, userId, cus as any);
    }

    await prisma.business.update({ where: { id: businessId }, data: { onboardingStep: 7 } });
    await updateScore(businessId);
    return { success: true };
  } catch (error: any) { return { success: false, error: error.message }; }
}

// ── Step 7: Finance Config ──────────────────────────────────
export async function saveFinanceConfigAction(data: FinanceConfigInput) {
  try {
    const { businessId } = await getSession();
    await prisma.businessSettings.upsert({
      where: { businessId },
      update: { fiscalYearStart: data.fiscalYearStart, accountingMethod: data.accountingMethod, invoicePrefix: data.invoicePrefix, defaultCurrency: data.defaultCurrency, openingCash: data.openingCash, openingBank: data.openingBank, openingReceivables: data.openingReceivables, openingPayables: data.openingPayables },
      create: { businessId, fiscalYearStart: data.fiscalYearStart, accountingMethod: data.accountingMethod, invoicePrefix: data.invoicePrefix, defaultCurrency: data.defaultCurrency, openingCash: data.openingCash, openingBank: data.openingBank, openingReceivables: data.openingReceivables, openingPayables: data.openingPayables },
    });
    
    // Create/update banks directly (no bank domain service yet, simple enough)
    if (data.banks) {
      await prisma.bankAccount.updateMany({ where: { businessId, deletedAt: null }, data: { deletedAt: new Date() } });
      if (data.banks.length > 0) {
        await prisma.bankAccount.createMany({ data: data.banks.map((b) => ({ businessId, name: b.name, bankName: b.bankName, accountNumber: b.accountNumber, currency: b.currency, openingBalance: b.openingBalance, isDefault: b.isDefault })) });
      }
    }
    await prisma.business.update({ where: { id: businessId }, data: { onboardingStep: 8 } });
    await updateScore(businessId);
    return { success: true };
  } catch (error: any) { return { success: false, error: error.message }; }
}

// ── Step 8: Taxes ───────────────────────────────────────────
export async function saveTaxesAction(taxes: TaxRuleInput[]) {
  try {
    const { businessId } = await getSession();
    await prisma.taxConfiguration.updateMany({ where: { businessId, deletedAt: null }, data: { deletedAt: new Date() } });
    if (taxes.length > 0) {
      await prisma.taxConfiguration.createMany({ data: taxes.map((t) => ({ businessId, taxType: t.taxType, name: t.name, rate: t.rate, hsnCode: t.hsnCode, region: t.region, invoiceFormat: t.invoiceFormat, isDefault: t.isDefault })) });
    }
    await prisma.business.update({ where: { id: businessId }, data: { onboardingStep: 9 } });
    return { success: true };
  } catch (error: any) { return { success: false, error: error.message }; }
}

// ── Step 9: AI Settings ─────────────────────────────────────
export async function saveAISettingsAction(data: AISettingsInput) {
  try {
    const { businessId } = await getSession();
    await prisma.aISettings.upsert({
      where: { businessId },
      update: { ...data },
      create: { businessId, ...data },
    });
    await prisma.business.update({ where: { id: businessId }, data: { onboardingStep: 10 } });
    await updateScore(businessId);
    return { success: true };
  } catch (error: any) { return { success: false, error: error.message }; }
}

// ── Step 10: Complete Onboarding ─────────────────────────────
export async function completeOnboardingAction() {
  try {
    const { businessId, userId } = await getSession();
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    
    // 1. Generate default Chart of Accounts if none exist
    const accountsCount = await prisma.ledgerAccount.count({ where: { businessId, deletedAt: null } });
    if (accountsCount === 0) {
      const coa = [
        { code: "1000", name: "Cash", type: "ASSET", isSystemAccount: true },
        { code: "1010", name: "Bank", type: "ASSET", isSystemAccount: true },
        { code: "1200", name: "Accounts Receivable", type: "ASSET", isSystemAccount: true },
        { code: "1400", name: "Inventory", type: "ASSET", isSystemAccount: true },
        { code: "1500", name: "Fixed Assets", type: "ASSET", isSystemAccount: true },
        { code: "2000", name: "Accounts Payable", type: "LIABILITY", isSystemAccount: true },
        { code: "2200", name: "GST Payable", type: "LIABILITY", isSystemAccount: true },
        { code: "2210", name: "VAT Payable", type: "LIABILITY", isSystemAccount: true },
        { code: "2500", name: "Loans", type: "LIABILITY", isSystemAccount: true },
        { code: "3000", name: "Owner Capital", type: "EQUITY", isSystemAccount: true },
        { code: "3100", name: "Retained Earnings", type: "EQUITY", isSystemAccount: true },
        { code: "4000", name: "Sales Revenue", type: "REVENUE", isSystemAccount: true },
        { code: "4100", name: "Service Revenue", type: "REVENUE", isSystemAccount: true },
        { code: "5000", name: "Cost of Goods Sold", type: "EXPENSE", isSystemAccount: true },
        { code: "6000", name: "Salary Expense", type: "EXPENSE", isSystemAccount: true },
        { code: "6100", name: "Rent Expense", type: "EXPENSE", isSystemAccount: true },
        { code: "6200", name: "Utilities", type: "EXPENSE", isSystemAccount: true },
        { code: "6300", name: "Marketing", type: "EXPENSE", isSystemAccount: true },
        { code: "6400", name: "Travel", type: "EXPENSE", isSystemAccount: true },
        { code: "6900", name: "Miscellaneous", type: "EXPENSE", isSystemAccount: true },
      ];
      await prisma.ledgerAccount.createMany({
        data: coa.map(a => ({ businessId, ...a }))
      });
    }

    // 2. Generate default Departments if missing
    const deptsCount = await prisma.department.count({ where: { businessId, deletedAt: null } });
    if (deptsCount === 0) {
      await prisma.department.createMany({
        data: ["Finance", "Inventory", "Sales", "Operations", "HR"].map(name => ({ businessId, name }))
      });
    }

    // 3. Generate default Roles
    const rolesCount = await prisma.role.count({ where: { businessId, deletedAt: null } });
    if (rolesCount === 0) {
      await prisma.role.createMany({
        data: ["Owner", "Admin", "Finance Manager", "Inventory Manager", "Sales Manager", "HR Manager", "Employee"].map(name => ({
          businessId, name, isSystemRole: true, permissions: []
        }))
      });
    }

    // 4. Generate Business Knowledge Base
    const employeesCount = await prisma.employee.count({ where: { businessId, deletedAt: null } });
    const suppliersCount = await prisma.supplier.count({ where: { businessId, deletedAt: null } });
    const customersCount = await prisma.customer.count({ where: { businessId, deletedAt: null } });
    const locationsCount = await prisma.businessLocation.count({ where: { businessId, deletedAt: null } });
    
    const kbContent = `Business Name: ${business?.name || 'N/A'}
Industry: ${business?.industry || 'N/A'}
Country: ${business?.country || 'N/A'}
Currency: ${business?.currency || 'USD'}
Employees: ${employeesCount}
Departments: ${Math.max(deptsCount, 5)}
Suppliers: ${suppliersCount}
Customers: ${customersCount}
Warehouses/Locations: ${locationsCount}`;

    await prisma.businessKnowledgeBase.upsert({
      where: { businessId },
      update: { content: kbContent },
      create: { businessId, content: kbContent }
    });

    const score = await recalculateSetupScore(businessId);
    await prisma.business.update({ where: { id: businessId }, data: { onboardingComplete: true, onboardingStep: 10, setupScore: score } });
    await prisma.auditLog.create({ data: { businessId, userId, action: "COMPLETE", entity: "ONBOARDING", entityId: businessId, details: { setupScore: score } } });
    
    revalidatePath("/dashboard");
    return { success: true, setupScore: score };
  } catch (error: any) { return { success: false, error: error.message }; }
}
