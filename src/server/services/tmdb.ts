'use server'

import { RateLimiterMemory } from 'rate-limiter-flexible';
import { type Credits, type Movie, type MovieDetails, type Recommendations, type Search, TMDB } from 'tmdb-ts';

const tmdb = new TMDB(process.env.TMDB_API_TOKEN!);
const rateLimiter = new RateLimiterMemory({
    points: 30,
    duration: 60
});

const handleRateLimit = async (key: string | number) => {
    try {
        await rateLimiter.consume(key);
    } catch {
        throw new Error('Too many requests, please try again later.');
    }
};

export const searchMovies = async (query: string): Promise<Search<Movie>> => {
    await handleRateLimit(query);
    try {
        return await tmdb.search.movies({query, include_adult: false});
    } catch (err) {
        console.error('Error fetching movies:', err);
        throw new Error('Failed to fetch movies from TMDB.');
    }
};

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
    await handleRateLimit(id);
    try {
        return await tmdb.movies.details(id);
    } catch (err) {
        console.error('Error fetching movie details:', err);
        throw new Error('Failed to get details for movie from TMDB.');
    }
};

export const getMovieCredits = async (id: number): Promise<Credits> => {
    await handleRateLimit(id);
    try {
        return await tmdb.movies.credits(id);
    } catch (err) {
        console.error('Error fetching movie crew:', err);
        throw new Error('Failed to get crew for movie from TMDB.');
    }
}

export const getDiscoverMovies = async (): Promise<Search<Movie>> => {
    await handleRateLimit('discover');
    try {
        return await tmdb.discover.movie();
    } catch (err) {
        console.error('Error fetching discover movies:', err);
        throw new Error('Failed to fetch discover movies from TMDB.');
    }
}

export const getSuggestions = async (id: number): Promise<Recommendations> => {
    await handleRateLimit(id);
    try {
        return await tmdb.movies.recommendations(id);
    } catch (err) {
        console.error('Error fetching suggestions:', err);
        throw new Error('Failed to get suggestions for movie from TMDB.');
    }
};