import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { extractJson, parseRequestBody } from './parsing.js';
import { normalizeBootstrapData, normalizeGenerateContentData, normalizeResearchData } from './normalize.js';

const port = Number(process.env.PORT || 8787);
const model = process.env.OPENAI_MODEL || 'gpt-4o';

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
        const rawData = await callResponses(
          'You are a data generator for a social media trend planner app. Return ONLY valid JSON, no markdown, no explanation.',
          `Return a JSON object with these exact keys and shapes:
{
  "trendingTopics": [12 items, each: { "id": number, "topic": string, "score": number(60-99), "longevity": "short-term"|"mid-term"|"evergreen", "platforms": string[], "category": string, "growth": number(5-300), "volume": string(e.g."45K"), "keywords": string[] }],
  "sampleCalendar": [30 items, each: { "id": number, "day": number(1-30), "date": "2025-MM-DD", "platform": string, "postType": string, "theme": string, "hook": string, "caption": string, "hashtags": string[], "cta": string, "bestTime": "H:MM AM/PM", "contentPillar": "viral"|"authority"|"community"|"conversion", "engagementPrediction": number(40-95), "status": "draft"|"scheduled"|"published" }],
  "analyticsData": [30 items, each: { "day": string, "engagement": number, "reach": number, "followers": number, "clicks": number }],
  "weeklyAnalytics": [8 items, each: { "week": string, "engagement": number, "followers": number }],
  "platformBreakdown": [5 items, each: { "name": string, "value": number, "color": string(hex) }],
  "competitorData": [5 items, each: { "name": string, "followers": number, "posts": number, "engagement": number(1.0-6.0), "growth": number(1-30) }],
  "contentPillarData": [4 items, each: { "name": string, "value": number, "color": string(hex) }],
  "engagementByTime": [6 items representing time slots, each: { "time": string(e.g."9:00 AM"), "mon": number(0-100), "tue": number(0-100), "wed": number(0-100), "thu": number(0-100), "fri": number(0-100), "sat": number(0-100), "sun": number(0-100) }],
  "nicheOptions": ["SaaS & Tech", "E-commerce", "Health & Wellness", "Finance", "Education", "Travel", "Food & Beverage", "Fashion", "Real Estate", "Gaming"],
  "audienceOptions": ["Gen Z (18-24)", "Millennials (25-40)", "Gen X (41-56)", "Founders & Entrepreneurs", "Marketers", "Students"],
  "toneOptions": ["Educational", "Entertaining", "Inspirational", "Professional", "Casual", "Bold", "Humorous", "Empathetic"],
  "marketOptions": ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Global"]
}`
        );
        const data = normalizeBootstrapData(rawData);
        sendJson(res, 200, data);
        return;
      }

      if (req.method === 'POST' && req.url === '/api/research') {
        const body = await readBody(req);
        const rawData = await callResponses(
          'You are a trend research strategist. Return ONLY valid JSON, no markdown.',
          `Generate 12 trending social media topics for:
- Niche: ${body.niche || 'general'}
- Audience: ${body.audience || 'general'}
- Market: ${body.market || 'global'}
- Tone: ${body.tone || 'educational'}

Return: { "trendingTopics": [ ...12 items each with: { "id": number, "topic": string, "score": number(60-99), "longevity": "short-term"|"mid-term"|"evergreen", "platforms": string[], "category": string, "growth": number, "volume": string, "keywords": string[] } ] }`
        );
        const data = normalizeResearchData(rawData);
        sendJson(res, 200, data);
        return;
      }

      if (req.method === 'POST' && req.url === '/api/generate-content') {
        const body = await readBody(req);
        const rawData = await callResponses(
          'You are an expert social media copywriter. Return ONLY valid JSON, no markdown.',
          `Generate social media content for:
- Platform: ${body.platform}
- Topic: ${body.topic}
- Tone: ${body.tone}
- Include A/B variation: ${body.includeAB ? 'yes' : 'no'}

Return JSON: {
  "fields": [array of field name strings, e.g. ["Hook", "Caption", "Hashtags", "CTA"]],
  "generated": { "Hook": "...", "Caption": "...", "Hashtags": "...", "CTA": "..." },
  "abVariation": ${body.includeAB ? '"alternative caption text here"' : 'null'}
}`
        );
        const data = normalizeGenerateContentData(rawData);
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
