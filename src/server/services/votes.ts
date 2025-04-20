"use server";

import {getCurrentCampaign} from "@/server/services/campaigns";
import {type VoteForMovieResponse} from "@/types/responses";
import {type Vote} from "@/types/vote";
import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";

/**
 * Votes for one movie.
 * This database checks whether the user has already voted for this movie, thanks to its primary keys.
 * @param proposalId
 */
export async function voteForProposal(proposalId: number): Promise<VoteForMovieResponse> {
    const supabase = await createClient()
    const currentVotes = await getCurrentVotes();

    if (currentVotes.length >= 3) {
        return {
            success: false,
            message: "Tu as déjà voté 3 films. Un choix s'impose.",
            votes: currentVotes
        }
    }

    const {data: userData, error: userError} = await supabase.auth.getUser();

    if (!userData.user?.id || userError) {
        throw new Error("Impossible de lire la session de l'utilisateur. Essayez de vous reconnecter.");
    }

    const user_id = userData.user.id;

    const currentCampaign = await getCurrentCampaign();

    if (!currentCampaign) {
        throw new Error("There is currently no campaign.")
    }

    const {error} = await supabase
        .from("movie_votes")
        .insert({
            movie_proposal_id: proposalId,
            user_id: user_id,
            campaign_id: currentCampaign.id,
            vote_value: 1
        });
    
    if (error) {
        throw new Error("Une erreur est survenue, merci de réessayer ultérieurement. Le vote n'a pas été pris en compte.");
    }

    revalidatePath("/");

    return {
        success: true,
        message: "A voté !"
    }
}

/**
 * Delete vote for one movie.
 *
 * @param movie_proposal_id
 */
export async function deleteVoteForProposal(movie_proposal_id: number): Promise<VoteForMovieResponse> {
    const supabase = await createClient()

    const {data: session, error: sessionError} = await supabase.auth.getUser();

    if (sessionError || !session) {
        throw new Error("Impossible de lire la session de l'utilisateur. Essayez de vous reconnecter.");
    }
    
    const currentCampaign = await getCurrentCampaign();

    const {error} = await supabase
        .from("movie_votes")
        .delete()
        .eq("movie_proposal_id", movie_proposal_id)
        .eq("user_id", session.user.id)
        .eq("campaign_id", currentCampaign.id);
    
    if (error) {
        throw new Error("Une erreur est survenue, merci de réessayer ultérieurement. La suppression du vote n'a pas été pris en compte.");
    }

    revalidatePath("/");

    return {
        success: true,
        message: "Vote supprimé avec succès."
    }
}

/**
 * Returns the votes for the current user.
 */
export async function getCurrentVotes(): Promise<Vote[]> {
    const supabase = await createClient()
    const {data: userData, error: userError} = await supabase.auth.getUser();

    if (!userData.user?.id || userError) {
        throw new Error("User not authenticated.");
    }

    const user_id = userData.user.id;

    const currentCampaign = await getCurrentCampaign();
    
    const {data: votes, error: votesError} = await supabase
        .from("movie_votes")
        .select()
        .eq("user_id", user_id)
        .eq("campaign_id", currentCampaign.id);
    
    if (votesError) {
        console.error(votesError)
        throw new Error("Failed to fetch votes for current user.");
    }
    
    return votes as Vote[]
}

/**
 * Check if the user has already voted for this proposal.
 * @param movie_proposal_id
 * @param user_id
 */
export async function hasUserVotedForProposal(
    movie_proposal_id: number,
    user_id: string | undefined
): Promise<boolean> {
    if (!user_id) {
        throw new Error("Could not find if user has voted for movie: User ID is undefined.");
    }

    const supabase = await createClient();

    let currentCampaign;
    try {
        currentCampaign = await getCurrentCampaign();
    } catch (error) {
        console.error("Error fetching current campaign:", error);
        return false;
    }

    if (!currentCampaign) {
        return false;
    }

    const { data, error } = await supabase
        .from("movie_votes")
        .select("id")
        .eq("user_id", user_id)
        .eq("movie_proposal_id", movie_proposal_id)
        .eq("campaign_id", currentCampaign.id)
        .limit(1);

    if (error) {
        console.error("Error checking vote status:", error.message);
        return false;
    }

    return data.length > 0;
}