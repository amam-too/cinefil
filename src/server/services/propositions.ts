"use server"

import { getCurrentCampaign } from "@/server/services/campaigns";
import { type EnhancedMovie, getEnhancedMovies } from "@/server/services/movie";
import { type Proposition } from "@/types/proposition";
import { type ProposeAMovieResponse } from "@/types/responses";
import { withDatabase, getUserSession } from "@/utils/database";
import { AppError, ErrorCodes, ErrorMessages } from "@/types/errors";
import { revalidatePath } from "next/cache";

/**
 * Propose a movie.
 * @param tmdb_id
 */
export async function proposeMovie(tmdb_id: number): Promise<ProposeAMovieResponse> {
    const currentPropositions = await getCurrentUserPropositions();
    
    if (currentPropositions.length >= 3) {
        return {
            success: false,
            message: "Tu as déjà proposé 3 films. Un choix s'impose.",
            propositions: currentPropositions
        }
    }
    
    const user = await getUserSession();
    const currentCampaign = await getCurrentCampaign();
    
    if (!currentCampaign) {
        return {
            success: false,
            message: ErrorMessages[ErrorCodes.NO_CAMPAIGN],
            propositions: currentPropositions
        }
    }
    
    return await withDatabase(async (supabase) => {
        const { error } = await supabase
            .from("movie_proposals")
            .insert({
                movie_id: tmdb_id,
                proposed_by: user.id,
                campaign_id: currentCampaign.id
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
            message: "Proposition enregistrée !"
        }
    });
}

/**
 * Remove a proposition.
 * @param tmdb_id
 */
export async function removeProposition(tmdb_id: number): Promise<ProposeAMovieResponse> {
    const user = await getUserSession();

    return await withDatabase(async (supabase) => {
        // Step 1: Fetch the proposition to get its ID.
        const { data: proposition, error: propositionError } = await supabase
            .from("movie_proposals")
            .select("id")
            .eq("movie_id", tmdb_id)
            .eq("proposed_by", user.id)
            .single();

        if (propositionError || !proposition) {
            throw new AppError(
                "La proposition est introuvable ou ne t'appartient pas.",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Step 2: Check if there are any votes for the proposition.
        const { count: voteCount, error: votesError } = await supabase
            .from("movie_votes")
            .select("*", { count: "exact", head: true })
            .eq("movie_proposal_id", proposition.id);

        if (votesError) {
            throw new AppError(
                "Erreur lors de la vérification des votes.",
                ErrorCodes.DATABASE_ERROR
            );
        }

        if ((voteCount ?? 0) > 0) {
            throw new AppError(
                "Impossible de supprimer une proposition ayant déjà reçu des votes.",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Step 3: Proceed to delete the proposition.
        const { error: deleteError } = await supabase
            .from("movie_proposals")
            .delete()
            .eq("id", proposition.id);

        if (deleteError) {
            throw new AppError(
                ErrorMessages[ErrorCodes.DATABASE_ERROR],
                ErrorCodes.DATABASE_ERROR
            );
        }

        revalidatePath("/");

        return {
            success: true,
            message: "Ta proposition a été retirée.",
        };
    });
}

/**
 * TODO DOC
 * @param proposition_id
 * @param campaign_id
 */
export async function getPropositionById(proposition_id: number, campaign_id: number): Promise<Proposition> {
    return await withDatabase(async (supabase) => {
        const { data, error } = await supabase
            .from("movie_proposals")
            .select()
            .eq("id", proposition_id)
            .eq("campaign_id", campaign_id)
            .single();

        if (error || !data) {
            throw new AppError(
                "Le film n'est pas proposé dans la campagne actuelle.",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        return data as Proposition;
    });
}

/**
 * Returns the propositions for the current user.
 */
export async function getCurrentUserPropositions(): Promise<Proposition[]> {
    const user = await getUserSession();
    
    return await withDatabase(async (supabase) => {
        const { data: propositions, error: propositionsError } = await supabase
            .from("movie_proposals")
            .select()
            .eq("proposed_by", user.id)
            .is("shown_at", null);
        
        if (propositionsError) {
            throw new AppError(
                ErrorMessages[ErrorCodes.DATABASE_ERROR],
                ErrorCodes.DATABASE_ERROR
            );
        }
        
        return propositions as Proposition[];
    });
}

/**
 * Fetch all movies ids that have been shown.
 * Fetch only movies ids with non-null "shown_at".
 */
export async function fetchShownMoviesIds(): Promise<{ movie_id: number; shown_at: string }[]> {
    return await withDatabase(async (supabase) => {
        const { data, error } = await supabase
            .from("movie_proposals")
            .select("movie_id, shown_at")
            .not("shown_at", "is", null)
            .lt("shown_at", new Date().toISOString())
            .order("shown_at", { ascending: false });

        if (error) {
            console.error("Error fetching shown movies:", error.message);
            return [];
        }
        
        return data;
    });
}

/**
 * Fetch details of movies that have already been shown.
 */
export async function getShownMovies(): Promise<EnhancedMovie[]> {
    const shownMovies = await fetchShownMoviesIds();
    
    if (!shownMovies.length) return [];
    
    try {
        return await getEnhancedMovies(shownMovies.map(movie => movie.movie_id))
    } catch (err) {
        console.error("Error fetching shown movie details from TMDB:", err);
        return [];
    }
}

/**
 * Returns the propositions, shuffled randomly.
 */
export async function getPropositions(): Promise<Proposition[]> {
    return await withDatabase(async (supabase) => {
        const { data, error } = await supabase
            .from("movie_proposals")
            .select()
            .is("shown_at", null);

        if (error || !data) {
            console.error(error);
            return [];
        }

        const shuffled = [...data];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled as Proposition[];
    });
}

