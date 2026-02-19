import { Check, Zap, Crown, Building2, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PricingProps {
  darkMode: boolean;
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Sparkles,
    color: 'gray',
    features: [
      '7-day content calendar',
      '10 AI generations/month',
      '1 platform',
      'Basic trend insights',
      'CSV export',
      'Community support',
    ],
    cta: 'Current Plan',
    current: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For serious content creators',
    icon: Zap,
    color: 'violet',
    popular: true,
    features: [
      '30-day content calendar',
      '500 AI generations/month',
      'All platforms',
      'Advanced trend engine',
      'A/B caption generator',
      'Content repurposing',
      'Engagement predictions',
      'Priority support',
      'Google Calendar sync',
      'Competitor analysis',
    ],
    cta: 'Upgrade to Pro',
  },
  {
    name: 'Team',
    price: '$79',
    period: '/month',
    description: 'For agencies and teams',
    icon: Building2,
    color: 'indigo',
    features: [
      'Everything in Pro',
      'Unlimited AI generations',
      '5 team members',
      'Workspace management',
      'White-label exports',
      'API access',
      'Custom brand voices',
      'Bulk scheduling',
      'Advanced analytics',
      'Dedicated account manager',
      'Auto-posting integrations',
      'Custom workflows',
    ],
    cta: 'Contact Sales',
  },
];

export function Pricing({ darkMode }: PricingProps) {
  const card = cn('rounded-2xl border', darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700">
          <Crown className="h-4 w-4" />
          Pricing Plans
        </div>
        <h1 className={cn('text-3xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
          Scale Your Content Strategy
        </h1>
        <p className={cn('mx-auto mt-2 max-w-lg text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>
          Choose the plan that fits your needs. All plans include our core AI trend engine and content generation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map(plan => (
          <div key={plan.name} className={cn(
            card,
            'relative flex flex-col p-6 transition-all hover:shadow-xl',
            plan.popular && 'border-violet-500 ring-2 ring-violet-500/20 scale-[1.02]'
          )}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-lg">
                Most Popular
              </div>
            )}
            <div className="mb-4">
              <div className={cn('mb-3 inline-flex rounded-xl p-2.5',
                plan.color === 'violet' ? (darkMode ? 'bg-violet-950/30' : 'bg-violet-50') :
                plan.color === 'indigo' ? (darkMode ? 'bg-indigo-950/30' : 'bg-indigo-50') :
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              )}>
                <plan.icon className={cn('h-5 w-5',
                  plan.color === 'violet' ? 'text-violet-500' :
                  plan.color === 'indigo' ? 'text-indigo-500' : 'text-gray-500'
                )} />
              </div>
              <h3 className={cn('text-xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{plan.name}</h3>
              <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{plan.description}</p>
            </div>

            <div className="mb-6">
              <span className={cn('text-4xl font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{plan.price}</span>
              <span className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{plan.period}</span>
            </div>

            <ul className="mb-6 flex-1 space-y-3">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check className={cn('mt-0.5 h-4 w-4 shrink-0',
                    plan.popular ? 'text-violet-500' : darkMode ? 'text-gray-500' : 'text-gray-400'
                  )} />
                  <span className={cn('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>{feature}</span>
                </li>
              ))}
            </ul>

            <button className={cn('w-full rounded-xl py-3 text-sm font-semibold transition',
              plan.popular
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
                : plan.current
                  ? darkMode ? 'bg-gray-800 text-gray-400 cursor-default' : 'bg-gray-100 text-gray-500 cursor-default'
                  : darkMode ? 'border border-gray-700 text-gray-300 hover:bg-gray-800' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
            )}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Usage Dashboard */}
      <div className={cn(card, 'p-6')}>
        <h3 className={cn('mb-4 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>📊 Usage Dashboard</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'AI Credits Used', used: 347, total: 500, color: '#8B5CF6' },
            { label: 'Calendar Days', used: 30, total: 30, color: '#3B82F6' },
            { label: 'Team Members', used: 1, total: 1, color: '#10B981' },
          ].map(item => (
            <div key={item.label} className={cn('rounded-xl p-4', darkMode ? 'bg-gray-800' : 'bg-gray-50')}>
              <div className="flex items-center justify-between">
                <span className={cn('text-sm font-medium', darkMode ? 'text-gray-300' : 'text-gray-700')}>{item.label}</span>
                <span className={cn('text-sm font-bold', darkMode ? 'text-white' : 'text-gray-900')}>{item.used}/{item.total}</span>
              </div>
              <div className={cn('mt-3 h-2 rounded-full', darkMode ? 'bg-gray-700' : 'bg-gray-200')}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(item.used / item.total) * 100}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className={cn(card, 'p-6')}>
        <h3 className={cn('mb-4 font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { q: 'What counts as an AI credit?', a: 'Each content generation (caption, script, thread, etc.) uses 5 credits. Trend research uses 10 credits.' },
            { q: 'Can I cancel anytime?', a: 'Yes! You can cancel or downgrade your plan at any time. No long-term contracts.' },
            { q: 'Do you offer annual billing?', a: 'Yes! Save 20% with annual billing. Contact us for custom enterprise pricing.' },
            { q: 'What platforms are supported?', a: 'Instagram, TikTok, LinkedIn, X (Twitter), YouTube, Reddit, and Pinterest.' },
          ].map(faq => (
            <div key={faq.q} className={cn('rounded-xl p-4', darkMode ? 'bg-gray-800' : 'bg-gray-50')}>
              <p className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>{faq.q}</p>
              <p className={cn('mt-1 text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
