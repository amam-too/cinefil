import MoviesCarousel from "@/components/movies/movies-carousel";
import { getEnhancedMovies } from "@/server/services/movie";
import { getDiscoverMovies } from "@/server/services/tmdb";
import React from "react";

export default async function HomeDiscover() {
    const discoveries = await getDiscoverMovies();
    
    if (!discoveries) {
        return null;
    }
    
    const movies = await getEnhancedMovies(discoveries.results.map(movie => movie.id));
    
    if (!movies?.length) {
        return null;
    }
    
    return (
        <section>
            <h2 className="mb-4 text-3xl font-bold">
                Découvertes
            </h2>
            <MoviesCarousel movies={ movies }/>
        </section>
    )
}