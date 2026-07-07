import { vi, describe, it, expect, beforeAll } from "vitest";
import { InvalidQuantityException, JournalNotBalancedException, SupplierNotFoundException, DepartmentNotFoundException } from "../lib/exceptions";
import { InventoryService } from "../modules/business/services/inventory-service";
import { FinanceService } from "../modules/business/services/finance-service";
import { PurchaseService } from "../modules/business/services/purchase-service";
import { EmployeeService } from "../modules/business/services/employee-service";
import { prisma, withBusinessContext } from "../lib/prisma";

// --- MOCKING PRISMA DIRECTLY (No module replacement for withBusinessContext) ---
beforeAll(() => {
  // Override the methods on the real prisma object exported by lib/prisma
  prisma.aISettings = { findUnique: vi.fn() } as any;
  prisma.aIRecommendation = { findUnique: vi.fn(), update: vi.fn(), create: vi.fn() } as any;
  prisma.workflowExecution = { create: vi.fn(), update: vi.fn() } as any;
  
  // Mock the transaction method
  prisma.$transaction = vi.fn().mockImplementation(async (cb) => {
    // Provide a mock transaction client that includes $executeRaw for RLS
    return cb({
      $executeRaw: vi.fn().mockResolvedValue(true),
      department: { findFirst: vi.fn().mockResolvedValue(null) }, // Mock department not found
      supplier: { findFirst: vi.fn().mockResolvedValue(null) }, // Mock supplier not found
      employee: { create: vi.fn() },
      journalEntry: { create: vi.fn() },
      inventoryMovement: { create: vi.fn() }
    });
  }) as any;
});

vi.mock("../modules/audit/audit-service", () => ({
  AuditService: { log: vi.fn() }
}));

// --------------------------------

describe("Domain Guard Rails", () => {
  it("InventoryService throws InvalidQuantityException on negative quantity", async () => {
    await expect(
      InventoryService.adjustStock("expected-business-id", "user1", "prod1", "wh1", -5)
    ).rejects.toThrow(InvalidQuantityException);
  });

  it("FinanceService throws JournalNotBalancedException on unbalanced journal", async () => {
    await expect(
      FinanceService.postJournal("expected-business-id", "user1", "Test", [
        { accountId: "acc1", debit: 100, credit: 0 },
        { accountId: "acc2", debit: 0, credit: 50 } // Unbalanced!
      ])
    ).rejects.toThrow(JournalNotBalancedException);
  });

  it("PurchaseService throws SupplierNotFoundException on missing supplier", async () => {
    await expect(
      PurchaseService.createPurchaseOrder("expected-business-id", "user1", "invalid-supplier", 1000)
    ).rejects.toThrow(SupplierNotFoundException);
  });

  it("EmployeeService throws DepartmentNotFoundException on missing department", async () => {
    await expect(
      EmployeeService.create("expected-business-id", "user1", {
        name: "Test", email: "test@test.com", departmentId: "invalid-dept"
      } as any)
    ).rejects.toThrow(DepartmentNotFoundException);
  });

  it("Business Tenant Isolation correctly applies PostgreSQL RLS via withBusinessContext", async () => {
    // We pass a dummy callback and intercept the $executeRaw call
    let interceptedTx: any;
    
    await withBusinessContext("secure-tenant-123", async (tx) => {
      interceptedTx = tx;
      return "SUCCESS";
    });

    // Verify that the REAL withBusinessContext executed set_config before running our code
    // The exact query uses Prisma's tagged template literal string arrays
    const executeRawCalls = interceptedTx.$executeRaw.mock.calls;
    expect(executeRawCalls.length).toBeGreaterThan(0);
    
    const queryParts = executeRawCalls[0][0]; // The SQL template strings
    const queryValues = executeRawCalls[0].slice(1); // The interpolated values
    
    expect(queryParts.join("")).toContain("SELECT set_config('app.current_business',");
    expect(queryValues).toContain("secure-tenant-123");
  });
});

