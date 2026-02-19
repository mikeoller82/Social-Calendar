import {
  LayoutDashboard, TrendingUp, Calendar, Sparkles, BarChart3,
  Clock, Settings, ChevronLeft, ChevronRight, Zap,
  Moon, Sun, LogOut, Crown
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  credits: number;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'trends', label: 'Trend Engine', icon: TrendingUp },
  { id: 'calendar', label: 'Content Calendar', icon: Calendar },
  { id: 'generator', label: 'AI Generator', icon: Sparkles },
  { id: 'scheduling', label: 'Scheduling', icon: Clock },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const bottomItems = [
  { id: 'pricing', label: 'Upgrade Plan', icon: Crown },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, darkMode, setDarkMode, credits }: SidebarProps) {
  return (
    <aside className={cn(
      'fixed left-0 top-0 z-40 flex h-full flex-col border-r transition-all duration-300',
      darkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white',
      collapsed ? 'w-[68px]' : 'w-[260px]'
    )}>
      {/* Logo */}
      <div className={cn('flex h-16 items-center border-b px-4', darkMode ? 'border-gray-800' : 'border-gray-200')}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className={cn('text-sm font-bold leading-tight', darkMode ? 'text-white' : 'text-gray-900')}>
                TrendPlanner
              </h1>
              <p className="text-[10px] font-medium text-violet-500">PRO</p>
            </div>
          )}
        </div>
      </div>

      {/* Credits */}
      {!collapsed && (
        <div className="px-3 pt-4">
          <div className={cn(
            'rounded-xl p-3',
            darkMode ? 'bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border border-violet-900/50' : 'bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100'
          )}>
            <div className="flex items-center justify-between">
              <span className={cn('text-xs font-medium', darkMode ? 'text-violet-300' : 'text-violet-700')}>AI Credits</span>
              <span className={cn('text-xs font-bold', darkMode ? 'text-violet-200' : 'text-violet-800')}>{credits}/500</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-violet-200/30">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${(credits / 500) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {!collapsed && <p className={cn('mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider', darkMode ? 'text-gray-500' : 'text-gray-400')}>Main</p>}
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                activeTab === item.id
                  ? darkMode
                    ? 'bg-violet-600/20 text-violet-300 shadow-sm'
                    : 'bg-violet-50 text-violet-700 shadow-sm'
                  : darkMode
                    ? 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className={cn('h-[18px] w-[18px] shrink-0', activeTab === item.id ? 'text-violet-500' : '')} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && activeTab === item.id && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className={cn('border-t px-3 py-3', darkMode ? 'border-gray-800' : 'border-gray-200')}>
        {bottomItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              item.id === 'pricing'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 mb-1'
                : darkMode ? 'text-gray-400 hover:bg-gray-900 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              collapsed && 'justify-center px-2'
            )}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
            darkMode ? 'text-gray-400 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-50',
            collapsed && 'justify-center px-2'
          )}
        >
          {darkMode ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
            darkMode ? 'text-gray-400 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-50',
            collapsed && 'justify-center px-2'
          )}
        >
          {collapsed ? <ChevronRight className="h-[18px] w-[18px]" /> : <ChevronLeft className="h-[18px] w-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* User */}
        {!collapsed && (
          <div className={cn('mt-3 flex items-center gap-3 rounded-xl p-3', darkMode ? 'bg-gray-900' : 'bg-gray-50')}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn('truncate text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>Jane Doe</p>
              <p className={cn('truncate text-xs', darkMode ? 'text-gray-500' : 'text-gray-500')}>Pro Plan</p>
            </div>
            <LogOut className={cn('h-4 w-4 shrink-0 cursor-pointer', darkMode ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600')} />
          </div>
        )}
      </div>
    </aside>
  );
}
