"use server";

import { createClient } from "@/utils/supabase/server";
import { type Suggestion } from "@/types/suggestion";
import { type SuggestMovieResponse } from "@/types/responses";

/**
 * Fetches all suggestions made by users.
 * @returns {Promise<Suggestion[]>} A list of all suggestions.
 */
export async function getSuggestions(): Promise<Suggestion[]> {
  const supabase = createClient();

  const { data: suggestions, error: suggestionsError } = await supabase
    .from("suggestions")
    .select("*")
    .order("shown_at", { ascending: false }); // Sort by shown_at in descending order.

  if (suggestionsError) {
    console.error("Error fetching suggestions:", suggestionsError);
    return [];
  }

  return suggestions as Suggestion[];
}

/**
 * Fetches the suggestions made by the current user.
 * If an optional list of suggestions is provided, it filters them by the current user.
 * Otherwise, it fetches the user's suggestions directly from the database.
 *
 * @param {Suggestion[]} [suggestions] Optional list of suggestions to filter.
 * @returns {Promise<Suggestion[]>} A list of suggestions made by the current user.
 */
export async function getUserSuggestions(
  suggestions?: Suggestion[],
): Promise<Suggestion[]> {
  const supabase = createClient();

  const { data: session, error: sessionError } = await supabase.auth.getUser();

  if (sessionError || !session?.user) {
    throw new Error(
      "Unable to retrieve the user session. Please try reconnecting.",
    );
  }

  if (suggestions) {
    return suggestions.filter(
      (suggestion) => suggestion.user_id === session.user.id,
    );
  }

  const { data: dbSuggestions, error: dbError } = await supabase
    .from("suggestions")
    .select("*")
    .eq("user_id", session.user.id);

  if (dbError) {
    console.error("Error fetching user suggestions:", dbError);
    return [];
  }

  return dbSuggestions as Suggestion[];
}

/**
 * Suggests a new movie by its TMDB ID.
 * @param {string} tmdb_id - The TMDB ID of the movie to suggest.
 * @returns {Promise<SuggestMovieResponse>} A response indicating the success or failure of the operation.
 */
export async function suggestMovie(
  tmdb_id: string,
): Promise<SuggestMovieResponse> {
  const supabase = createClient();

  const { data: session, error: sessionError } = await supabase.auth.getUser();

  if (sessionError || !session?.user) {
    throw new Error(
      "Unable to retrieve the user session. Please try reconnecting.",
    );
  }

  const { error } = await supabase.from("suggestions").insert({
    tmdb_id,
    shown_at: null,
    created_at: new Date().toISOString(),
    user_id: session.user.id,
  });

  if (error) {
    console.error("Error suggesting movie:", error);

    if (error.code === "23505") {
      // Duplicate entry
      throw new Error("This movie has already been suggested.");
    }

    throw new Error(
      "An error occurred. Please try again later. The movie suggestion was not recorded.",
    );
  }

  return {
    success: true,
    message: "Movie successfully suggested!",
  };
}

/**
 * Removes a suggestion for a movie by its TMDB ID.
 * @param {string} tmdb_id - The TMDB ID of the movie to remove the suggestion for.
 * @returns {Promise<SuggestMovieResponse>} A response indicating the success or failure of the operation.
 */
export async function removeSuggestion(
  tmdb_id: string,
): Promise<SuggestMovieResponse> {
  const supabase = createClient();

  const { data: session, error: sessionError } = await supabase.auth.getUser();

  if (sessionError || !session?.user) {
    throw new Error(
      "Unable to retrieve the user session. Please try reconnecting.",
    );
  }

  const { error } = await supabase
    .from("suggestions")
    .delete()
    .eq("tmdb_id", tmdb_id)
    .eq("user_id", session.user.id); // Ensure the deletion is scoped to the current user.

  if (error) {
    console.error("Error removing suggestion:", error);

    throw new Error(
      "An error occurred. Please try again later. The movie suggestion was not removed.",
    );
  }

  return {
    success: true,
    message: "Movie suggestion successfully removed!",
  };
}
