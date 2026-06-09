import { useState, useMemo } from 'react';
import type { Movie } from '../types';
import MovieCard from './MovieCard';
import './MovieList.css';

type Props = {
  movies: Movie[];
  title: string;
  id?: string;
};

export default function MovieList({ movies, title, id }: Props) {
  const [query, setQuery] = useState('');
  const layout: 'card' = 'card';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.genres.join(' ').toLowerCase().includes(q) ||
      m.cast.join(' ').toLowerCase().includes(q)
    );
  }, [movies, query]);

  return (
    <section className="movie-list" id={id}>
      <div className="list-header">
        <h2>{title}</h2>
        <div className="controls">
          <div className="search">
            <input
              type="search"
              placeholder="Search titles, genres, cast"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search movies"
            />
          </div>
        </div>
      </div>
      <div className={`grid ${layout}`}>
        {filtered.map((m) => (
          <MovieCard key={m.id} movie={m} layout={layout} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty">No movies matched your search.</div>
      )}
    </section>
  );
}
