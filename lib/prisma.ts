// Ensure Prisma uses the binary engine when running locally to avoid
// the "engine type 'client' requires adapter/accelerateUrl" error.
// Set the env var before requiring the client so it's respected at runtime.
if (!process.env.PRISMA_CLIENT_ENGINE) {
  process.env.PRISMA_CLIENT_ENGINE = 'binary';
}

// Use a runtime require so the env var is set before the module loads.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as any;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
