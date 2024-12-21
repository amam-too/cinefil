"use server";
import MoviesCard from "@/components/movie/movieCard";
import { createClient } from "@/utils/supabase/server";
import { type Movie } from "tmdb-ts";

export default async function MoviesGrid({
  movies,
  filmId,
  displayShown,
  forSuggestions,
}: {
  movies: Movie[]
  filmId?: number
  displayShown?: string | undefined
  forSuggestions: boolean
}) {
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

  const moviesId: { tmdb_id: number; shown_at: string }[] =
    await fetchShownMovies();
  const displayShownBoolValue: boolean = displayShown === "true" || false;

  return (
    <div
      className={`grid w-full gap-6 p-10 ${
        filmId
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      }`}
    >
      {movies?.length > 0 ? (
        movies.map((movie: Movie) =>
          // If the movie has been shown and displayShown is false, hide the movie (return null).
          !displayShownBoolValue &&
          moviesId.some(
            (value: { tmdb_id: number; shown_at: string }) =>
              value.tmdb_id === movie.id,
          ) ? null : (
              <MoviesCard
                key={movie.id}
                movie={movie}
                hasBeenSuggested={forSuggestions}
                shown_at={
                  moviesId.find(
                    (value: { tmdb_id: number; shown_at: string }) =>
                      value.tmdb_id === movie.id,
                  )?.shown_at
                }
              />
            ),
        )
      ) : (
        <> {/* TODO : Implement fallback. */} </>
      )}
    </div>
  );
}
