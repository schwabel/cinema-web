import { useEffect, useState } from 'react';
import type { Movie } from '../types';

const BASE_URL = (import.meta.env.VITE_DATA_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${BASE_URL}/movies.json`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load movies.json: ${res.status}`);
        return (await res.json()) as Movie[];
      })
      .then((data) => {
        if (!cancelled) {
          setMovies(data);
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

  return { movies, loading, error };
}
