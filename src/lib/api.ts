import type { BootstrapData, TrendItem } from '@/types/ai';

export const platformIcons: Record<string, string> = {
  Instagram: '📸',
  TikTok: '🎵',
  LinkedIn: '💼',
  X: '𝕏',
  YouTube: '▶️',
  Reddit: '🔴',
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }
  return data as T;
}

export const api = {
  bootstrap: () => request<BootstrapData>('/api/bootstrap'),
  research: (payload: { niche: string; audience: string; market: string; tone: string }) =>
    request<{ trendingTopics: TrendItem[] }>('/api/research', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  generateContent: (payload: { platform: string; topic: string; tone: string; includeAB: boolean }) =>
    request<{ fields: string[]; generated: Record<string, string>; abVariation: string | null }>('/api/generate-content', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
