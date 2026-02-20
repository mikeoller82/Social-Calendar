// server/trpcHandler.js
// Wire this into your existing Node HTTP server (server/index.js)
// alongside your existing /api/* routes.

import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createFetchHandler } from '@trpc/server/adapters/fetch';
import { serve } from 'inngest/node';
import { appRouter } from '../src/server/routers/_app.js';
import { createContext } from '../src/server/trpc.js';
import { inngest } from '../src/server/inngest/client.js';
import { inngestFunctions } from '../src/server/inngest/functions.js';

/**
 * Attaches tRPC and Inngest routes to an existing http.Server / express app.
 *
 * Usage in server/index.js:
 *
 *   import { attachTrpcAndInngest } from './trpcHandler.js';
 *   const server = http.createServer(handler);
 *   attachTrpcAndInngest(server);
 */

// ─── tRPC fetch handler (works with bare Node http) ──────────────────────────

export async function handleTrpc(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (!url.pathname.startsWith('/trpc')) return false;

  // Convert Node IncomingMessage → Web Request
  const body = await new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });

  const webRequest = new Request(`http://localhost${req.url}`, {
    method: req.method,
    headers: Object.fromEntries(
      Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v ?? ''])
    ),
    body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
  });

  const webResponse = await createFetchHandler({
    router: appRouter,
    createContext: () => createContext({ req, res } as any),
    endpoint: '/trpc',
  })(webRequest);

  res.writeHead(webResponse.status, Object.fromEntries(webResponse.headers.entries()));
  res.end(Buffer.from(await webResponse.arrayBuffer()));
  return true;
}

// ─── Inngest serve handler ────────────────────────────────────────────────────

const inngestHandler = serve({
  client: inngest,
  functions: inngestFunctions,
});

export async function handleInngest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (!url.pathname.startsWith('/api/inngest')) return false;

  const body = await new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });

  const webRequest = new Request(`http://localhost${req.url}`, {
    method: req.method,
    headers: Object.fromEntries(
      Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v ?? ''])
    ),
    body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
  });

  const webResponse = await inngestHandler(webRequest);
  res.writeHead(webResponse.status, Object.fromEntries(webResponse.headers.entries()));
  res.end(Buffer.from(await webResponse.arrayBuffer()));
  return true;
}
