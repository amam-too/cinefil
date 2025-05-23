"use server";

import { createClient } from "@/utils/supabase/server";
import {
  type Cast,
  type Crew,
  type Genre,
  type Movie,
  type Recommendation,
} from "tmdb-ts";
import { getMovieCredits, getMovieDetails, getSuggestions } from "./tmdb";
import { hasUserVotedForProposal } from "@/server/services/votes";

export interface EnhancedMovie extends Movie {
  genres: Genre[];
  cast: Cast[];
  crew: Crew[];
  director: Crew | null;
  writers: Crew[];
  recommendations: Recommendation[];
  movie_proposal_id: number;
  proposed_by?: string;
  proposedAt?: string;
  shown_at?: string;
  voteCount: number;
  fromCache: boolean;
  lastUpdated: string;
  runtime: number;
  tagline: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  cinefil_votes_count: number;
  user_has_voted: boolean;
}

export async function getEnhancedMovie(
  tmdbId: number,
  userId?: string,
): Promise<EnhancedMovie> {
  const supabase = await createClient();

  if (!userId) {
    const { data: userData } = await supabase.auth.getUser();
    userId = userData.user?.id;
  }

  const { data: cachedMovie, error } = (await supabase
    .from("enhanced_movies")
    .select("*")
    .eq("tmdb_id", tmdbId)
    .single()) as { data: EnhancedMovie; error: any };

  const isCached: boolean =
    cachedMovie &&
    cachedMovie.cast?.length > 0 &&
    cachedMovie.crew?.length > 0 &&
    !error;

  let user_has_voted: boolean = false;

  if (
    isCached &&
    cachedMovie.cinefil_votes_count > 0 &&
    cachedMovie.movie_proposal_id != null &&
    userId
  ) {
    user_has_voted = await hasUserVotedForProposal(
      cachedMovie.movie_proposal_id,
      userId,
    );
  }

  if (isCached) {
    return {
      ...cachedMovie,
      user_has_voted,
      fromCache: true,
    } as EnhancedMovie;
  }

  const movieDetails = await getMovieDetails(tmdbId);

  if (!movieDetails) {
    throw new Error("Could not find movie details");
  }

  try {
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
      last_updated: new Date().toISOString(),
    };

    await supabase
      .from("movies")
      .upsert(movie, { onConflict: "tmdb_id", ignoreDuplicates: true })
      .throwOnError();

    await Promise.all([
      storeGenres(tmdbId, movieDetails.genres),
      storeProductionCompanies(tmdbId, movieDetails.production_companies),
    ]);

    const [credits, recs] = await Promise.all([
      getMovieCredits(tmdbId),
      getSuggestions(tmdbId),
    ]);

    await Promise.all([
      storeCast(credits?.cast, tmdbId),
      storeCrew(credits?.crew, tmdbId),
      storeRecommendations(recs?.results, tmdbId),
    ]);

    return {
      ...movie,
      genres: movieDetails.genres ?? [],
      cast: credits?.cast ?? [],
      crew: credits?.crew ?? [],
      director:
        credits?.crew.find((person) => person.job === "Director") ?? null,
      writers:
        credits?.crew.filter((person) =>
          ["Screenplay", "Writer", "Story"].includes(person.job),
        ) ?? [],
      recommendations: recs?.results ?? [],
      voteCount: movieDetails.vote_count,
      fromCache: false,
      lastUpdated: movie.last_updated,
      genre_ids: movieDetails.genres.map((genre) => genre.id),
      production_companies: movieDetails.production_companies ?? [],
      cinefil_votes_count: 0,
      movie_proposal_id: 0,
      proposedAt: "",
      proposed_by: "",
      shown_at: "",
      user_has_voted: false,
    };
  } catch (err) {
    console.error(`Error fetching movie ${tmdbId}:`, err);
    throw new Error(`Failed to get movie ${tmdbId}`);
  }
}

