import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "@/modules/audit/audit-service";

export type DepartmentData = {
  name: string;
  parentDepartmentId?: string;
};

export class DepartmentService {
  static async list(businessId: string) {
    return withBusinessContext(businessId, async (tx) =>
      tx.department.findMany({ 
        where: { businessId, deletedAt: null }, 
        orderBy: { createdAt: "desc" } 
      })
    );
  }

  static async create(businessId: string, userId: string, data: DepartmentData) {
    return withBusinessContext(businessId, async (tx) => {
      const dept = await tx.department.create({ 
        data: { businessId, ...data } 
      });
      await AuditService.log(tx, { 
        businessId, 
        userId, 
        action: "CREATE", 
        entity: "DEPARTMENT", 
        entityId: dept.id, 
        details: { name: data.name } 
      });
      return dept;
    });
  }

  static async update(businessId: string, userId: string, id: string, data: Partial<DepartmentData>) {
    return withBusinessContext(businessId, async (tx) => {
      const dept = await tx.department.update({ where: { id }, data });
      await AuditService.log(tx, { 
        businessId, 
        userId, 
        action: "UPDATE", 
        entity: "DEPARTMENT", 
        entityId: id, 
        details: data 
      });
      return dept;
    });
  }

  static async delete(businessId: string, userId: string, id: string) {
    return withBusinessContext(businessId, async (tx) => {
      await tx.department.update({ where: { id }, data: { deletedAt: new Date() } });
      await AuditService.log(tx, { 
        businessId, 
        userId, 
        action: "DELETE", 
        entity: "DEPARTMENT", 
        entityId: id, 
        details: {} 
      });
    });
  }
}
