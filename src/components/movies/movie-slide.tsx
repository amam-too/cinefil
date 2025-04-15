"use client";

import VoteButton from "@/components/movie-actions/vote-button";
import ProposeMovieManager from "@/components/propositions/propose-movie-manager";
import { type EnhancedMovie } from "@/server/services/movie";
import { getHumanReadableDate, getYearOnly } from "@/utils/date";
import Link from "next/link";
import React from "react";

interface MovieSlideProps {
    movie: EnhancedMovie;
}

export default function MovieSlide({movie}: MovieSlideProps) {
    
    return (
        <div className="embla__slide w-64 flex-shrink-0 px-2">
            <Link href={ `/movie/${ movie.id }` }>
                <div className="group cursor-pointer relative">
                    <img
                        src={ `https://image.tmdb.org/t/p/w500${ movie.poster_path }` }
                        alt={ movie.title }
                        className={ `h-96 w-full rounded-md object-cover ${
                            movie.shown_at ? "opacity-50 grayscale" : ""
                        }` }
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex h-1/2 flex-col justify-end rounded-b-md bg-gradient-to-t from-black via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <h3 className="text-lg font-bold text-white">{ movie.title }</h3>
                        <p className="text-sm text-gray-500">{ getYearOnly(movie.release_date) }</p>
                    </div>
                </div>
            </Link>
            { movie.shown_at && (
                <CalendarBadge shown_at={movie.shown_at} />
            ) }
            { !movie.shown_at && (
                <div className="mt-2">
                    { movie.is_proposed ? (
                        <VoteButton movieId={ movie.id } initial={ movie.userHasVoted }/>
                    ) : (
                        <ProposeMovieManager movie={ movie }/>
                    ) }
                </div>
            ) }
        </div>
    );
}

const CalendarBadge = ({shown_at}: { shown_at: string }) => (
    <div className="absolute top-5 right-5">
        { getHumanReadableDate(shown_at) }
    </div>
)