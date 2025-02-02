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

export default async function MoviesCard({movie, hasBeenProposed, shown_at}: MovieCardProps) {
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
        
        router.replace(`${ pathname }?${ params.toString() }`);
    }, 300);
    
    return (
        <Card
            className="cursor-pointer flex flex-col justify-between "
            key={ movie.id }
        >
            <div onClick={ (): void => selectMovie(movie.id) }>
                <CardContent className="flex flex-col p-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */ }
                    <img
                        src={ `https://image.tmdb.org/t/p/w500${ movie.poster_path }` }
                        alt={ movie.title }
                        className={ `rounded-lg rounded-b-none max-h-40 object-cover h-full w-full ${ shown_at ? 'grayscale opacity-50' : '' }` }
                    />
                    
                    <div className="p-2 px-3">
                        <h1 className="font-semibold text-lg">{ movie.title }</h1>
                        <p className="text-start text-sm text-gray-500">{ getYearOnly(movie.release_date) }</p>
                        { shown_at ? <p className="text-start text-sm text-red-500 font-bold pt-8">
                            Diffusé { getHumanReadableDate(shown_at) }
                        </p> : null }
                    </div>
                </CardContent>
            </div>
            <CardFooter className="p-4 pb-4">
                { hasBeenSuggested || shown_at ? (
                    <>
                        <VoteButton movieId={ movie.id }/>
                    </>
                ) : (
                    <ProposeMovieManager movieDetails={ movie as unknown as MovieDetails }/>
                ) }
            </CardFooter>


          /*



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

          */
        </Card>
    );
}
