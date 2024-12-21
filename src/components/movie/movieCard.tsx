"use client";

import { SearchParams } from "@/app/searchParams";
import SuggestButton from "@/components/customButtons/suggestButton";
import VoteButton from "@/components/customButtons/voteButton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getHumanReadableDate, getYearOnly } from "@/utils/date";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { type Movie, type MovieDetails } from "tmdb-ts";
import { useDebouncedCallback } from "use-debounce";

interface MoviesCardProps {
    movie: Movie;
    hasBeenSuggested: boolean;
    shown_at?: string | undefined;
}

export default function MoviesCard({movie, hasBeenSuggested, shown_at}: MoviesCardProps) {
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
        <Card key={ movie.id }>
            <div onClick={ (): void => selectMovie(movie.id) }>
                <CardContent>
                    <Suspense fallback={ <div>Loading...</div> }>
                        <img
                            src={ `https://image.tmdb.org/t/p/w500${ movie.poster_path }` }
                            alt={ movie.title }
                            className={ `rounded-lg p-4 ${ shown_at ? "opacity-50 grayscale" : "" }` }
                        />
                    </Suspense>
                </CardContent>
                <CardHeader>
                    <CardTitle className={ "text-xl" }>{ movie.title }</CardTitle>
                    <p className="text-start text-sm text-gray-500">
                        { getYearOnly(movie.release_date) }
                    </p>
                    { shown_at ? (
                        <p className="pt-8 text-start text-sm font-bold text-red-500">
                            Diffusé lors de la séance du : { getHumanReadableDate(shown_at) }
                        </p>
                    ) : null }
                </CardHeader>
            </div>
            <CardFooter>
                { hasBeenSuggested || shown_at ? (
                    <Suspense fallback={ <div>Loading...</div> }>
                        <VoteButton movieId={ movie.id }/>
                    </Suspense>
                ) : (
                    <SuggestButton movieDetails={ movie as unknown as MovieDetails }/>
                ) }
            </CardFooter>
        </Card>
    );
}
