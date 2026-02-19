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
  script?: string;
  slides?: string[];
  threadParts?: string[];
  seoTitle?: string;
  status: 'draft' | 'scheduled' | 'published' | 'generating';
}

export interface AnalyticsData {
  day: string;
  engagement: number;
  reach: number;
  followers: number;
  clicks: number;
}

export const trendingTopics: TrendItem[] = [
  { id: 1, topic: 'AI-Powered Personal Branding', score: 95, longevity: 'evergreen', platforms: ['LinkedIn', 'Instagram', 'TikTok'], category: 'AI & Tech', growth: 234, volume: '1.2M', keywords: ['personal brand', 'AI tools', 'automation'] },
  { id: 2, topic: 'Micro-SaaS Side Hustles', score: 92, longevity: 'mid-term', platforms: ['X', 'LinkedIn', 'YouTube'], category: 'Business', growth: 189, volume: '890K', keywords: ['micro-saas', 'indie hacker', 'passive income'] },
  { id: 3, topic: 'Short-Form Video Storytelling', score: 89, longevity: 'evergreen', platforms: ['TikTok', 'Instagram', 'YouTube'], category: 'Content', growth: 156, volume: '2.1M', keywords: ['storytelling', 'reels', 'shorts'] },
  { id: 4, topic: 'Remote Work Culture 2025', score: 87, longevity: 'mid-term', platforms: ['LinkedIn', 'X', 'Reddit'], category: 'Workplace', growth: 143, volume: '670K', keywords: ['remote work', 'hybrid', 'digital nomad'] },
  { id: 5, topic: 'Creator Economy Monetization', score: 85, longevity: 'evergreen', platforms: ['YouTube', 'Instagram', 'TikTok'], category: 'Creator', growth: 178, volume: '1.5M', keywords: ['monetization', 'creator fund', 'sponsorships'] },
  { id: 6, topic: 'No-Code App Development', score: 83, longevity: 'evergreen', platforms: ['X', 'LinkedIn', 'YouTube'], category: 'Tech', growth: 198, volume: '560K', keywords: ['no-code', 'bubble', 'automation'] },
  { id: 7, topic: 'Sustainable Fashion Tech', score: 81, longevity: 'mid-term', platforms: ['Instagram', 'TikTok', 'Pinterest'], category: 'Fashion', growth: 167, volume: '430K', keywords: ['sustainable', 'eco-fashion', 'circular'] },
  { id: 8, topic: 'AI Art & Creative Tools', score: 79, longevity: 'short-term', platforms: ['Instagram', 'TikTok', 'X'], category: 'Creative', growth: 312, volume: '3.2M', keywords: ['AI art', 'midjourney', 'creative AI'] },
  { id: 9, topic: 'Health Tech Wearables', score: 77, longevity: 'mid-term', platforms: ['YouTube', 'Instagram', 'Reddit'], category: 'Health', growth: 134, volume: '780K', keywords: ['wearables', 'biohacking', 'health tech'] },
  { id: 10, topic: 'Community-Led Growth', score: 75, longevity: 'evergreen', platforms: ['LinkedIn', 'X', 'Reddit'], category: 'Marketing', growth: 156, volume: '340K', keywords: ['community', 'PLG', 'growth'] },
  { id: 11, topic: 'Voice Search Optimization', score: 73, longevity: 'mid-term', platforms: ['YouTube', 'LinkedIn'], category: 'SEO', growth: 112, volume: '290K', keywords: ['voice search', 'SEO', 'smart speakers'] },
  { id: 12, topic: 'UGC Creator Partnerships', score: 71, longevity: 'evergreen', platforms: ['TikTok', 'Instagram'], category: 'Marketing', growth: 201, volume: '510K', keywords: ['UGC', 'partnerships', 'brand deals'] },
  { id: 13, topic: 'Newsletter Growth Hacking', score: 88, longevity: 'evergreen', platforms: ['X', 'LinkedIn', 'YouTube'], category: 'Content', growth: 245, volume: '920K', keywords: ['newsletter', 'substack', 'email marketing'] },
  { id: 14, topic: 'AI Automation Workflows', score: 91, longevity: 'evergreen', platforms: ['LinkedIn', 'YouTube', 'X'], category: 'AI & Tech', growth: 267, volume: '1.8M', keywords: ['automation', 'zapier', 'make'] },
  { id: 15, topic: 'Social Commerce Evolution', score: 82, longevity: 'mid-term', platforms: ['TikTok', 'Instagram', 'YouTube'], category: 'E-commerce', growth: 178, volume: '1.1M', keywords: ['social commerce', 'TikTok shop', 'live shopping'] },
];

const platformIcons: Record<string, string> = {
  Instagram: '📸',
  TikTok: '🎵',
  LinkedIn: '💼',
  X: '𝕏',
  YouTube: '▶️',
  Reddit: '🔴',
};

export { platformIcons };

