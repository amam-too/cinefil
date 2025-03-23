"use client";

import { Button } from "@/components/ui/button";
import { getMovieDetails } from "@/server/services/tmdb";
import { type Proposition } from "@/types/proposition";
import { getYearOnly } from "@/utils/date";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { type MovieDetails } from "tmdb-ts";
import { getCurrentPropositions } from "@/server/services/propositions";

interface ToDiscardMoviesProps {
    handleChoice: (tmdb_id: number) => void;
}

export function ToDiscardMovies({ handleChoice }: ToDiscardMoviesProps) {
    const [movies, setMovies] = useState<MovieDetails[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const propositions: Proposition[] = await getCurrentPropositions();
                const movieDetails = await Promise.all(propositions.map((movie: Proposition) => getMovieDetails(movie.tmdb_id)));
                setMovies(movieDetails);
            } catch {
                toast.error("Une erreur est survenue lors de la récupération des propositions.");
            } finally {
                setLoading(false);
            }
        };
        
        void fetchMovies();
    }, []);
    
    if (loading) {
        return <MoviesSkeleton />;
    }
    
    return movies.map((movie, index) => (
        <div key={index} className="flex flex-col items-center justify-between gap-4 w-full max-w-[200px]">
            <div className="flex flex-col h-full w-full gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */ }
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="object-cover w-full h-auto aspect-[2/3]"
                />
                
                <div className="flex flex-col p-2 px-3 w-full text-center items-center">
                    <h1 className="font-semibold text-sm sm:text-base md:text-lg break-words">{movie.title}</h1>
                    <p className="text-start text-xs sm:text-sm text-gray-500">{getYearOnly(movie.release_date)}</p>
                </div>
            </div>
            <Button
                variant="destructive"
                onClick={() => handleChoice(movie.id)}
                className="text-xs sm:text-sm md:text-base text-center px-2 py-1 sm:px-4 sm:py-2"
            >
                Supprimer
            </Button>
        </div>
    ));
}

function MoviesSkeleton() {
    return Array(3)
        .fill(null)
        .map((_, index) => (
            <div key={index} className="flex flex-col items-center justify-between gap-4 w-full max-w-[200px]">
                <div className="bg-stone-800 w-full h-[300px] animate-pulse"></div>
                <div className="bg-stone-800 w-full h-8 animate-pulse"></div>
                <div className="bg-stone-800 w-full h-8 animate-pulse"></div>
            </div>
        ));
}