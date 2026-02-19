import { useState } from 'react';
import { Clock, Calendar, Globe, Download, Upload, ChevronRight, Zap, GripVertical, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { sampleCalendar, platformIcons } from '@/data/mockData';

interface SchedulingProps {
  darkMode: boolean;
}

export function Scheduling({ darkMode }: SchedulingProps) {
  const [timezone, setTimezone] = useState('America/New_York');
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [scheduledItems, setScheduledItems] = useState<Set<number>>(new Set());

  const upcomingPosts = sampleCalendar.slice(0, 14);

  const card = cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white');

  const handleSchedule = (id: number) => {
    setScheduledItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkSchedule = () => {
    const allIds = new Set(upcomingPosts.map(p => p.id));
    setScheduledItems(allIds);
  };

  const handleExport = () => {
    const events = sampleCalendar.map(e => {
      const start = new Date(`${e.date}T${convertTo24h(e.bestTime)}:00`);
      const end = new Date(start.getTime() + 30 * 60000);
      return `BEGIN:VEVENT\nDTSTART:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nDTEND:${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nSUMMARY:${e.platform} - ${e.theme}\nDESCRIPTION:${e.postType} | ${e.contentPillar}\nEND:VEVENT`;
    });
    const ical = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TrendPlanner//EN\n${events.join('\n')}\nEND:VCALENDAR`;
    const blob = new Blob([ical], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  function convertTo24h(time: string): string {
    const [t, period] = time.split(' ');
    const [hours, minutes] = t.split(':');
    let h = parseInt(hours);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minutes}`;
  }

  const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney',
  ];

  const integrations = [
    { name: 'Buffer', status: 'connected', color: 'emerald' },
    { name: 'Hootsuite', status: 'available', color: 'gray' },
    { name: 'Later', status: 'available', color: 'gray' },
    { name: 'Sprout Social', status: 'available', color: 'gray' },
    { name: 'Google Calendar', status: 'connected', color: 'emerald' },
    { name: 'Notion', status: 'available', color: 'gray' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>⏰ Smart Scheduling Engine</h1>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>AI-powered posting schedule with auto-optimization</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleBulkSchedule}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25"
          >
            <Zap className="h-4 w-4" />
            Bulk Schedule All
          </button>
          <button onClick={handleExport}
            className={cn('flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium',
              darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            )}
          >
            <Download className="h-4 w-4" />
            Export .ics
          </button>
        </div>
      </div>

      {/* Settings Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className={card}>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-violet-500" />
            <span className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Time Zone</span>
          </div>
          <select value={timezone} onChange={e => setTimezone(e.target.value)}
            className={cn('w-full rounded-xl border px-3 py-2.5 text-sm',
              darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-900'
            )}
          >
            {timezones.map(tz => <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className={card}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-violet-500" />
            <span className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>AI Optimization</span>
          </div>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>
            Times auto-adjusted for peak engagement based on your audience analytics
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-3 w-6 rounded-full bg-violet-600 relative">
              <div className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-white" />
            </div>
            <span className="text-xs text-violet-500 font-medium">Enabled</span>
          </div>
        </div>
        <div className={card}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-violet-500" />
            <span className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Schedule Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{scheduledItems.size}</p>
              <p className={cn('text-xs', darkMode ? 'text-gray-400' : 'text-gray-500')}>Scheduled</p>
            </div>
            <div>
              <p className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{upcomingPosts.length - scheduledItems.size}</p>
              <p className={cn('text-xs', darkMode ? 'text-gray-400' : 'text-gray-500')}>Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Queue */}
      <div className={cn('rounded-2xl border', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white')}>
        <div className={cn('flex items-center justify-between border-b p-4', darkMode ? 'border-gray-800' : 'border-gray-100')}>
          <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>📋 Scheduling Queue</h3>
          <span className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Drag to reorder priority</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {upcomingPosts.map(post => {
            const isScheduled = scheduledItems.has(post.id);
            return (
              <div key={post.id}
                draggable
                onDragStart={() => setDraggedItem(post.id)}
                onDragEnd={() => setDraggedItem(null)}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 transition',
                  draggedItem === post.id ? 'opacity-50' : '',
                  darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                )}
              >
                <GripVertical className={cn('h-4 w-4 shrink-0 cursor-grab', darkMode ? 'text-gray-600' : 'text-gray-300')} />
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg',
                  darkMode ? 'bg-gray-800' : 'bg-gray-100'
                )}>
                  {platformIcons[post.platform] || '📱'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{post.theme}</span>
                    <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                      darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                    )}>{post.postType}</span>
                  </div>
                  <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>
                    {post.platform} · Day {post.day} · {post.bestTime}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-xs font-medium', darkMode ? 'text-gray-400' : 'text-gray-500')}>
                    {post.date}
                  </span>
                  <button onClick={() => handleSchedule(post.id)}
                    className={cn('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition',
                      isScheduled
                        ? 'bg-emerald-100 text-emerald-700'
                        : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-violet-900/30 hover:text-violet-300' : 'bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600'
                    )}
                  >
                    {isScheduled ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {isScheduled ? 'Scheduled' : 'Schedule'}
                  </button>
                  <ChevronRight className={cn('h-4 w-4', darkMode ? 'text-gray-600' : 'text-gray-300')} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integrations */}
      <div className={card}>
        <div className="mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-violet-500" />
          <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Integrations</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map(int => (
            <div key={int.name} className={cn('flex items-center justify-between rounded-xl border p-4',
              darkMode ? 'border-gray-700' : 'border-gray-200'
            )}>
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold',
                  int.status === 'connected'
                    ? 'bg-emerald-100 text-emerald-700'
                    : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                )}>
                  {int.name[0]}
                </div>
                <div>
                  <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{int.name}</p>
                  <p className={cn('text-xs capitalize', int.status === 'connected' ? 'text-emerald-500' : darkMode ? 'text-gray-500' : 'text-gray-400')}>
                    {int.status}
                  </p>
                </div>
              </div>
              <button className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition',
                int.status === 'connected'
                  ? darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                  : 'bg-violet-600 text-white hover:bg-violet-700'
              )}>
                {int.status === 'connected' ? 'Manage' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
