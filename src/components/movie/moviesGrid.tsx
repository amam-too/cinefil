"use server";
import MoviesCard from "@/components/movie/movieCard";
import { Suspense } from "react";
import { type Movie } from "tmdb-ts";
import { type Vote } from "@/types/vote";
import {
  fetchProposedMoviesIds,
  fetchShownMoviesIds,
} from "@/server/services/propositions";

interface MovieGridProps {
  movies: Movie[];
  filmId?: number;
  displayShown?: string | undefined;
  votedMovies: Vote[];
}

export default async function MoviesGrid({
  movies,
  filmId,
  displayShown,
  votedMovies,
}: MovieGridProps) {
  const moviesId: { tmdb_id: number }[] = await fetchProposedMoviesIds();

  const shownMoviesId: { tmdb_id: number; shown_at: string }[] =
    await fetchShownMoviesIds();

  const displayShownBoolValue: boolean = displayShown === "true" || false;

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
          movies.map((movie: Movie) =>
            // If the movie has been shown and displayShown is false, hide the movie (return null).
            !displayShownBoolValue &&
            shownMoviesId.some(
              (value: { tmdb_id: number; shown_at: string }) =>
                value.tmdb_id === movie.id,
            ) ? null : (
              <MoviesCard
                key={movie.id}
                movie={movie}
                filmCanBeProposed={
                  !moviesId?.find(
                    (value: { tmdb_id: number }) => value.tmdb_id === movie.id,
                  )
                }
                shown_at={
                  shownMoviesId.find(
                    (value: { tmdb_id: number; shown_at: string }) =>
                      value.tmdb_id === movie.id,
                  )?.shown_at
                }
                hasVoted={
                  !!votedMovies?.find(
                    (value: Vote) => value.tmdb_id === movie.id,
                  )
                }
              />
            ),
          )
        ) : (
          <> {/* TODO : Implement fallback. */} </>
        )}
      </div>
    </Suspense>
  );
}
