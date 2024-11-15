"use server";

import { type VoteForMovieResponse } from "@/types/responses";
import { createClient } from "@/utils/supabase/server";

/**
 * Votes for one movie.
 * This database checks whether the user has already voted for this movie, thanks to its primary keys.
 * @param tmdb_id
 */
export async function voteForMovie(tmdb_id: string): Promise<VoteForMovieResponse> {
    const supabase = createClient()
    
    const {data: session, error: sessionError} = await supabase.auth.getUser();
    
    if (sessionError || !session) {
        console.error(sessionError)
        return {
            success: false,
            message: "Une erreur est survenue, merci de réessayer ultérieurement."
        }
    }
    
    const { error } = await supabase
      .from("votes")
      .insert({
        tmdb_id: tmdb_id,
        user_id: session.user.id
      });
    
    if (error) {
        console.error(error)
        return {
            success: false,
            message: "Une erreur est survenue, merci de réessayer ultérieurement."
        }
    }
    
    return {
        success: true,
        message: "A voté !"
    }
}

export async function unvoteForMovie(tmdb_id: string): Promise<VoteForMovieResponse> {
    const supabase = createClient()
    
    const {data: session, error: sessionError} = await supabase.auth.getUser();
    
    if (sessionError || !session) {
        console.error(sessionError)
        return {
            success: false,
            message: "Une erreur est survenue, merci de réessayer ultérieurement."
        }
    }
    
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("tmdb_id", tmdb_id)
      .eq("user_id", session.user.id);
    
    if (error) {
        console.error(error)
        return {
            success: false,
            message: "Une erreur est survenue, merci de réessayer ultérieurement."
        }
    }
    
    return {
        success: true,
        message: "Ton vote a été retiré."
    }
}