import { config } from "dotenv";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

if (process.env.NODE_ENV !== "production") {
  // Shell DATABASE_URL (e.g. Prisma's johndoe placeholder) overrides Next.js
  // .env loading — prefer project files in local development.
  config({ path: resolve(process.cwd(), ".env.local"), override: true });
  config({ path: resolve(process.cwd(), ".env"), override: true });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaConnectionString: string | undefined;
};

function createPrismaClient(connectionString: string) {
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

function getPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  if (
    globalForPrisma.prisma &&
    globalForPrisma.prismaConnectionString !== connectionString
  ) {
    void globalForPrisma.prisma.$disconnect();
    globalForPrisma.prisma = undefined;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient(connectionString);
    globalForPrisma.prismaConnectionString = connectionString;
  }

  return globalForPrisma.prisma;
}

export const db = getPrismaClient();
