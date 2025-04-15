import MoviesCarousel from "@/components/movies/movies-carousel";
import { getEnhancedMovies } from "@/server/services/movie";
import { getPropositions } from "@/server/services/propositions";
import React from "react";

export default async function HomePropositions() {
    const propositions = await getPropositions();
    const movies = await getEnhancedMovies(propositions.map(movie => movie.movie_id));
    
    if (!movies?.length) {
        return (
            <section>
                <h2 className="mb-4 text-3xl font-bold">
                    Propositions
                </h2>
                
                <div className="flex justify-center items-center w-full h-44 border border-dashed border-muted-foreground rounded-xl text-muted-foreground">
                    <div className="flex flex-col gap-1 justify-center items-center w-full">
                        <h3 className="text-lg font-bold text-white">
                            Aucune proposition
                        </h3>
                        <p className="text-muted-foreground">
                            N&apos;hésite pas à proposer un film en cherchant ou en cliquant sur l'un des films proposés.
                        </p>
                    </div>
                </div>
            </section>
        )
    }
    
    return (
        <section>
            <h2 className="mb-4 text-3xl font-bold">
                Propositions
            </h2>
            <MoviesCarousel movies={ movies }/>)
        </section>
    )
}