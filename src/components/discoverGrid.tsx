import MoviesGrid from "@/components/movie/moviesGrid";
import { getDiscoverMovies } from "@/server/services/tmdb";
import React, { Suspense } from "react";

export async function DiscoverGrid() {
    const discoverMovies = await getDiscoverMovies();
    
    if (!discoverMovies || !discoverMovies.results) {
        return null;
    }
    
    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold mt-4 ml-8">Gallerie de films</h1>
            <Suspense fallback={ <p>Loading...</p> }>
            <MoviesGrid movies={ discoverMovies.results } forSuggestions={ true }/>
            </Suspense>
        </div>
    )
}