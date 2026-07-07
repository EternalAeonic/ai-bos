import { Prisma } from "@prisma/client";
import { AuditService } from "../../audit/audit-service";
import { withBusinessContext } from "@/lib/prisma";

export class ProductService {
  static async createProduct(
    businessId: string,
    userId: string,
    data: {
      sku: string;
      name: string;
      categoryId?: string;
      supplierId?: string;
      unit?: string;
      costPrice: number;
      sellPrice: number;
      reorderLevel?: number;
    }
  ) {
    return await withBusinessContext(businessId, async (tx) => {
      // Create product
      const product = await tx.product.create({
        data: {
          businessId,
          sku: data.sku,
          name: data.name,
          categoryId: data.categoryId,
          supplierId: data.supplierId,
          unit: data.unit ?? "pcs",
          costPrice: data.costPrice,
          sellPrice: data.sellPrice,
          reorderLevel: data.reorderLevel ?? 0,
        },
      });

      // Audit log
      await AuditService.log(tx, {
        businessId,
        userId,
        action: "CREATE",
        entity: "PRODUCT",
        entityId: product.id,
        details: { sku: product.sku, name: product.name },
      });

      return product;
    });
  }

  static async updateProduct(
    businessId: string,
    userId: string,
    productId: string,
    data: Partial<{
      name: string;
      categoryId: string;
      supplierId: string;
      unit: string;
      costPrice: number;
      sellPrice: number;
      reorderLevel: number;
    }>
  ) {
    return await withBusinessContext(businessId, async (tx) => {
      const product = await tx.product.update({
        where: { id: productId },
        data,
      });

      // Audit log
      await AuditService.log(tx, {
        businessId,
        userId,
        action: "UPDATE",
        entity: "PRODUCT",
        entityId: product.id,
        details: { changes: data },
      });

      return product;
    });
  }

  static async deleteProduct(businessId: string, userId: string, productId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      // Soft delete
      const product = await tx.product.update({
        where: { id: productId },
        data: { deletedAt: new Date() },
      });

      await AuditService.log(tx, {
        businessId,
        userId,
        action: "DELETE",
        entity: "PRODUCT",
        entityId: product.id,
        details: { softDelete: true },
      });

      return product;
    });
  }

  static async getProduct(businessId: string, productId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      return await tx.product.findUnique({
        where: { id: productId, deletedAt: null },
        include: { category: true, supplier: true },
      });
    });
  }

  static async listProducts(businessId: string) {
    return await withBusinessContext(businessId, async (tx) => {
      return await tx.product.findMany({
        where: { deletedAt: null },
        include: { category: true, supplier: true },
        orderBy: { createdAt: "desc" },
      });
    });
  }
}
