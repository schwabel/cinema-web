import type { Movie } from '../types';
import './Hero.css';

type Props = { movie?: Movie; label?: string; id?: string };

function getNextShowtime(movie: Movie): Date | null {
  const now = new Date();
  let best: Date | null = null;
  for (const s of movie.showtimes || []) {
    for (const t of s.times || []) {
      const dt = new Date(`${s.date}T${t}:00`);
      if (isNaN(dt.getTime())) continue;
      if (dt >= now && (!best || dt < best)) best = dt;
    }
  }
  return best;
}

export default function Hero({ movie, label, id }: Props) {
  if (!movie) return null;
  const year = new Date(movie.releaseDate).getFullYear();
  const bg = movie.backdropUrl || '';
  const posterSrc = movie.posterUrl || '';

  const next = getNextShowtime(movie);
  const eyebrow = `${label || 'Featured'}${next ? ' — Next showtime: ' + next.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''}`;

  return (
    <section className="hero" aria-label={label || 'Featured'} id={id}>
      <div className="hero-bg" style={{ backgroundImage: bg ? `url(${bg})` : undefined }} />
      <div className="hero-overlay" />
      <div className="hero-inner">
        <div className="hero-layout">
          <div className="hero-media">
            {posterSrc && (
              <img className="hero-poster" src={posterSrc} alt={`${movie.title} poster`} />
            )}
          </div>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="eyebrow">{eyebrow}</span>
              {movie.title} <span className="year">({year})</span>
            </h1>
            <p className="hero-synopsis">{movie.synopsis}</p>
            {movie.cast?.length > 0 && (
              <p className="hero-synopsis"><strong>Cast:</strong> {movie.cast.join(', ')}</p>
            )}
            <div className="hero-actions">
              {movie.trailerUrl && (
                <a className="btn ghost" href={movie.trailerUrl} target="_blank" rel="noreferrer">Watch Trailer</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
