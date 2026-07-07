import { withBusinessContext } from "@/lib/prisma";
import { AuditService } from "@/modules/audit/audit-service";

export type LocationData = {
  name: string; type: string; address?: string; city?: string;
  state?: string; country?: string; postalCode?: string; phone?: string;
  isDefault?: boolean; operatingHours?: any;
};

export class LocationService {
  static async list(businessId: string) {
    return withBusinessContext(businessId, async (tx) =>
      tx.businessLocation.findMany({ where: { businessId, deletedAt: null }, orderBy: { createdAt: "desc" } })
    );
  }

  static async create(businessId: string, userId: string, data: LocationData) {
    return withBusinessContext(businessId, async (tx) => {
      if (data.isDefault) {
        await tx.businessLocation.updateMany({ where: { businessId, deletedAt: null }, data: { isDefault: false } });
      }
      const loc = await tx.businessLocation.create({ data: { businessId, ...data } });
      await AuditService.log(tx, { businessId, userId, action: "CREATE", entity: "BUSINESS_LOCATION", entityId: loc.id, details: { name: data.name, type: data.type } });
      return loc;
    });
  }

  static async update(businessId: string, userId: string, id: string, data: Partial<LocationData>) {
    return withBusinessContext(businessId, async (tx) => {
      if (data.isDefault) {
        await tx.businessLocation.updateMany({ where: { businessId, deletedAt: null }, data: { isDefault: false } });
      }
      const loc = await tx.businessLocation.update({ where: { id }, data });
      await AuditService.log(tx, { businessId, userId, action: "UPDATE", entity: "BUSINESS_LOCATION", entityId: id, details: data });
      return loc;
    });
  }

  static async delete(businessId: string, userId: string, id: string) {
    return withBusinessContext(businessId, async (tx) => {
      await tx.businessLocation.update({ where: { id }, data: { deletedAt: new Date() } });
      await AuditService.log(tx, { businessId, userId, action: "DELETE", entity: "BUSINESS_LOCATION", entityId: id, details: {} });
    });
  }
}
