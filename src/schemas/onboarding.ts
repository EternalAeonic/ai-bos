import { z } from "zod";

// ─── Step 2: Business Identity ───────────────────────────────
export const BusinessIdentitySchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  legalName: z.string().optional(),
  industry: z.string().min(1, "Please select an industry"),
  businessType: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  currency: z.string().min(1, "Please select a currency"),
  timezone: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  logoUrl: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  gstNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
});
export type BusinessIdentityInput = z.infer<typeof BusinessIdentitySchema>;

// ─── Step 3: Locations ───────────────────────────────────────
export const LocationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  type: z.enum(["WAREHOUSE", "STORE", "OFFICE", "FACTORY"]),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});
export const LocationsStepSchema = z.object({
  locations: z.array(LocationSchema).min(1, "Add at least one location"),
});
export type LocationInput = z.infer<typeof LocationSchema>;

// ─── Step 4: Departments ─────────────────────────────────────
export const DepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  parentDepartmentId: z.string().optional(),
});
export const DepartmentsStepSchema = z.object({
  departments: z.array(DepartmentSchema),
});
export type DepartmentInput = z.infer<typeof DepartmentSchema>;

// ─── Step 5: Employees ───────────────────────────────────────
export const EmployeeSchema = z.object({
  name: z.string().min(1, "Employee name is required"),
  email: z.string().email("Must be a valid email"),
  jobTitle: z.string().optional(),
  departmentId: z.string().optional(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]).default("FULL_TIME"),
});
export const EmployeesStepSchema = z.object({
  employees: z.array(EmployeeSchema),
});
export type EmployeeInput = z.infer<typeof EmployeeSchema>;

// ─── Step 6: Roles ───────────────────────────────────────────
export const RoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  permissions: z.array(z.string()).default([]),
});
export const RolesStepSchema = z.object({
  roles: z.array(RoleSchema),
});
export type RoleInput = z.infer<typeof RoleSchema>;

// ─── Step 8: Suppliers ───────────────────────────────────────
export const SupplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  contactPerson: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  gstNumber: z.string().optional(),
  paymentTerms: z.string().optional(),
  leadTimeDays: z.number().int().min(0).optional(),
  isPreferred: z.boolean().default(false),
});
export const SuppliersStepSchema = z.object({
  suppliers: z.array(SupplierSchema),
});
export type SupplierInput = z.infer<typeof SupplierSchema>;

// ─── Step 9: Customers ───────────────────────────────────────
export const CustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  category: z.enum(["RETAIL", "WHOLESALE", "VIP"]).optional(),
  paymentTerms: z.string().optional(),
  creditLimit: z.number().min(0).optional(),
  gstNumber: z.string().optional(),
});
export const CustomersStepSchema = z.object({
  customers: z.array(CustomerSchema),
});
export type CustomerInput = z.infer<typeof CustomerSchema>;

// ─── Step 10: Finance ────────────────────────────────────────
export const FinanceConfigSchema = z.object({
  fiscalYearStart: z.string().default("01-01"),
  accountingMethod: z.enum(["ACCRUAL", "CASH"]).default("ACCRUAL"),
  invoicePrefix: z.string().default("INV"),
  defaultCurrency: z.string().default("USD"),
  openingCash: z.number().min(0).optional(),
  openingBank: z.number().min(0).optional(),
  openingReceivables: z.number().min(0).optional(),
  openingPayables: z.number().min(0).optional(),
  banks: z.array(z.object({
    name: z.string().min(1),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    currency: z.string().default("USD"),
    openingBalance: z.number().default(0),
    isDefault: z.boolean().default(false),
  })).optional(),
});
export type FinanceConfigInput = z.infer<typeof FinanceConfigSchema>;

// ─── Step 11: Taxes ──────────────────────────────────────────
export const TaxRuleSchema = z.object({
  taxType: z.string().min(1),
  name: z.string().min(1),
  rate: z.number().min(0).max(100),
  hsnCode: z.string().optional(),
  region: z.string().optional(),
  invoiceFormat: z.string().default("INV-[YYYY]-[0000]"),
  isDefault: z.boolean().default(false),
});
export const TaxStepSchema = z.object({
  taxes: z.array(TaxRuleSchema),
});
export type TaxRuleInput = z.infer<typeof TaxRuleSchema>;

// ─── Step 12: AI Settings ────────────────────────────────────
export const AISettingsSchema = z.object({
  autonomyLevel: z.enum(["MANUAL", "BALANCED", "AUTONOMOUS"]).default("BALANCED"),
  riskLow: z.enum(["AUTO", "NOTIFY", "APPROVE"]).default("AUTO"),
  riskMedium: z.enum(["AUTO", "NOTIFY", "APPROVE", "OWNER"]).default("APPROVE"),
  riskHigh: z.enum(["NOTIFY", "APPROVE", "OWNER", "OWNER_MANAGER"]).default("OWNER"),
  riskCritical: z.enum(["OWNER", "OWNER_MANAGER"]).default("OWNER_MANAGER"),
  notifyEmail: z.boolean().default(true),
  notifySlack: z.boolean().default(false),
  notifyWhatsApp: z.boolean().default(false),
  notifySms: z.boolean().default(false),
  dailyBriefTime: z.string().default("09:00"),
  weeklyReport: z.boolean().default(true),
  monthlyReport: z.boolean().default(true),
  language: z.string().default("en"),
  workStart: z.string().default("09:00"),
  workEnd: z.string().default("18:00"),
});
export type AISettingsInput = z.infer<typeof AISettingsSchema>;
