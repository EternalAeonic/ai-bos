"use server";
import { getSession } from "@/lib/get-session";
import { TaxService, TaxConfigData } from "@/modules/business/services/tax-service";
import { revalidatePath } from "next/cache";

export async function getTaxesAction() {
  try {
    const { businessId } = await getSession();
    const data = await TaxService.list(businessId);
    return { success: true as const, data };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function createTaxAction(data: TaxConfigData) {
  try {
    const { businessId, userId } = await getSession();
    const result = await TaxService.create(businessId, userId, data);
    revalidatePath("/dashboard/settings/tax");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function updateTaxAction(id: string, data: Partial<TaxConfigData>) {
  try {
    const { businessId, userId } = await getSession();
    const result = await TaxService.update(businessId, userId, id, data);
    revalidatePath("/dashboard/settings/tax");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function deleteTaxAction(id: string) {
  try {
    const { businessId, userId } = await getSession();
    await TaxService.delete(businessId, userId, id);
    revalidatePath("/dashboard/settings/tax");
    return { success: true as const };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}
