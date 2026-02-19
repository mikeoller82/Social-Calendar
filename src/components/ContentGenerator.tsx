import { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Wand2, Hash, Type, Loader2, Check, ChevronDown, Zap, Scissors, Repeat } from 'lucide-react';
import { cn } from '@/utils/cn';
import { platformIcons } from '@/data/mockData';

interface ContentGeneratorProps {
  darkMode: boolean;
  credits: number;
  setCredits: (c: number) => void;
}

type Platform = 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'YouTube';

const platformContent: Record<Platform, {
  fields: string[];
  generated: Record<string, string>;
}> = {
  Instagram: {
    fields: ['Hook Line', 'Caption', 'Hashtags', 'Reel Script', 'CTA'],
    generated: {
      'Hook Line': '🔥 Stop scrolling — this changed everything about my morning routine',
      'Caption': '🔥 Stop scrolling — this changed everything about my morning routine\n\nI used to wake up dreading my day. Emails piling up, zero energy, and a to-do list that never seemed to end.\n\nThen I discovered the 5-4-3-2-1 method:\n\n5️⃣ minutes of movement\n4️⃣ deep breaths\n3️⃣ things you\'re grateful for\n2️⃣ goals for the day\n1️⃣ act of kindness\n\nThe result? 3x more productive mornings, better mental clarity, and actually ENJOYING my work.\n\nTry it for 7 days — you\'ll never go back.',
      'Hashtags': '#morningroutine #productivity #mindset #wellness #selfimprovement #habits #growthmindset #motivation #dailyroutine #healthyhabits #success #lifehacks #mindfulness #personaldevelopment #entrepreneur',
      'Reel Script': '[HOOK - 0:00-0:03]\n"Stop scrolling — this changed everything"\n\n[SETUP - 0:03-0:08]\n"I used to wake up dreading mornings..."\n\n[REVEAL - 0:08-0:20]\n"Then I found the 5-4-3-2-1 method"\n[Show each step with on-screen text]\n\n[PROOF - 0:20-0:25]\n"3x more productive in just 7 days"\n\n[CTA - 0:25-0:30]\n"Save this and try it tomorrow morning 🔥"',
      'CTA': 'Save this for tomorrow morning ✅ Follow @handle for more productivity hacks 🔔',
    },
  },
  TikTok: {
    fields: ['3-Second Hook', 'Script', 'On-Screen Text', 'CTA'],
    generated: {
      '3-Second Hook': 'POV: You just found the hack that top 1% creators use...',
      'Script': '[HOOK - 0:00-0:03]\n"POV: You just found the hack that top 1% creators use"\n\n[PATTERN INTERRUPT - 0:03-0:05]\n*quick zoom in* "And no, it\'s not what you think"\n\n[VALUE DROP - 0:05-0:25]\n"Here\'s the thing nobody tells you about going viral:\nIt\'s not about the algorithm.\nIt\'s about the first 3 seconds.\n\nStep 1: Open with curiosity, not context\nStep 2: Use pattern interrupts every 5 seconds\nStep 3: End with an incomplete loop"\n\n[OPEN LOOP - 0:25-0:30]\n"But the REAL secret is in part 2... follow to see it 👀"',
      'On-Screen Text': 'Slide 1: "The hack top creators use 🤫"\nSlide 2: "It\'s NOT about the algorithm"\nSlide 3: "It\'s about the FIRST 3 seconds"\nSlide 4: "Step 1: Curiosity > Context"\nSlide 5: "Step 2: Pattern interrupts"\nSlide 6: "Step 3: Incomplete loops"\nSlide 7: "Part 2 coming... 👀"',
      'CTA': 'Follow for Part 2 🔔 — Comment "HACK" and I\'ll send you the full guide',
    },
  },
  LinkedIn: {
    fields: ['Authority Hook', 'Structured Post', 'Engagement Question'],
    generated: {
      'Authority Hook': 'I\'ve reviewed 500+ content strategies this year.\n\nHere\'s what separates the top 1% from everyone else:',
      'Structured Post': 'I\'ve reviewed 500+ content strategies this year.\n\nHere\'s what separates the top 1% from everyone else:\n\n↳ They don\'t chase trends. They CREATE them.\n↳ They post with intention, not obligation.\n↳ They build systems, not just content.\n\nThe biggest misconception?\n\nThat more content = more growth.\n\nWrong.\n\nThe top performers I\'ve worked with post LESS.\nBut every single piece is:\n\n✅ Data-backed\n✅ Story-driven\n✅ Strategically distributed\n\nHere\'s the framework they all use:\n\n1. Research (2 hours)\n2. Outline (30 min)\n3. Write (1 hour)\n4. Edit ruthlessly (30 min)\n5. Distribute across 3+ platforms\n\nTotal time: 4 hours for a week\'s worth of content.\n\nThat\'s the real "hack" — it\'s just discipline + strategy.\n\n♻️ Repost this if you agree\n💬 What\'s YOUR content framework?',
      'Engagement Question': 'What\'s the ONE thing that\'s transformed your content strategy this year?\n\nI\'ll share my top resource with the best answer 👇',
    },
  },
  X: {
    fields: ['Thread Structure', 'Single Tweet', 'Engagement Bait'],
    generated: {
      'Thread Structure': '🧵 I spent 1,000 hours studying viral content.\n\nHere are 10 patterns EVERY viral post follows:\n\n(Save this thread — it\'ll change how you create)\n\n1/ The "Unexpected Stat" opener\n→ Lead with a number that makes people stop\n→ Example: "99% of people don\'t know this..."\n\n2/ The "Contrarian Take"\n→ Challenge a widely held belief\n→ Creates instant engagement through disagreement\n\n3/ The "Story Arc"\n→ Before → Struggle → Discovery → After\n→ Most powerful format on any platform\n\n4/ The "Listicle with Depth"\n→ Not just a list — each item needs a WHY\n\n5/ The "Open Loop"\n→ Tease what\'s coming next\n→ Keeps people reading till the end\n\n🔁 RT the first tweet to help others\n💬 Which pattern will you try first?',
      'Single Tweet': 'Hot take: The "post every day" advice is killing your growth.\n\nConsistency isn\'t about frequency.\n\nIt\'s about quality + reliability.\n\nPost 3x/week with intention > 7x/week with filler.\n\nYour audience can tell the difference. 🎯',
      'Engagement Bait': 'Unpopular opinion:\n\nFollower count is a vanity metric.\n\nEngagement rate is the ONLY metric that matters for monetization.\n\n10K engaged followers > 100K ghost followers.\n\nAgree or disagree? 👇',
    },
  },
  YouTube: {
    fields: ['Title', 'Description', 'Tags', 'Thumbnail Text', 'Script Outline', 'Chapters'],
    generated: {
      'Title': 'I Tried Every Viral Content Strategy (Here\'s What Actually Works)',
      'Description': '🔥 I Tried Every Viral Content Strategy (Here\'s What Actually Works)\n\nIn this video, I break down the exact strategies that took me from 0 to 100K+ across all platforms in 12 months.\n\n📌 What you\'ll learn:\n- The #1 mistake killing your content growth\n- The 3-second hook formula that 10x\'d my views\n- My exact content calendar system\n- How to repurpose 1 piece into 10\n\n🔗 Resources mentioned:\n- Free Content Calendar Template: [link]\n- AI Content Generator: [link]\n\n📱 Follow me:\n- Instagram: @handle\n- TikTok: @handle\n- Twitter: @handle\n\n⏰ Timestamps in the comments!\n\n#contentcreation #socialmedia #growthhacking',
      'Tags': 'content strategy, social media growth, viral content, content creation tips, how to go viral, content calendar, social media marketing 2025, creator economy, content repurposing',
      'Thumbnail Text': 'Main text: "I TESTED EVERY STRATEGY"\nSubtext: "Here\'s what works"\nStyle: Split face reaction, bright yellow background, red arrow pointing to results graph',
      'Script Outline': 'INTRO [0:00-1:00]\n- Hook: "I spent $10K testing every content strategy so you don\'t have to"\n- Credibility: Show results dashboard\n- Promise: "By the end, you\'ll have the exact system"\n\nSECTION 1 [1:00-5:00] - The Myth of Posting Daily\n- Data breakdown\n- Case study: Quality vs Quantity\n\nSECTION 2 [5:00-10:00] - The 3-Second Hook Formula\n- Framework explanation\n- Live examples\n- Before/after results\n\nSECTION 3 [10:00-15:00] - The Content Multiplication System\n- 1 video → 10 pieces of content\n- Step by step walkthrough\n\nCONCLUSION [15:00-17:00]\n- Recap key points\n- CTA: Subscribe + free template',
      'Chapters': '0:00 - Why most content strategies fail\n1:15 - The data behind viral content\n3:30 - Myth: Post every day\n5:00 - The 3-Second Hook Formula\n7:45 - Live hook examples\n10:00 - Content Multiplication System\n12:30 - Step-by-step walkthrough\n15:00 - Results & proof\n16:00 - Your action plan\n16:45 - Free template download',
    },
  },
};

