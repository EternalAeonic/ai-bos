"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type OnboardingData = {
  // Step 2: Business Identity
  businessName: string;
  legalName: string;
  industry: string;
  companySize: string;
  website: string;
  email: string;
  phone: string;
  country: string;
  currency: string;
  timezone: string;
  fiscalYear: string;
  gstNumber: string;

  // Step 3: Locations
  locations: any[];

  // Step 4: Departments
  departments: string[];

  // Step 5: Employees
  employees: any[];

  // Step 6: Roles
  roles: any[];

  // Step 7: Inventory
  inventory: any[];

  // Step 8: Suppliers
  suppliers: any[];

  // Step 9: Customers
  customers: any[];

  // Step 10: Finance
  finance: any;

  // Step 11: Taxes
  taxes: any;

  // Step 12: AI Preferences
  aiPreferences: any;

  // Step 13: Integrations
  integrations: string[];
};

const defaultData: OnboardingData = {
  businessName: "",
  legalName: "",
  industry: "",
  companySize: "1-10",
  website: "",
  email: "",
  phone: "",
  country: "United States",
  currency: "USD",
  timezone: "UTC",
  fiscalYear: "Jan-Dec",
  gstNumber: "",
  locations: [],
  departments: [],
  employees: [],
  roles: [],
  inventory: [],
  suppliers: [],
  customers: [],
  finance: {},
  taxes: {},
  aiPreferences: {
    autonomy: "Balanced",
    approvalThreshold: "Only High Risk",
  },
  integrations: [],
};

type OnboardingContextType = {
  step: number;
  data: OnboardingData;
  setStep: (step: number) => void;
  updateData: (partialData: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(defaultData);

  const updateData = (partialData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partialData }));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 15));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <OnboardingContext.Provider value={{ step, data, setStep, updateData, nextStep, prevStep }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
