import {useState} from 'react';
import type {Movie} from '../types';
import './MovieCard.css';

type Props = {
  movie: Movie;
  layout?: 'card' | 'list';
};

export default function MovieCard({ movie, layout = 'card' }: Props) {
  const [imgSrc, setImgSrc] = useState(movie.posterUrl || '/placeholder/poster.svg');
  const releaseYear = new Date(movie.releaseDate).getFullYear();
  const today = new Date();
  const releaseDateObj = new Date(movie.releaseDate + 'T00:00:00');
  const comingSoon = releaseDateObj > today;

  return (
      <article className={`movie ${layout}${comingSoon ? ' coming-soon' : ''}`}>
      <div className="poster">
        <img
          src={imgSrc}
          alt={`${movie.title} poster`}
          loading="lazy"
          onError={() => setImgSrc('/placeholder/poster.svg')}
        />
        <div className="rating-badge">{movie.rating}</div>
      </div>
      <div className="info">
        <h3 className="title">{movie.title} <span className="year">({releaseYear})</span></h3>
        <div className="meta">
          <span>{movie.runtime}m</span>
          <span>•</span>
          <span>{movie.genres.join(', ')}</span>
        </div>
        {comingSoon && (
          <div className="opens">Opens {releaseDateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        )}
        <p className="synopsis">{movie.synopsis}</p>
        <div className="details">
          <span className="label">Director:</span> {movie.director}
          <span className="dot">•</span>
          <span className="label">Cast:</span> {movie.cast.slice(0, 3).join(', ')}
        </div>
        {movie.showtimes?.length > 0 && !comingSoon && (
          <div className="showtimes">
            {(() => {
              const { label, times } = getDisplayShowtimes(movie);
              return (
                <>
                  <div className="showtimes-label">{label}</div>
                  <div className="times">
                    {times.map((t) => (
                      <span key={t} className="time-chip">{t}</span>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}
        <div className="actions">
          {movie.trailerUrl && (
            <a className="btn ghost" href={movie.trailerUrl} target="_blank" rel="noreferrer">Watch Trailer</a>
          )}
        </div>
      </div>
    </article>
  );
}

function getDisplayShowtimes(movie: Movie): { label: string; times: string[] } {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const iso = `${yyyy}-${mm}-${dd}`;
  const entry = movie.showtimes.find(s => s.date === iso) || movie.showtimes[0];
  if (!entry) return { label: '', times: [] };
  const label = entry.date === iso
    ? 'Today'
    : new Date(entry.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  return { label, times: entry.times };
}
