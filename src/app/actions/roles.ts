"use server";
import { getSession } from "@/lib/get-session";
import { RoleService, RoleData } from "@/modules/business/services/role-service";
import { revalidatePath } from "next/cache";

export async function getRolesAction() {
  try {
    const { businessId } = await getSession();
    const data = await RoleService.list(businessId);
    return { success: true as const, data };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function createRoleAction(data: RoleData) {
  try {
    const { businessId, userId } = await getSession();
    const result = await RoleService.create(businessId, userId, data);
    revalidatePath("/dashboard/roles");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function updateRoleAction(id: string, data: Partial<RoleData>) {
  try {
    const { businessId, userId } = await getSession();
    const result = await RoleService.update(businessId, userId, id, data);
    revalidatePath("/dashboard/roles");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function deleteRoleAction(id: string) {
  try {
    const { businessId, userId } = await getSession();
    await RoleService.delete(businessId, userId, id);
    revalidatePath("/dashboard/roles");
    return { success: true as const };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}
