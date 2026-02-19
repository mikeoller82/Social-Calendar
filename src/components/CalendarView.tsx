import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Edit3, Download, ListFilter, LayoutGrid, List, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { sampleCalendar, platformIcons, type CalendarEvent } from '@/data/mockData';

interface CalendarViewProps {
  darkMode: boolean;
}

const pillarColors: Record<string, { bg: string; text: string; darkBg: string }> = {
  viral: { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'bg-purple-900/30' },
  authority: { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'bg-blue-900/30' },
  community: { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'bg-emerald-900/30' },
  conversion: { bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'bg-amber-900/30' },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-600' },
  scheduled: { bg: 'bg-violet-100', text: 'text-violet-700' },
  published: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  generating: { bg: 'bg-amber-100', text: 'text-amber-700' },
};

export function CalendarView({ darkMode }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);

  const weeks = [
    sampleCalendar.slice(0, 7),
    sampleCalendar.slice(7, 14),
    sampleCalendar.slice(14, 21),
    sampleCalendar.slice(21, 28),
    sampleCalendar.slice(28, 30),
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const card = cn('rounded-2xl border', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white');

  const handleExportCSV = () => {
    const headers = ['Day', 'Date', 'Platform', 'Post Type', 'Theme', 'Hook', 'Caption', 'Hashtags', 'CTA', 'Best Time', 'Pillar', 'Status'];
    const rows = sampleCalendar.map(e => [
      e.day, e.date, e.platform, e.postType, e.theme, e.hook,
      e.caption.replace(/\n/g, ' '), e.hashtags.join(' '), e.cta, e.bestTime, e.contentPillar, e.status
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-calendar.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>📅 30-Day Content Calendar</h1>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>AI-generated multi-platform content strategy</p>
        </div>
        <div className="flex gap-2">
          <div className={cn('flex rounded-xl border p-1', darkMode ? 'border-gray-700' : 'border-gray-200')}>
            {[
              { mode: 'month' as const, icon: LayoutGrid },
              { mode: 'week' as const, icon: ListFilter },
              { mode: 'list' as const, icon: List },
            ].map(v => (
              <button key={v.mode} onClick={() => setViewMode(v.mode)}
                className={cn('rounded-lg p-2 transition',
                  viewMode === v.mode ? 'bg-violet-600 text-white' : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <v.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <button onClick={handleExportCSV}
            className={cn('flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition',
              darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            )}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Content Pillar Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(pillarColors).map(([key, colors]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={cn('h-2.5 w-2.5 rounded-full', colors.bg)} />
            <span className={cn('text-xs capitalize', darkMode ? 'text-gray-400' : 'text-gray-500')}>{key}</span>
          </div>
        ))}
        <div className={cn('ml-4 text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>
          30 posts • 7 platforms • Strategic mix
        </div>
      </div>

      {/* Month Grid View */}
      {viewMode === 'month' && (
        <div className={cn(card, 'overflow-hidden p-0')}>
          <div className={cn('grid grid-cols-7 border-b', darkMode ? 'border-gray-800' : 'border-gray-100')}>
            {daysOfWeek.map(day => (
              <div key={day} className={cn('px-3 py-3 text-center text-xs font-semibold', darkMode ? 'text-gray-400' : 'text-gray-500')}>
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className={cn('grid grid-cols-7', wi < weeks.length - 1 && (darkMode ? 'border-b border-gray-800' : 'border-b border-gray-100'))}>
              {Array.from({ length: 7 }, (_, di) => {
                const event = week[di];
                if (!event) return (
                  <div key={`empty-${di}`} className={cn('min-h-[120px] border-r p-2', darkMode ? 'border-gray-800 bg-gray-950/50' : 'border-gray-50 bg-gray-50/50')} />
                );
                const pillar = pillarColors[event.contentPillar];
                return (
                  <div key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={cn(
                      'min-h-[120px] cursor-pointer border-r p-2 transition hover:shadow-inner',
                      darkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-violet-50/30',
                      di === 6 && 'border-r-0'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn('text-xs font-bold', darkMode ? 'text-gray-300' : 'text-gray-700')}>{event.day}</span>
                      <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-medium',
                        statusColors[event.status].bg, statusColors[event.status].text
                      )}>
                        {event.status}
                      </span>
                    </div>
                    <div className={cn('mt-1.5 rounded-lg p-1.5', darkMode ? pillar.darkBg : pillar.bg)}>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{platformIcons[event.platform] || '📱'}</span>
                        <span className={cn('truncate text-[10px] font-medium', pillar.text)}>{event.platform}</span>
                      </div>
                      <p className={cn('mt-0.5 truncate text-[10px]', darkMode ? 'text-gray-300' : 'text-gray-600')}>{event.theme}</p>
                      <p className={cn('mt-0.5 text-[9px]', darkMode ? 'text-gray-500' : 'text-gray-400')}>{event.postType} · {event.bestTime}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-1 flex-1 rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${event.engagementPrediction}%` }} />
                      </div>
                      <span className={cn('text-[9px]', darkMode ? 'text-gray-500' : 'text-gray-400')}>{event.engagementPrediction}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <button onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
              className={cn('rounded-lg border p-2 transition', darkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50')}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Week {currentWeek + 1} of 5</span>
            <button onClick={() => setCurrentWeek(Math.min(4, currentWeek + 1))}
              className={cn('rounded-lg border p-2 transition', darkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50')}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {(weeks[currentWeek] || []).map(event => {
              const pillar = pillarColors[event.contentPillar];
              return (
                <div key={event.id} onClick={() => setSelectedEvent(event)}
                  className={cn(card, 'cursor-pointer p-4 transition-all hover:shadow-lg')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{platformIcons[event.platform]}</span>
                      <div>
                        <span className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>{event.platform}</span>
                        <span className={cn('ml-2 text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>{event.postType}</span>
                      </div>
                    </div>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', pillar.bg, pillar.text)}>
                      {event.contentPillar}
                    </span>
                  </div>
                  <h4 className={cn('mt-3 text-sm font-medium', darkMode ? 'text-gray-200' : 'text-gray-800')}>{event.theme}</h4>
                  <p className={cn('mt-1 line-clamp-2 text-xs', darkMode ? 'text-gray-400' : 'text-gray-500')}>{event.hook}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3 text-violet-500" />
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{event.bestTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>Day {event.day}</span>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium',
                        statusColors[event.status].bg, statusColors[event.status].text
                      )}>{event.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {sampleCalendar.map(event => {
            const pillar = pillarColors[event.contentPillar];
            return (
              <div key={event.id} onClick={() => setSelectedEvent(event)}
                className={cn(
                  'flex cursor-pointer items-center gap-4 rounded-xl border p-3 transition hover:shadow-md',
                  darkMode ? 'border-gray-800 bg-gray-900/50 hover:border-gray-700' : 'border-gray-100 bg-white hover:border-violet-200'
                )}
              >
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                  darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                )}>
                  {event.day}
                </div>
                <span className="shrink-0 text-lg">{platformIcons[event.platform]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{event.theme}</span>
                    <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-medium', pillar.bg, pillar.text)}>{event.contentPillar}</span>
                  </div>
                  <p className={cn('truncate text-xs', darkMode ? 'text-gray-400' : 'text-gray-500')}>
                    {event.platform} · {event.postType} · {event.bestTime}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium',
                    statusColors[event.status].bg, statusColors[event.status].text
                  )}>{event.status}</span>
                  <button className={cn('rounded-lg p-1.5 transition', darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100')}>
                    <Eye className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <div className={cn('max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-6',
            darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
          )} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{platformIcons[selectedEvent.platform]}</span>
                <div>
                  <h2 className={cn('text-lg font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{selectedEvent.theme}</h2>
                  <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>
                    Day {selectedEvent.day} · {selectedEvent.platform} · {selectedEvent.postType}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedEvent(null)} className={cn('rounded-lg p-2 transition', darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100')}>
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className={cn('text-xs font-semibold uppercase tracking-wider', darkMode ? 'text-gray-400' : 'text-gray-500')}>Hook</label>
                <p className={cn('mt-1 text-sm italic', darkMode ? 'text-violet-300' : 'text-violet-600')}>"{selectedEvent.hook}"</p>
              </div>
              <div>
                <label className={cn('text-xs font-semibold uppercase tracking-wider', darkMode ? 'text-gray-400' : 'text-gray-500')}>Caption</label>
                <div className={cn('mt-1 whitespace-pre-wrap rounded-xl p-3 text-sm', darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-700')}>
                  {selectedEvent.caption}
                </div>
              </div>
              <div>
                <label className={cn('text-xs font-semibold uppercase tracking-wider', darkMode ? 'text-gray-400' : 'text-gray-500')}>Hashtags</label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selectedEvent.hashtags.map(h => (
                    <span key={h} className={cn('rounded-md px-2 py-1 text-xs', darkMode ? 'bg-violet-950/50 text-violet-300' : 'bg-violet-50 text-violet-600')}>{h}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className={cn('rounded-xl p-3', darkMode ? 'bg-gray-800' : 'bg-gray-50')}>
                  <p className={cn('text-[10px] font-semibold uppercase', darkMode ? 'text-gray-500' : 'text-gray-400')}>Best Time</p>
                  <p className={cn('mt-1 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{selectedEvent.bestTime}</p>
                </div>
                <div className={cn('rounded-xl p-3', darkMode ? 'bg-gray-800' : 'bg-gray-50')}>
                  <p className={cn('text-[10px] font-semibold uppercase', darkMode ? 'text-gray-500' : 'text-gray-400')}>CTA</p>
                  <p className={cn('mt-1 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{selectedEvent.cta}</p>
                </div>
                <div className={cn('rounded-xl p-3', darkMode ? 'bg-gray-800' : 'bg-gray-50')}>
                  <p className={cn('text-[10px] font-semibold uppercase', darkMode ? 'text-gray-500' : 'text-gray-400')}>Engagement</p>
                  <p className={cn('mt-1 text-sm font-bold text-violet-500')}>{selectedEvent.engagementPrediction}%</p>
                </div>
              </div>
              {selectedEvent.script && (
                <div>
                  <label className={cn('text-xs font-semibold uppercase tracking-wider', darkMode ? 'text-gray-400' : 'text-gray-500')}>Video Script</label>
                  <pre className={cn('mt-1 whitespace-pre-wrap rounded-xl p-3 font-mono text-xs', darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-700')}>
                    {selectedEvent.script}
                  </pre>
                </div>
              )}
              {selectedEvent.slides && (
                <div>
                  <label className={cn('text-xs font-semibold uppercase tracking-wider', darkMode ? 'text-gray-400' : 'text-gray-500')}>Carousel Slides</label>
                  <div className="mt-2 space-y-1.5">
                    {selectedEvent.slides.map((s, i) => (
                      <div key={i} className={cn('flex items-center gap-3 rounded-lg p-2 text-sm', darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-700')}>
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-500 text-[10px] font-bold text-white">{i + 1}</span>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedEvent.threadParts && (
                <div>
                  <label className={cn('text-xs font-semibold uppercase tracking-wider', darkMode ? 'text-gray-400' : 'text-gray-500')}>Thread Breakdown</label>
                  <div className="mt-2 space-y-1.5">
                    {selectedEvent.threadParts.map((t, i) => (
                      <div key={i} className={cn('rounded-lg border-l-2 border-violet-500 p-2 text-sm', darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-700')}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-medium text-white">
                <Edit3 className="mr-2 inline h-4 w-4" />Edit Content
              </button>
              <button className={cn('flex-1 rounded-xl border py-2.5 text-sm font-medium',
                darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'
              )}>
                <Clock className="mr-2 inline h-4 w-4" />Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
