// src/server/routers/content.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const contentRouter = router({
  /** List all content items for the workspace */
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'GENERATING']).optional(),
        platform: z.string().optional(),
        limit: z.number().min(1).max(100).default(30),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, workspaceId } = ctx;

      const items = await prisma.contentItem.findMany({
        where: {
          workspaceId,
          ...(input.status && { status: input.status }),
          ...(input.platform && { platform: input.platform }),
        },
        orderBy: { scheduledDay: 'asc' },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        nextCursor = items.pop()!.id;
      }

      return {
        items: items.map((item) => ({
          id: item.id,
          day: item.scheduledDay ?? 0,
          date: item.scheduledDate?.toISOString().split('T')[0] ?? '',
          platform: item.platform,
          postType: item.postType,
          theme: item.theme,
          hook: item.hook,
          caption: item.caption,
          hashtags: item.hashtags,
          cta: item.cta,
          bestTime: item.bestTime,
          contentPillar: item.contentPillar as any,
          engagementPrediction: item.engagementPrediction,
          status: item.status.toLowerCase() as any,
          script: item.script ?? undefined,
          slides: item.slides.length ? item.slides : undefined,
          threadParts: item.threadParts.length ? item.threadParts : undefined,
        })),
        nextCursor,
      };
    }),

  /** Generate content via Inngest (async, credits-gated) */
  generate: protectedProcedure
    .input(
      z.object({
        platform: z.string(),
        topic: z.string().min(1),
        tone: z.string(),
        includeAB: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, userId, workspaceId } = ctx;

      // Check credits
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.credits < 5) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Insufficient credits' });
      }

      // Deduct credits immediately
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 5 } },
      });

      // Record the job
      const job = await prisma.aiJob.create({
        data: {
          userId,
          jobType: 'CONTENT_GENERATION',
          status: 'PENDING',
          creditsUsed: 5,
          payload: input,
        },
      });

      // Fire Inngest event
      const { inngest } = await import('../inngest/client');
      const event = await inngest.send({
        name: 'ai/content.generate',
        data: { jobId: job.id, userId, workspaceId, ...input },
      });

      await prisma.aiJob.update({
        where: { id: job.id },
        data: { inngestRunId: event.ids[0] },
      });

      return { jobId: job.id, status: 'queued' };
    }),

  /** Poll job result */
  jobResult: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ ctx, input }) => {
      const job = await ctx.prisma.aiJob.findUnique({
        where: { id: input.jobId, userId: ctx.userId },
      });
      if (!job) throw new TRPCError({ code: 'NOT_FOUND' });
      return {
        status: job.status,
        result: job.result as { fields: string[]; generated: Record<string, string>; abVariation: string | null } | null,
        error: job.error,
      };
    }),

  /** Update a content item's status */
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contentItem.update({
        where: { id: input.id, workspaceId: ctx.workspaceId },
        data: { status: input.status },
      });
    }),
});

// ─── Scheduling Router ────────────────────────────────────────────────────────

// src/server/routers/scheduling.ts  (exported from same file for brevity)
export const schedulingRouter = router({
  /** Schedule a content item to publish at a specific time */
  schedule: protectedProcedure
    .input(
      z.object({
        contentItemId: z.string(),
        scheduledAt: z.string().datetime(),
        timezone: z.string().default('America/New_York'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, userId } = ctx;

      // Upsert the scheduled post
      const scheduled = await prisma.scheduledPost.upsert({
        where: { contentItemId: input.contentItemId },
        create: {
          contentItemId: input.contentItemId,
          userId,
          scheduledAt: new Date(input.scheduledAt),
          timezone: input.timezone,
          status: 'PENDING',
        },
        update: {
          scheduledAt: new Date(input.scheduledAt),
          timezone: input.timezone,
          status: 'PENDING',
        },
      });

      // Update the content item status
      await prisma.contentItem.update({
        where: { id: input.contentItemId },
        data: { status: 'SCHEDULED' },
      });

      // Send to Inngest for delayed execution
      const { inngest } = await import('../inngest/client');
      const delayMs = new Date(input.scheduledAt).getTime() - Date.now();
      const event = await inngest.send({
        name: 'scheduling/post.publish',
        data: {
          scheduledPostId: scheduled.id,
          contentItemId: input.contentItemId,
          userId,
        },
        // Inngest supports future scheduling natively
        ts: new Date(input.scheduledAt).getTime(),
      });

      await prisma.scheduledPost.update({
        where: { id: scheduled.id },
        data: { inngestEventId: event.ids[0] },
      });

      return { id: scheduled.id, status: 'scheduled' };
    }),

  /** Cancel a scheduled post */
  cancel: protectedProcedure
    .input(z.object({ contentItemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      await prisma.scheduledPost.delete({
        where: { contentItemId: input.contentItemId },
      });
      await prisma.contentItem.update({
        where: { id: input.contentItemId },
        data: { status: 'DRAFT' },
      });
      return { cancelled: true };
    }),

  /** List upcoming scheduled posts */
  upcoming: protectedProcedure
    .input(z.object({ limit: z.number().default(14) }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.scheduledPost.findMany({
        where: {
          userId: ctx.userId,
          status: 'PENDING',
          scheduledAt: { gte: new Date() },
        },
        include: { contentItem: true },
        orderBy: { scheduledAt: 'asc' },
        take: input.limit,
      });

      return posts.map((p) => ({
        id: p.id,
        scheduledAt: p.scheduledAt.toISOString(),
        timezone: p.timezone,
        contentItem: {
          id: p.contentItem.id,
          platform: p.contentItem.platform,
          theme: p.contentItem.theme,
          postType: p.contentItem.postType,
          bestTime: p.contentItem.bestTime,
          day: p.contentItem.scheduledDay ?? 0,
          date: p.contentItem.scheduledDate?.toISOString().split('T')[0] ?? '',
          status: p.contentItem.status.toLowerCase(),
          contentPillar: p.contentItem.contentPillar,
        },
      }));
    }),
});
