// src/server/inngest/functions.ts
//
// All background jobs for TrendPlanner Pro.
// Register all exports in your Inngest serve handler.

import { inngest } from './client';
import { prisma } from '../trpc';

// ─── 1. Stats Rollup ─────────────────────────────────────────────────────────
// Triggered: manually from dashboard or on a cron schedule.
// Rolls up DB counts into DashboardStats for the KPI cards.

export const statsRollup = inngest.createFunction(
  { id: 'dashboard-stats-rollup', name: 'Dashboard Stats Rollup' },
  [
    { event: 'dashboard/stats.refresh' },
    { cron: '0 */6 * * *' }, // every 6 hours
  ],
  async ({ event, step }) => {
    const workspaceId =
      event.name === 'dashboard/stats.refresh'
        ? (event.data as any).workspaceId
        : undefined; // cron: process all workspaces

    const workspaces = workspaceId
      ? [{ id: workspaceId }]
      : await step.run('fetch-workspaces', () =>
          prisma.workspace.findMany({ select: { id: true } })
        );

    for (const ws of workspaces) {
      await step.run(`rollup-${ws.id}`, async () => {
        const now = new Date();
        const periodStart = new Date(now);
        periodStart.setDate(periodStart.getDate() - 7);

        // Count trending topics from last report
        const latestReport = await prisma.trendReport.findFirst({
          where: { workspaceId: ws.id },
          orderBy: { createdAt: 'desc' },
          include: { _count: { select: { topics: true } } },
        });

        // Count content generated this period
        const contentCount = await prisma.contentItem.count({
          where: {
            workspaceId: ws.id,
            createdAt: { gte: periodStart },
          },
        });

        const prevContentCount = await prisma.contentItem.count({
          where: {
            workspaceId: ws.id,
            createdAt: {
              gte: new Date(periodStart.getTime() - 7 * 24 * 60 * 60 * 1000),
              lt: periodStart,
            },
          },
        });

        // Aggregate reach and engagement from analytics days
        const analyticsAgg = await prisma.analyticsDay.aggregate({
          where: {
            workspaceId: ws.id,
            date: { gte: periodStart },
          },
          _sum: { reach: true },
          _avg: { engagement: true },
        });

        const prevAnalyticsAgg = await prisma.analyticsDay.aggregate({
          where: {
            workspaceId: ws.id,
            date: {
              gte: new Date(periodStart.getTime() - 7 * 24 * 60 * 60 * 1000),
              lt: periodStart,
            },
          },
          _sum: { reach: true },
          _avg: { engagement: true },
        });

        const totalReach = analyticsAgg._sum.reach ?? 0;
        const prevReach = prevAnalyticsAgg._sum.reach ?? 1;
        const engagementRate = analyticsAgg._avg.engagement ?? 0;
        const prevEngagement = prevAnalyticsAgg._avg.engagement ?? 1;

        const pct = (curr: number, prev: number) =>
          prev === 0 ? 0 : Math.round(((curr - prev) / prev) * 1000) / 10;

        await prisma.dashboardStats.upsert({
          where: {
            workspaceId_periodStart: {
              workspaceId: ws.id,
              periodStart,
            },
          },
          create: {
            workspaceId: ws.id,
            periodStart,
            periodEnd: now,
            trendingTopicsCount: latestReport?._count.topics ?? 0,
            contentGeneratedCount: contentCount,
            totalReach,
            engagementRate,
            trendingTopicsChange: 0,
            contentGeneratedChange: pct(contentCount, prevContentCount),
            totalReachChange: pct(totalReach, prevReach),
            engagementRateChange: pct(engagementRate, prevEngagement),
          },
          update: {
            periodEnd: now,
            trendingTopicsCount: latestReport?._count.topics ?? 0,
            contentGeneratedCount: contentCount,
            totalReach,
            engagementRate,
            contentGeneratedChange: pct(contentCount, prevContentCount),
            totalReachChange: pct(totalReach, prevReach),
            engagementRateChange: pct(engagementRate, prevEngagement),
          },
        });
      });
    }

    return { processed: workspaces.length };
  }
);

// ─── 2. AI Content Generation ────────────────────────────────────────────────
// Triggered: when a user clicks "Generate Content".
// Calls OpenAI, saves result, updates job status.

