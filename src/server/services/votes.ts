"use server";

import { getCurrentCampaign } from "@/server/services/campaigns";
import { type VoteForMovieResponse } from "@/types/responses";
import { type Vote } from "@/types/vote";
import { withDatabase, getUserSession } from "@/utils/database";
import { AppError, ErrorCodes, ErrorMessages } from "@/types/errors";
import { revalidatePath } from "next/cache";

/**
 * Votes for one movie.
 * This database checks whether the user has already voted for this movie, thanks to its primary keys.
 * @param proposalId
 */
export async function voteForProposal(proposalId: number): Promise<VoteForMovieResponse> {
    const currentVotes = await getCurrentVotes();

    if (currentVotes.length >= 3) {
        return {
            success: false,
            message: "Tu as déjà voté 3 films. Un choix s'impose.",
            votes: currentVotes
        }
    }

    const user = await getUserSession();
    const currentCampaign = await getCurrentCampaign();

    if (!currentCampaign) {
        return {
            success: false,
            message: ErrorMessages[ErrorCodes.NO_CAMPAIGN],
            votes: currentVotes
        }
    }

    return await withDatabase(async (supabase) => {
        const { error } = await supabase
            .from("movie_votes")
            .insert({
                movie_proposal_id: proposalId,
                user_id: user.id,
                campaign_id: currentCampaign.id,
                vote_value: 1
            });
        
        if (error) {
            throw new AppError(
                ErrorMessages[ErrorCodes.DATABASE_ERROR],
                ErrorCodes.DATABASE_ERROR
            );
        }

        revalidatePath("/");

        return {
            success: true,
            message: "A voté !"
        }
    });
}

/**
 * Delete vote for one movie.
 *
 * @param movie_proposal_id
 */
export async function deleteVoteForProposal(movie_proposal_id: number): Promise<VoteForMovieResponse> {
    const user = await getUserSession();
    const currentCampaign = await getCurrentCampaign();

    if (!currentCampaign) {
        return {
            success: false,
            message: ErrorMessages[ErrorCodes.NO_CAMPAIGN],
            votes: []
        }
    }

    return await withDatabase(async (supabase) => {
        const { error } = await supabase
            .from("movie_votes")
            .delete()
            .eq("movie_proposal_id", movie_proposal_id)
            .eq("user_id", user.id)
            .eq("campaign_id", currentCampaign.id);
        
        if (error) {
            throw new AppError(
                ErrorMessages[ErrorCodes.DATABASE_ERROR],
                ErrorCodes.DATABASE_ERROR
            );
        }

        revalidatePath("/");

        return {
            success: true,
            message: "Vote supprimé avec succès."
        }
    });
}

/**
 * Returns the votes for the current user.
 */
export async function getCurrentVotes(): Promise<Vote[]> {
    const user = await getUserSession();
    const currentCampaign = await getCurrentCampaign();
    
    if (!currentCampaign) {
        return [];
    }
    
    return await withDatabase(async (supabase) => {
        const { data: votes, error: votesError } = await supabase
            .from("movie_votes")
            .select()
            .eq("user_id", user.id)
            .eq("campaign_id", currentCampaign.id);
        
        if (votesError) {
            throw new AppError(
                ErrorMessages[ErrorCodes.DATABASE_ERROR],
                ErrorCodes.DATABASE_ERROR
            );
        }
        
        return votes as Vote[];
    });
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
        throw new AppError(
            "Could not find if user has voted for movie: User ID is undefined.",
            ErrorCodes.VALIDATION_ERROR
        );
    }

    const currentCampaign = await getCurrentCampaign();
    
    if (!currentCampaign) {
        return false;
    }

    return await withDatabase(async (supabase) => {
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
    });
}