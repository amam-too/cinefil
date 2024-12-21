import MoviesGrid from "@/components/movie/moviesGrid";
import { getMovieDetails } from "@/server/services/tmdb";
import { type Suggestion } from "@/types/suggestion";
import { createClient } from "@/utils/supabase/server";
import React, { Suspense } from "react";
import { type Movie } from "tmdb-ts";

export default async function Propositions({displayShown}: { displayShown?: string }) {
    const fetchMoviesDetails = (suggestions: Suggestion[]) => {
        const moviePromises = suggestions.map(suggestion => getMovieDetails(suggestion.tmdb_id));
        return Promise.all(moviePromises);
    };
    
    const fetchSuggestions = async () => {
        const {data, error} = await createClient().from("suggestions").select().order('shown_at', {ascending: false});
        if (error) {
            console.error("Error fetching suggestions:", error);
            return [];
        }
        return data && data.length > 0 ? fetchMoviesDetails(data as Suggestion[]) : [];
    };
    
    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold mt-4 ml-8">Films proposés</h1>
            <Suspense fallback={ <p>Loading...</p> }>
                <MoviesGrid movies={ await fetchSuggestions() as unknown as Movie[] } forSuggestions={ true } displayShown={ displayShown }/>
            </Suspense>
        </div>
    );
}