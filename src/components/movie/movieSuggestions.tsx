import MoviesCard from "@/components/movie/movieCard";
import { type EnhancedMovie } from "@/server/services/movie-service";
import { fetchProposedMoviesIds } from "@/server/services/propositions";
import { getSuggestions } from "@/server/services/tmdb";
import { getAllVotes } from "@/server/services/votes";
import { type Vote } from "@/types/vote";

interface SuggestedMoviesProps {
    filmId: number;
    votedMovies: Vote[];
}

/**
 * Suggestion de films similaires au film correspondant à l'ID passé en paramètre.
 *
 * @param filmId
 * @param votedMovies
 * @constructor
 */
export default async function SuggestedMovies({
                                                  filmId,
                                                  votedMovies
                                              }: SuggestedMoviesProps) {
    // Fetch all required data in parallel for better performance.
    const [suggestedMovies, proposedMoviesIds, allVotes] = await Promise.all([
        getSuggestions(filmId),
        fetchProposedMoviesIds(),
        getAllVotes()
    ]);
    
    if (!suggestedMovies?.results) {
        return <div>Loading...</div>;
    }
    
    // Convert votes to a Map for faster lookup.
    const voteCountMap = new Map<number, number>();
    allVotes.forEach((vote) => {
        voteCountMap.set(vote.tmdb_id, (voteCountMap.get(vote.tmdb_id) ?? 0) + 1);
    });
    
    return (
        <div className="mt-4 flex flex-col overflow-auto">
            <h1 className="text-xl">Films Similaires</h1>
            <div className="flex flex-row justify-start gap-8">
                { suggestedMovies.results.map((movie) => (
                    <MoviesCard
                        key={ movie.id }
                        movie={ movie as unknown as EnhancedMovie}
                        filmCanBeProposed={
                            proposedMoviesIds?.some((p) => p.tmdb_id === movie.id)
                        }
                        userHasVotedFor={ votedMovies.some((v) => v.tmdb_id === movie.id) }
                        numberOfVoteForFilm={ voteCountMap.get(movie.id) ?? 0 }
                    />
                )) }
            </div>
        </div>
    );
}