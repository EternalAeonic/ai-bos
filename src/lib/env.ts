import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("Must be a valid Postgres connection string"),
  BETTER_AUTH_SECRET: z.string().min(32, "Auth secret must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url("Must be a valid absolute URL for Better Auth"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
});