export const generateContent = inngest.createFunction(
  {
    id: 'ai-content-generation',
    name: 'AI Content Generation',
    retries: 2,
    throttle: { limit: 10, period: '1m' },
  },
  { event: 'ai/content.generate' },
  async ({ event, step }) => {
    const { jobId, userId, workspaceId, platform, topic, tone, includeAB } =
      event.data as {
        jobId: string;
        userId: string;
        workspaceId: string;
        platform: string;
        topic: string;
        tone: string;
        includeAB: boolean;
      };

    // Mark job as running
    await step.run('mark-running', () =>
      prisma.aiJob.update({
        where: { id: jobId },
        data: { status: 'RUNNING' },
      })
    );

    // Call OpenAI
    const result = await step.run('call-openai', async () => {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('OPENAI_API_KEY not set');

      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? 'gpt-4o',
          instructions:
            'You are an expert social media copywriter. Return ONLY valid JSON, no markdown.',
          input: `Generate social media content for:
- Platform: ${platform}
- Topic: ${topic}
- Tone: ${tone}
- Include A/B variation: ${includeAB ? 'yes' : 'no'}

Return JSON: {
  "fields": ["Hook", "Caption", "Hashtags", "CTA"],
  "generated": { "Hook": "...", "Caption": "...", "Hashtags": "...", "CTA": "..." },
  "abVariation": ${includeAB ? '"alternative caption text here"' : 'null'}
}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message ?? 'OpenAI error');
      return data.output_text;
    });

    // Parse result
    const parsed = await step.run('parse-result', () => {
      const text: string = result;
      const start = text.search(/[\[{]/);
      if (start === -1) throw new Error('No JSON in response');
      try {
        return JSON.parse(text.slice(start));
      } catch {
        throw new Error('Failed to parse AI response');
      }
    });

    // Save to DB and update job
    await step.run('save-result', async () => {
      await prisma.aiJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          result: parsed,
          completedAt: new Date(),
        },
      });

      // Also bump the contentGenerated stat
      await prisma.dashboardStats.updateMany({
        where: {
          workspaceId,
          periodEnd: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        data: {
          contentGeneratedCount: { increment: 1 },
        },
      });
    });

    return { jobId, status: 'completed' };
  }
);

// ─── 3. Trend Research ───────────────────────────────────────────────────────
// Triggered: when a user runs trend research.

export const runTrendResearch = inngest.createFunction(
  {
    id: 'ai-trend-research',
    name: 'AI Trend Research',
    retries: 2,
  },
  { event: 'ai/trends.research' },
  async ({ event, step }) => {
    const { jobId, userId, workspaceId, niche, audience, market, tone } =
      event.data as {
        jobId: string;
        userId: string;
        workspaceId: string;
        niche: string;
        audience: string;
        market: string;
        tone: string;
      };

    await step.run('mark-running', () =>
      prisma.aiJob.update({ where: { id: jobId }, data: { status: 'RUNNING' } })
    );

    const rawTopics = await step.run('call-openai', async () => {
      const apiKey = process.env.OPENAI_API_KEY!;
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? 'gpt-4o',
          instructions: 'You are a trend research strategist. Return ONLY valid JSON.',
          input: `Generate 12 trending topics for niche: ${niche}, audience: ${audience}, market: ${market}, tone: ${tone}.
Return: { "trendingTopics": [{ "topic": string, "score": number, "longevity": "short-term"|"mid-term"|"evergreen", "platforms": string[], "category": string, "growth": number, "volume": string, "keywords": string[] }] }`,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message ?? 'OpenAI error');
      return data.output_text;
    });

    await step.run('save-topics', async () => {
      const text: string = rawTopics;
      const start = text.search(/[\[{]/);
      const parsed = JSON.parse(text.slice(start));
      const topics: any[] = parsed.trendingTopics ?? [];

      const report = await prisma.trendReport.create({
        data: {
          workspaceId,
          niche,
          audience,
          market,
          tone,
          topics: {
            create: topics.map((t) => ({
              topic: t.topic,
              score: t.score,
              longevity: t.longevity,
              platforms: t.platforms,
              category: t.category,
              growth: t.growth,
              volume: t.volume,
              keywords: t.keywords,
            })),
          },
        },
      });

      await prisma.aiJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          result: { reportId: report.id, topicCount: topics.length },
          completedAt: new Date(),
        },
      });

      // Update the trending topics count in stats
      await prisma.dashboardStats.updateMany({
        where: {
          workspaceId,
          periodEnd: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        data: { trendingTopicsCount: topics.length },
      });
    });

    return { jobId, status: 'completed' };
  }
);

// ─── 4. Scheduled Post Publisher ─────────────────────────────────────────────
// Triggered: at the exact scheduled time of a post.

export const publishScheduledPost = inngest.createFunction(
  {
    id: 'scheduling-publish-post',
    name: 'Publish Scheduled Post',
    retries: 3,
  },
  { event: 'scheduling/post.publish' },
  async ({ event, step }) => {
    const { scheduledPostId, contentItemId, userId } = event.data as {
      scheduledPostId: string;
      contentItemId: string;
      userId: string;
    };

    await step.run('mark-processing', () =>
      prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: { status: 'PROCESSING' },
      })
    );

    // TODO: Integrate with real social APIs (Buffer, Later, etc.)
    // For now we simulate publishing
    await step.sleep('simulate-publish-delay', '2s');

    await step.run('mark-published', async () => {
      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: { status: 'PUBLISHED', publishedAt: new Date() },
      });
      await prisma.contentItem.update({
        where: { id: contentItemId },
        data: { status: 'PUBLISHED' },
      });
    });

    return { scheduledPostId, status: 'published' };
  }
);

// ─── 5. Analytics Ingestion ──────────────────────────────────────────────────
// Cron: runs nightly to seed analytics rows (replace with real platform API calls)

export const analyticsRefresh = inngest.createFunction(
  {
    id: 'analytics-nightly-refresh',
    name: 'Analytics Nightly Refresh',
  },
  { cron: '0 2 * * *' }, // 2am daily
  async ({ step }) => {
    const workspaces = await step.run('fetch-workspaces', () =>
      prisma.workspace.findMany({ select: { id: true } })
    );

    for (const ws of workspaces) {
      await step.run(`analytics-${ws.id}`, async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        // In production: call Buffer / Meta / TikTok APIs here.
        // For now, upsert placeholder row so charts don't show empty.
        await prisma.analyticsDay.upsert({
          where: {
            workspaceId_date: { workspaceId: ws.id, date: yesterday },
          },
          create: {
            workspaceId: ws.id,
            date: yesterday,
            engagement: 0,
            reach: 0,
            followers: 0,
            clicks: 0,
          },
          update: {}, // Don't overwrite real data if it exists
        });
      });
    }

    return { processed: workspaces.length };
  }
);

// Export all functions as an array for the Inngest serve handler
export const inngestFunctions = [
  statsRollup,
  generateContent,
  runTrendResearch,
  publishScheduledPost,
  analyticsRefresh,
];
