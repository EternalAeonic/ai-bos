"use server";
import { getSession } from "@/lib/get-session";
import { LocationService, LocationData } from "@/modules/business/services/location-service";
import { revalidatePath } from "next/cache";

export async function getLocationsAction() {
  try {
    const { businessId } = await getSession();
    const data = await LocationService.list(businessId);
    return { success: true as const, data };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function createLocationAction(data: LocationData) {
  try {
    const { businessId, userId } = await getSession();
    const result = await LocationService.create(businessId, userId, data);
    revalidatePath("/dashboard/locations");
    revalidatePath("/dashboard");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function updateLocationAction(id: string, data: Partial<LocationData>) {
  try {
    const { businessId, userId } = await getSession();
    const result = await LocationService.update(businessId, userId, id, data);
    revalidatePath("/dashboard/locations");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function deleteLocationAction(id: string) {
  try {
    const { businessId, userId } = await getSession();
    await LocationService.delete(businessId, userId, id);
    revalidatePath("/dashboard/locations");
    revalidatePath("/dashboard");
    return { success: true as const };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}
