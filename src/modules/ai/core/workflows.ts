export interface WorkflowStep {
  name: string;
  execute: (businessId: string, userId: string, context: any) => Promise<any>;
}

export interface WorkflowDefinition {
  name: string;
  steps: WorkflowStep[];
}

export const WorkflowRegistry: Record<string, WorkflowDefinition> = {
  
  CREATE_SUPPLIER_WORKFLOW: {
    name: "Supplier Onboarding Workflow",
    steps: [
      {
        name: "Create Supplier Record",
        execute: async (businessId, userId, context) => {
          const { BusinessSupplierService } = await import("@/modules/business/services/supplier-service");
          return BusinessSupplierService.create(businessId, userId, {
            name: context.name,
            email: context.email || "",
            phone: context.phone || "",
            paymentTerms: context.paymentTerms || "NET_30",
            isPreferred: false,
          });
        }
      },
      {
        name: "Notify Procurement Team",
        execute: async (businessId, userId, context) => {
          // Mock sending email or Slack
          console.log(`[Workflow] Notifying procurement team about new supplier: ${context.name}`);
          return { notified: true };
        }
      }
    ]
  },

  CREATE_EMPLOYEE_WORKFLOW: {
    name: "Employee Onboarding Workflow",
    steps: [
      {
        name: "Create Employee Record",
        execute: async (businessId, userId, context) => {
          const { EmployeeService } = await import("@/modules/business/services/employee-service");
          return EmployeeService.create(businessId, userId, {
            name: context.name,
            email: context.email,
            jobTitle: context.jobTitle || "",
            employmentType: "FULL_TIME",
          });
        }
      },
      {
        name: "Assign Default Roles",
        execute: async (businessId, userId, context) => {
          console.log(`[Workflow] Assigning default roles to employee: ${context.name}`);
          return { rolesAssigned: true };
        }
      },
      {
        name: "Send Welcome Email",
        execute: async (businessId, userId, context) => {
          console.log(`[Workflow] Sending welcome email to: ${context.email}`);
          return { emailSent: true };
        }
      }
    ]
  },

  INVENTORY_RESTOCK_WORKFLOW: {
    name: "Inventory Restock Workflow",
    steps: [
      {
        name: "Create Purchase Order",
        execute: async (businessId, userId, context) => {
          const { PurchaseService } = await import("@/modules/business/services/purchase-service");
          // Assuming the context contains supplierId and totalCost based on tool payload
          return PurchaseService.createPurchaseOrder(businessId, userId, context.supplierId, context.totalCost);
        }
      },
      {
        name: "Notify Supplier",
        execute: async (businessId, userId, context) => {
          console.log(`[Workflow] Notifying supplier ${context.supplierId} about new Purchase Order.`);
          return { notified: true };
        }
      },
      {
        name: "Post Finance Journal",
        execute: async (businessId, userId, context) => {
          const { FinanceService } = await import("@/modules/business/services/finance-service");
          // Accrue liability for the PO
          return FinanceService.postJournal(businessId, userId, `Purchase Order Liability Accrual`, [
            { accountId: "inventory-asset-acc", debit: context.totalCost, credit: 0 },
            { accountId: "accounts-payable-acc", debit: 0, credit: context.totalCost }
          ]);
        }
      }
    ]
  }

};
