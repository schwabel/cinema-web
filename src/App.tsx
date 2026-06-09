import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieList from './components/MovieList';
import Footer from './components/Footer';
import { useMovies } from './hooks/useMovies';
import type { Movie } from './types';

function App() {
  const { movies, loading, error } = useMovies();
  const { comingSoon } = splitMovies(movies);
  const { movie: nowPlayingMovie } = findNextNowPlaying(movies);
  const comingSoonFiltered = nowPlayingMovie
    ? comingSoon.filter((m) => m.id !== nowPlayingMovie.id)
    : comingSoon;

  return (
    <div className="app">
      <Header />
      <main className="main">
        {nowPlayingMovie && (
          <Hero movie={nowPlayingMovie} label="Now Playing" id="now-playing" />
        )}
        {loading && <div className="loading">Loading movies…</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <>
            <section className="section">
              <MovieList id="coming-soon" title="Coming Soon" movies={comingSoonFiltered} />
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function splitMovies(movies: Movie[]) {
  const now = new Date();
  const comingSoon: Movie[] = [];

  const nextFutureShowtime = (m: Movie): Date | null => {
    const futureDates = (m.showtimes || [])
      .flatMap((s) => (s.times || []).map((t) => new Date(`${s.date}T${t}:00`)))
      .filter((d) => !isNaN(d.getTime()) && d > now)
      .sort((a, b) => +a - +b);
    return futureDates[0] ?? null;
  };

  for (const m of movies) {
    const nextShow = nextFutureShowtime(m);
    if (nextShow) comingSoon.push(m);
  }

  comingSoon.sort((a, b) => {
    const aNext = nextFutureShowtime(a);
    const bNext = nextFutureShowtime(b);
    if (aNext && bNext) return +aNext - +bNext;
    if (aNext) return -1;
    if (bNext) return 1;
    return 0;
  });

  return { comingSoon };
}

function findNextNowPlaying(movies: Movie[]) {
  const now = new Date();
  let best: { movie: Movie; at: Date } | { movie: null; at: null } = { movie: null, at: null };
  for (const m of movies) {
    for (const s of m.showtimes || []) {
      for (const t of s.times || []) {
        const dt = new Date(`${s.date}T${t}:00`);
        if (isNaN(dt.getTime())) continue;
        if (dt >= now && (!best.at || dt < best.at)) {
          best = { movie: m, at: dt };
        }
      }
    }
  }
  return best.movie ? best : { movie: null, at: null };
}

export default App;