export const sampleCalendar: CalendarEvent[] = Array.from({ length: 30 }, (_, i) => {
  const platforms = ['Instagram', 'TikTok', 'LinkedIn', 'X', 'YouTube', 'Instagram', 'TikTok'];
  const postTypes: Record<string, string[]> = {
    Instagram: ['Reel', 'Carousel', 'Story', 'Single Post'],
    TikTok: ['Short Video', 'Duet', 'Stitch', 'Live'],
    LinkedIn: ['Text Post', 'Article', 'Carousel', 'Poll'],
    X: ['Thread', 'Single Tweet', 'Poll', 'Quote Tweet'],
    YouTube: ['Short', 'Long-form Video', 'Community Post', 'Live'],
  };
  const themes = [
    'Industry Trend Breakdown', 'Behind The Scenes', 'Quick Tips', 'Case Study',
    'Myth Busting', 'Tool Review', 'Day in the Life', 'Tutorial',
    'Hot Take', 'Success Story', 'Common Mistakes', 'Prediction',
    'Q&A', 'Comparison', 'Transformation', 'Challenge',
    'Story Time', 'Data Insight', 'Hack Reveal', 'Community Spotlight',
    'Expert Interview', 'Resource List', 'Process Breakdown', 'Trend Alert',
    'Controversial Opinion', 'Step-by-Step Guide', 'Results Reveal', 'Inspiration',
    'Weekly Roundup', 'Announcement'
  ];
  const hooks = [
    'Stop scrolling — this will change how you think about...',
    'I spent 100 hours researching this so you don\'t have to...',
    'Nobody talks about this, but...',
    'Here\'s what 99% of people get wrong about...',
    'The #1 mistake I see beginners make is...',
    'This simple trick 10x\'d my results in just 7 days...',
    'Unpopular opinion: Most people are doing this completely wrong...',
    'I analyzed 1,000 top performers and found this pattern...',
    'Save this — you\'ll need it later...',
    'POV: You just discovered the secret that top creators use...',
  ];
  const pillars: CalendarEvent['contentPillar'][] = ['viral', 'authority', 'community', 'conversion'];
  const pillarWeights = [0.3, 0.3, 0.2, 0.2];
  let pillarIndex = 0;
  const rand = Math.random();
  let cum = 0;
  for (let p = 0; p < pillarWeights.length; p++) {
    cum += pillarWeights[p];
    if (rand < cum) { pillarIndex = p; break; }
  }

  const platform = platforms[i % platforms.length];
  const types = postTypes[platform] || ['Post'];
  const postType = types[i % types.length];
  const date = new Date(2025, 6, i + 1);
  const times = ['7:00 AM', '9:00 AM', '12:00 PM', '2:00 PM', '5:00 PM', '7:00 PM', '9:00 PM'];
  const statuses: CalendarEvent['status'][] = ['draft', 'scheduled', 'draft', 'scheduled'];

  const hashtags = [
    ['#trending', '#viral', '#growth', '#socialmedia', '#marketing'],
    ['#business', '#entrepreneur', '#startup', '#saas', '#tech'],
    ['#contentcreator', '#digitalmarketing', '#branding', '#strategy'],
    ['#motivation', '#success', '#hustle', '#mindset', '#goals'],
  ];

  return {
    id: i + 1,
    day: i + 1,
    date: date.toISOString().split('T')[0],
    platform,
    postType,
    theme: themes[i % themes.length],
    hook: hooks[i % hooks.length],
    caption: `🔥 ${themes[i % themes.length]}\n\n${hooks[i % hooks.length]}\n\nHere's what I've learned after years of experience in this space. The key insights that most people overlook are often the simplest ones.\n\n💡 Key takeaway: Focus on consistency over perfection. The algorithm rewards those who show up daily.\n\nDrop a 🙌 if this resonates with you!`,
    hashtags: hashtags[i % hashtags.length],
    cta: ['Save for later ✅', 'Share with a friend 👥', 'Follow for more 🔔', 'Comment below 👇', 'Link in bio 🔗'][i % 5],
    bestTime: times[i % times.length],
    contentPillar: pillars[pillarIndex],
    engagementPrediction: Math.floor(Math.random() * 40) + 60,
    status: statuses[i % statuses.length],
    script: postType.toLowerCase().includes('video') || postType.toLowerCase().includes('reel') || postType.toLowerCase().includes('short')
      ? `[HOOK - 0:00-0:03]\n"${hooks[i % hooks.length]}"\n\n[SETUP - 0:03-0:10]\nLet me break this down for you...\n\n[VALUE - 0:10-0:45]\nStep 1: Research your audience\nStep 2: Create a content framework\nStep 3: Test and iterate\n\n[CTA - 0:45-0:60]\nFollow for more tips like this!`
      : undefined,
    slides: postType === 'Carousel'
      ? ['Slide 1: Bold Statement / Hook', 'Slide 2: The Problem', 'Slide 3: Why It Matters', 'Slide 4: Solution Step 1', 'Slide 5: Solution Step 2', 'Slide 6: Solution Step 3', 'Slide 7: Results / Proof', 'Slide 8: CTA + Save This']
      : undefined,
    threadParts: postType === 'Thread'
      ? ['🧵 Thread: ' + themes[i % themes.length], '1/ ' + hooks[i % hooks.length], '2/ Here\'s the first key insight...', '3/ But most people miss this part...', '4/ The real game changer is...', '5/ Here\'s exactly how to implement this...', '6/ The results speak for themselves...', '7/ TL;DR + Follow for more threads like this']
      : undefined,
    seoTitle: platform === 'YouTube' ? `${themes[i % themes.length]} | Complete Guide 2025` : undefined,
  };
});

