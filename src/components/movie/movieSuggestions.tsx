import MoviesCard from "@/components/movie/movieCard";
import { getSuggestions } from "@/server/services/tmdb";
import { Vote } from "@/types/vote";

interface SuggestedMoviesProps {
  filmId: number;
  votedMovies: Vote[];
}

export default async function SuggestedMovies({
  filmId,
  votedMovies,
}: SuggestedMoviesProps) {
  const suggestedMovies = await getSuggestions(filmId);

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
            hasBeenProposed={false}
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