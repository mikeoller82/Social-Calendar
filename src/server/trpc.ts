// src/server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import superjson from 'superjson';
import { z } from 'zod';

// ─── Prisma singleton ────────────────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ─── Context ─────────────────────────────────────────────────────────────────
// In production you'd pull the real user from a session/JWT.
// For now we accept a userId header so you can wire auth later.

export async function createContext(opts?: CreateNextContextOptions) {
  const userId =
    opts?.req?.headers['x-user-id'] as string | undefined ??
    process.env.DEFAULT_USER_ID ??
    'demo-user';

  const workspaceId =
    opts?.req?.headers['x-workspace-id'] as string | undefined ??
    process.env.DEFAULT_WORKSPACE_ID ??
    'demo-workspace';

  return { prisma, userId, workspaceId };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

// ─── tRPC init ───────────────────────────────────────────────────────────────

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware: ensure user exists
const enforceUser = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx });
});

export const protectedProcedure = t.procedure.use(enforceUser);
