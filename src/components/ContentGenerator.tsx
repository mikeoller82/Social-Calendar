import { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Wand2, Hash, Type, Loader2, Check, ChevronDown, Repeat } from 'lucide-react';
import { cn } from '@/utils/cn';
import { api, platformIcons } from '@/lib/api';

interface ContentGeneratorProps {
  darkMode: boolean;
  credits: number;
  setCredits: (c: number) => void;
}

type Platform = 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'YouTube';

export function ContentGenerator({ darkMode, credits, setCredits }: ContentGeneratorProps) {
  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [topic, setTopic] = useState('');
  const [abMode, setAbMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ fields: string[]; generated: Record<string, string>; abVariation: string | null }>({ fields: [], generated: {}, abVariation: null });

  const handleGenerate = async () => {
    if (!topic || credits < 5) return;
    setGenerating(true);
    setError(null);
    try {
      const response = await api.generateContent({ platform, topic, tone: 'Educational', includeAB: abMode });
      setResult(response);
      setCredits(credits - 5);
      setGenerated(true);
      setExpandedField(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const card = cn('rounded-2xl border p-6', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white');

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>✨ AI Content Generator</h1>
      </div>
      <div className={card}>
        <div className="mb-4 flex flex-wrap gap-2">
          {(['Instagram', 'TikTok', 'LinkedIn', 'X', 'YouTube'] as Platform[]).map((p) => (
            <button key={p} onClick={() => setPlatform(p)} className={cn('rounded-lg px-3 py-1.5 text-sm', platform === p ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700')}>
              {platformIcons[p]} {p}
            </button>
          ))}
        </div>
        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={2} className={cn('w-full rounded-xl border px-4 py-3 text-sm', darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200')} placeholder="Enter your topic" />
        <button onClick={() => setAbMode(!abMode)} className="mt-3 flex items-center gap-2 text-sm"><Repeat className="h-4 w-4" />A/B Variations</button>
        <button onClick={handleGenerate} disabled={generating || !topic || credits < 5} className="mt-4 flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-white disabled:opacity-50">
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate Content (5 credits)
        </button>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      {generating && <div className={card}><div className="flex items-center gap-2"><Wand2 className="h-4 w-4" />Generating...</div></div>}

      {generated && !generating && (
        <div className="space-y-4">
          <button onClick={handleGenerate} className="flex items-center gap-2 text-sm"><RefreshCw className="h-3 w-3" />Regenerate</button>
          {result.fields.map((field) => (
            <div key={field} className={cn(card, 'overflow-hidden')}>
              <button onClick={() => setExpandedField(expandedField === field ? null : field)} className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">{field.includes('Hook') ? <Type className="h-4 w-4" /> : field.includes('Hash') ? <Hash className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />} {field}</div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); copyToClipboard(result.generated[field] || '', field); }}>{copiedField === field ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
                  <ChevronDown className={cn('h-4 w-4 transition', expandedField === field ? 'rotate-180' : '')} />
                </div>
              </button>
              {(expandedField === field || expandedField === null) && <pre className="mt-3 whitespace-pre-wrap text-sm">{result.generated[field]}</pre>}
            </div>
          ))}
          {abMode && result.abVariation && <div className={card}><p className="text-sm">{result.abVariation}</p></div>}
        </div>
      )}
    </div>
  );
}
