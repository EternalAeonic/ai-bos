"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  saveBusinessIdentityAction,
  saveLocationsAction,
  saveDepartmentsAction,
  saveEmployeesAction,
  saveSuppliersAction,
  saveCustomersAction,
  saveFinanceConfigAction,
  saveTaxesAction,
  saveAISettingsAction,
  completeOnboardingAction,
} from "@/app/actions/onboarding";

// ─── Types ───────────────────────────────────────────────────

export interface OnboardingData {
  // Step 1: Business Info
  businessName: string;
  legalName: string;
  industry: string;
  businessType: string;
  country: string;
  currency: string;
  timezone: string;
  website: string;
  phone: string;
  logoUrl: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  gstNumber: string;
  vatNumber: string;
  registrationNumber: string;
  companySize?: string;
  email?: string;

  // Step 2: Locations
  locations: any[];

  // Step 3: Departments
  departments: any[];

  // Step 4: Employees
  employees: any[];

  // Step 5: Suppliers
  suppliers: any[];

  // Step 6: Customers
  customers: any[];

  // Step 7: Finance
  finance: {
    openingCash: string;
    bankBalance: string;
    fiscalYearStart: string;
    invoicePrefix: string;
    currency: string;
    accountingMethod: string;
  };

  // Step 8: Tax
  taxes: { rules: any[]; invoiceFormat: string };

  // Step 9: AI Config
  aiConfig: {
    assistantName: string;
    language: string;
    notificationEmail: string;
    approvalLevel: string;
    autoSuggestions: boolean;
  };
}

interface OnboardingContextType {
  step: number;
  data: OnboardingData;
  saving: boolean;
  setStep: (step: number | ((s: number) => number)) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  updateData: (updates: Partial<OnboardingData>) => void;
}

// ─── Default Data ────────────────────────────────────────────

const defaultData: OnboardingData = {
  businessName: "",
  legalName: "",
  industry: "",
  businessType: "",
  country: "",
  currency: "USD",
  timezone: "UTC",
  website: "",
  phone: "",
  logoUrl: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  gstNumber: "",
  vatNumber: "",
  registrationNumber: "",
  companySize: "",
  email: "",
  locations: [],
  departments: [],
  employees: [],
  suppliers: [],
  customers: [],
  finance: {
    openingCash: "",
    bankBalance: "",
    fiscalYearStart: "01-01",
    invoicePrefix: "INV",
    currency: "USD",
    accountingMethod: "Accrual",
  },
  taxes: { rules: [], invoiceFormat: "INV-[YYYY]-[0000]" },
  aiConfig: {
    assistantName: "AI-BOS",
    language: "en",
    notificationEmail: "",
    approvalLevel: "BALANCED",
    autoSuggestions: true,
  },
};

