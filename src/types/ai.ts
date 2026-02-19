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
  script?: string;
  slides?: string[];
  threadParts?: string[];
}

export interface AnalyticsData {
  day: string;
  engagement: number;
  reach: number;
  followers: number;
  clicks: number;
}

export interface CompetitorItem {
  name: string;
  followers: number;
  posts: number;
  engagement: number;
  growth: number;
}

export interface EngagementByTime {
  time: string;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}

export interface WeeklyAnalytic {
  week: string;
  engagement: number;
  followers: number;
}

export interface BootstrapData {
  trendingTopics: TrendItem[];
  sampleCalendar: CalendarEvent[];
  analyticsData: AnalyticsData[];
  weeklyAnalytics: WeeklyAnalytic[];
  platformBreakdown: Array<{ name: string; value: number; color: string }>;
  competitorData: CompetitorItem[];
  contentPillarData: Array<{ name: string; value: number; color: string }>;
  engagementByTime: EngagementByTime[];
  nicheOptions: string[];
  audienceOptions: string[];
  toneOptions: string[];
  marketOptions: string[];
}
