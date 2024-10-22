import MoviesGrid from "@/components/movie/moviesGrid";
import { getMovieDetails } from "@/server/services/tmdb";
import { type Suggestion } from "@/types/suggestion";
import { createClient } from "@/utils/supabase/server";
import React, { Suspense } from "react";
import { type Movie } from "tmdb-ts";

export default async function Suggestions({displayShown}: {
    displayShown?: string | undefined,
}) {
    
    /**
     * Fetch movie details for each suggestion based on tmdb_id.
     * @param suggestions
     */
    const fetchMoviesDetails = async (suggestions: Suggestion[]) => {
        const moviePromises = suggestions.map(async (suggestion) => {
            return await getMovieDetails(suggestion.tmdb_id);
        });
        
        return await Promise.all(moviePromises);
    };
    
    /**
     *
     */
    const fetchSuggestions = async () => {
        const {data, error} = await createClient().from("suggestions").select()
            .order('shown_at', {ascending: false});  // Sort by shown_at in descending order.
        
        if (error) {
            console.error("Error fetching suggestions:", error);
            // TODO : Add error handlingg.
            return <>{ error }</>;
        }
        
        if (data && data.length > 0) {
            return fetchMoviesDetails(data as Suggestion[]);
        }
    }
    
    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-center mt-4">Suggestions des utilisateurs</h1>
            <Suspense>
                <MoviesGrid movies={ await fetchSuggestions() as unknown[] as Movie[] } forSuggestions={ true }
                            displayShown={ displayShown }/>
            </Suspense>
        </div>
    );
}