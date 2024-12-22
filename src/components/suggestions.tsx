import MoviesGrid from "@/components/movie/moviesGrid";
import { getMovieDetails } from "@/server/services/tmdb";
import { type Suggestion } from "@/types/suggestion";
import React, { Suspense } from "react";
import { type Movie } from "tmdb-ts";
import { getSuggestions } from "@/server/services/suggestions";

export default async function Suggestions({
  displayShown,
}: {
  displayShown?: string | undefined
}) {
  /**
   * Fetch movie details for each suggestion based on tmdb_id.
   * @param suggestions
   */
  const fetchMoviesDetails = async (suggestions: Suggestion[]) => {
    const moviePromises = suggestions.map(async (suggestion) => {
      return await getMovieDetails(suggestion.tmdb_id);
    });

    return await Promise.all(moviePromises);
  };

  return (
    <div className="flex flex-col">
      <h1 className="ml-8 mt-4 text-center text-2xl font-bold">
        Suggestions des utilisateurs
      </h1>
      <Suspense>
        <MoviesGrid
          movies={
            (await fetchMoviesDetails(
              await getSuggestions(),
            )) as unknown[] as Movie[]
          }
          displayShown={displayShown}
        />
      </Suspense>
    </div>
  );
}
