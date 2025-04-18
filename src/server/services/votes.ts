"use server";

import {getCurrentCampaign} from "@/server/services/campaigns";
import {getPropositionById} from "@/server/services/propositions";
import {type VoteForMovieResponse} from "@/types/responses";
import {type Vote} from "@/types/vote";
import {createClient} from "@/utils/supabase/server";

/**
 * Votes for one movie.
 * This database checks whether the user has already voted for this movie, thanks to its primary keys.
 * @param tmdb_id
 */
export async function voteForMovie(tmdb_id: string): Promise<VoteForMovieResponse> {
    const supabase = await createClient()
    
    const {data: session, error: sessionError} = await supabase.auth.getUser();
    
    if (sessionError || !session) {
        throw new Error("Impossible de lire la session de l'utilisateur. Essayez de vous reconnecter.");
    }
    
    const numberOfVotes = await getNumberOfVotesForCurrentUser(session.user.id);
    
    if (numberOfVotes >= 3) {
        throw new Error("Tu as déjà voté pour 3 films. Tu ne peux plus voter.");
    }
    
    const currentCampaign = await getCurrentCampaign();
    const movieProposition = await getPropositionById(tmdb_id, currentCampaign.id);
    
    const {error} = await supabase
        .from("movie_votes")
        .insert({
            movie_proposal_id: movieProposition.id,
            user_id: session.user.id,
            campaign_id: currentCampaign.id,
            vote_value: 1
        });
    
    if (error) {
        console.error(error);
        throw new Error("Une erreur est survenue, merci de réessayer ultérieurement. Le vote n'a pas été pris en compte.");
    }
    
    return {
        success: true,
        message: "A voté !"
    }
}

/**
 * Delete vote for one movie.
 *
 * @param tmdb_id
 */
export async function deleteVoteForMovie(tmdb_id: string): Promise<VoteForMovieResponse> {
    const supabase = await createClient()
    
    const {data: session, error: sessionError} = await supabase.auth.getUser();
    
    if (sessionError || !session) {
        throw new Error("Impossible de lire la session de l'utilisateur. Essayez de vous reconnecter.");
    }
    
    const currentCampaign = await getCurrentCampaign();
    
    // Todo: fix this
    const {error} = await supabase
        .from("movie_votes")
        .delete()
        .eq("movie_proposal_id", tmdb_id)
        .eq("user_id", session.user.id)
        .eq("campaign_id", currentCampaign.id);
    
    if (error) {
        console.error(error);
        throw new Error("Une erreur est survenue, merci de réessayer ultérieurement. La suppression du vote n'a pas été pris en compte.");
    }
    
    return {
        success: true,
        message: "Vote supprimé avec succès."
    }
}

/**
 *
 */
export async function getMoviesVotedByUser(): Promise<Vote[]> {
    const supabase = await createClient()
    
    const {data: session, error: sessionError} = await supabase.auth.getUser();
    
    if (sessionError || !session) {
        return [] as Vote[]
    }
    
    const currentCampaign = await getCurrentCampaign();
    
    const {data: votes, error: votesError} = await supabase
        .from("movie_votes")
        .select()
        .eq("user_id", session.user.id)
        .eq("campaign_id", currentCampaign.id);
    
    if (votesError) {
        console.error(votesError)
        return []
    }
    
    return votes as Vote[]
}

/**
 *
 */
export async function getAllVotes(): Promise<Vote[]> {
    const supabase = await createClient();

    let currentCampaign;
    try {
        currentCampaign = await getCurrentCampaign();
    } catch (error) {
        console.error("Error fetching current campaign:", error);
        return []; // Return an empty array if fetching the campaign fails
    }

    if (!currentCampaign) {
        return []; // Handle the case where getCurrentCampaign returns null or undefined
    }

    const {data: votes, error: votesError} = await supabase
        .from("movie_votes")
        .select()
        .eq("campaign_id", currentCampaign.id);
    
    if (votesError) {
        console.error("Error fetching votes :", votesError);
        return [];
        //throw new Error("Une erreur est survenue lors de la récupération des votes.");
    }
    
    return votes as Vote[];
}

/**
 * Returns the number of votes for the current user.
 * @returns {Promise<number>}
 */
async function getNumberOfVotesForCurrentUser(user_id: string): Promise<number> {
    const supabase = await createClient()
    
    const {data: votes, error: votesError} = await supabase
        .from("movie_votes")
        .select()
        .eq("user_id", user_id);
    
    if (votesError) {
        console.error(votesError)
        return 0
    }
    
    return votes ? votes.length : 0
}

/**
 * Check if the user has already voted for this movie.
 * @param movie_id
 * @param user_id
 */
export async function hasUserVoted(movie_id: number, user_id: string | undefined): Promise<boolean> {
    if (!user_id) {
        console.error("User ID is undefined.");
        return false;
    }

    const supabase = await createClient();

    let currentCampaign;
    try {
        currentCampaign = await getCurrentCampaign();
    } catch (error) {
        console.error("Error fetching current campaign:", error);
        return false; // Return an empty array if fetching the campaign fails
    }

    if (!currentCampaign) {
        return false; // Handle the case where getCurrentCampaign returns null or undefined
    }

    // Todo: fix this
    const {data, error} = await supabase
        .from("movie_votes")
        .select()
        .eq("user_id", user_id)
        .eq("movie_proposal_id", movie_id)
        .eq("campaign_id", currentCampaign.id)
        .limit(1)
    
    if (error) {
        console.error(`Error fetching whether user voted for movie proposal:`, error.message);
        return false;
    }
    
    return !!data?.length;
}