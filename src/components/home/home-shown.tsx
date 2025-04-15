import MoviesCarousel from "@/components/movies/movies-carousel";
import { getEnhancedMovies } from "@/server/services/movie";
import { getShownMovies } from "@/server/services/propositions";
import React from "react";

export default async function HomeShown() {
    const shownMovies = await getShownMovies();
    const movies = await getEnhancedMovies(shownMovies.map(movie => movie.id));
    
    if (!movies?.length) {
        return null;
    }
    
    return (
        <section className="opacity-60">
            <h2 className="mb-4 text-3xl font-bold">
                Films déjà projetés
            </h2>
            <MoviesCarousel movies={ movies }/>
        </section>
    )
}