/**
 * Auth Session Abstraction Layer
 *
 * This is the ONLY file that needs to change when switching from
 * Demo Mode to real Better Auth in production.
 *
 * All Server Actions and Services import from this file — never
 * hardcode businessId or userId anywhere in the business modules.
 *
 * To switch to real auth:
 *   1. Replace the body of `getSession()` with Better Auth logic
 *   2. No other file changes needed
 */

export interface AppSession {
  userId: string;
  businessId: string;
  userName: string;
  userRole: string;
  email: string;
}

/**
 * DEMO MODE: Returns a fixed session context.
 *
 * In production, replace this function body with:
 *   const session = await auth.api.getSession({ headers: await headers() })
 *   if (!session?.user) throw new Error("Unauthorized")
 *   return {
 *     userId: session.user.id,
 *     businessId: (session.user as any).businessId,
 *     userName: session.user.name,
 *     userRole: (session.user as any).role ?? "EMPLOYEE",
 *     email: session.user.email,
 *   }
 */
export async function getSession(): Promise<AppSession> {
  return {
    userId: "demo-user-123",
    businessId: "demo-business-123",
    userName: "Demo User",
    userRole: "OWNER",
    email: "demo@ai-bos.io",
  };
}
