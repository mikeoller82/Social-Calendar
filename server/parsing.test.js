import test from 'node:test';
import assert from 'node:assert/strict';
import { extractJson, parseRequestBody } from './parsing.js';
import { createServer } from './index.js';

test('parseRequestBody returns empty object for empty payload', () => {
  assert.deepEqual(parseRequestBody(''), {});
  assert.deepEqual(parseRequestBody('   '), {});
});

test('parseRequestBody parses valid JSON and throws for invalid JSON', () => {
  assert.deepEqual(parseRequestBody('{"niche":"tech"}'), { niche: 'tech' });
  assert.throws(() => parseRequestBody('{bad json'), /Invalid JSON request body/);
});

test('extractJson supports markdown wrapped JSON and nested strings', () => {
  const text = 'Here is your data:\n```json\n{"ok":true,"message":"brace } inside"}\n```';
  assert.deepEqual(extractJson(text), { ok: true, message: 'brace } inside' });
});

test('extractJson handles unicode characters before JSON payload', () => {
  assert.deepEqual(extractJson('✅ Result: {"ok":true}'), { ok: true });
});

test('extractJson supports top-level arrays and throws on empty', () => {
  assert.deepEqual(extractJson('Result: [1,2,3]'), [1, 2, 3]);
  assert.throws(() => extractJson(''), /Model response was empty/);
});

test('end-to-end server routes work with parsing and validation', async () => {
  const server = createServer({
    callResponses: async (_instructions, input) => {
      if (input.includes('Return JSON with keys')) {
        return { trending_topics: [{ id: 1, topic: 'AI content' }], sample_calendar: [] };
      }
      if (input.includes('Generate 12 trending topics')) {
        return { trending_topics: [{ id: 1, topic: 'AI content' }] };
      }
          return { fieldNames: ['caption'], generatedContent: { caption: 'hello' }, ab_variant: 'alt' };
    },
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const bootstrapRes = await fetch(`${baseUrl}/api/bootstrap`);
  assert.equal(bootstrapRes.status, 200);
  assert.deepEqual(await bootstrapRes.json(), {
    trendingTopics: [{ id: 1, topic: 'AI content' }],
    sampleCalendar: [],
    analyticsData: [],
    weeklyAnalytics: [],
    platformBreakdown: [],
    competitorData: [],
    contentPillarData: [],
    engagementByTime: [],
    nicheOptions: [],
    audienceOptions: [],
    toneOptions: [],
    marketOptions: [],
  });

  const researchRes = await fetch(`${baseUrl}/api/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ niche: 'fitness', audience: 'founders', market: 'US', tone: 'bold' }),
  });
  assert.equal(researchRes.status, 200);
  assert.deepEqual(await researchRes.json(), { trendingTopics: [{ id: 1, topic: 'AI content' }] });

  const invalidJsonRes = await fetch(`${baseUrl}/api/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{not valid',
  });
  assert.equal(invalidJsonRes.status, 500);
  const invalidBody = await invalidJsonRes.json();
  assert.match(invalidBody.error, /Invalid JSON request body/);

  const genRes = await fetch(`${baseUrl}/api/generate-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform: 'LinkedIn', topic: 'AI', tone: 'educational' }),
  });
  assert.equal(genRes.status, 200);
  assert.deepEqual(await genRes.json(), {
    fields: ['caption'],
    generated: { caption: 'hello' },
    abVariation: 'alt',
  });

  await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});
