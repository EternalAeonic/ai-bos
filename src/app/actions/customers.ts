"use server";
import { getSession } from "@/lib/get-session";
import { CustomerService, CustomerData } from "@/modules/business/services/customer-service";
import { revalidatePath } from "next/cache";

export async function getCustomersAction() {
  try {
    const { businessId } = await getSession();
    const data = await CustomerService.list(businessId);
    return { success: true as const, data };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function createCustomerAction(data: CustomerData) {
  try {
    const { businessId, userId } = await getSession();
    const result = await CustomerService.create(businessId, userId, data);
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function updateCustomerAction(id: string, data: Partial<CustomerData>) {
  try {
    const { businessId, userId } = await getSession();
    const result = await CustomerService.update(businessId, userId, id, data);
    revalidatePath("/dashboard/customers");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function deleteCustomerAction(id: string) {
  try {
    const { businessId, userId } = await getSession();
    await CustomerService.delete(businessId, userId, id);
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard");
    return { success: true as const };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}
