"use server";
import { getSession } from "@/lib/get-session";
import { BusinessSupplierService, SupplierData } from "@/modules/business/services/supplier-service";
import { revalidatePath } from "next/cache";

export async function getSuppliersAction() {
  try {
    const { businessId } = await getSession();
    const data = await BusinessSupplierService.list(businessId);
    return { success: true as const, data };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function createSupplierAction(data: SupplierData) {
  try {
    const { businessId, userId } = await getSession();
    const result = await BusinessSupplierService.create(businessId, userId, data);
    revalidatePath("/dashboard/suppliers");
    revalidatePath("/dashboard");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function updateSupplierAction(id: string, data: Partial<SupplierData>) {
  try {
    const { businessId, userId } = await getSession();
    const result = await BusinessSupplierService.update(businessId, userId, id, data);
    revalidatePath("/dashboard/suppliers");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function deleteSupplierAction(id: string) {
  try {
    const { businessId, userId } = await getSession();
    await BusinessSupplierService.delete(businessId, userId, id);
    revalidatePath("/dashboard/suppliers");
    revalidatePath("/dashboard");
    return { success: true as const };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}
