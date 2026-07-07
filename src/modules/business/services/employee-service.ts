import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "@/modules/audit/audit-service";

export type EmployeeData = {
  name: string; email: string; phone?: string; jobTitle?: string;
  departmentId?: string; managerId?: string; roleId?: string;
  employmentType?: string; hireDate?: Date;
  emergencyContactName?: string; emergencyContactPhone?: string;
};

export class EmployeeService {
  static async list(businessId: string) {
    return withBusinessContext(businessId, async (tx) =>
      tx.employee.findMany({
        where: { businessId, deletedAt: null },
        include: { department: { select: { id: true, name: true } }, role: { select: { id: true, name: true } }, manager: { select: { id: true, name: true } } },
        orderBy: { name: "asc" },
      })
    );
  }

  static async create(businessId: string, userId: string, data: EmployeeData) {
    return withBusinessContext(businessId, async (tx) => {
      // Validate department if provided
      if (data.departmentId) {
        const dept = await tx.department.findFirst({
          where: { id: data.departmentId, businessId }
        });
        if (!dept) {
          const { DepartmentNotFoundException } = await import("@/lib/exceptions");
          throw new DepartmentNotFoundException(`Department ID ${data.departmentId} not found`);
        }
      }

      const employee = await tx.employee.create({ data: { businessId, ...data, status: "INVITED" } });
      await AuditService.log(tx, { businessId, userId, action: "CREATE", entity: "EMPLOYEE", entityId: employee.id, details: { name: data.name, email: data.email } });
      return employee;
    });
  }

  static async update(businessId: string, userId: string, id: string, data: Partial<EmployeeData>) {
    return withBusinessContext(businessId, async (tx) => {
      const employee = await tx.employee.update({ where: { id }, data });
      await AuditService.log(tx, { businessId, userId, action: "UPDATE", entity: "EMPLOYEE", entityId: id, details: data });
      return employee;
    });
  }

  static async deactivate(businessId: string, userId: string, id: string) {
    return withBusinessContext(businessId, async (tx) => {
      const employee = await tx.employee.update({ where: { id }, data: { status: "INACTIVE" } });
      await AuditService.log(tx, { businessId, userId, action: "DEACTIVATE", entity: "EMPLOYEE", entityId: id, details: { reason: "manual_deactivation" } });
      return employee;
    });
  }

  static async delete(businessId: string, userId: string, id: string) {
    return withBusinessContext(businessId, async (tx) => {
      await tx.employee.update({ where: { id }, data: { deletedAt: new Date() } });
      await AuditService.log(tx, { businessId, userId, action: "DELETE", entity: "EMPLOYEE", entityId: id, details: {} });
    });
  }
}
