"use server";
import MoviesCard from "@/components/movie/movie-card";
import { type EnhancedMovie } from "@/server/services/movie";
import { fetchProposedMoviesIds, fetchShownMoviesIds } from "@/server/services/propositions";
import { getAllVotes } from "@/server/services/votes";
import { type Vote } from "@/types/vote";
import { Suspense } from "react";
import { getUser } from "@/app/login/actions";

interface MovieGridProps {
  movies: EnhancedMovie[];
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
  if (!movies || movies.length === 0) {
    return null;
  }

  const [moviesId, shownMoviesId, allVotes, user] = await Promise.all([
    fetchProposedMoviesIds(),
    fetchShownMoviesIds(),
    getAllVotes(),
    getUser(),
  ]);

  const displayShownBoolValue: boolean = displayShown === "true" || false;

  const voteCountMap = new Map<number, number>();

  allVotes.forEach((vote) => {
    voteCountMap.set(vote.tmdb_id, (voteCountMap.get(vote.tmdb_id) ?? 0) + 1);
  });

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
          movies.map((movie: EnhancedMovie) =>
            // If the movie has been shown and displayShown is false, hide the movie (return null).
            !displayShownBoolValue &&
            shownMoviesId.some(
              (value: { movie_id: number; shown_at: string }) =>
                value.movie_id === movie.id,
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
                    (value: { movie_id: number; shown_at: string }) =>
                      value.movie_id === movie.id,
                  )?.shown_at
                }
                userHasVotedFor={
                  !!votedMovies?.find(
                    (value: Vote) => value.tmdb_id === movie.id,
                  )
                }
                user={user}
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
