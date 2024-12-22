"use server";

import { RateLimiterMemory } from "rate-limiter-flexible";
import { type Movie, type MovieDetails, type Search, TMDB } from "tmdb-ts";

const LOCALE = "fr-FR";

const tmdb = new TMDB(process.env.TMDB_API_TOKEN!);
const rateLimiter = new RateLimiterMemory({
  points: 15,
  duration: 60,
});

const handleRateLimit = async (key: string | number) => {
  try {
    await rateLimiter.consume(key);
  } catch {
    throw new Error("Too many requests, please try again later.");
  }
};

/**
 * TMDB Service to search for movies.
 * @param query
 */
export const searchMovies = async (query: string): Promise<Search<Movie>> => {
  // Use rate limiter to prevent excessive calls.
  await handleRateLimit(query);
  try {
    // Call the TMDB API.
    return await tmdb.search.movies({ query });
  } catch (err) {
    // Handle TMDB API errors.
    console.error("Error fetching movies:", err);
    throw new Error("Failed to fetch movies from TMDB.");
  }
};

/**
 * TMDB Service to get details for a given movie.
 * @param id
 */
export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  // Use rate limiter to prevent excessive calls.
  await handleRateLimit(id);
  try {
    // Call the TMDB API.
    return await tmdb.movies.details(id, undefined, LOCALE);
  } catch (err) {
    // Handle TMDB API errors.
    console.error("Error fetching movie details:", err);
    throw new Error("Failed to get details for movie from TMDB.");
  }
};

export const getDiscoverMovies = async (): Promise<Search<Movie>> => {
  // Use rate limiter to prevent excessive calls.
  await handleRateLimit("discover");
  try {
    // Call the TMDB API.
    return await tmdb.discover.movie({ language: LOCALE });
  } catch (err) {
    // Handle TMDB API errors.
    console.error("Error fetching discover movies:", err);
    throw new Error("Failed to fetch discover movies from TMDB.");
  }
};

export const getSuggestions = async (id: number): Promise<Search<Movie>> => {
  // Use rate limiter to prevent excessive calls.
  await handleRateLimit(id);
  try {
    // Call the TMDB API.
    return await tmdb.movies.similar(id, { language: LOCALE });
  } catch (err) {
    // Handle TMDB API errors.
    console.error("Error fetching suggestions:", err);
    throw new Error("Failed to get suggestions for movie from TMDB.");
  }
};
