"use server";
import {
  type AlternativeTitles,
  type Changes,
  type Credits,
  type ExternalIds,
  type Images,
  type Keywords,
  type Movie,
  type MovieChangeValue,
  type MovieDetails,
  type MovieLists,
  type Recommendations,
  type ReleaseDates,
  type Reviews,
  type Search,
  type SimilarMovies,
  TMDB,
  type Translations,
  type Videos,
  type WatchProviders,
} from "tmdb-ts";
import { RateLimiterMemory } from "rate-limiter-flexible";

const LOCALE = "fr";
const tmdb: TMDB = new TMDB(process.env.TMDB_API_TOKEN!);

// Rate limiter configuration : limit to 15 requests per minute.
const rateLimiter = new RateLimiterMemory({
  points: 15, // Number of requests.
  duration: 60, // Per 60 seconds (1 minute).
});

/**
 * TMDB Service to search for movies.
 * @param query
 */
export const searchMovies = async (query: string): Promise<Search<Movie>> => {
  // Use rate limiter to prevent excessive calls.
  try {
    await rateLimiter.consume(query);

    // Will throw an error if rate limit exceeded.
  } catch (rateLimitError) {
    throw new Error("Too many requests, please try again later.");
  }

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
export const getMovieDetails = async (
  id: number,
): Promise<
  | (MovieDetails & { credits: Omit<Credits, "id"> } & {
      videos: Omit<Videos, "id">
    } & { images: Omit<Images, "id"> } & {
      recommendations: Recommendations
    } & { reviews: Omit<Reviews, "id"> } & {
      reviews: Omit<Translations, "id">
    } & { changes: Changes<MovieChangeValue> } & {
      keywords: Omit<Keywords, "id">
    } & { lists: Omit<MovieLists, "id"> } & {
      release_dates: Omit<ReleaseDates, "id">
    } & { alternative_titles: Omit<AlternativeTitles, "id"> } & {
      external_ids: Omit<ExternalIds, "id">
    } & {
      translations: Omit<Translations, "id">
    } & { "watch/providers": Omit<WatchProviders, "id"> } & object & {
        similar: SimilarMovies
      })
  | (MovieDetails & object)
> => {
  // Use rate limiter to prevent excessive calls.
  try {
    await rateLimiter.consume(id);

    // Will throw an error if rate limit exceeded.
  } catch (rateLimitError) {
    throw new Error("Too many requests, please try again later.");
  }

  try {
    // Call the TMDB API.
    return await tmdb.movies.details(id, undefined, LOCALE);
  } catch (err) {
    // Handle TMDB API errors.
    console.error("Error fetching movies:", err);
    throw new Error("Failed to get details for movie from TMDB.");
  }
};
