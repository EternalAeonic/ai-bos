"use server";
import { getSession } from "@/lib/get-session";
import { FinanceConfigService, FinanceSettingsData, BankAccountData } from "@/modules/business/services/finance-config-service";
import { revalidatePath } from "next/cache";

export async function getFinanceSettingsAction() {
  try {
    const { businessId } = await getSession();
    const data = await FinanceConfigService.getSettings(businessId);
    return { success: true as const, data };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function updateFinanceSettingsAction(data: FinanceSettingsData) {
  try {
    const { businessId, userId } = await getSession();
    const result = await FinanceConfigService.upsertSettings(businessId, userId, data);
    revalidatePath("/dashboard/settings/finance");
    revalidatePath("/dashboard");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function getBankAccountsAction() {
  try {
    const { businessId } = await getSession();
    const data = await FinanceConfigService.listBankAccounts(businessId);
    return { success: true as const, data };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function createBankAccountAction(data: BankAccountData) {
  try {
    const { businessId, userId } = await getSession();
    const result = await FinanceConfigService.createBankAccount(businessId, userId, data);
    revalidatePath("/dashboard/settings/finance");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function updateBankAccountAction(id: string, data: Partial<BankAccountData>) {
  try {
    const { businessId, userId } = await getSession();
    const result = await FinanceConfigService.updateBankAccount(businessId, userId, id, data);
    revalidatePath("/dashboard/settings/finance");
    return { success: true as const, data: result };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}

export async function deleteBankAccountAction(id: string) {
  try {
    const { businessId, userId } = await getSession();
    await FinanceConfigService.deleteBankAccount(businessId, userId, id);
    revalidatePath("/dashboard/settings/finance");
    return { success: true as const };
  } catch (e: any) { return { success: false as const, error: e.message }; }
}