export const analyticsData: AnalyticsData[] = [
  { day: 'Mon', engagement: 4200, reach: 28000, followers: 150, clicks: 890 },
  { day: 'Tue', engagement: 3800, reach: 24000, followers: 120, clicks: 720 },
  { day: 'Wed', engagement: 5100, reach: 35000, followers: 210, clicks: 1100 },
  { day: 'Thu', engagement: 4700, reach: 31000, followers: 180, clicks: 950 },
  { day: 'Fri', engagement: 6200, reach: 42000, followers: 290, clicks: 1400 },
  { day: 'Sat', engagement: 7800, reach: 56000, followers: 340, clicks: 1800 },
  { day: 'Sun', engagement: 5500, reach: 38000, followers: 220, clicks: 1200 },
];

export const weeklyAnalytics = [
  { week: 'W1', engagement: 32000, reach: 180000, posts: 12, followers: 890 },
  { week: 'W2', engagement: 38000, reach: 220000, posts: 14, followers: 1120 },
  { week: 'W3', engagement: 45000, reach: 290000, posts: 15, followers: 1450 },
  { week: 'W4', engagement: 52000, reach: 340000, posts: 13, followers: 1780 },
];

export const platformBreakdown = [
  { name: 'Instagram', value: 35, color: '#E1306C' },
  { name: 'TikTok', value: 28, color: '#000000' },
  { name: 'LinkedIn', value: 18, color: '#0077B5' },
  { name: 'X', value: 12, color: '#1DA1F2' },
  { name: 'YouTube', value: 7, color: '#FF0000' },
];

export const competitorData = [
  { name: 'You', followers: 24500, engagement: 4.2, posts: 28, growth: 12.3 },
  { name: 'Competitor A', followers: 89000, engagement: 2.8, posts: 22, growth: 5.1 },
  { name: 'Competitor B', followers: 45000, engagement: 3.5, posts: 35, growth: 8.7 },
  { name: 'Competitor C', followers: 120000, engagement: 1.9, posts: 18, growth: 3.2 },
];

export const contentPillarData = [
  { name: 'Viral Growth', value: 30, color: '#8B5CF6' },
  { name: 'Authority', value: 30, color: '#3B82F6' },
  { name: 'Community', value: 20, color: '#10B981' },
  { name: 'Conversion', value: 20, color: '#F59E0B' },
];

export const engagementByTime = [
  { time: '6AM', mon: 20, tue: 15, wed: 25, thu: 18, fri: 30, sat: 45, sun: 35 },
  { time: '9AM', mon: 45, tue: 50, wed: 55, thu: 48, fri: 60, sat: 40, sun: 30 },
  { time: '12PM', mon: 65, tue: 70, wed: 75, thu: 68, fri: 80, sat: 55, sun: 50 },
  { time: '3PM', mon: 55, tue: 58, wed: 62, thu: 56, fri: 70, sat: 75, sun: 65 },
  { time: '6PM', mon: 80, tue: 85, wed: 88, thu: 82, fri: 90, sat: 85, sun: 78 },
  { time: '9PM', mon: 70, tue: 72, wed: 78, thu: 74, fri: 82, sat: 90, sun: 85 },
];

export const nicheOptions = [
  'SaaS & Tech', 'E-commerce', 'Personal Branding', 'Health & Fitness',
  'Finance & Investing', 'Real Estate', 'Education', 'Fashion & Beauty',
  'Food & Beverage', 'Travel & Tourism', 'Gaming', 'Entertainment',
  'Non-Profit', 'Agency & Consulting', 'Coaching & Courses',
];

export const audienceOptions = [
  'Gen Z (18-24)', 'Millennials (25-40)', 'Gen X (41-56)', 'Boomers (57-75)',
  'B2B Decision Makers', 'Small Business Owners', 'Solopreneurs',
  'Students', 'Parents', 'Tech Enthusiasts', 'Creatives',
];

export const toneOptions = [
  'Educational', 'Bold & Provocative', 'Funny & Witty', 'Luxury & Premium',
  'Casual & Friendly', 'Professional & Corporate', 'Inspirational',
  'Data-Driven', 'Storytelling', 'Minimalist',
];

export const marketOptions = [
  'United States', 'United Kingdom', 'Canada', 'Australia',
  'Europe', 'Global', 'India', 'Southeast Asia', 'Latin America',
];