// ─── Context ─────────────────────────────────────────────────

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [saving, setSaving] = useState(false);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const persistStep = useCallback(async (currentStep: number): Promise<boolean> => {
    try {
      setSaving(true);
      let result: { success: boolean; error?: string } = { success: true };

      switch (currentStep) {
        case 1:
          result = await saveBusinessIdentityAction({
            name: data.businessName,
            legalName: data.legalName || undefined,
            industry: data.industry,
            businessType: data.businessType || undefined,
            country: data.country,
            currency: data.currency,
            timezone: data.timezone || undefined,
            website: data.website || undefined,
            phone: data.phone || undefined,
            logoUrl: data.logoUrl || undefined,
            address: data.address || undefined,
            city: data.city || undefined,
            state: data.state || undefined,
            postalCode: data.postalCode || undefined,
            gstNumber: data.gstNumber || undefined,
            vatNumber: data.vatNumber || undefined,
            registrationNumber: data.registrationNumber || undefined,
          });
          break;

        case 2:
          if (data.locations.length > 0) {
            result = await saveLocationsAction(
              data.locations.map((l: any) => ({
                name: l.name || "Main Location",
                type: l.type || "OFFICE",
                address: l.address,
                city: l.city,
                state: l.state,
                country: l.country,
                postalCode: l.postalCode,
                phone: l.phone,
                isDefault: l.isDefault ?? false,
              }))
            );
          }
          break;

        case 3:
          if (data.departments.length > 0) {
            result = await saveDepartmentsAction(
              data.departments.map((d: any) => ({ name: d.name || d }))
            );
          }
          break;

        case 4:
          if (data.employees.length > 0) {
            result = await saveEmployeesAction(
              data.employees.map((e: any) => ({
                name: e.name,
                email: e.email,
                jobTitle: e.role || e.jobTitle,
                employmentType: "FULL_TIME" as const,
              }))
            );
          }
          break;

        case 5:
          if (data.suppliers.length > 0) {
            result = await saveSuppliersAction(
              data.suppliers.map((s: any) => ({
                name: s.name,
                contactPerson: s.contactPerson,
                email: s.email,
                phone: s.phone,
                address: s.address,
                city: s.city,
                country: s.country,
                gstNumber: s.gstNumber,
                paymentTerms: s.paymentTerms,
                leadTimeDays: s.leadTimeDays,
                isPreferred: s.isPreferred ?? false,
              }))
            );
          }
          break;

        case 6:
          if (data.customers.length > 0) {
            result = await saveCustomersAction(
              data.customers.map((c: any) => ({
                name: c.name,
                email: c.email,
                phone: c.phone,
                address: c.address,
                city: c.city,
                country: c.country,
                category: c.category,
                paymentTerms: c.paymentTerms,
                creditLimit: c.creditLimit,
                gstNumber: c.gstNumber,
              }))
            );
          }
          break;

        case 7:
          result = await saveFinanceConfigAction({
            fiscalYearStart: data.finance.fiscalYearStart || "01-01",
            accountingMethod: data.finance.accountingMethod === "Cash" ? "CASH" : "ACCRUAL",
            invoicePrefix: data.finance.invoicePrefix || "INV",
            defaultCurrency: data.finance.currency || "USD",
            openingCash: parseFloat(data.finance.openingCash) || undefined,
            openingBank: parseFloat(data.finance.bankBalance) || undefined,
          });
          break;

        case 8:
          if (data.taxes.rules && data.taxes.rules.length > 0) {
            result = await saveTaxesAction(
              data.taxes.rules.map((t: any) => ({
                taxType: t.taxType || "SALES_TAX",
                name: t.taxType || "Sales Tax",
                rate: parseFloat(t.rate) || 0,
                region: t.region,
                invoiceFormat: data.taxes.invoiceFormat || "INV-[YYYY]-[0000]",
                isDefault: false,
              }))
            );
          }
          break;

        case 9:
          result = await saveAISettingsAction({
            assistantName: data.aiConfig.assistantName || "AI-BOS",
            automaticSuggestions: data.aiConfig.autoSuggestions,
            autonomyLevel: data.aiConfig.approvalLevel === "MANUAL" ? "MANUAL" : (data.aiConfig.approvalLevel === "AUTONOMOUS" ? "AUTONOMOUS" : "BALANCED"),
            riskLow: "AUTO",
            riskMedium: "APPROVE",
            riskHigh: "OWNER",
            riskCritical: "OWNER_MANAGER",
            notifyEmail: data.aiConfig.notificationEmail !== "",
            notifySlack: false,
            notifyWhatsApp: false,
            notifySms: false,
            dailyBriefTime: "09:00",
            weeklyReport: true,
            monthlyReport: true,
            language: data.aiConfig.language || "en",
            workStart: "09:00",
            workEnd: "18:00",
          });
          break;

        case 10:
          result = await completeOnboardingAction();
          if (result.success) {
            toast.success("Business setup complete! 🎉", {
              description: "Your AI CEO is ready to manage your business.",
            });
          }
          break;
      }

      if (!result.success) {
        toast.error("Failed to save", { description: result.error });
        return false;
      }

      if (currentStep !== 10 && currentStep >= 1) {
        toast.success(`Step ${currentStep} saved`, {
          description: "Your data is safely stored in the cloud.",
          duration: 2000,
        });
      }

      return true;
    } catch (err: any) {
      console.error("persistStep error:", err);
      toast.error("Something went wrong", { description: err.message });
      return false;
    } finally {
      setSaving(false);
    }
  }, [data]);

  const nextStep = useCallback(async () => {
    const saved = await persistStep(step);
    if (saved) {
      setStep((s) => Math.min(s + 1, 10));
    }
  }, [step, persistStep]);

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  return (
    <OnboardingContext.Provider value={{ step, data, saving, setStep, nextStep, prevStep, updateData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
