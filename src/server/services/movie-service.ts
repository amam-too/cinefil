"use server"

import { createClient } from "@/utils/supabase/server";
import { type SupabaseClient } from "@supabase/supabase-js";
import { type Cast, type Crew, type Movie } from "tmdb-ts";
import { getMovieCredits, getMovieDetails, getSuggestions } from "./tmdb";

interface Genre {
    id: number;
    name: string;
}

export interface EnhancedMovie extends Movie {
    genres: Genre[];
    cast: Cast[];
    crew: Crew[];
    director: Crew | null;
    writers: Crew[];
    recommendations: Movie[];
    isProposed: boolean;
    proposedBy?: string;
    proposedAt?: string;
    shown_at?: string;
    userHasVoted: boolean;
    voteCount: number;
    fromCache: boolean;
    lastUpdated: string;
    runtime: number;
    tagline: string;
    production_companies: { id: number; name: string; logo_path: string | null }[];
}

export async function getEnhancedMovie(tmdbId: number, userId?: string): Promise<EnhancedMovie> {
    const supabase = await createClient();
    
    if (!userId) {
        const {data: userData} = await supabase.auth.getUser();
        userId = userData.user?.id;
    }
    
    const {data: cachedMovie, error} = await supabase
        .from("enhanced_movies")
        .select("*, movie_cast(*)")
        .eq("tmdb_id", tmdbId)
        .single() as { data: EnhancedMovie & { movie_cast: Cast[] }, error: any };
    
    const isCached: boolean = cachedMovie && cachedMovie.movie_cast.length > 0 && !error;
    
    // show if it is in cache or not
    console.log("strategy", isCached ? "cache" : "api");
    
    if (isCached) {
        return {
            ...cachedMovie,
            userHasVoted: await hasUserVoted(supabase, cachedMovie.id, userId),
            fromCache: true
        } as EnhancedMovie;
    }
    
    try {
        const movieDetails = await getMovieDetails(tmdbId);
        const movie = {
            id: movieDetails.id,
            tmdb_id: tmdbId,
            title: movieDetails.title,
            poster_path: movieDetails.poster_path ?? "",
            backdrop_path: movieDetails.backdrop_path,
            release_date: movieDetails.release_date,
            overview: movieDetails.overview,
            vote_average: movieDetails.vote_average,
            vote_count: movieDetails.vote_count,
            popularity: movieDetails.popularity,
            adult: movieDetails.adult,
            original_language: movieDetails.original_language,
            original_title: movieDetails.original_title,
            video: movieDetails.video,
            runtime: movieDetails.runtime ?? 0,
            tagline: movieDetails.tagline ?? "",
            cached_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
        };
        
        await supabase.from("movies").upsert(movie, {onConflict: "tmdb_id"}).throwOnError();
        
        await Promise.all([
            storeGenres(tmdbId, movieDetails.genres),
            storeProductionCompanies(tmdbId, movieDetails.production_companies)
        ]);
        
        const [credits, recs] = await Promise.all([
            getMovieCredits(tmdbId),
            getSuggestions(tmdbId)
        ]);
        
        await Promise.all([
            storeCast(credits.cast, tmdbId),
            storeCrew(credits.crew, tmdbId),
            storeRecommendations(recs.results, tmdbId)
        ]);
        
        return {
            ...movie,
            genres: movieDetails.genres ?? [],
            cast: credits.cast ?? [],
            crew: credits.crew ?? [],
            director: credits.crew.find(person => person.job === "Director") ?? null,
            writers: credits.crew.filter(person => ["Screenplay", "Writer", "Story"].includes(person.job)),
            recommendations: recs.results ?? [],
            isProposed: false,
            userHasVoted: false,
            voteCount: movieDetails.vote_count,
            fromCache: false,
            lastUpdated: movie.last_updated,
            genre_ids: movieDetails.genres.map(genre => genre.id),
            production_companies: movieDetails.production_companies ?? []
        };
    } catch (err) {
        console.error(`Error fetching movie ${ tmdbId }:`, err);
        throw new Error(`Failed to get movie ${ tmdbId }`);
    }
}

async function hasUserVoted(supabase: SupabaseClient<any, "public", any>, movieId: number, userId?: string) {
    if (!userId) return false;
    const {data} = await supabase
        .from("movie_votes")
        .select("id")
        .eq("movie_id", movieId)
        .eq("user_id", userId)
        .single();
    return !!data;
}

async function storeGenres(movieId: number, genres?: Genre[]) {
    if (!genres || genres.length === 0) return;
    const supabase = await createClient();
    await supabase.from("genres").upsert(genres);
    await supabase.from("movie_genres").upsert(genres.map(({id}) => ({genre_id: id, movie_id: movieId})), {onConflict: "movie_id,genre_id"});
}

async function storeProductionCompanies(movieId: number, companies?: { id: number; name: string; logo_path?: string }[]) {
    if (!companies || companies.length === 0) return;
    const supabase = await createClient();
    await supabase.from("production_companies").upsert(companies);
    await supabase.from("movie_production_companies").upsert(companies.map(({id}) => ({company_id: id, movie_id: movieId})), {onConflict: "movie_id,company_id"});
}

async function storeCast(cast: Cast[], movieId: number) {
    if (!cast || cast.length === 0) return;
    const supabase = await createClient();
    await supabase.from("cast_members").upsert(cast.map(cast_member => ({
        id: cast_member.id,
        name: cast_member.name,
        profile_path: cast_member.profile_path,
        gender: cast_member.gender,
        popularity: cast_member.popularity
    })), {ignoreDuplicates: true}).throwOnError();
    await supabase
        .from("movie_cast")
        .upsert(
            cast.map(({id, character, order}) => ({
                movie_id: movieId,
                cast_id: id,
                character: character,
                actor_order: order
            })), {onConflict: "movie_id,cast_id", ignoreDuplicates: true})
        .throwOnError();
}

async function storeCrew(crew: Crew[], movieId: number) {
    if (!crew || crew.length === 0) return;
    const supabase = await createClient();
    await supabase.from("crew_members").upsert(crew.map(crew_member => ({
        id: crew_member.id,
        name: crew_member.name,
        profile_path: crew_member.profile_path,
        gender: crew_member.gender,
        popularity: crew_member.popularity
    })), {ignoreDuplicates: true}).throwOnError();
    await supabase.from("movie_crew").upsert(crew.map(({id, department, job}) => ({movie_id: movieId, crew_id: id, department, job})), {onConflict: "movie_id,crew_id", ignoreDuplicates: true}).throwOnError();
}

async function storeRecommendations(recommendations: Movie[], movieId: number) {
    if (!recommendations || recommendations.length === 0) return;
    const supabase = await createClient();
    await supabase.from("movies").upsert(recommendations.map(({id, title, poster_path, backdrop_path, release_date, overview, vote_average, popularity, adult, original_language, original_title, video}) => ({
        id,
        tmdb_id: id,
        title,
        poster_path: poster_path || "",
        backdrop_path: backdrop_path || "",
        release_date: release_date || "",
        overview: overview || "",
        vote_average: vote_average || 0,
        popularity: popularity || 0,
        adult: adult || false,
        original_language: original_language || "",
        original_title: original_title || "",
        video: video || false
    })));
    await supabase.from("movie_recommendations").upsert(recommendations.map(({id}) => ({movie_id: movieId, recommended_movie_id: id})));
}
