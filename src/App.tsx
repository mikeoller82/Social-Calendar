import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { TrendEngine } from '@/components/TrendEngine';
import { CalendarView } from '@/components/CalendarView';
import { ContentGenerator } from '@/components/ContentGenerator';
import { Scheduling } from '@/components/Scheduling';
import { Analytics } from '@/components/Analytics';
import { Pricing } from '@/components/Pricing';
import {
  Zap, ChevronRight, Globe, Users, Palette, Target,
  ArrowRight, Sparkles, TrendingUp, Calendar, BarChart3,
  X, Menu, Bell, Search, Settings, User, Shield, Key,
  Monitor, Moon, Sun
} from 'lucide-react';
import { useBootstrapData } from '@/hooks/useBootstrapData';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [credits, setCredits] = useState(347);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { data } = useBootstrapData();
  const nicheOptions = data?.nicheOptions ?? [];
  const audienceOptions = data?.audienceOptions ?? [];
  const marketOptions = data?.marketOptions ?? [];
  const toneOptions = data?.toneOptions ?? [];

  // Onboarding state
  const [obNiche, setObNiche] = useState('');
  const [obAudience, setObAudience] = useState('');
  const [obMarket, setObMarket] = useState('');
  const [obTone, setObTone] = useState('');

  useEffect(() => {
    const savedOnboarding = localStorage.getItem('tp_onboarded');
    if (savedOnboarding) setShowOnboarding(false);
  }, []);

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('tp_onboarded', 'true');
  };

  const onboardingSteps = [
    {
      title: 'Welcome to TrendPlanner Pro',
      subtitle: 'Your AI-powered social media command center',
      icon: Zap,
    },
    {
      title: 'What\'s your niche?',
      subtitle: 'Help us find the most relevant trends for you',
      icon: Target,
    },
    {
      title: 'Who\'s your audience?',
      subtitle: 'We\'ll optimize content for your ideal followers',
      icon: Users,
    },
    {
      title: 'Your brand voice',
      subtitle: 'Set the tone for all AI-generated content',
      icon: Palette,
    },
    {
      title: 'You\'re all set! 🎉',
      subtitle: 'Your personalized trend intelligence is ready',
      icon: Sparkles,
    },
  ];

  const notifications = [
    { title: '🔥 New trend detected', desc: 'AI Automation Workflows is surging +267%', time: '2m ago' },
    { title: '📅 3 posts ready to schedule', desc: 'Your content for this week is generated', time: '1h ago' },
    { title: '📊 Weekly report ready', desc: 'Engagement up 18% from last week', time: '3h ago' },
    { title: '⚡ Credits running low', desc: '153 credits remaining this month', time: '1d ago' },
  ];

  // Onboarding Modal
  if (showOnboarding) {
    const step = onboardingSteps[onboardingStep];
    const selectClass = cn('w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500',
      'border-gray-200 bg-white text-gray-900');

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {onboardingSteps.map((_, i) => (
              <div key={i} className={cn('h-2 rounded-full transition-all duration-500',
                i === onboardingStep ? 'w-10 bg-violet-600' : i < onboardingStep ? 'w-6 bg-violet-400' : 'w-6 bg-gray-200'
              )} />
            ))}
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-violet-500/10">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
                <step.icon className="h-8 w-8 text-white" />
              </div>
            </div>

            <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">{step.title}</h2>
            <p className="mb-8 text-center text-sm text-gray-500">{step.subtitle}</p>

            {/* Step Content */}
            {onboardingStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: TrendingUp, label: 'Trend Engine', desc: 'Real-time insights' },
                    { icon: Calendar, label: '30-Day Calendar', desc: 'Auto-generated' },
                    { icon: Sparkles, label: 'AI Content', desc: 'Platform-optimized' },
                    { icon: BarChart3, label: 'Analytics', desc: 'Performance tracking' },
                  ].map(feature => (
                    <div key={feature.label} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                      <div className="rounded-lg bg-violet-50 p-2">
                        <feature.icon className="h-4 w-4 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{feature.label}</p>
                        <p className="text-xs text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {onboardingStep === 1 && (
              <div>
                <select value={obNiche} onChange={e => setObNiche(e.target.value)} className={selectClass}>
                  <option value="">Choose your niche...</option>
                  {nicheOptions.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <div className="mt-4 flex flex-wrap gap-2">
                  {nicheOptions.slice(0, 6).map(n => (
                    <button key={n} onClick={() => setObNiche(n)}
                      className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition',
                        obNiche === n ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div>
                <select value={obAudience} onChange={e => setObAudience(e.target.value)} className={selectClass}>
                  <option value="">Choose your target audience...</option>
                  {audienceOptions.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    <Globe className="mr-1 inline h-3.5 w-3.5" />Geographic Market
                  </label>
                  <select value={obMarket} onChange={e => setObMarket(e.target.value)} className={selectClass}>
                    <option value="">Choose your market...</option>
                    {marketOptions.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="grid grid-cols-2 gap-2">
                {toneOptions.map(t => (
                  <button key={t} onClick={() => setObTone(t)}
                    className={cn('rounded-xl border p-3 text-left text-sm font-medium transition',
                      obTone === t ? 'border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-500/20' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {onboardingStep === 4 && (
              <div className="space-y-3">
                {[
                  { label: 'Niche', value: obNiche || 'SaaS & Tech' },
                  { label: 'Audience', value: obAudience || 'Millennials (25-40)' },
                  { label: 'Market', value: obMarket || 'United States' },
                  { label: 'Tone', value: obTone || 'Educational' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
                <div className="rounded-xl bg-violet-50 p-4 text-center">
                  <p className="text-sm font-medium text-violet-700">🎁 You get 500 free AI credits to start!</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex gap-3">
              {onboardingStep > 0 && (
                <button onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => onboardingStep < 4 ? setOnboardingStep(onboardingStep + 1) : completeOnboarding()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40"
              >
                {onboardingStep < 4 ? 'Continue' : 'Launch Dashboard'}
                {onboardingStep < 4 ? <ChevronRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </div>

            {onboardingStep < 4 && (
              <button onClick={completeOnboarding} className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600">
                Skip onboarding
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Settings Page
  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>⚙️ Settings</h1>
        <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Manage your account and preferences</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <div className={cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-violet-500" />
              <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Profile</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold text-white">JD</div>
                <div>
                  <p className={cn('font-medium', darkMode ? 'text-white' : 'text-gray-900')}>Jane Doe</p>
                  <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>jane@example.com</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn('mb-1 block text-sm font-medium', darkMode ? 'text-gray-300' : 'text-gray-700')}>First Name</label>
                  <input defaultValue="Jane" className={cn('w-full rounded-xl border px-3 py-2.5 text-sm',
                    darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-900'
                  )} />
                </div>
                <div>
                  <label className={cn('mb-1 block text-sm font-medium', darkMode ? 'text-gray-300' : 'text-gray-700')}>Last Name</label>
                  <input defaultValue="Doe" className={cn('w-full rounded-xl border px-3 py-2.5 text-sm',
                    darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-900'
                  )} />
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className={cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="h-5 w-5 text-violet-500" />
              <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Appearance</h3>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDarkMode(false)}
                className={cn('flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition',
                  !darkMode ? 'border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-500/20' : 'border-gray-200 text-gray-600'
                )}
              >
                <Sun className="h-4 w-4" /> Light
              </button>
              <button onClick={() => setDarkMode(true)}
                className={cn('flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition',
                  darkMode ? 'border-violet-500 bg-violet-950/30 text-violet-300 ring-2 ring-violet-500/20' : 'border-gray-200 text-gray-600'
                )}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>
            </div>
          </div>

          {/* Security */}
          <div className={cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-violet-500" />
              <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Security</h3>
            </div>
            <div className="space-y-3">
              <button className={cn('flex w-full items-center justify-between rounded-xl border p-4 text-left transition',
                darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
              )}>
                <div className="flex items-center gap-3">
                  <Key className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>Change Password</p>
                    <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>Last changed 30 days ago</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className={cn('flex w-full items-center justify-between rounded-xl border p-4 text-left transition',
                darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
              )}>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>Two-Factor Authentication</p>
                    <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>Add extra security to your account</p>
                  </div>
                </div>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700')}>Off</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className={cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
            <h3 className={cn('mb-3 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Plan Details</h3>
            <div className={cn('rounded-xl p-4', darkMode ? 'bg-violet-950/30 border border-violet-900/50' : 'bg-violet-50 border border-violet-100')}>
              <p className={cn('text-sm font-bold', darkMode ? 'text-violet-200' : 'text-violet-800')}>Pro Plan</p>
              <p className={cn('text-xs', darkMode ? 'text-violet-400' : 'text-violet-600')}>$29/month · Renews Aug 15</p>
            </div>
            <button onClick={() => setActiveTab('pricing')} className="mt-3 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white">
              Manage Plan
            </button>
          </div>

          <div className={cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
            <h3 className={cn('mb-3 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Brand Settings</h3>
            <div className="space-y-3">
              {[
                { label: 'Niche', value: obNiche || 'SaaS & Tech' },
                { label: 'Audience', value: obAudience || 'Millennials' },
                { label: 'Market', value: obMarket || 'United States' },
                { label: 'Tone', value: obTone || 'Educational' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{s.label}</span>
                  <span className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard darkMode={darkMode} setActiveTab={setActiveTab} />;
      case 'trends': return <TrendEngine darkMode={darkMode} />;
      case 'calendar': return <CalendarView darkMode={darkMode} />;
      case 'generator': return <ContentGenerator darkMode={darkMode} credits={credits} setCredits={setCredits} />;
      case 'scheduling': return <Scheduling darkMode={darkMode} />;
      case 'analytics': return <Analytics darkMode={darkMode} />;
      case 'pricing': return <Pricing darkMode={darkMode} />;
      case 'settings': return renderSettings();
      default: return <Dashboard darkMode={darkMode} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className={cn('min-h-screen transition-colors duration-300', darkMode ? 'bg-gray-950' : 'bg-gray-50/50')}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-[260px]" onClick={e => e.stopPropagation()}>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }}
              collapsed={false}
              setCollapsed={setCollapsed}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              credits={credits}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          credits={credits}
        />
      </div>

      {/* Main Content */}
      <div className={cn('transition-all duration-300', collapsed ? 'lg:pl-[68px]' : 'lg:pl-[260px]')}>
        {/* Top Bar */}
        <header className={cn('sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-xl lg:px-6',
          darkMode ? 'border-gray-800 bg-gray-950/80' : 'border-gray-200 bg-white/80'
        )}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden">
              <Menu className={cn('h-5 w-5', darkMode ? 'text-gray-400' : 'text-gray-600')} />
            </button>
            <div className={cn('hidden items-center gap-2 rounded-xl border px-3 py-2 sm:flex',
              darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'
            )}>
              <Search className="h-4 w-4 text-gray-400" />
              <input
                placeholder="Search trends, content..."
                className={cn('w-48 bg-transparent text-sm outline-none placeholder-gray-400 lg:w-64',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)}
                className={cn('relative rounded-xl p-2.5 transition',
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                )}
              >
                <Bell className={cn('h-5 w-5', darkMode ? 'text-gray-400' : 'text-gray-500')} />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet-500" />
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className={cn('absolute right-0 top-12 w-80 rounded-2xl border p-2 shadow-xl',
                  darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
                )}>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Notifications</span>
                    <button onClick={() => setShowNotifications(false)}>
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  {notifications.map((n, i) => (
                    <div key={i} className={cn('rounded-xl p-3 transition cursor-pointer',
                      darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    )}>
                      <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{n.title}</p>
                      <p className={cn('text-xs', darkMode ? 'text-gray-400' : 'text-gray-500')}>{n.desc}</p>
                      <p className={cn('mt-1 text-[10px]', darkMode ? 'text-gray-600' : 'text-gray-400')}>{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setActiveTab('settings')}
              className={cn('rounded-xl p-2.5 transition', darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100')}
            >
              <Settings className={cn('h-5 w-5', darkMode ? 'text-gray-400' : 'text-gray-500')} />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white lg:hidden">
              JD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
