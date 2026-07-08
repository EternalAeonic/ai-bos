"use server";

import { revalidatePath } from "next/cache";
import { ProductService } from "@/modules/inventory/services/product-service";
import { CategoryService } from "@/modules/inventory/services/category-service";
import { WarehouseService } from "@/modules/inventory/services/warehouse-service";
import { SupplierService } from "@/modules/inventory/services/supplier-service";
import { InventoryMovementService } from "@/modules/inventory/services/movement-service";
import { StockCalculationService } from "@/modules/inventory/services/stock-service";

// ==========================================
// PRODUCTS
// ==========================================

export async function createProductAction(businessId: string, userId: string, data: any) {
  const result = await ProductService.createProduct(businessId, userId, data);
  revalidatePath("/dashboard/inventory/products");
  revalidatePath("/dashboard/inventory");
  // Serialize Decimal and Date objects by converting to JSON and back
  return JSON.parse(JSON.stringify(result));
}

export async function updateProductAction(businessId: string, userId: string, productId: string, data: any) {
  const result = await ProductService.updateProduct(businessId, userId, productId, data);
  revalidatePath("/dashboard/inventory/products");
  revalidatePath(`/dashboard/inventory/products/${productId}`);
  revalidatePath("/dashboard/inventory");
  return JSON.parse(JSON.stringify(result));
}

export async function deleteProductAction(businessId: string, userId: string, productId: string) {
  const result = await ProductService.deleteProduct(businessId, userId, productId);
  revalidatePath("/dashboard/inventory/products");
  revalidatePath("/dashboard/inventory");
  return JSON.parse(JSON.stringify(result));
}

export async function getProductStockAction(businessId: string, productId: string) {
  const result = await StockCalculationService.getProductTotalStock(businessId, productId);
  return JSON.parse(JSON.stringify(result));
}

// ==========================================
// CATEGORIES
// ==========================================

export async function createCategoryAction(businessId: string, userId: string, data: { name: string; parentCategoryId?: string }) {
  const result = await CategoryService.create(businessId, userId, data);
  revalidatePath("/dashboard/inventory/categories");
  revalidatePath("/dashboard/inventory/products/new");
  return JSON.parse(JSON.stringify(result));
}

export async function updateCategoryAction(businessId: string, userId: string, categoryId: string, data: { name?: string; parentCategoryId?: string }) {
  // Not implemented in CategoryService yet, throwing error
  throw new Error("Update category not implemented");
}

// ==========================================
// WAREHOUSES
// ==========================================

export async function createWarehouseAction(businessId: string, userId: string, data: any) {
  const result = await WarehouseService.create(businessId, userId, data);
  revalidatePath("/dashboard/inventory/warehouses");
  revalidatePath("/dashboard/inventory/products/new");
  return JSON.parse(JSON.stringify(result));
}

export async function updateWarehouseAction(businessId: string, userId: string, warehouseId: string, data: any) {
  // Not implemented in WarehouseService yet, throwing error
  throw new Error("Update warehouse not implemented");
}

// ==========================================
// SUPPLIERS
// ==========================================

export async function createSupplierAction(businessId: string, userId: string, data: any) {
  const result = await SupplierService.create(businessId, userId, data);
  revalidatePath("/dashboard/inventory/suppliers");
  revalidatePath("/dashboard/inventory/products/new");
  return JSON.parse(JSON.stringify(result));
}

// ==========================================
// MOVEMENTS & ADJUSTMENTS
// ==========================================

export async function recordMovementAction(businessId: string, userId: string, data: any) {
  const result = await InventoryMovementService.recordMovement(businessId, userId, data);
  revalidatePath("/dashboard/inventory/movements");
  revalidatePath("/dashboard/inventory/products");
  revalidatePath("/dashboard/inventory");
  if (data.productId) {
    revalidatePath(`/dashboard/inventory/products/${data.productId}`);
  }
  return JSON.parse(JSON.stringify(result));
}

export async function transferStockAction(businessId: string, userId: string, data: {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  notes?: string;
}) {
  await InventoryMovementService.transferStock(businessId, userId, data);
  revalidatePath("/dashboard/inventory/movements");
  revalidatePath("/dashboard/inventory/products");
  revalidatePath("/dashboard/inventory");
  if (data.productId) {
    revalidatePath(`/dashboard/inventory/products/${data.productId}`);
  }
}
