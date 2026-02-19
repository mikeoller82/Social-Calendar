export interface TrendItem {
  id: number;
  topic: string;
  score: number;
  longevity: 'short-term' | 'mid-term' | 'evergreen';
  platforms: string[];
  category: string;
  growth: number;
  volume: string;
  keywords: string[];
}

export interface CalendarEvent {
  id: number;
  day: number;
  date: string;
  platform: string;
  postType: string;
  theme: string;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  bestTime: string;
  contentPillar: 'viral' | 'authority' | 'community' | 'conversion';
  engagementPrediction: number;
  status: 'draft' | 'scheduled' | 'published' | 'generating';
}

export interface AnalyticsData {
  day: string;
  engagement: number;
  reach: number;
  followers: number;
  clicks: number;
}

export interface BootstrapData {
  trendingTopics: TrendItem[];
  sampleCalendar: CalendarEvent[];
  analyticsData: AnalyticsData[];
  weeklyAnalytics: Array<{ week: string; engagement: number; reach: number }>;
  platformBreakdown: Array<{ name: string; value: number; color: string }>;
  competitorData: Array<{ name: string; you: number; competitor: number }>;
  contentPillarData: Array<{ name: string; value: number; color: string }>;
  engagementByTime: Array<{ time: string; engagement: number }>;
  nicheOptions: string[];
  audienceOptions: string[];
  toneOptions: string[];
  marketOptions: string[];
}
