"use server";
import { getSession } from "@/lib/get-session";
import { BusinessService } from "@/modules/business/services/business-service";
import { revalidatePath } from "next/cache";

export async function getBusinessAction() {
  try {
    const { businessId } = await getSession();
    const data = await BusinessService.get(businessId);
    return { success: true as const, data };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function updateBusinessAction(data: Parameters<typeof BusinessService.update>[2]) {
  try {
    const { businessId, userId } = await getSession();
    const result = await BusinessService.update(businessId, userId, data);
    await BusinessService.refreshScore(businessId);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function getSetupScoreAction() {
  try {
    const { businessId } = await getSession();
    const score = await BusinessService.getSetupScore(businessId);
    return { success: true as const, data: score };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}
