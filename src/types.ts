export type Showtime = {
  date: string; // YYYY-MM-DD
  times: string[]; // HH:mm local times
};

export type Movie = {
  id: string;
  title: string;
  synopsis: string;
  runtime: number; // minutes
  rating: string; // MPAA
  genres: string[];
  posterUrl: string; // relative to public/
  backdropUrl: string; // relative to public/
  releaseDate: string; // YYYY-MM-DD
  director: string;
  cast: string[];
  trailerUrl?: string;
  showtimes: Showtime[];
};

export type SiteConfig = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  metaTitle?: string;
  metaDescription?: string;
};
