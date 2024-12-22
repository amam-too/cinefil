import MoviesCard from "@/components/movie/movieCard";
import { getSuggestions } from "@/server/services/tmdb";
import { type Movie } from "tmdb-ts";

export default async function SuggestedMovies({ filmId }: { filmId: number }) {
  const suggestedMovies = await getSuggestions(filmId);

  if (!suggestedMovies?.results) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mt-4 flex flex-col overflow-auto">
      <h1 className="text-xl">Films Similaires</h1>
      <div className="flex flex-row justify-start gap-8">
        {suggestedMovies.results.map((movie: Movie) => {
          return (
            <MoviesCard
              movie={movie}
              // TODO : Implement true value fetching for hasBeenSuggestedByUser.
              hasBeenSuggestedByUser={false}
              key={movie.id}
              // TODO : Implement true value fetching for hasBeenSuggested.
              hasBeenSuggested={false}
            />
          );
        })}
      </div>
    </div>
  );
}
