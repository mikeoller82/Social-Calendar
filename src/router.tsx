// src/router.tsx
// TanStack Router + tRPC query client wiring
// Replace your current src/main.tsx App shell with this.

import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  useNavigate,
} from '@tanstack/react-router';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';
import type { AppRouter } from './server/routers/_app';

// ─── tRPC React client ────────────────────────────────────────────────────────

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,      // 30s
      refetchOnWindowFocus: false,
    },
  },
});

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/trpc',
      transformer: superjson,
      headers() {
        // Wire your auth token here
        return {
          'x-user-id': localStorage.getItem('userId') ?? 'demo-user',
          'x-workspace-id': localStorage.getItem('workspaceId') ?? 'demo-workspace',
        };
      },
    }),
  ],
});

// ─── Route tree ───────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </trpc.Provider>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    // Lazy-import your existing Dashboard component
    const { Dashboard } = require('./components/Dashboard');
    return <Dashboard darkMode={false} setActiveTab={() => {}} />;
  },
});

const trendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trends',
  component: () => {
    const { TrendEngine } = require('./components/TrendEngine');
    return <TrendEngine darkMode={false} />;
  },
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: () => {
    const { CalendarView } = require('./components/CalendarView');
    return <CalendarView darkMode={false} />;
  },
});

const generatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/generator',
  component: () => {
    const { ContentGenerator } = require('./components/ContentGenerator');
    return <ContentGenerator darkMode={false} credits={500} setCredits={() => {}} />;
  },
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: () => {
    const { Analytics } = require('./components/Analytics');
    return <Analytics darkMode={false} />;
  },
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  trendsRoute,
  calendarRoute,
  generatorRoute,
  analyticsRoute,
]);

export const router = createRouter({ routeTree });

// ─── Type-safe router declaration ─────────────────────────────────────────────

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ─── Root component ───────────────────────────────────────────────────────────

export function AppWithRouter() {
  return <RouterProvider router={router} />;
}
