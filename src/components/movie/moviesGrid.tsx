"use server";
import MoviesCard from "@/components/movie/movieCard";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import { type Movie } from "tmdb-ts";
import type { Suggestion } from "@/types/suggestion";
import {
  getSuggestions,
  getUserSuggestions,
} from "@/server/services/suggestions";

interface MovieGridProps {
  movies: Movie[]
  filmId?: number
  displayShown?: string | undefined
}

export default async function MoviesGrid({
  movies,
  filmId,
  displayShown,
}: MovieGridProps) {
  /**
   * Fetch all movies that have been shown.
   */
  const fetchShownMovies = async (): Promise<
    { tmdb_id: number; shown_at: string }[]
  > => {
    // Fetch only movies ids with non-null "shown_at".
    const { data, error } = await createClient()
      .from("suggestions")
      .select("tmdb_id,  shown_at")
      .not("shown_at", "is", null);

    if (error) {
      console.error("Error fetching shown movies:", error);
      return [];
    }

    return data;
  };

  // Fetch data.
  const shownMovies = await fetchShownMovies();
  const suggestions: Suggestion[] = await getSuggestions();
  const userSuggestions: Suggestion[] = await getUserSuggestions(suggestions);

  // Convert displayShown to a boolean.
  const displayShownBool: boolean = displayShown === "true";

  // Map TMDB IDs of shown movies for quick lookup.
  const shownMoviesMap = new Map(
    shownMovies.map((movie) => [movie.tmdb_id, movie.shown_at]),
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={`grid w-full gap-6 p-10 ${
          filmId
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        }`}
      >
        {movies?.length > 0 ? (
          movies.map((movie: Movie) => {
            const shownAt = shownMoviesMap.get(movie.id);

            // If the movie has been shown and displayShown is false, skip rendering.
            if (!displayShownBool && shownAt) return null;

            const hasBeenSuggestedByUser: boolean = userSuggestions.some(
              (suggestedMovie: Suggestion): boolean => {
                return suggestedMovie.tmdb_id === movie.id;
              },
            );

            const hasBeenSuggested: boolean = suggestions.some(
              (suggestedMovie: Suggestion): boolean => {
                return suggestedMovie.tmdb_id === movie.id;
              },
            );
            return (
              <MoviesCard
                key={movie.id}
                movie={movie}
                hasBeenSuggestedByUser={hasBeenSuggestedByUser}
                hasBeenSuggested={hasBeenSuggested}
                shown_at={shownAt}
              />
            );
          })
        ) : (
          <div className="text-center text-gray-500">
            No movies available to display.
          </div>
        )}
      </div>
    </Suspense>
  );
}
