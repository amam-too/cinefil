"use server";

import { RateLimiterMemory } from "rate-limiter-flexible";
import {
  type Credits,
  type Movie,
  type MovieDetails,
  type Recommendations,
  type Search,
  TMDB,
} from "tmdb-ts";

const tmdb = new TMDB(process.env.TMDB_API_TOKEN!);
const rateLimiter = new RateLimiterMemory({
  points: 50,
  duration: 60,
});

/**
 * TODO DOC
 * @param key
 */
const handleRateLimit = async (key: string | number) => {
  try {
    await rateLimiter.consume(key);
  } catch {
    throw new Error("Too many requests, please try again later.");
  }
};

/**
 * TODO DOC
 * @param query
 */
export const searchMovies = async (
  query: string,
): Promise<Search<Movie> | null> => {
  await handleRateLimit(query);
  try {
    return await tmdb.search.movies({ query, include_adult: false });
  } catch (err) {
    console.error("Error fetching movies:", err);
    return null;
  }
};

/**
 * Fetches detailed information for a specific movie from TMDB.
 *
 * @param id - The TMDB movie id.
 * @returns A promise that resolves to the movie details.
 */
export const getMovieDetails = async (
  id: number,
): Promise<MovieDetails | null> => {
  await handleRateLimit(id);
  try {
    return await tmdb.movies.details(id);
  } catch (err) {
    console.error(`Error fetching movie ${id} details:`, err);
    return null;
  }
};

/**
 * TODO DOC
 * @param id
 */
export const getMovieCredits = async (id: number): Promise<Credits | null> => {
  await handleRateLimit(id);
  try {
    return await tmdb.movies.credits(id);
  } catch (err) {
    console.error("Error fetching movie crew:", err);
    return null;
  }
};

/**
 * Fetches discover movies from TMDB.
 *
 * @returns A promise that resolves to the TMDB discover movies response.
 */
export const getDiscoverMovies = async (): Promise<Search<Movie> | null> => {
  await handleRateLimit("discover");
  try {
    return await tmdb.discover.movie();
  } catch (err) {
    console.error("Error fetching discover movies:", err);
    return null;
  }
};

/**
 * TODO DOC
 * @param id
 */
export const getSuggestions = async (
  id: number,
): Promise<Recommendations | null> => {
  await handleRateLimit(id);
  try {
    return await tmdb.movies.recommendations(id);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    return null;
  }
};