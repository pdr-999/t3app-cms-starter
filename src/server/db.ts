import { PrismaClient } from "@prisma/client";
import { env } from "@/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.ENV === "development" ? ["info", "error", "warn"] : ["error"],
  });

if (env.ENV !== "production") globalForPrisma.prisma = prisma;
