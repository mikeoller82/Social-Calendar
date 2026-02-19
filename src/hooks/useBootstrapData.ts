import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { BootstrapData } from '@/types/ai';

let bootstrapCache: BootstrapData | null = null;

export function useBootstrapData() {
  const [data, setData] = useState<BootstrapData | null>(bootstrapCache);
  const [loading, setLoading] = useState(!bootstrapCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bootstrapCache) return;

    api.bootstrap()
      .then((result) => {
        bootstrapCache = result;
        setData(result);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
