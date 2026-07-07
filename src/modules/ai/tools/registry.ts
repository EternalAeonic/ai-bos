import { z } from "zod";
import { BusinessSupplierService } from "@/modules/business/services/supplier-service";
import { EmployeeService } from "@/modules/business/services/employee-service";
import { FinanceConfigService } from "@/modules/business/services/finance-config-service";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ExecutionType = "READ" | "WRITE" | "DELETE" | "WORKFLOW";

export interface ToolMetadata {
  name: string;
  risk: RiskLevel;
  permissions: string[];
  requiredModule: string;
  estimatedCost: number;
  executionType: ExecutionType;
  rollbackSupport: boolean;
  version: string;
  affectedModules: string[];
}

export interface AIToolConfig {
  description: string;
  parameters: z.ZodType<any>;
  execute: (args: any) => Promise<any>;
  metadata: ToolMetadata;
}

export const getAITools = (businessId: string): Record<string, AIToolConfig> => {
  return {
    
    // -------------------------------------------------------------
    // READ TOOLS
    // -------------------------------------------------------------

    readSuppliersTool: {
      description: "Read the list of active suppliers.",
      parameters: z.object({}),
      execute: async () => {
        const suppliers = await BusinessSupplierService.list(businessId);
        return { suppliers };
      },
      metadata: {
        name: "Read Suppliers",
        risk: "LOW",
        permissions: ["suppliers.view"],
        requiredModule: "SUPPLIERS",
        estimatedCost: 0,
        executionType: "READ",
        rollbackSupport: false,
        version: "1.0",
        affectedModules: ["SUPPLIERS"]
      }
    },

    readEmployeesTool: {
      description: "Read the list of employees and their departments.",
      parameters: z.object({}),
      execute: async () => {
        const employees = await EmployeeService.list(businessId);
        return { employees };
      },
      metadata: {
        name: "Read Employees",
        risk: "LOW",
        permissions: ["employees.view"],
        requiredModule: "HR",
        estimatedCost: 0,
        executionType: "READ",
        rollbackSupport: false,
        version: "1.0",
        affectedModules: ["HR"]
      }
    },

    readFinanceConfigTool: {
      description: "Read the finance settings and active bank accounts.",
      parameters: z.object({}),
      execute: async () => {
        const settings = await FinanceConfigService.getSettings(businessId);
        const bankAccounts = await FinanceConfigService.listBankAccounts(businessId);
        return { settings, bankAccounts };
      },
      metadata: {
        name: "Read Finance Settings",
        risk: "LOW",
        permissions: ["finance.view"],
        requiredModule: "FINANCE",
        estimatedCost: 0,
        executionType: "READ",
        rollbackSupport: false,
        version: "1.0",
        affectedModules: ["FINANCE"]
      }
    },

    // -------------------------------------------------------------
    // INVENTORY INTELLIGENCE TOOLS
    // -------------------------------------------------------------

    analyzeInventoryHealthTool: {
      description: "Analyze inventory health (low stock, overstock, dead stock, fast/slow moving products).",
      parameters: z.object({}),
      execute: async () => {
        const { InventoryIntelligenceService } = await import("@/modules/business/services/inventory-intelligence-service");
        return await InventoryIntelligenceService.analyzeInventoryHealth(businessId);
      },
      metadata: {
        name: "Analyze Inventory Health",
        risk: "LOW",
        permissions: ["inventory.view"],
        requiredModule: "INVENTORY",
        estimatedCost: 0,
        executionType: "READ",
        rollbackSupport: false,
        version: "1.0",
        affectedModules: ["INVENTORY"]
      }
    },

    scoreSuppliersTool: {
      description: "Get deterministic scores for suppliers based on price, lead time, delivery, and quality.",
      parameters: z.object({
        productId: z.string().optional()
      }),
      execute: async (args: any) => {
        const { InventoryIntelligenceService } = await import("@/modules/business/services/inventory-intelligence-service");
        return await InventoryIntelligenceService.scoreSuppliers(businessId, args.productId);
      },
      metadata: {
        name: "Score Suppliers",
        risk: "LOW",
        permissions: ["suppliers.view"],
        requiredModule: "SUPPLIERS",
        estimatedCost: 0,
        executionType: "READ",
        rollbackSupport: false,
        version: "1.0",
        affectedModules: ["SUPPLIERS"]
      }
    },

    predictStockoutTool: {
      description: "Predict when a specific product will run out of stock.",
      parameters: z.object({
        productId: z.string()
      }),
      execute: async (args: any) => {
        const { InventoryIntelligenceService } = await import("@/modules/business/services/inventory-intelligence-service");
        return await InventoryIntelligenceService.predictStockoutDate(businessId, args.productId);
      },
      metadata: {
        name: "Predict Stockout",
        risk: "LOW",
        permissions: ["inventory.view"],
        requiredModule: "INVENTORY",
        estimatedCost: 0,
        executionType: "READ",
        rollbackSupport: false,
        version: "1.0",
        affectedModules: ["INVENTORY"]
      }
    },

    // -------------------------------------------------------------
    // WORKFLOW PREPARATION TOOLS
    // -------------------------------------------------------------

    createSupplierWorkflowTool: {
      description: "Prepare a workflow to onboard a new Supplier. Requires verification.",
      parameters: z.object({
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        paymentTerms: z.string().optional(),
      }),
      execute: async (args: any) => {
        return {
          status: "PREPARED",
          actionType: "CREATE_SUPPLIER_WORKFLOW",
          sourceModule: "SUPPLIERS",
          payload: args,
          message: "Supplier creation workflow prepared and waiting for approval.",
          isReversible: true, // Can delete the supplier if not used
          numberOfRecords: 1
        };
      },
      metadata: {
        name: "Supplier Onboarding Workflow",
        risk: "MEDIUM",
        permissions: ["suppliers.create"],
        requiredModule: "SUPPLIERS",
        estimatedCost: 0,
        executionType: "WORKFLOW",
        rollbackSupport: true,
        version: "1.0",
        affectedModules: ["SUPPLIERS", "FINANCE"]
      }
    },

    createEmployeeWorkflowTool: {
      description: "Prepare a workflow to onboard a new Employee. Requires verification.",
      parameters: z.object({
        name: z.string(),
        email: z.string(),
        jobTitle: z.string().optional(),
      }),
      execute: async (args: any) => {
        return {
          status: "PREPARED",
          actionType: "CREATE_EMPLOYEE_WORKFLOW",
          sourceModule: "HR",
          payload: args,
          message: "Employee onboarding workflow prepared and waiting for approval.",
          isReversible: true,
          numberOfRecords: 1
        };
      },
      metadata: {
        name: "Employee Onboarding Workflow",
        risk: "HIGH",
        permissions: ["employees.create"],
        requiredModule: "HR",
        estimatedCost: 1000,
        executionType: "WORKFLOW",
        rollbackSupport: true,
        version: "1.0",
        affectedModules: ["HR", "IT"]
      }
    },

    createPurchaseOrderWorkflowTool: {
      description: "Prepare a workflow to restock inventory via a Purchase Order. Drafts PO and waits for approval.",
      parameters: z.object({
        supplierId: z.string(),
        items: z.array(z.object({
          productId: z.string(),
          quantity: z.number(),
          unitPrice: z.number()
        })),
        totalCost: z.number().describe("The total estimated cost of this purchase order")
      }),
      execute: async (args: any) => {
        return {
          status: "PREPARED",
          actionType: "INVENTORY_RESTOCK_WORKFLOW",
          sourceModule: "INVENTORY",
          payload: args,
          message: "Purchase Order workflow drafted and waiting for approval.",
          isReversible: true, // A PO can be cancelled before goods are received
          numberOfRecords: args.items.length
        };
      },
      metadata: {
        name: "Inventory Restock Workflow",
        risk: "MEDIUM",
        permissions: ["inventory.purchase"],
        requiredModule: "INVENTORY",
        estimatedCost: 0, // LLM provides cost via expectedCost, but base cost of tool is 0
        executionType: "WORKFLOW",
        rollbackSupport: true,
        version: "1.0",
        affectedModules: ["INVENTORY", "SUPPLIERS", "FINANCE"]
      }
    },

    readInventoryTool: {
      description: "Read the complete list of products and current stock.",
      parameters: z.object({}),
      execute: async () => {
        const { ProductService } = await import("@/modules/inventory/services/product-service");
        const products = await ProductService.listProducts(businessId);
        return { products };
      },
      metadata: {
        name: "Read Inventory",
        risk: "LOW",
        permissions: ["inventory.view"],
        requiredModule: "INVENTORY",
        estimatedCost: 0,
        executionType: "READ",
        rollbackSupport: false,
        version: "1.0",
        affectedModules: ["INVENTORY"]
      }
    },

    createProductWorkflowTool: {
      description: "Prepare a workflow to create a new Product. Requires verification.",
      parameters: z.object({
        name: z.string(),
        sku: z.string().optional(),
        barcode: z.string().optional(),
        categoryId: z.string().optional(),
        supplierId: z.string().optional(),
        warehouseId: z.string().optional(),
        unit: z.string().optional(),
        costPrice: z.number().optional(),
        sellingPrice: z.number().optional(),
        minStockLevel: z.number().optional(),
        maxStockLevel: z.number().optional(),
        reorderPoint: z.number().optional()
      }),
      execute: async (args: any) => {
        return {
          status: "PREPARED",
          actionType: "CREATE_PRODUCT_WORKFLOW",
          sourceModule: "INVENTORY",
          payload: args,
          message: "Product creation workflow prepared and waiting for approval.",
          isReversible: true,
          numberOfRecords: 1
        };
      },
      metadata: {
        name: "Create Product Workflow",
        risk: "MEDIUM",
        permissions: ["inventory.create"],
        requiredModule: "INVENTORY",
        estimatedCost: 0,
        executionType: "WORKFLOW",
        rollbackSupport: true,
        version: "1.0",
        affectedModules: ["INVENTORY"]
      }
    },

    recordMovementWorkflowTool: {
      description: "Prepare a workflow to record a manual stock movement (e.g. DAMAGE, EXPIRED). Requires verification.",
      parameters: z.object({
        productId: z.string(),
        warehouseId: z.string(),
        type: z.enum(["DAMAGE", "EXPIRED", "ADJUSTMENT"]),
        quantity: z.number(),
        notes: z.string().optional()
      }),
      execute: async (args: any) => {
        return {
          status: "PREPARED",
          actionType: "RECORD_MOVEMENT_WORKFLOW",
          sourceModule: "INVENTORY",
          payload: args,
          message: "Stock movement workflow prepared and waiting for approval.",
          isReversible: false, // Movements are append-only ledger
          numberOfRecords: 1
        };
      },
      metadata: {
        name: "Record Movement Workflow",
        risk: "HIGH",
        permissions: ["inventory.movement"],
        requiredModule: "INVENTORY",
        estimatedCost: 0,
        executionType: "WORKFLOW",
        rollbackSupport: false,
        version: "1.0",
        affectedModules: ["INVENTORY"]
      }
    },

    transferStockWorkflowTool: {
      description: "Prepare a workflow to transfer stock between two warehouses. Requires verification.",
      parameters: z.object({
        productId: z.string(),
        fromWarehouseId: z.string(),
        toWarehouseId: z.string(),
        quantity: z.number(),
        notes: z.string().optional()
      }),
      execute: async (args: any) => {
        return {
          status: "PREPARED",
          actionType: "TRANSFER_STOCK_WORKFLOW",
          sourceModule: "INVENTORY",
          payload: args,
          message: "Stock transfer workflow prepared and waiting for approval.",
          isReversible: false,
          numberOfRecords: 2 // Two ledger entries (out and in)
        };
      },
      metadata: {
        name: "Transfer Stock Workflow",
        risk: "HIGH",
        permissions: ["inventory.transfer"],
        requiredModule: "INVENTORY",
        estimatedCost: 0,
        executionType: "WORKFLOW",
        rollbackSupport: false,
        version: "1.0",
        affectedModules: ["INVENTORY"]
      }
    }

  };
};
