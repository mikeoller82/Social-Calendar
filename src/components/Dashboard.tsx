import { TrendingUp, Eye, Zap, ArrowUpRight, ArrowDownRight, Sparkles, Target, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { cn } from '@/utils/cn';
import { trendingTopics, analyticsData, platformBreakdown, contentPillarData, weeklyAnalytics, engagementByTime } from '@/data/mockData';

interface DashboardProps {
  darkMode: boolean;
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ darkMode, setActiveTab }: DashboardProps) {
  const stats = [
    { label: 'Trending Topics', value: '47', change: '+12%', up: true, icon: TrendingUp, color: 'violet' },
    { label: 'Content Generated', value: '128', change: '+23%', up: true, icon: Sparkles, color: 'blue' },
    { label: 'Total Reach', value: '2.4M', change: '+18%', up: true, icon: Eye, color: 'emerald' },
    { label: 'Engagement Rate', value: '4.2%', change: '-0.3%', up: false, icon: Target, color: 'amber' },
  ];

  const colorMap: Record<string, { bg: string; darkBg: string; text: string; icon: string }> = {
    violet: { bg: 'bg-violet-50', darkBg: 'bg-violet-950/30', text: 'text-violet-600', icon: 'bg-violet-100 text-violet-600' },
    blue: { bg: 'bg-blue-50', darkBg: 'bg-blue-950/30', text: 'text-blue-600', icon: 'bg-blue-100 text-blue-600' },
    emerald: { bg: 'bg-emerald-50', darkBg: 'bg-emerald-950/30', text: 'text-emerald-600', icon: 'bg-emerald-100 text-emerald-600' },
    amber: { bg: 'bg-amber-50', darkBg: 'bg-amber-950/30', text: 'text-amber-600', icon: 'bg-amber-100 text-amber-600' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Dashboard</h1>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Welcome back, Jane! Here&apos;s your trend intelligence overview.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('trends')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40"
          >
            <TrendingUp className="h-4 w-4" />
            Research Trends
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={cn('flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition',
              darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            )}
          >
            <Sparkles className="h-4 w-4" />
            Generate Content
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const colors = colorMap[stat.color];
          return (
            <div key={stat.label} className={cn(
              'rounded-2xl border p-5 transition-all hover:shadow-lg',
              darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white'
            )}>
              <div className="flex items-start justify-between">
                <div className={cn('rounded-xl p-2.5', darkMode ? colors.darkBg : colors.bg)}>
                  <stat.icon className={cn('h-5 w-5', colors.text)} />
                </div>
                <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
                  darkMode && (stat.up ? 'bg-emerald-950/50 text-emerald-400' : 'bg-red-950/50 text-red-400')
                )}>
                  {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{stat.value}</p>
                <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Engagement Chart */}
        <div className={cn('col-span-2 rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Engagement Overview</h3>
              <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Weekly performance metrics</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              {['7D', '30D', '90D'].map(period => (
                <button key={period} className={cn('rounded-md px-3 py-1 text-xs font-medium transition',
                  period === '7D'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-900'
                )}>
                  {period}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f3f4f6'} />
              <XAxis dataKey="day" stroke={darkMode ? '#6B7280' : '#9CA3AF'} fontSize={12} />
              <YAxis stroke={darkMode ? '#6B7280' : '#9CA3AF'} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
              <Area type="monotone" dataKey="engagement" stroke="#8B5CF6" strokeWidth={2} fill="url(#engGrad)" />
              <Area type="monotone" dataKey="reach" stroke="#3B82F6" strokeWidth={2} fill="url(#reachGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Breakdown */}
        <div className={cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
          <h3 className={cn('mb-1 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Platform Mix</h3>
          <p className={cn('mb-4 text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Content distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={platformBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                {platformBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {platformBreakdown.map(p => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className={cn('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>{p.name}</span>
                </div>
                <span className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending + Content Pillars Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Trends */}
        <div className={cn('col-span-2 rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>🔥 Top Trending Topics</h3>
              <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Highest scoring opportunities right now</p>
            </div>
            <button onClick={() => setActiveTab('trends')} className="text-sm font-medium text-violet-500 hover:text-violet-600">
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {trendingTopics.slice(0, 6).map((trend, i) => (
              <div key={trend.id} className={cn(
                'flex items-center gap-4 rounded-xl p-3 transition',
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
              )}>
                <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                  i < 3
                    ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white'
                    : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                )}>
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn('truncate text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{trend.topic}</p>
                  <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>
                    {trend.platforms.join(' · ')} · {trend.volume} searches
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={cn('text-sm font-bold', trend.score >= 90 ? 'text-violet-500' : trend.score >= 80 ? 'text-blue-500' : 'text-emerald-500')}>
                      {trend.score}
                    </div>
                    <div className={cn('text-[10px]', darkMode ? 'text-gray-500' : 'text-gray-400')}>score</div>
                  </div>
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium',
                    trend.longevity === 'evergreen' ? 'bg-emerald-100 text-emerald-700' :
                    trend.longevity === 'mid-term' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  )}>
                    {trend.longevity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Pillars */}
        <div className={cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
          <h3 className={cn('mb-1 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Content Strategy Mix</h3>
          <p className={cn('mb-4 text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Optimal pillar balance</p>
          <div className="space-y-4">
            {contentPillarData.map(pillar => (
              <div key={pillar.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className={cn('text-sm font-medium', darkMode ? 'text-gray-300' : 'text-gray-700')}>{pillar.name}</span>
                  <span className={cn('text-sm font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{pillar.value}%</span>
                </div>
                <div className={cn('h-2 rounded-full', darkMode ? 'bg-gray-800' : 'bg-gray-100')}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pillar.value}%`, backgroundColor: pillar.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className={cn('mt-6 rounded-xl p-4', darkMode ? 'bg-violet-950/30 border border-violet-900/50' : 'bg-violet-50 border border-violet-100')}>
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
              <div>
                <p className={cn('text-sm font-medium', darkMode ? 'text-violet-300' : 'text-violet-700')}>AI Recommendation</p>
                <p className={cn('mt-1 text-xs leading-relaxed', darkMode ? 'text-violet-400' : 'text-violet-600')}>
                  Increase authority content by 5% this week. Your audience responds well to data-driven posts.
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Performance */}
          <div className="mt-6">
            <h4 className={cn('mb-3 text-sm font-semibold', darkMode ? 'text-gray-300' : 'text-gray-700')}>Weekly Growth</h4>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={weeklyAnalytics}>
                <Bar dataKey="followers" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '8px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Best Posting Times */}
      <div className={cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>📊 Best Posting Times</h3>
            <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>AI-optimized engagement heatmap</p>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>EST (UTC-5)</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={cn('px-3 py-2 text-left text-xs font-medium', darkMode ? 'text-gray-500' : 'text-gray-400')}>Time</th>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <th key={day} className={cn('px-3 py-2 text-center text-xs font-medium', darkMode ? 'text-gray-500' : 'text-gray-400')}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {engagementByTime.map(row => (
                <tr key={row.time}>
                  <td className={cn('px-3 py-2 text-xs font-medium', darkMode ? 'text-gray-400' : 'text-gray-500')}>{row.time}</td>
                  {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat, row.sun].map((val, i) => (
                    <td key={i} className="px-1 py-1">
                      <div className={cn(
                        'mx-auto flex h-8 w-full items-center justify-center rounded-lg text-xs font-medium',
                        val >= 80 ? 'bg-violet-500 text-white' :
                        val >= 60 ? 'bg-violet-400/60 text-white' :
                        val >= 40 ? (darkMode ? 'bg-violet-900/40 text-violet-300' : 'bg-violet-100 text-violet-700') :
                        darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400'
                      )}>
                        {val}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
