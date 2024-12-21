"use client";

import SuggestButton from "@/components/customButtons/suggestButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type Movie, type MovieDetails } from "tmdb-ts";
import { useDebouncedCallback } from "use-debounce";
import React from "react";
import { getHumanReadableDate, getYearOnly } from "@/utils/date";
import { SearchParams } from "@/app/searchParams";
import DeleteSuggestionButton from "@/components/customButtons/deleteSuggestionButton";

export default function MoviesCard({
  movie,
  hasBeenSuggested,
  shown_at,
}: {
  movie: Movie
  hasBeenSuggested: boolean
  shown_at?: string | undefined
}) {
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
    <Card key={movie.id}>
      <div onClick={(): void => selectMovie(movie.id)}>
        <CardContent>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className={`rounded-lg p-4 ${shown_at ? "opacity-50 grayscale" : ""}`}
          />
        </CardContent>
        <CardHeader>
          <CardTitle className={"text-xl"}>{movie.title}</CardTitle>
          <p className="text-start text-sm text-gray-500">
            {getYearOnly(movie.release_date)}
          </p>
          {shown_at ? (
            <p className="pt-8 text-start text-sm font-bold text-red-500">
              Diffusé lors de la séance du : {getHumanReadableDate(shown_at)}
            </p>
          ) : null}
        </CardHeader>
      </div>
      <CardFooter>
        {hasBeenSuggested || shown_at ? (
          <div className="flex flex-col space-y-4">
            {/* TODO : Add Vote Button. */}
            <DeleteSuggestionButton
              movieDetails={movie as unknown as MovieDetails}
            />
          </div>
        ) : (
          <SuggestButton movieDetails={movie as unknown as MovieDetails} />
        )}
      </CardFooter>
    </Card>
  );
}
