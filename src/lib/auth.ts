import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

function getBaseURL() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return "http://localhost:3000";
}

export const auth = betterAuth({
  baseURL: getBaseURL(),
  trustedOrigins: ["https://ai-bos-eta.vercel.app", "http://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "EMPLOYEE",
      },
      businessId: {
        type: "string",
        required: false,
      },
    },
  },
});

// Demo mode override — cast to any to bypass strict BetterAuth endpoint types
(auth.api as any).getSession = async (_options?: any) => {
  return {
    user: {
      id: "demo-user-123",
      email: "demo@example.com",
      name: "Demo User",
      role: "OWNER",
      businessId: "demo-business-123",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    session: {
      id: "demo-session-123",
      userId: "demo-user-123",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      ipAddress: "127.0.0.1",
      userAgent: "Demo Browser",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };
};