export function ContentGenerator({ darkMode, credits, setCredits }: ContentGeneratorProps) {
  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [topic, setTopic] = useState('Morning productivity routine for entrepreneurs');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [abMode, setAbMode] = useState(false);

  const handleGenerate = () => {
    if (credits < 5) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setCredits(credits - 5);
    }, 2000);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const card = cn('rounded-2xl border', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white');
  const content = platformContent[platform];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={cn('text-2xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>🤖 AI Content Generator</h1>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Generate platform-optimized content with AI</p>
        </div>
        <div className={cn('flex items-center gap-2 rounded-xl px-4 py-2', darkMode ? 'bg-violet-950/30 border border-violet-900/50' : 'bg-violet-50 border border-violet-100')}>
          <Zap className="h-4 w-4 text-violet-500" />
          <span className={cn('text-sm font-medium', darkMode ? 'text-violet-300' : 'text-violet-700')}>{credits} credits remaining</span>
        </div>
      </div>

      {/* Configuration */}
      <div className={cn(card, 'p-6')}>
        <h3 className={cn('mb-4 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Content Configuration</h3>

        {/* Platform Selector */}
        <div className="mb-4">
          <label className={cn('mb-2 block text-sm font-medium', darkMode ? 'text-gray-300' : 'text-gray-700')}>Platform</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(platformContent) as Platform[]).map(p => (
              <button key={p} onClick={() => { setPlatform(p); setGenerated(false); }}
                className={cn('flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition',
                  platform === p
                    ? 'border-violet-500 bg-violet-600 text-white'
                    : darkMode ? 'border-gray-700 text-gray-400 hover:border-gray-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                <span>{platformIcons[p]}</span>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input */}
        <div className="mb-4">
          <label className={cn('mb-2 block text-sm font-medium', darkMode ? 'text-gray-300' : 'text-gray-700')}>Topic / Theme</label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            rows={2}
            className={cn('w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500',
              darkMode ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500' : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400'
            )}
            placeholder="Enter your content topic or idea..."
          />
        </div>

        {/* Options */}
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            onClick={() => setAbMode(!abMode)}
            className={cn('flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition',
              abMode
                ? 'border-violet-500 bg-violet-50 text-violet-700'
                : darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
            )}
          >
            <Repeat className="h-4 w-4" />
            A/B Variations
          </button>
          <button className={cn('flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium',
            darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
          )}>
            <Scissors className="h-4 w-4" />
            Repurpose Mode
          </button>
        </div>

        <button onClick={handleGenerate} disabled={generating || !topic || credits < 5}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition hover:shadow-violet-500/40 disabled:opacity-50"
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {generating ? 'Generating...' : 'Generate Content (5 credits)'}
        </button>
      </div>

      {/* Loading State */}
      {generating && (
        <div className={cn(card, 'p-8')}>
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="h-14 w-14 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
              <Wand2 className="absolute inset-0 m-auto h-5 w-5 text-violet-500" />
            </div>
            <p className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Generating {platform} content...</p>
            <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Optimizing for maximum engagement</p>
          </div>
        </div>
      )}

      {/* Generated Content */}
      {generated && !generating && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={cn('font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
              ✨ Generated {platform} Content
            </h3>
            <button onClick={() => { setGenerated(false); handleGenerate(); }}
              className={cn('flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition',
                darkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              <RefreshCw className="h-3 w-3" />
              Regenerate
            </button>
          </div>

          {content.fields.map(field => (
            <div key={field} className={cn(card, 'overflow-hidden')}>
              <button
                onClick={() => setExpandedField(expandedField === field ? null : field)}
                className={cn('flex w-full items-center justify-between p-4 text-left transition',
                  darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-3">
                  {field.includes('Hook') ? <Type className="h-4 w-4 text-violet-500" /> :
                   field.includes('Hash') || field.includes('Tags') ? <Hash className="h-4 w-4 text-blue-500" /> :
                   <Sparkles className="h-4 w-4 text-amber-500" />}
                  <span className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>{field}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(content.generated[field] || '', field); }}
                    className={cn('rounded-lg p-1.5 transition', darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')}
                  >
                    {copiedField === field ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
                  </button>
                  <ChevronDown className={cn('h-4 w-4 transition', expandedField === field ? 'rotate-180' : '', darkMode ? 'text-gray-500' : 'text-gray-400')} />
                </div>
              </button>
              {(expandedField === field || expandedField === null) && (
                <div className={cn('border-t px-4 py-3', darkMode ? 'border-gray-800' : 'border-gray-100')}>
                  <pre className={cn('whitespace-pre-wrap font-sans text-sm leading-relaxed', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                    {content.generated[field]}
                  </pre>
                </div>
              )}
            </div>
          ))}

          {abMode && (
            <div className={cn(card, 'p-4')}>
              <div className="flex items-center gap-2 mb-3">
                <Repeat className="h-4 w-4 text-violet-500" />
                <span className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>A/B Variation</span>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium bg-violet-100 text-violet-700')}>Alternative</span>
              </div>
              <p className={cn('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                "You&apos;re doing mornings wrong — here&apos;s the 60-second fix that successful entrepreneurs swear by 🚀"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
