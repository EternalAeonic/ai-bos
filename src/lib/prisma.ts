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
    // Set the local transaction variable for RLS using set_config to prevent SQL injection
    await tx.$executeRaw`SELECT set_config('app.current_business', ${businessId}, true)`;
    
    // Execute the callback with this isolated transaction
    return await callback(tx);
  });
}
