// src/server/routers/dashboard.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const dashboardRouter = router({
  /**
   * GET /trpc/dashboard.stats
   * Returns the 4 KPI cards from DB instead of hardcoded values.
   */
  stats: protectedProcedure
    .input(
      z.object({
        periodDays: z.number().min(1).max(90).default(7),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { prisma, workspaceId } = ctx;
      const days = input?.periodDays ?? 7;

      // Get most recent stats record for this workspace
      const latest = await prisma.dashboardStats.findFirst({
        where: { workspaceId },
        orderBy: { periodEnd: 'desc' },
      });

      if (!latest) {
        // Return zeros — Inngest will populate this on first run
        return {
          trendingTopicsCount: 0,
          contentGeneratedCount: 0,
          totalReach: 0,
          engagementRate: 0,
          trendingTopicsChange: 0,
          contentGeneratedChange: 0,
          totalReachChange: 0,
          engagementRateChange: 0,
          isStale: true,
        };
      }

      return {
        trendingTopicsCount: latest.trendingTopicsCount,
        contentGeneratedCount: latest.contentGeneratedCount,
        totalReach: Number(latest.totalReach),
        engagementRate: latest.engagementRate,
        trendingTopicsChange: latest.trendingTopicsChange,
        contentGeneratedChange: latest.contentGeneratedChange,
        totalReachChange: latest.totalReachChange,
        engagementRateChange: latest.engagementRateChange,
        isStale: false,
        lastUpdated: latest.createdAt,
      };
    }),

  /**
   * GET /trpc/dashboard.engagementTimeseries
   * Powers the Engagement Overview area chart (7D / 30D / 90D).
   */
  engagementTimeseries: protectedProcedure
    .input(
      z.object({
        days: z.union([z.literal(7), z.literal(30), z.literal(90)]).default(7),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, workspaceId } = ctx;

      const since = new Date();
      since.setDate(since.getDate() - input.days);

      const rows = await prisma.analyticsDay.findMany({
        where: {
          workspaceId,
          date: { gte: since },
        },
        orderBy: { date: 'asc' },
      });

      return rows.map((r) => ({
        day: r.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        engagement: r.engagement,
        reach: r.reach,
        followers: r.followers,
        clicks: r.clicks,
      }));
    }),

  /**
   * GET /trpc/dashboard.platformBreakdown
   */
  platformBreakdown: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, workspaceId } = ctx;

    const stats = await prisma.platformStat.findMany({
      where: { workspaceId },
      orderBy: { recordedAt: 'desc' },
      take: 10,
    });

    // Deduplicate by platform, take most recent per platform
    const seen = new Set<string>();
    return stats
      .filter((s) => {
        if (seen.has(s.platform)) return false;
        seen.add(s.platform);
        return true;
      })
      .map((s) => ({ name: s.platform, value: s.percentage, color: s.color }));
  }),

  /**
   * GET /trpc/dashboard.contentPillars
   * Aggregates content items by pillar for the pie/bar.
   */
  contentPillars: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, workspaceId } = ctx;

    const groups = await prisma.contentItem.groupBy({
      by: ['contentPillar'],
      where: { workspaceId },
      _count: { id: true },
    });

    const total = groups.reduce((sum, g) => sum + g._count.id, 0) || 1;

    const colorMap: Record<string, string> = {
      viral: '#8B5CF6',
      authority: '#3B82F6',
      community: '#10B981',
      conversion: '#F59E0B',
    };

    return groups.map((g) => ({
      name: g.contentPillar,
      value: Math.round((g._count.id / total) * 100),
      color: colorMap[g.contentPillar] ?? '#6B7280',
    }));
  }),

  /**
   * GET /trpc/dashboard.weeklyGrowth
   */
  weeklyGrowth: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, workspaceId } = ctx;

    const rows = await prisma.weeklyAnalytic.findMany({
      where: { workspaceId },
      orderBy: { weekStart: 'asc' },
      take: 8,
    });

    return rows.map((r) => ({
      week: r.weekLabel,
      engagement: r.engagement,
      followers: r.followers,
    }));
  }),

  /**
   * GET /trpc/dashboard.engagementHeatmap
   */
  engagementHeatmap: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, workspaceId } = ctx;

    const rows = await prisma.engagementHeatmap.findMany({
      where: { workspaceId },
      orderBy: { timeSlot: 'asc' },
    });

    return rows.map((r) => ({
      time: r.timeSlot,
      mon: r.mon,
      tue: r.tue,
      wed: r.wed,
      thu: r.thu,
      fri: r.fri,
      sat: r.sat,
      sun: r.sun,
    }));
  }),

  /**
   * GET /trpc/dashboard.trendingTopics
   * Returns topics from the most recent trend report.
   */
  trendingTopics: protectedProcedure
    .input(z.object({ limit: z.number().default(12) }).optional())
    .query(async ({ ctx, input }) => {
      const { prisma, workspaceId } = ctx;

      const latestReport = await prisma.trendReport.findFirst({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
        include: {
          topics: {
            orderBy: { score: 'desc' },
            take: input?.limit ?? 12,
          },
        },
      });

      if (!latestReport) return [];

      return latestReport.topics.map((t, i) => ({
        id: i + 1,
        topic: t.topic,
        score: t.score,
        longevity: t.longevity as 'short-term' | 'mid-term' | 'evergreen',
        platforms: t.platforms,
        category: t.category,
        growth: t.growth,
        volume: t.volume,
        keywords: t.keywords,
      }));
    }),

  /**
   * GET /trpc/dashboard.competitors
   */
  competitors: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, workspaceId } = ctx;

    const rows = await prisma.competitorProfile.findMany({
      where: { workspaceId },
      orderBy: [{ isYou: 'desc' }, { followers: 'desc' }],
    });

    return rows.map((r) => ({
      name: r.name,
      followers: r.followers,
      posts: r.postsPerMonth,
      engagement: r.engagementRate,
      growth: r.growthRate,
    }));
  }),

  /**
   * MUTATION: manually trigger a stats refresh (calls Inngest).
   */
  triggerStatsRefresh: protectedProcedure.mutation(async ({ ctx }) => {
    // Import at call time to avoid circular deps
    const { inngest } = await import('../inngest/client');
    await inngest.send({
      name: 'dashboard/stats.refresh',
      data: { workspaceId: ctx.workspaceId, userId: ctx.userId },
    });
    return { queued: true };
  }),
});
