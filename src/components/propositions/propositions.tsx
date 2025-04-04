import MoviesGrid from "@/components/movie/movies-grid";
import { type EnhancedMovie } from "@/server/services/movie";
import { getMovieDetails } from "@/server/services/tmdb";
import { getMoviesVotedByUser } from "@/server/services/votes";
import { type Proposition } from "@/types/proposition";
import { createClient } from "@/utils/supabase/server";
import React, { Suspense } from "react";

export default async function Propositions({
                                               displayShown
                                           }: {
    displayShown?: string;
}) {
    const fetchMoviesDetails = (propositions: Proposition[]) => {
        const moviePromises = propositions.map((proposition) =>
            getMovieDetails(proposition.tmdb_id)
        );
        return Promise.all(moviePromises);
    };
    
    const fetchPropositions = async () => {
        const supabase = await createClient();
        
        const {data, error} = await supabase
            .from("movie_proposals")
            .select()
            .order("shown_at", {ascending: false});
        if (error) {
            console.error("Error fetching propositions:", error);
            return [];
        }
        return data && data.length > 0
            ? fetchMoviesDetails(data as Proposition[])
            : [];
    };
    
    return (
        <div className="flex flex-col">
            <h1 className="ml-8 mt-4 text-2xl font-bold">Films proposés</h1>
            <Suspense fallback={ <p>Loading...</p> }>
                <MoviesGrid
                    movies={ (await fetchPropositions()) as unknown as EnhancedMovie[] }
                    displayShown={ displayShown }
                    votedMovies={ await getMoviesVotedByUser() }
                />
            </Suspense>
        </div>
    );
}