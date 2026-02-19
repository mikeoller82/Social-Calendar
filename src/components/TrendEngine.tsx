import { useState } from 'react';
import { Search, TrendingUp, Filter, Zap, ArrowUpRight, Loader2, Globe, Users, Palette, Target } from 'lucide-react';
import { cn } from '@/utils/cn';
import { trendingTopics, nicheOptions, audienceOptions, toneOptions, marketOptions, platformIcons } from '@/data/mockData';

interface TrendEngineProps {
  darkMode: boolean;
}

export function TrendEngine({ darkMode }: TrendEngineProps) {
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [market, setMarket] = useState('');
  const [tone, setTone] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [filterLongevity, setFilterLongevity] = useState('All');

  const handleResearch = () => {
    setIsResearching(true);
    setTimeout(() => {
      setIsResearching(false);
      setShowResults(true);
    }, 2500);
  };

  const filteredTopics = trendingTopics.filter(t => {
    if (filterPlatform !== 'All' && !t.platforms.includes(filterPlatform)) return false;
    if (filterLongevity !== 'All' && t.longevity !== filterLongevity) return false;
    return true;
  });

  const platforms = ['All', 'Instagram', 'TikTok', 'LinkedIn', 'X', 'YouTube', 'Reddit'];

  const card = cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white');
  const label = cn('mb-1.5 block text-sm font-medium', darkMode ? 'text-gray-300' : 'text-gray-700');
  const select = cn('w-full rounded-xl border px-3 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500',
    darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-900');

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>🔎 Trend Intelligence Engine</h1>
        <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>AI-powered trend research across all major platforms</p>
      </div>

      {/* Research Config */}
      <div className={card}>
        <h3 className={cn('mb-4 flex items-center gap-2 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
          <Target className="h-5 w-5 text-violet-500" />
          Research Configuration
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={label}><Globe className="mr-1 inline h-3.5 w-3.5" />Niche / Business</label>
            <select className={select} value={niche} onChange={e => setNiche(e.target.value)}>
              <option value="">Select niche...</option>
              {nicheOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className={label}><Users className="mr-1 inline h-3.5 w-3.5" />Target Audience</label>
            <select className={select} value={audience} onChange={e => setAudience(e.target.value)}>
              <option value="">Select audience...</option>
              {audienceOptions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className={label}><Globe className="mr-1 inline h-3.5 w-3.5" />Geographic Market</label>
            <select className={select} value={market} onChange={e => setMarket(e.target.value)}>
              <option value="">Select market...</option>
              {marketOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={label}><Palette className="mr-1 inline h-3.5 w-3.5" />Brand Tone</label>
            <select className={select} value={tone} onChange={e => setTone(e.target.value)}>
              <option value="">Select tone...</option>
              {toneOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={handleResearch}
          disabled={isResearching}
          className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40 disabled:opacity-50"
        >
          {isResearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {isResearching ? 'Researching Trends...' : 'Research Trends'}
        </button>
      </div>

      {/* Animated Research Progress */}
      {isResearching && (
        <div className={card}>
          <div className="flex flex-col items-center py-8">
            <div className="relative mb-4">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
              <Zap className="absolute inset-0 m-auto h-6 w-6 text-violet-500" />
            </div>
            <p className={cn('mb-2 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Analyzing Trends Across Platforms...</p>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center sm:grid-cols-7">
              {['Google Trends', 'X / Twitter', 'Instagram', 'TikTok', 'YouTube', 'Reddit', 'LinkedIn'].map((p, i) => (
                <div key={p} className={cn('rounded-lg p-2 text-xs transition-opacity', darkMode ? 'bg-gray-800' : 'bg-gray-50')}
                  style={{ animationDelay: `${i * 0.3}s` }}>
                  <div className={cn('font-medium', darkMode ? 'text-gray-300' : 'text-gray-700')}>{p}</div>
                  <div className="mt-1 text-violet-500">Scanning...</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && !isResearching && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Filter className={cn('h-4 w-4', darkMode ? 'text-gray-400' : 'text-gray-500')} />
            <div className="flex flex-wrap gap-1.5">
              {platforms.map(p => (
                <button key={p} onClick={() => setFilterPlatform(p)}
                  className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition',
                    filterPlatform === p
                      ? 'bg-violet-600 text-white'
                      : darkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {p !== 'All' && platformIcons[p] ? `${platformIcons[p]} ` : ''}{p}
                </button>
              ))}
            </div>
            <div className="mx-2 h-4 w-px bg-gray-300" />
            {['All', 'evergreen', 'mid-term', 'short-term'].map(l => (
              <button key={l} onClick={() => setFilterLongevity(l)}
                className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition',
                  filterLongevity === l
                    ? 'bg-violet-600 text-white'
                    : darkMode ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {l === 'All' ? 'All Types' : l}
              </button>
            ))}
          </div>

          {/* Trend Cards */}
          <div className="space-y-3">
            {filteredTopics.map((trend, i) => (
              <div key={trend.id} className={cn(
                'group rounded-2xl border p-4 transition-all hover:shadow-lg',
                darkMode ? 'border-gray-800 bg-gray-900/50 hover:border-gray-700' : 'border-gray-100 bg-white hover:border-violet-200'
              )}>
                <div className="flex flex-wrap items-start gap-4">
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold',
                    i < 3 ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white' : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                  )}>
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>{trend.topic}</h4>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium',
                        trend.longevity === 'evergreen' ? 'bg-emerald-100 text-emerald-700' :
                        trend.longevity === 'mid-term' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      )}>
                        {trend.longevity}
                      </span>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600')}>
                        {trend.category}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                      <span className={cn(darkMode ? 'text-gray-400' : 'text-gray-500')}>
                        <TrendingUp className="mr-1 inline h-3 w-3 text-emerald-500" />+{trend.growth}% growth
                      </span>
                      <span className={cn(darkMode ? 'text-gray-400' : 'text-gray-500')}>📊 {trend.volume} searches</span>
                      <span className={cn(darkMode ? 'text-gray-400' : 'text-gray-500')}>
                        {trend.platforms.map(p => platformIcons[p] || p).join(' ')}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {trend.keywords.map(kw => (
                        <span key={kw} className={cn('rounded-md px-2 py-0.5 text-[10px]',
                          darkMode ? 'bg-violet-950/50 text-violet-300' : 'bg-violet-50 text-violet-600'
                        )}>
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Score */}
                    <div className="relative h-14 w-14">
                      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="24" stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth="4" fill="none" />
                        <circle cx="28" cy="28" r="24" stroke={trend.score >= 90 ? '#8B5CF6' : trend.score >= 80 ? '#3B82F6' : '#10B981'}
                          strokeWidth="4" fill="none" strokeDasharray={`${(trend.score / 100) * 150.8} 150.8`} strokeLinecap="round" />
                      </svg>
                      <span className={cn('absolute inset-0 flex items-center justify-center text-sm font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
                        {trend.score}
                      </span>
                    </div>
                    <button className="rounded-xl bg-violet-600 p-2 text-white opacity-0 transition group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
