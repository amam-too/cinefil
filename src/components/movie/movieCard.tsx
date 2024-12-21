"use client";

import { SearchParams } from "@/app/searchParams";
import ProposeMovieManager from "@/components/propositions/proposeMovieManager";
import VoteButton from "@/components/customButtons/voteButton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getHumanReadableDate, getYearOnly } from "@/utils/date";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { type Movie, type MovieDetails } from "tmdb-ts";
import { useDebouncedCallback } from "use-debounce";

interface MovieCardProps {
  movie: Movie
  hasBeenSuggestedByUser: boolean
  hasBeenSuggested: boolean
  shown_at?: string
}

export default function MoviesCard({
  movie,
  hasBeenSuggestedByUser,
  hasBeenSuggested,
  shown_at,
}: MovieCardProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selectMovie = useDebouncedCallback((filmId: number): void => {
    const params = new URLSearchParams(searchParams);

    if (filmId) {
      params.set(SearchParams.FILM_ID, filmId.toString());
    } else {
      params.delete(SearchParams.FILM_ID);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Card
      className="flex cursor-pointer flex-col justify-between"
      key={movie.id}
    >
      <div onClick={(): void => selectMovie(movie.id)}>
        <CardContent className="flex flex-col p-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className={`h-full max-h-40 w-full rounded-lg rounded-b-none object-cover ${shown_at ? "opacity-50 grayscale" : ""}`}
          />

          <div className="p-2 px-3">
            <h1 className="text-lg font-semibold">{movie.title}</h1>
            <p className="text-start text-sm text-gray-500">
              {getYearOnly(movie.release_date)}
            </p>
            {shown_at && (
              <p className="pt-8 text-start text-sm font-bold text-red-500">
                Diffusé {getHumanReadableDate(shown_at)}
              </p>
            )}
          </div>
        </CardContent>
      </div>
      {/* Case 1: The movie was shown => Allow nothing */}
      {!shown_at && (
        <CardFooter className="p-4 pb-4">
          {hasBeenSuggested && !hasBeenSuggestedByUser ? (
            /* Case 2: The movie was suggested by another user => Allow voting */
            <VoteButton movieId={movie.id} />
          ) : (
            /* Case 3: The movie was suggested by the user => Allow removal */
            /* Case 4: The movie was never suggested => Allow suggestion */
            <SuggestButton
              movieDetails={movie as unknown as MovieDetails}
              hasBeenSuggestedByUser={hasBeenSuggestedByUser}
            />
            //  <ProposeMovieManager movieDetails={ movie as unknown as MovieDetails }/>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
