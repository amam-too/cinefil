// MovieSlide.tsx
"use client";

import React from "react";
import Link from "next/link";
import { type EnhancedMovie } from "@/server/services/movie";
import ProposeMovieManager from "@/components/propositions/proposeMovieManager";
import VoteButton from "@/components/customButtons/voteButton";
import { getHumanReadableDate, getYearOnly } from "@/utils/date";

interface MovieSlideProps {
  movie: EnhancedMovie;
  filmCanBeProposed: boolean;
  userHasVotedFor: boolean;
  shownAt: string;
  user: any;
}

export default function MovieSlide({
                                       movie,
                                       filmCanBeProposed,
                                       userHasVotedFor,
                                       shownAt,
                                       user,
                                   }: MovieSlideProps) {
    return (
        <div className="embla__slide w-64 flex-shrink-0 px-2">
            <Link href={`/movie/${movie.id}`}>
                <div className="group cursor-pointer relative">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className={`h-96 w-full rounded-md object-cover ${
                            shownAt ? "opacity-50 grayscale" : ""
                        }`}
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex h-1/2 flex-col justify-end rounded-b-md bg-gradient-to-t from-black via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <h3 className="text-lg font-bold text-white">{movie.title}</h3>
                        <p className="text-sm text-gray-500">{getYearOnly(movie.release_date)}</p>
                        {shownAt && (
                            <p className="pt-8 text-sm font-bold text-red-500">
                                Diffusé {getHumanReadableDate(shownAt)}
                            </p>
                        )}
                    </div>
                </div>
            </Link>
            {!shownAt && user && (
                <div className="mt-2">
                    {filmCanBeProposed ? (
                        <ProposeMovieManager movie={movie} />
                    ) : (
                        <VoteButton movieId={movie.id} initial={userHasVotedFor} />
                    )}
                </div>
            )}
        </div>
    );
}
