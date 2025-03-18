import MoviesCard from "@/components/movie/movieCard";
import { getSuggestions } from "@/server/services/tmdb";
import { type Vote } from "@/types/vote";
import { fetchProposedMoviesIds } from "@/server/services/propositions";

interface SuggestedMoviesProps {
  filmId: number;
  votedMovies: Vote[];
}

/**
 * Suggestion de films similaires au film correspondant à l'id passé en paramètre.
 *
 * @param filmId
 * @param votedMovies
 * @constructor
 */
export default async function SuggestedMovies({
  filmId,
  votedMovies,
}: SuggestedMoviesProps) {
  const suggestedMovies = await getSuggestions(filmId);

  const moviesId: { tmdb_id: number }[] = await fetchProposedMoviesIds();

  if (!suggestedMovies?.results) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 flex flex-col overflow-auto">
      <h1 className="text-xl">Films Similaires</h1>
      <div className="flex flex-row justify-start gap-8">
        {suggestedMovies.results.map((movie) => (
          <MoviesCard
            movie={movie}
            filmCanBeProposed={
              !moviesId?.find(
                (value: { tmdb_id: number }) => value.tmdb_id === movie.id,
              )
            }
            key={movie.id}
            hasVoted={
              !!votedMovies?.find((value: Vote) => value.tmdb_id === movie.id)
            }
          />
        ))}
      </div>
    </div>
  );
}