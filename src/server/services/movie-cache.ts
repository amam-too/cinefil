"use server"

import { createClient } from "@/utils/supabase/server";
import { type Movie } from "tmdb-ts";
import { getMovieDetails } from "./tmdb";

/**
 * Gets a movie by TMDB ID, either from cache or from TMDB API
 * @param tmdbId - The TMDB ID of the movie
 * @param forceRefresh - Force refresh from TMDB API (default: false)
 */
export async function getMovie(tmdbId: number, forceRefresh = false): Promise<Movie> {
    const supabase = await createClient();
    
    // If not forcing refresh, try to get from cache first
    if (!forceRefresh) {
        const {data: cachedMovie, error} = await supabase
            .from("movies")
            .select("*")
            .eq("tmdb_id", tmdbId)
            .single();
        
        if (cachedMovie && !error) {
            return cachedMovie as unknown as Movie;
        }
    }
    
    // If not in cache or forcing refresh, get from TMDB API
    try {
        const movieDetails = await getMovieDetails(tmdbId);
        
        // Create simplified movie object for cache
        const movieCache = {
            id: movieDetails.id,
            tmdb_id: movieDetails.id,
            title: movieDetails.title,
            poster_path: movieDetails.poster_path,
            backdrop_path: movieDetails.backdrop_path,
            release_date: movieDetails.release_date,
            overview: movieDetails.overview,
            vote_average: movieDetails.vote_average,
            vote_count: movieDetails.vote_count,
            popularity: movieDetails.popularity,
            adult: movieDetails.adult,
            runtime: movieDetails.runtime,
            original_language: movieDetails.original_language,
            original_title: movieDetails.original_title,
            video: movieDetails.video,
            tagline: movieDetails.tagline || "",
            last_updated: new Date().toISOString()
        };
        
        // Update cache asynchronously
        supabase
            .from("movies")
            .upsert(movieCache, {onConflict: "tmdb_id"})
            .then(({error}) => {
                if (error) console.error("Error updating movie cache:", error);
                else {
                    // Store genres if available
                    if (movieDetails.genres && movieDetails.genres.length > 0) {
                        // First, ensure all genres exist in the genres table
                        const genreUpsertPromises = movieDetails.genres.map(genre =>
                            supabase.from("genres").upsert({id: genre.id, name: genre.name})
                        );
                        
                        void Promise.all(genreUpsertPromises)
                            .then(() => {
                                // Then create movie-genre associations
                                const movieGenreData = movieDetails.genres.map(genre => ({
                                    movie_id: movieDetails.id,
                                    genre_id: genre.id
                                }));
                                
                                supabase
                                    .from("movie_genres")
                                    .upsert(movieGenreData, {
                                        onConflict: "movie_id,genre_id"
                                    })
                                    .then(({error}) => {
                                        if (error) console.error("Error storing movie genres:", error);
                                    });
                            });
                    }
                    
                    // Handle production companies if available
                    if (movieDetails.production_companies && movieDetails.production_companies.length > 0) {
                        // First ensure all companies exist
                        const companyUpsertPromises = movieDetails.production_companies.map(company =>
                            supabase.from("production_companies").upsert({
                                id: company.id,
                                name: company.name,
                                logo_path: company.logo_path
                            })
                        );
                        
                        void Promise.all(companyUpsertPromises)
                            .then(() => {
                                // Then create movie-company associations
                                const movieCompanyData = movieDetails.production_companies.map(company => ({
                                    movie_id: movieDetails.id,
                                    company_id: company.id
                                }));
                                
                                supabase
                                    .from("movie_production_companies")
                                    .upsert(movieCompanyData, {
                                        onConflict: "movie_id,company_id"
                                    })
                                    .then(({error}) => {
                                        if (error) console.error("Error storing production companies:", error);
                                    });
                            });
                    }
                }
            });
        
        // Return the movie details
        return movieCache as unknown as Movie;
    } catch (err) {
        console.error(`Error fetching movie ${ tmdbId }:`, err);
        throw new Error(`Failed to get movie ${ tmdbId }`);
    }
}