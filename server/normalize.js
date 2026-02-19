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

export function normalizeBootstrapData(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const normalized = { ...DEFAULT_BOOTSTRAP };

  for (const [targetKey, aliases] of Object.entries(KEY_ALIASES)) {
    const value = pickKey(source, aliases);
    if (value !== undefined) {
      normalized[targetKey] = Array.isArray(DEFAULT_BOOTSTRAP[targetKey]) ? asArray(value) : value;
    }
  }

  return normalized;
}

export function normalizeResearchData(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const trendingTopics = pickKey(source, ['trendingTopics', 'trending_topics', 'topics', 'trendTopics']);
  return { trendingTopics: asArray(trendingTopics) };
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
