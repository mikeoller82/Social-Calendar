// src/server/routers/_app.ts
import { router } from '../trpc';
import { dashboardRouter } from './dashboard';
import { contentRouter, schedulingRouter } from './content';

export const appRouter = router({
  dashboard: dashboardRouter,
  content: contentRouter,
  scheduling: schedulingRouter,
});

export type AppRouter = typeof appRouter;
