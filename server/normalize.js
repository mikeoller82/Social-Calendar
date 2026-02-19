const DEFAULT_BOOTSTRAP = {
  trendingTopics: [],
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
};

const KEY_ALIASES = {
  trendingTopics: ['trendingTopics', 'trending_topics', 'topics', 'trendTopics'],
  sampleCalendar: ['sampleCalendar', 'sample_calendar', 'calendar', 'calendarItems'],
  analyticsData: ['analyticsData', 'analytics_data', 'analytics'],
  weeklyAnalytics: ['weeklyAnalytics', 'weekly_analytics', 'weeklyData'],
  platformBreakdown: ['platformBreakdown', 'platform_breakdown', 'platformData'],
  competitorData: ['competitorData', 'competitor_data', 'competitors'],
  contentPillarData: ['contentPillarData', 'content_pillar_data', 'pillarData', 'contentPillars'],
  engagementByTime: ['engagementByTime', 'engagement_by_time', 'timeEngagement', 'engagementOverTime'],
  nicheOptions: ['nicheOptions', 'niche_options', 'niches'],
  audienceOptions: ['audienceOptions', 'audience_options', 'audiences'],
  toneOptions: ['toneOptions', 'tone_options', 'tones'],
  marketOptions: ['marketOptions', 'market_options', 'markets'],
};

function pickKey(source, aliases) {
  for (const key of aliases) {
    if (key in source) return source[key];
  }
  return undefined;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * Ensure each competitor item has the shape components expect:
 * { name, followers, posts, engagement, growth }
 */
function normalizeCompetitorItem(item) {
  if (!item || typeof item !== 'object') return null;
  return {
    name: item.name || 'Unknown',
    followers: Number(item.followers ?? item.you ?? 0),
    posts: Number(item.posts ?? item.postsPerMonth ?? 20),
    engagement: Number(item.engagement ?? item.engagementRate ?? 3.0),
    growth: Number(item.growth ?? item.growthRate ?? 0),
  };
}

/**
 * Ensure each engagementByTime item has day-of-week columns:
 * { time, mon, tue, wed, thu, fri, sat, sun }
 */
function normalizeEngagementByTime(item) {
  if (!item || typeof item !== 'object') return null;
  return {
    time: item.time || item.hour || '12:00 PM',
    mon: Number(item.mon ?? item.monday ?? item.engagement ?? 0),
    tue: Number(item.tue ?? item.tuesday ?? item.engagement ?? 0),
    wed: Number(item.wed ?? item.wednesday ?? item.engagement ?? 0),
    thu: Number(item.thu ?? item.thursday ?? item.engagement ?? 0),
    fri: Number(item.fri ?? item.friday ?? item.engagement ?? 0),
    sat: Number(item.sat ?? item.saturday ?? item.engagement ?? 0),
    sun: Number(item.sun ?? item.sunday ?? item.engagement ?? 0),
  };
}

/**
 * Ensure each weeklyAnalytics item has: { week, engagement, followers }
 */
function normalizeWeeklyAnalytic(item) {
  if (!item || typeof item !== 'object') return null;
  return {
    week: item.week || item.label || 'W1',
    engagement: Number(item.engagement ?? 0),
    followers: Number(item.followers ?? item.reach ?? 0),
  };
}

/**
 * Ensure each trendingTopic has all required fields
 */
function normalizeTrendItem(item, index) {
  if (!item || typeof item !== 'object') return null;
  return {
    id: item.id ?? index + 1,
    topic: item.topic || item.name || item.title || 'Unknown Topic',
    score: Number(item.score ?? 70),
    longevity: item.longevity ?? 'mid-term',
    platforms: Array.isArray(item.platforms) ? item.platforms : ['Instagram'],
    category: item.category || 'General',
    growth: Number(item.growth ?? 0),
    volume: String(item.volume ?? '10K'),
    keywords: Array.isArray(item.keywords) ? item.keywords : [],
  };
}

/**
 * Ensure each calendarEvent has all required fields
 */
function normalizeCalendarEvent(item, index) {
  if (!item || typeof item !== 'object') return null;
  return {
    id: item.id ?? index + 1,
    day: Number(item.day ?? index + 1),
    date: item.date || '',
    platform: item.platform || 'Instagram',
    postType: item.postType || item.post_type || 'Post',
    theme: item.theme || item.title || 'Content',
    hook: item.hook || '',
    caption: item.caption || '',
    hashtags: Array.isArray(item.hashtags) ? item.hashtags : [],
    cta: item.cta || '',
    bestTime: item.bestTime || item.best_time || '12:00 PM',
    contentPillar: item.contentPillar || item.content_pillar || 'authority',
    engagementPrediction: Number(item.engagementPrediction ?? item.engagement_prediction ?? 50),
    status: item.status || 'draft',
    ...(item.script ? { script: item.script } : {}),
    ...(item.slides ? { slides: item.slides } : {}),
    ...(item.threadParts ? { threadParts: item.threadParts } : {}),
  };
}

export function normalizeBootstrapData(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const normalized = { ...DEFAULT_BOOTSTRAP };

  for (const [targetKey, aliases] of Object.entries(KEY_ALIASES)) {
    const value = pickKey(source, aliases);
    if (value !== undefined) {
      normalized[targetKey] = Array.isArray(DEFAULT_BOOTSTRAP[targetKey]) ? asArray(value) : value;
    }
  }

  // Deep-normalize each array's items into the exact shape components expect
  normalized.trendingTopics = normalized.trendingTopics
    .map((item, i) => normalizeTrendItem(item, i))
    .filter(Boolean);

  normalized.sampleCalendar = normalized.sampleCalendar
    .map((item, i) => normalizeCalendarEvent(item, i))
    .filter(Boolean);

  normalized.competitorData = normalized.competitorData
    .map(normalizeCompetitorItem)
    .filter(Boolean);

  normalized.engagementByTime = normalized.engagementByTime
    .map(normalizeEngagementByTime)
    .filter(Boolean);

  normalized.weeklyAnalytics = normalized.weeklyAnalytics
    .map(normalizeWeeklyAnalytic)
    .filter(Boolean);

  return normalized;
}

export function normalizeResearchData(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const trendingTopics = pickKey(source, ['trendingTopics', 'trending_topics', 'topics', 'trendTopics']);
  return {
    trendingTopics: asArray(trendingTopics).map((item, i) => normalizeTrendItem(item, i)).filter(Boolean),
  };
}

export function normalizeGenerateContentData(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const fields = pickKey(source, ['fields', 'fieldNames', 'contentFields']);
  const generated = pickKey(source, ['generated', 'content', 'generatedContent']);
  const abVariation = pickKey(source, ['abVariation', 'ab_variation', 'abVariant', 'ab_variant']);

  return {
    fields: asArray(fields),
    generated: generated && typeof generated === 'object' ? generated : {},
    abVariation: typeof abVariation === 'string' ? abVariation : null,
  };
}
