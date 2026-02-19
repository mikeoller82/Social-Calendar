import { ArrowUpRight, ArrowDownRight, Users, Eye, Heart, MousePointer, BarChart3, Award, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { cn } from '@/utils/cn';
import { useBootstrapData } from '@/hooks/useBootstrapData';

interface AnalyticsProps {
  darkMode: boolean;
}

export function Analytics({ darkMode }: AnalyticsProps) {
  const { data } = useBootstrapData();
  const analyticsData = data?.analyticsData ?? [];
  const weeklyAnalytics = data?.weeklyAnalytics ?? [];
  const competitorData = data?.competitorData ?? [];
  const kpis = [
    { label: 'Total Followers', value: '24,583', change: '+12.3%', up: true, icon: Users, color: 'violet' },
    { label: 'Total Reach', value: '2.4M', change: '+18.7%', up: true, icon: Eye, color: 'blue' },
    { label: 'Engagement Rate', value: '4.2%', change: '+0.8%', up: true, icon: Heart, color: 'pink' },
    { label: 'Click-Through', value: '3.1%', change: '-0.2%', up: false, icon: MousePointer, color: 'amber' },
  ];

  const colorClasses: Record<string, { bg: string; darkBg: string; text: string }> = {
    violet: { bg: 'bg-violet-50', darkBg: 'bg-violet-950/30', text: 'text-violet-600' },
    blue: { bg: 'bg-blue-50', darkBg: 'bg-blue-950/30', text: 'text-blue-600' },
    pink: { bg: 'bg-pink-50', darkBg: 'bg-pink-950/30', text: 'text-pink-600' },
    amber: { bg: 'bg-amber-50', darkBg: 'bg-amber-950/30', text: 'text-amber-600' },
  };

  const radarData = [
    { subject: 'Hooks', you: 85, avg: 65 },
    { subject: 'Visuals', you: 78, avg: 60 },
    { subject: 'CTAs', you: 92, avg: 55 },
    { subject: 'Hashtags', you: 70, avg: 70 },
    { subject: 'Timing', you: 88, avg: 62 },
    { subject: 'Format', you: 82, avg: 58 },
  ];

  const topContent = [
    { title: 'AI Productivity Hacks Carousel', platform: 'Instagram', type: 'Carousel', reach: '56K', engagement: '8.2%', saves: 1240 },
    { title: 'Day in the Life Reel', platform: 'TikTok', type: 'Short Video', reach: '124K', engagement: '12.1%', saves: 3400 },
    { title: 'Content Strategy Thread', platform: 'X', type: 'Thread', reach: '89K', engagement: '6.5%', saves: 890 },
    { title: 'Building in Public Update', platform: 'LinkedIn', type: 'Text Post', reach: '34K', engagement: '5.8%', saves: 560 },
    { title: 'Tool Review: AI Writers', platform: 'YouTube', type: 'Long-form', reach: '45K', engagement: '4.1%', saves: 780 },
  ];

  const card = cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white');

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>📊 Performance Analytics</h1>
        <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Track your content performance and growth metrics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(kpi => {
          const colors = colorClasses[kpi.color];
          return (
            <div key={kpi.label} className={cn(card, 'p-5')}>
              <div className="flex items-start justify-between">
                <div className={cn('rounded-xl p-2.5', darkMode ? colors.darkBg : colors.bg)}>
                  <kpi.icon className={cn('h-5 w-5', colors.text)} />
                </div>
                <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  kpi.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
                  darkMode && (kpi.up ? 'bg-emerald-950/50 text-emerald-400' : 'bg-red-950/50 text-red-400')
                )}>
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className={cn('mt-3 text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{kpi.value}</p>
              <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Engagement Trend */}
        <div className={card}>
          <h3 className={cn('mb-4 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Engagement Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="aEngGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f3f4f6'} />
              <XAxis dataKey="day" stroke={darkMode ? '#6B7280' : '#9CA3AF'} fontSize={12} />
              <YAxis stroke={darkMode ? '#6B7280' : '#9CA3AF'} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="engagement" stroke="#8B5CF6" strokeWidth={2} fill="url(#aEngGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Growth */}
        <div className={card}>
          <h3 className={cn('mb-4 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Weekly Growth</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f3f4f6'} />
              <XAxis dataKey="week" stroke={darkMode ? '#6B7280' : '#9CA3AF'} fontSize={12} />
              <YAxis stroke={darkMode ? '#6B7280' : '#9CA3AF'} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '12px' }} />
              <Bar dataKey="engagement" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="followers" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar + Competitor Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Content Performance Radar */}
        <div className={card}>
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-violet-500" />
            <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Content Performance Radar</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={darkMode ? '#374151' : '#E5E7EB'} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }} />
              <Radar name="You" dataKey="you" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              <Radar name="Average" dataKey="avg" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.1} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Competitor Analysis */}
        <div className={card}>
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-violet-500" />
            <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Competitor Analysis</h3>
          </div>
          <div className="space-y-3">
            {competitorData.map((comp, i) => (
              <div key={comp.name} className={cn('rounded-xl p-3 transition',
                i === 0 ? (darkMode ? 'bg-violet-950/20 border border-violet-900/50' : 'bg-violet-50 border border-violet-100') :
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white',
                      i === 0 ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : 'bg-gray-400'
                    )}>
                      {comp.name[0]}{comp.name.includes(' ') ? comp.name.split(' ')[1][0] : ''}
                    </div>
                    <div>
                      <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                        {comp.name} {i === 0 && <span className="text-violet-500">(You)</span>}
                      </p>
                      <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>
                        {comp.followers.toLocaleString()} followers · {comp.posts} posts/mo
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-sm font-bold', comp.engagement >= 4 ? 'text-emerald-500' : comp.engagement >= 3 ? 'text-blue-500' : 'text-amber-500')}>
                      {comp.engagement}%
                    </p>
                    <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>engagement</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className={cn('h-1.5 flex-1 rounded-full', darkMode ? 'bg-gray-800' : 'bg-gray-100')}>
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${(comp.engagement / 5) * 100}%` }} />
                  </div>
                  <span className="flex items-center gap-0.5 text-xs text-emerald-500">
                    <ArrowUpRight className="h-3 w-3" />
                    {comp.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className={card}>
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-violet-500" />
          <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Top Performing Content</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('border-b', darkMode ? 'border-gray-800' : 'border-gray-100')}>
                {['Content', 'Platform', 'Type', 'Reach', 'Engagement', 'Saves'].map(h => (
                  <th key={h} className={cn('px-4 py-3 text-left text-xs font-semibold', darkMode ? 'text-gray-400' : 'text-gray-500')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topContent.map((item, i) => (
                <tr key={i} className={cn('border-b transition', darkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-gray-50')}>
                  <td className={cn('px-4 py-3 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{item.title}</td>
                  <td className={cn('px-4 py-3 text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>{item.platform}</td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600')}>
                      {item.type}
                    </span>
                  </td>
                  <td className={cn('px-4 py-3 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{item.reach}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-sm font-bold', parseFloat(item.engagement) >= 6 ? 'text-emerald-500' : 'text-blue-500')}>
                      {item.engagement}
                    </span>
                  </td>
                  <td className={cn('px-4 py-3 text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>{item.saves.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
