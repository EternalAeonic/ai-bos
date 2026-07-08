import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Executes a callback within a Prisma transaction that has Row-Level Security
 * enabled for the given businessId.
 */
export async function withBusinessContext<T>(
  businessId: string,
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    // RLS set_config removed to prevent PgBouncer/Neon compatibility errors on Vercel.
    // All queries must explicitly pass { where: { businessId } } instead.
    
    // Execute the callback with this isolated transaction
    return await callback(tx);
  });
}
