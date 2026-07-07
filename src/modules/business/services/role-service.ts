import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "@/modules/audit/audit-service";

export type RoleData = { name: string; description?: string; permissions?: string[] };

export class RoleService {
  static async list(businessId: string) {
    return withBusinessContext(businessId, async (tx) =>
      tx.role.findMany({ where: { businessId, deletedAt: null }, include: { _count: { select: { employees: true } } }, orderBy: { name: "asc" } })
    );
  }

  static async create(businessId: string, userId: string, data: RoleData) {
    return withBusinessContext(businessId, async (tx) => {
      const role = await tx.role.create({ data: { businessId, name: data.name, description: data.description, permissions: data.permissions ?? [] } });
      await AuditService.log(tx, { businessId, userId, action: "CREATE", entity: "ROLE", entityId: role.id, details: { name: data.name } });
      return role;
    });
  }

  static async update(businessId: string, userId: string, id: string, data: Partial<RoleData>) {
    return withBusinessContext(businessId, async (tx) => {
      const role = await tx.role.update({ where: { id }, data: { name: data.name, description: data.description, permissions: data.permissions } });
      await AuditService.log(tx, { businessId, userId, action: "UPDATE", entity: "ROLE", entityId: id, details: data });
      return role;
    });
  }

  static async delete(businessId: string, userId: string, id: string) {
    return withBusinessContext(businessId, async (tx) => {
      await tx.role.update({ where: { id }, data: { deletedAt: new Date() } });
      await AuditService.log(tx, { businessId, userId, action: "DELETE", entity: "ROLE", entityId: id, details: {} });
    });
  }
}

// Available permission modules
export const PERMISSION_MODULES = [
  { module: "inventory", label: "Inventory", permissions: ["inventory.view", "inventory.create", "inventory.edit", "inventory.delete"] },
  { module: "finance", label: "Finance", permissions: ["finance.view", "finance.create", "finance.edit", "finance.delete"] },
  { module: "suppliers", label: "Suppliers", permissions: ["suppliers.view", "suppliers.create", "suppliers.edit", "suppliers.delete"] },
  { module: "customers", label: "Customers", permissions: ["customers.view", "customers.create", "customers.edit", "customers.delete"] },
  { module: "employees", label: "Employees", permissions: ["employees.view", "employees.create", "employees.edit", "employees.delete"] },
  { module: "reports", label: "Reports", permissions: ["reports.view", "reports.export"] },
  { module: "ai", label: "AI CEO", permissions: ["ai.view", "ai.configure", "ai.approve"] },
  { module: "settings", label: "Settings", permissions: ["settings.view", "settings.edit"] },
  { module: "audit", label: "Audit Logs", permissions: ["audit.view"] },
];
