import MovieCard from "@/components/search/search-movie-card";
import { searchMovies } from "@/server/services/tmdb";
import SearchNoQuery from "@/components/search/search-no-query";
import { type AvailableLanguage } from "tmdb-ts";

interface SearchMoviesResultProps {
  query?: string;
  year?: string;
  language?: string;
}

export default async function SearchMoviesResult({
  query,
  year,
  language,
}: SearchMoviesResultProps) {
  if (!query) return <SearchNoQuery />;

  const yearNum = year ? parseInt(year) : undefined;

  const movies = await searchMovies({
    query,
    year: yearNum,
    language: language as AvailableLanguage,
  });

  if (!movies?.results || movies.results.length === 0) {
    return (
      <div className="mt-10 text-center text-lg text-gray-400">
        <p className="mb-2 text-3xl">😢</p>
        <p>No movies matched your search.</p>
        <p className="text-sm text-muted-foreground">
          Try a different title, year, or language.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full md:w-3/4">
      <div className="-mx-4 mt-6 flex flex-wrap justify-center gap-4 overflow-x-auto px-4 pb-10">
        {movies.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
