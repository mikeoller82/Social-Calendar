import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { extractJson, parseRequestBody } from './parsing.js';

const port = Number(process.env.PORT || 8787);
const model = process.env.OPENAI_MODEL || 'gpt-5.2';

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return parseRequestBody(Buffer.concat(chunks).toString('utf8'));
}

async function callResponsesAPI(instructions, input) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set.');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, instructions, input }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'OpenAI request failed');
  }

  return extractJson(data.output_text || '');
}

export function createServer({ callResponses = callResponsesAPI } = {}) {
  return http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      sendJson(res, 204, {});
      return;
    }

    try {
      if (req.method === 'GET' && req.url === '/api/bootstrap') {
        const data = await callResponses(
          'Return only JSON for social trend app datasets.',
          'Return JSON with keys: trendingTopics, sampleCalendar, analyticsData, weeklyAnalytics, platformBreakdown, competitorData, contentPillarData, engagementByTime, nicheOptions, audienceOptions, toneOptions, marketOptions. Use realistic values and include 30 sampleCalendar items.'
        );
        sendJson(res, 200, data);
        return;
      }

      if (req.method === 'POST' && req.url === '/api/research') {
        const body = await readBody(req);
        const data = await callResponses(
          'You are a trend research strategist. Return only JSON.',
          `Generate 12 trending topics for niche ${body.niche || 'general'}, audience ${body.audience || 'general'}, market ${body.market || 'global'}, tone ${body.tone || 'educational'}. Return as {"trendingTopics":[...]} with id/topic/score/longevity/platforms/category/growth/volume/keywords.`
        );
        sendJson(res, 200, data);
        return;
      }

      if (req.method === 'POST' && req.url === '/api/generate-content') {
        const body = await readBody(req);
        const data = await callResponses(
          'You are an expert social copywriter. Return only JSON.',
          `Platform: ${body.platform}. Topic: ${body.topic}. Tone: ${body.tone}. Return JSON: {"fields":[...],"generated":{"field":"text"},"abVariation":string|null}`
        );
        sendJson(res, 200, data);
        return;
      }

      sendJson(res, 404, { error: 'Not found' });
    } catch (error) {
      sendJson(res, 500, { error: error.message });
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createServer();
  server.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
  });
}