export async function getEnhancedMovies(
  tmdbIds: number[],
  options: {
    concurrency?: number;
    ignoreErrors?: boolean;
  } = {},
): Promise<EnhancedMovie[]> {
  const { concurrency = 4, ignoreErrors = false } = options;

  // Use Promise.all with a concurrency limit to fetch movies.
  const enhancedMovies: EnhancedMovie[] = [];

  // Process movies in batches to control concurrency.
  for (let i = 0; i < tmdbIds.length; i += concurrency) {
    const batch = tmdbIds.slice(i, i + concurrency);

    // Fetch batch of movies concurrently.
    const batchResults = await Promise.all(
      batch.map(async (tmdbId) => {
        try {
          return await getEnhancedMovie(tmdbId);
        } catch (error) {
          if (ignoreErrors) {
            console.warn(
              `Failed to fetch movie with TMDB ID ${tmdbId}:`,
              error,
            );
            return null;
          }
          throw error;
        }
      }),
    );

    // Filter out null results if ignoreErrors is true.
    const validResults = batchResults.filter(
      (movie): movie is EnhancedMovie => movie !== null,
    );
    enhancedMovies.push(...validResults);
  }

  return enhancedMovies;
}

async function storeGenres(movieId: number, genres?: Genre[]) {
  if (!genres || genres.length === 0) return;
  const supabase = await createClient();

  await supabase
    .from("genres")
    .upsert(
      genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
      { ignoreDuplicates: true },
    )
    .throwOnError();

  await supabase.from("movie_genres").upsert(
    genres.map(({ id }) => ({ genre_id: id, movie_id: movieId })),
    { onConflict: "movie_id,genre_id", ignoreDuplicates: true },
  );
}

async function storeProductionCompanies(
  movieId: number,
  companies?: { id: number; name: string; logo_path?: string }[],
) {
  if (!companies || companies.length === 0) return;
  const supabase = await createClient();

  await supabase
    .from("production_companies")
    .upsert(
      companies.map((company) => ({
        id: company.id,
        name: company.name,
        logo_path: company.logo_path,
      })),
      { ignoreDuplicates: true },
    )
    .throwOnError();

  await supabase
    .from("movie_production_companies")
    .upsert(
      companies
        .slice(0, 4)
        .map(({ id }) => ({ company_id: id, movie_id: movieId })),
      { onConflict: "movie_id,company_id", ignoreDuplicates: true },
    )
    .throwOnError();
}

async function storeCast(cast: Cast[] | undefined, movieId: number) {
  if (!cast || cast.length === 0) return;
  const supabase = await createClient();

  await supabase
    .from("cast_members")
    .upsert(
      cast.map((cast_member) => ({
        id: cast_member.id,
        name: cast_member.name,
        profile_path: cast_member.profile_path,
        gender: cast_member.gender,
        popularity: cast_member.popularity,
      })),
      { ignoreDuplicates: true },
    )
    .throwOnError();

  await supabase
    .from("movie_cast")
    .upsert(
      cast.map(({ id, character, order }) => ({
        movie_id: movieId,
        cast_id: id,
        character: character,
        actor_order: order,
      })),
      { onConflict: "movie_id,cast_id", ignoreDuplicates: true },
    )
    .throwOnError();
}

async function storeCrew(crew: Crew[] | undefined, movieId: number) {
  if (!crew || crew.length === 0) return;
  const supabase = await createClient();
  await supabase
    .from("crew_members")
    .upsert(
      crew.map((crew_member) => ({
        id: crew_member.id,
        name: crew_member.name,
        profile_path: crew_member.profile_path,
        gender: crew_member.gender,
        popularity: crew_member.popularity,
      })),
      { ignoreDuplicates: true },
    )
    .throwOnError();
  await supabase
    .from("movie_crew")
    .upsert(
      crew.slice(0, 4).map(({ id, department, job }) => ({
        movie_id: movieId,
        crew_id: id,
        department,
        job,
      })),
      { onConflict: "movie_id,crew_id", ignoreDuplicates: true },
    )
    .throwOnError();
}

async function storeRecommendations(
  recommendations: Recommendation[] | undefined,
  movieId: number,
) {
  if (!recommendations || recommendations.length === 0) return;
  const supabase = await createClient();

  await supabase
    .from("movie_recommendations")
    .upsert(
      recommendations.slice(0, 4).map(({ id }) => ({
        movie_id: movieId,
        recommended_movie_id: id,
      })),
      { ignoreDuplicates: true, onConflict: "movie_id,recommended_movie_id" },
    )
    .throwOnError();
}
