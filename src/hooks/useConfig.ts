import {useEffect, useState} from 'react';
import type {SiteConfig} from '../types';

const BASE_URL = (import.meta.env.VITE_DATA_URL as string | undefined)?.replace(/\/$/, '') ?? '';

// Simple module-level cache to avoid duplicate network requests
let cachedConfig: SiteConfig | null = null;
let inflight: Promise<SiteConfig> | null = null;

const defaultConfig: SiteConfig = {
  siteName: 'My Cinema',
  tagline: 'Now Playing & Showtimes',
  contactEmail: '',
};

async function loadConfig(): Promise<SiteConfig> {
  if (cachedConfig) return cachedConfig;
  if (inflight) return inflight;
  inflight = fetch(`${BASE_URL}/config.json`)
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to load config.json: ${res.status}`);
      return (await res.json()) as Partial<SiteConfig>;
    })
    .then((data) => {
      const merged: SiteConfig = {
        ...defaultConfig,
        ...data,
      };
      cachedConfig = merged;
      return merged;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useConfig() {
  const [config, setConfig] = useState<SiteConfig>(cachedConfig || defaultConfig);
  const [loading, setLoading] = useState(!cachedConfig);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (cachedConfig) {
      setLoading(false);
      setConfig(cachedConfig);
      return;
    }
    setLoading(true);
    loadConfig()
      .then((cfg) => {
        if (!cancelled) {
          setConfig(cfg);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { config, loading, error } as const;
}
