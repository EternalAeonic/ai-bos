"use server";
import { getSession } from "@/lib/get-session";
import { EmployeeService, EmployeeData } from "@/modules/business/services/employee-service";
import { revalidatePath } from "next/cache";

export async function getEmployeesAction() {
  try {
    const { businessId } = await getSession();
    const data = await EmployeeService.list(businessId);
    return { success: true as const, data };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function createEmployeeAction(data: EmployeeData) {
  try {
    const { businessId, userId } = await getSession();
    const result = await EmployeeService.create(businessId, userId, data);
    revalidatePath("/dashboard/employees");
    revalidatePath("/dashboard");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function updateEmployeeAction(id: string, data: Partial<EmployeeData>) {
  try {
    const { businessId, userId } = await getSession();
    const result = await EmployeeService.update(businessId, userId, id, data);
    revalidatePath("/dashboard/employees");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function deactivateEmployeeAction(id: string) {
  try {
    const { businessId, userId } = await getSession();
    const result = await EmployeeService.deactivate(businessId, userId, id);
    revalidatePath("/dashboard/employees");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function deleteEmployeeAction(id: string) {
  try {
    const { businessId, userId } = await getSession();
    await EmployeeService.delete(businessId, userId, id);
    revalidatePath("/dashboard/employees");
    revalidatePath("/dashboard");
    return { success: true as const };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}
