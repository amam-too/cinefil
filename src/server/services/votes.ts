"use server"

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
        throw new Error("Impossible de lire la session de l'utilisateur. Essayez de vous reconnecter.");
    }
    
    const numberOfVotes = await getNumberOfVotesForCurrentUser(session.user.id);
    
    if (numberOfVotes >= 3) {
        throw new Error("Tu as déjà voté pour 3 films. Tu ne peux plus voter.");
    }
    
    const { error } = await supabase
      .from("votes")
      .insert({
        tmdb_id: tmdb_id,
        user_id: session.user.id
      });
    
    if (error) {
        throw new Error("Une erreur est survenue, merci de réessayer ultérieurement. Le vote n'a pas été pris en compte.");
    }
    
    return {
        success: true,
        message: "A voté !"
    }
}

export async function hasVotedForMovie(tmdb_id: string, user_id: string): Promise<boolean> {
    const supabase = createClient()
    
    const {data: votes, error: votesError} = await supabase
      .from("votes")
      .select("*")
      .eq("tmdb_id", tmdb_id)
      .eq("user_id", user_id);
    
    if (votesError) {
        console.error(votesError)
        return false
    }
    
    return votes && votes.length > 0
}

/**
 * Returns the number of votes for the current user.
 * @returns {Promise<number>}
 */
async function getNumberOfVotesForCurrentUser(user_id: string): Promise<number> {
    const supabase = createClient()
    
    const {data: votes, error: votesError} = await supabase
      .from("votes")
      .select("*")
      .eq("user_id", user_id);
    
    if (votesError) {
        console.error(votesError)
        return 0
    }
    
    return votes ? votes.length : 0
}