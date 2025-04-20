"use client";

import { Button } from "@/components/ui/button";
import { type EnhancedMovie, getEnhancedMovies } from "@/server/services/movie";
import { getCurrentUserPropositions } from "@/server/services/propositions";
import { type Proposition } from "@/types/proposition";
import { getYearOnly } from "@/utils/date";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { DiscardMoviesSkeleton } from "@/components/movies/discard-movies-skeleton";

interface ToDiscardMoviesProps {
  handleChoiceAction: (tmdb_id: number) => void;
}

export function ToDiscardMovies({ handleChoiceAction }: ToDiscardMoviesProps) {
  const [movies, setMovies] = useState<EnhancedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const propositions: Proposition[] = await getCurrentUserPropositions();

        if (!propositions) {
          return;
        }

        const movieDetails = await getEnhancedMovies(
          propositions.map((movie) => movie.movie_id),
        );

        if (!movieDetails) {
          return;
        }

        setMovies(movieDetails);
      } catch {
        toast.error(
          "Une erreur est survenue lors de la récupération des propositions.",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchMovies();
  }, []);

  if (loading) {
    return <DiscardMoviesSkeleton />;
  }

  return (
    <>
      {movies.map((movie, index) => {
        const propositionHasVotes: boolean =
          (movie.cinefil_votes_count ?? 0) > 0;

        return (
          <div
            key={index}
            className="flex w-full max-w-[200px] flex-col items-center justify-between gap-4"
          >
            <div className="flex h-full w-full flex-col gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="aspect-[2/3] h-auto w-full object-cover"
              />

              <div className="flex w-full flex-col items-center p-2 px-3 text-center">
                <h1 className="break-words text-sm font-semibold sm:text-base md:text-lg">
                  {movie.title}
                </h1>
                <p className="text-start text-xs text-gray-500 sm:text-sm">
                  {getYearOnly(movie.release_date)}
                </p>
              </div>
            </div>
            <Button
              variant={propositionHasVotes ? "ghost" : "destructive"}
              disabled={propositionHasVotes}
              onClick={() => handleChoiceAction(movie.id)}
              className="px-2 py-1 text-center text-xs sm:px-4 sm:py-2 sm:text-sm md:text-base"
            >
              {propositionHasVotes ? (
                <>
                  🔒 Proposition soutenue
                  <br />
                  par d&#39;autres cinéphiles !
                </>
              ) : (
                "🗑️ Retirer la proposition"
              )}
            </Button>
          </div>
        );
      })}
    </>
  );
}