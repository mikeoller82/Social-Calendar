// src/components/Dashboard.tsx  (tRPC-powered — replaces hardcoded mock stats)
import { useState } from 'react';
import { TrendingUp, Eye, Zap, ArrowUpRight, ArrowDownRight, Sparkles, Target, Globe, RefreshCw } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { cn } from '@/utils/cn';
import { trpc } from '@/router';
import type { EngagementByTime } from '@/types/ai';

interface DashboardProps {
  darkMode: boolean;
  setActiveTab: (tab: string) => void;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function fmtPct(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
}

export function Dashboard({ darkMode, setActiveTab }: DashboardProps) {
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(7);

  const stats      = trpc.dashboard.stats.useQuery({ periodDays: timeRange }, { refetchInterval: 60_000 });
  const timeseries = trpc.dashboard.engagementTimeseries.useQuery({ days: timeRange });
  const platforms  = trpc.dashboard.platformBreakdown.useQuery();
  const pillars    = trpc.dashboard.contentPillars.useQuery();
  const weekly     = trpc.dashboard.weeklyGrowth.useQuery();
  const heatmap    = trpc.dashboard.engagementHeatmap.useQuery();
  const trending   = trpc.dashboard.trendingTopics.useQuery({ limit: 6 });

  const triggerRefresh = trpc.dashboard.triggerStatsRefresh.useMutation({
    onSuccess: () => { stats.refetch(); timeseries.refetch(); },
  });

  const kpis = [
    { label: 'Trending Topics',   value: stats.data ? String(stats.data.trendingTopicsCount)            : '—', change: stats.data ? fmtPct(stats.data.trendingTopicsChange)   : '—', up: (stats.data?.trendingTopicsChange   ?? 0) >= 0, icon: TrendingUp, color: 'violet'  },
    { label: 'Content Generated', value: stats.data ? String(stats.data.contentGeneratedCount)          : '—', change: stats.data ? fmtPct(stats.data.contentGeneratedChange) : '—', up: (stats.data?.contentGeneratedChange ?? 0) >= 0, icon: Sparkles,   color: 'blue'    },
    { label: 'Total Reach',       value: stats.data ? fmt(stats.data.totalReach)                        : '—', change: stats.data ? fmtPct(stats.data.totalReachChange)       : '—', up: (stats.data?.totalReachChange       ?? 0) >= 0, icon: Eye,        color: 'emerald' },
    { label: 'Engagement Rate',   value: stats.data ? `${stats.data.engagementRate.toFixed(1)}%`        : '—', change: stats.data ? fmtPct(stats.data.engagementRateChange)   : '—', up: (stats.data?.engagementRateChange   ?? 0) >= 0, icon: Target,     color: 'amber'   },
  ];

  const colorMap: Record<string, { bg: string; darkBg: string; text: string }> = {
    violet:  { bg: 'bg-violet-50',  darkBg: 'bg-violet-950/30',  text: 'text-violet-600' },
    blue:    { bg: 'bg-blue-50',    darkBg: 'bg-blue-950/30',    text: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-50', darkBg: 'bg-emerald-950/30', text: 'text-emerald-600' },
    amber:   { bg: 'bg-amber-50',   darkBg: 'bg-amber-950/30',   text: 'text-amber-600' },
  };

  const DOW_KEYS: Array<keyof EngagementByTime> = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const isLoading = stats.isLoading || timeseries.isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Dashboard</h1>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>
            Welcome back! Here&apos;s your trend intelligence overview.
            {stats.data?.lastUpdated && <span className="ml-2 text-gray-400">· Updated {new Date(stats.data.lastUpdated).toLocaleTimeString()}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => triggerRefresh.mutate()} disabled={triggerRefresh.isPending} title="Refresh"
            className={cn('flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition', darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50')}>
            <RefreshCw className={cn('h-4 w-4', triggerRefresh.isPending && 'animate-spin')} />
          </button>
          <button onClick={() => setActiveTab('trends')} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25">
            <TrendingUp className="h-4 w-4" />Research Trends
          </button>
          <button onClick={() => setActiveTab('generator')} className={cn('flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition', darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50')}>
            <Sparkles className="h-4 w-4" />Generate Content
          </button>
        </div>
      </div>

      {stats.data?.isStale && (
        <div className={cn('flex items-center gap-3 rounded-xl border px-4 py-3 text-sm', darkMode ? 'border-amber-900/50 bg-amber-950/20 text-amber-300' : 'border-amber-200 bg-amber-50 text-amber-700')}>
          <Zap className="h-4 w-4 shrink-0" />
          No stats yet — click refresh or wait for the scheduled rollup (runs every 6 hours).
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((stat) => {
          const colors = colorMap[stat.color];
          return (
            <div key={stat.label} className={cn('rounded-2xl border p-5 transition-all hover:shadow-lg', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
              <div className="flex items-start justify-between">
                <div className={cn('rounded-xl p-2.5', darkMode ? colors.darkBg : colors.bg)}>
                  <stat.icon className={cn('h-5 w-5', colors.text)} />
                </div>
                {isLoading
                  ? <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
                  : (
                    <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                      stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
                      darkMode && (stat.up ? 'bg-emerald-950/50 text-emerald-400' : 'bg-red-950/50 text-red-400')
                    )}>
                      {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.change}
                    </span>
                  )}
              </div>
              <div className="mt-4">
                {isLoading
                  ? <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
                  : <p className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{stat.value}</p>}
                <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Range */}
      <div className="flex items-center gap-2">
        <span className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Time range:</span>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {([7, 30, 90] as const).map((d) => (
            <button key={d} onClick={() => setTimeRange(d)}
              className={cn('rounded-md px-3 py-1 text-xs font-medium transition',
                timeRange === d ? 'bg-white text-gray-900 shadow-sm' : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-900')}>
              {d}D
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={cn('col-span-2 rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
          <div className="mb-4">
            <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Engagement Overview</h3>
            <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Weekly performance metrics</p>
          </div>
          {timeseries.isLoading ? (
            <div className="flex h-[280px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" /></div>
          ) : timeseries.data && timeseries.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={timeseries.data}>
                <defs>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} /></linearGradient>
                  <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3B82F6" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f3f4f6'} />
                <XAxis dataKey="day" stroke={darkMode ? '#6B7280' : '#9CA3AF'} fontSize={12} />
                <YAxis stroke={darkMode ? '#6B7280' : '#9CA3AF'} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="engagement" stroke="#8B5CF6" strokeWidth={2} fill="url(#engGrad)" />
                <Area type="monotone" dataKey="reach" stroke="#3B82F6" strokeWidth={2} fill="url(#reachGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className={cn('flex h-[280px] flex-col items-center justify-center gap-2', darkMode ? 'text-gray-500' : 'text-gray-400')}>
              <Eye className="h-8 w-8 opacity-30" /><p className="text-sm">No analytics data yet.</p>
            </div>
          )}
        </div>

        <div className={cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
          <h3 className={cn('mb-1 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Platform Mix</h3>
          <p className={cn('mb-4 text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Content distribution</p>
          {platforms.data && platforms.data.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart><Pie data={platforms.data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                  {platforms.data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-2">
                {platforms.data.map((p) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} /><span className={cn('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>{p.name}</span></div>
                    <span className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{p.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className={cn('flex h-40 items-center justify-center text-sm', darkMode ? 'text-gray-500' : 'text-gray-400')}>No platform data yet</div>}
        </div>
      </div>

      {/* Trending + Pillars */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={cn('col-span-2 rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>🔥 Top Trending Topics</h3><p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Highest scoring opportunities right now</p></div>
            <button onClick={() => setActiveTab('trends')} className="text-sm font-medium text-violet-500 hover:text-violet-600">View All →</button>
          </div>
          {trending.isLoading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />)}</div>
          ) : trending.data && trending.data.length > 0 ? (
            <div className="space-y-3">
              {trending.data.map((trend, i) => (
                <div key={trend.id} className={cn('flex items-center gap-4 rounded-xl p-3 transition', darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50')}>
                  <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold', i < 3 ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white' : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500')}>{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className={cn('truncate text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{trend.topic}</p>
                    <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>{trend.platforms.join(' · ')} · {trend.volume} searches</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={cn('text-sm font-bold', trend.score >= 90 ? 'text-violet-500' : trend.score >= 80 ? 'text-blue-500' : 'text-emerald-500')}>{trend.score}</div>
                      <div className={cn('text-[10px]', darkMode ? 'text-gray-500' : 'text-gray-400')}>score</div>
                    </div>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', trend.longevity === 'evergreen' ? 'bg-emerald-100 text-emerald-700' : trend.longevity === 'mid-term' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')}>{trend.longevity}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={cn('flex flex-col items-center gap-2 py-8 text-center', darkMode ? 'text-gray-500' : 'text-gray-400')}>
              <TrendingUp className="h-8 w-8 opacity-30" /><p className="text-sm">No trends yet.</p>
              <button onClick={() => setActiveTab('trends')} className="mt-1 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white">Run Your First Research →</button>
            </div>
          )}
        </div>

        <div className={cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
          <h3 className={cn('mb-1 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Content Strategy Mix</h3>
          <p className={cn('mb-4 text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Optimal pillar balance</p>
          <div className="space-y-4">
            {(pillars.data ?? []).map((pillar) => (
              <div key={pillar.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className={cn('text-sm font-medium capitalize', darkMode ? 'text-gray-300' : 'text-gray-700')}>{pillar.name}</span>
                  <span className={cn('text-sm font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{pillar.value}%</span>
                </div>
                <div className={cn('h-2 rounded-full', darkMode ? 'bg-gray-800' : 'bg-gray-100')}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pillar.value}%`, backgroundColor: pillar.color }} />
                </div>
              </div>
            ))}
            {!pillars.data?.length && <p className={cn('text-sm', darkMode ? 'text-gray-500' : 'text-gray-400')}>Generate content to see breakdown</p>}
          </div>
          <div className="mt-6">
            <h4 className={cn('mb-3 text-sm font-semibold', darkMode ? 'text-gray-300' : 'text-gray-700')}>Weekly Growth</h4>
            {weekly.data && weekly.data.length > 0 ? (
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={weekly.data}><Bar dataKey="followers" fill="#8B5CF6" radius={[4, 4, 0, 0]} /><Tooltip contentStyle={{ backgroundColor: darkMode ? '#1F2937' : '#fff', border: 'none', borderRadius: '8px' }} /></BarChart>
              </ResponsiveContainer>
            ) : <div className={cn('flex h-20 items-center justify-center text-sm', darkMode ? 'text-gray-500' : 'text-gray-400')}>No weekly data yet</div>}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className={cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
        <div className="mb-4 flex items-center justify-between">
          <div><h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>📊 Best Posting Times</h3><p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>AI-optimized engagement heatmap</p></div>
          <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-gray-400" /><span className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>EST (UTC-5)</span></div>
        </div>
        {heatmap.data && heatmap.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>
                <th className={cn('px-3 py-2 text-left text-xs font-medium', darkMode ? 'text-gray-500' : 'text-gray-400')}>Time</th>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => <th key={d} className={cn('px-3 py-2 text-center text-xs font-medium', darkMode ? 'text-gray-500' : 'text-gray-400')}>{d}</th>)}
              </tr></thead>
              <tbody>
                {heatmap.data.map((row) => (
                  <tr key={row.time}>
                    <td className={cn('px-3 py-2 text-xs font-medium', darkMode ? 'text-gray-400' : 'text-gray-500')}>{row.time}</td>
                    {DOW_KEYS.map((key) => {
                      const val = row[key] as number;
                      return (
                        <td key={key} className="px-1 py-1">
                          <div className={cn('mx-auto flex h-8 w-full items-center justify-center rounded-lg text-xs font-medium',
                            val >= 80 ? 'bg-violet-500 text-white' : val >= 60 ? 'bg-violet-400/60 text-white' : val >= 40 ? (darkMode ? 'bg-violet-900/40 text-violet-300' : 'bg-violet-100 text-violet-700') : darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400'
                          )}>{val}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={cn('flex h-32 items-center justify-center text-sm', darkMode ? 'text-gray-500' : 'text-gray-400')}>Heatmap data will appear after workspace is seeded</div>
        )}
      </div>
    </div>
  );
}
