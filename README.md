# Cinema Web

A responsive theater website built with React + TypeScript + Vite. Features a cinematic black theme, featured hero for the next showtime, movie cards with search, and a coming-soon grid.

All theater-specific content (site name, contact email, movie listings, images) lives outside this repo — see **Data setup** below.

## Quick start

Requirements: Node 18+

```bash
npm install
cp public/config.example.json public/config.json   # edit with your values
cp public/movies.example.json public/movies.json   # edit with your movies
npm run dev
```

Open the URL printed in the terminal (usually http://localhost:5173).

## Data setup

The app loads two JSON files at runtime:

| File | Purpose |
|------|---------|
| `config.json` | Site name, tagline, contact email |
| `movies.json` | Movie listings with showtimes |

Both files are gitignored so your real data stays private. Use the `.example.json` files as templates.

### Option A — Local files (default)

Drop `config.json` and `movies.json` into `public/`. The app fetches them from `/config.json` and `/movies.json` automatically.

### Option B — Remote data source (private repo, S3, etc.)

Set `VITE_DATA_URL` in a `.env` file (copy `.env.example` to get started):

```
VITE_DATA_URL=https://raw.githubusercontent.com/yourname/your-theater-data/main
```

The app will fetch `config.json` and `movies.json` from that base URL. Images referenced in `movies.json` can also live there.

## Movie JSON shape

```json
{
  "id": "unique-string",
  "title": "Film Title",
  "synopsis": "Short description.",
  "runtime": 120,
  "rating": "PG-13",
  "genres": ["Drama"],
  "posterUrl": "/posters/film.jpg",
  "backdropUrl": "/backdrops/film.jpg",
  "releaseDate": "YYYY-MM-DD",
  "director": "Name",
  "cast": ["Actor One", "Actor Two"],
  "trailerUrl": "https://youtube.com/...",
  "showtimes": [
    { "date": "YYYY-MM-DD", "times": ["HH:mm", "HH:mm"] }
  ]
}
```

**Now Playing vs Coming Soon** is determined automatically: the movie with the nearest upcoming showtime appears in the hero; everything else appears in the coming-soon grid. Missing images fall back to a placeholder poster.

## Project structure

```
src/
  hooks/       useConfig, useMovies — fetch data from configurable URL
  components/  Header, Hero, MovieList, MovieCard, Footer
  types.ts     Movie, Showtime, SiteConfig
public/
  *.example.json    Templates — copy and fill in your own values
  placeholder/      Fallback poster SVG
```

## Build

```bash
npm run build && npm run preview
```

Set `VITE_DATA_URL` in your hosting environment (Vercel, Netlify, etc.) to point at your private data source.
