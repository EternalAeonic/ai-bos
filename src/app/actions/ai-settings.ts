"use server";
import { getSession } from "@/lib/get-session";
import { AISettingsService, AISettingsData } from "@/modules/business/services/ai-settings-service";
import { revalidatePath } from "next/cache";

export async function getAISettingsAction() {
  try {
    const { businessId } = await getSession();
    const data = await AISettingsService.get(businessId);
    return { success: true as const, data };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function updateAISettingsAction(data: AISettingsData) {
  try {
    const { businessId, userId } = await getSession();
    const result = await AISettingsService.upsert(businessId, userId, data);
    revalidatePath("/dashboard/settings/ai");
    revalidatePath("/dashboard");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}
