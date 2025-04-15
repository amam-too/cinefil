import MovieCard from "@/components/search/search-movie-card";
import { searchMovies } from "@/server/services/tmdb";
import SearchNoQuery from "@/components/search/search-no-query";

interface SearchMoviesResultProps {
  query?: string;
}

export default async function SearchMoviesResult({
  query,
}: SearchMoviesResultProps) {
  if (!query) {
    return <SearchNoQuery />;
  }

  const movies = await searchMovies(query);

  if (!movies?.results) {
    return <p>No results</p>;
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