// prisma/seed.ts
// Run once after `prisma migrate dev` to create the demo user/workspace
// and seed the heatmap with sensible defaults.
//
//   npx tsx prisma/seed.ts
//   -- or --
//   npx ts-node prisma/seed.ts

import { PrismaClient } from '../src/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DEMO_USER_ID      = 'demo-user';
const DEMO_WORKSPACE_ID = 'demo-workspace';

async function main() {
  console.log('🌱 Seeding TrendPlanner database...');

  // ── User ──────────────────────────────────────────────────────────────────
  const user = await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    create: {
      id: DEMO_USER_ID,
      email: 'jane@example.com',
      name: 'Jane Doe',
      plan: 'PRO',
      credits: 500,
    },
    update: {},
  });
  console.log('✅ User:', user.email);

  // ── Workspace ─────────────────────────────────────────────────────────────
  const workspace = await prisma.workspace.upsert({
    where: { id: DEMO_WORKSPACE_ID },
    create: {
      id: DEMO_WORKSPACE_ID,
      name: 'Jane Doe\'s Workspace',
      niche: 'SaaS & Tech',
      audience: 'Founders & Entrepreneurs',
      market: 'United States',
      tone: 'Educational',
      users: { connect: { id: DEMO_USER_ID } },
    },
    update: {},
  });
  console.log('✅ Workspace:', workspace.name);

  // ── Engagement heatmap defaults ───────────────────────────────────────────
  const timeSlots = ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM', '11:00 PM'];
  const heatmapData = [
    { time: '9:00 AM',  mon: 72, tue: 68, wed: 75, thu: 70, fri: 65, sat: 45, sun: 40 },
    { time: '12:00 PM', mon: 85, tue: 88, wed: 90, thu: 87, fri: 82, sat: 55, sun: 50 },
    { time: '3:00 PM',  mon: 78, tue: 80, wed: 82, thu: 79, fri: 75, sat: 60, sun: 55 },
    { time: '6:00 PM',  mon: 92, tue: 88, wed: 85, thu: 90, fri: 88, sat: 70, sun: 65 },
    { time: '9:00 PM',  mon: 65, tue: 60, wed: 62, thu: 68, fri: 75, sat: 80, sun: 78 },
    { time: '11:00 PM', mon: 35, tue: 32, wed: 30, thu: 38, fri: 55, sat: 62, sun: 58 },
  ];

  for (const row of heatmapData) {
    await prisma.engagementHeatmap.upsert({
      where: { workspaceId_timeSlot: { workspaceId: DEMO_WORKSPACE_ID, timeSlot: row.time } },
      create: { workspaceId: DEMO_WORKSPACE_ID, ...row, timeSlot: row.time },
      update: { ...row },
    });
  }
  console.log('✅ Engagement heatmap seeded');

  // ── Platform stats defaults ───────────────────────────────────────────────
  const platforms = [
    { platform: 'Instagram', percentage: 35, color: '#8B5CF6' },
    { platform: 'TikTok',    percentage: 28, color: '#EC4899' },
    { platform: 'LinkedIn',  percentage: 18, color: '#3B82F6' },
    { platform: 'X',         percentage: 12, color: '#1F2937' },
    { platform: 'YouTube',   percentage: 7,  color: '#EF4444' },
  ];

  for (const p of platforms) {
    await prisma.platformStat.create({ data: { workspaceId: DEMO_WORKSPACE_ID, ...p } });
  }
  console.log('✅ Platform stats seeded');

  // ── Competitor profiles ───────────────────────────────────────────────────
  const competitors = [
    { name: 'Jane Doe',        followers: 12400, postsPerMonth: 28, engagementRate: 5.2, growthRate: 18, isYou: true  },
    { name: 'Creator A',       followers: 24800, postsPerMonth: 35, engagementRate: 3.8, growthRate: 12, isYou: false },
    { name: 'Creator B',       followers: 18600, postsPerMonth: 22, engagementRate: 4.5, growthRate: 21, isYou: false },
    { name: 'Brand Account',   followers: 51200, postsPerMonth: 60, engagementRate: 2.1, growthRate: 5,  isYou: false },
    { name: 'Niche Influencer',followers: 8900,  postsPerMonth: 15, engagementRate: 6.1, growthRate: 28, isYou: false },
  ];

  for (const c of competitors) {
    await prisma.competitorProfile.create({ data: { workspaceId: DEMO_WORKSPACE_ID, ...c } });
  }
  console.log('✅ Competitor profiles seeded');

  // ── Seed 30 days of sample analytics ─────────────────────────────────────
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    await prisma.analyticsDay.upsert({
      where: { workspaceId_date: { workspaceId: DEMO_WORKSPACE_ID, date } },
      create: {
        workspaceId: DEMO_WORKSPACE_ID,
        date,
        engagement: Math.floor(Math.random() * 300 + 100),
        reach: Math.floor(Math.random() * 5000 + 1000),
        followers: Math.floor(Math.random() * 50 + 10),
        clicks: Math.floor(Math.random() * 200 + 50),
      },
      update: {},
    });
  }
  console.log('✅ 30 days of analytics seeded');

  // ── Seed 8 weeks of weekly analytics ─────────────────────────────────────
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    await prisma.weeklyAnalytic.upsert({
      where: { workspaceId_weekStart: { workspaceId: DEMO_WORKSPACE_ID, weekStart } },
      create: {
        workspaceId: DEMO_WORKSPACE_ID,
        weekStart,
        weekLabel: `W${8 - i}`,
        engagement: Math.floor(Math.random() * 1000 + 500),
        followers: Math.floor(Math.random() * 200 + 50),
      },
      update: {},
    });
  }
  console.log('✅ Weekly analytics seeded');

  // ── Initial stats rollup ──────────────────────────────────────────────────
  const periodEnd   = new Date();
  const periodStart = new Date(periodEnd);
  periodStart.setDate(periodStart.getDate() - 7);

  await prisma.dashboardStats.upsert({
    where: { workspaceId_periodStart: { workspaceId: DEMO_WORKSPACE_ID, periodStart } },
    create: {
      workspaceId: DEMO_WORKSPACE_ID,
      periodStart,
      periodEnd,
      trendingTopicsCount: 0,
      contentGeneratedCount: 0,
      totalReach: 0,
      engagementRate: 0,
      trendingTopicsChange: 0,
      contentGeneratedChange: 0,
      totalReachChange: 0,
      engagementRateChange: 0,
    },
    update: {},
  });
  console.log('✅ Initial dashboard stats record created');

  console.log('\n🎉 Seed complete! Your demo workspace is ready.');
  console.log('   User ID:      demo-user');
  console.log('   Workspace ID: demo-workspace');
  console.log('\n   Next steps:');
  console.log('   1. Set x-user-id: demo-user header (or update DEFAULT_USER_ID in .env)');
  console.log('   2. Run trend research to populate trending topics');
  console.log('   3. Generate content to populate content pillars');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
