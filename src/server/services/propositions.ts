"use server"

import { getCurrentCampaign } from "@/server/services/campaigns";
import { type Proposition } from "@/types/proposition";
import { type ProposeAMovieResponse } from "@/types/responses";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Propose a movie.
 * @param tmdb_id
 */
export async function proposeMovie(tmdb_id: number): Promise<ProposeAMovieResponse> {
    const supabase = await createClient();
    const currentPropositions = await getCurrentPropositions();
    
    if (currentPropositions.length >= 3) {
        return {
            success: false,
            message: "Tu as déjà proposé 3 films. Un choix s'impose.",
            propositions: currentPropositions
        }
    }
    
    const {data: userData, error: userError} = await supabase.auth.getUser();
    
    if (!userData.user?.id || userError) {
        throw new Error(userError?.message ?? "User not found.");
    }
    
    const user_id = userData.user.id;
    
    const currentCampagin = await getCurrentCampaign();
    
    const {error} = await supabase
        .from("movie_proposals")
        .insert({
            movie_id: tmdb_id,
            proposed_by: user_id,
            campaign_id: currentCampagin.id
        });
    
    if (error) {
        console.error(error);
        throw new Error("Une erreur est survenue, merci de réessayer ultérieurement. La proposition n'a pas été prise en compte.");
    }
    
    revalidatePath("/");
    return {
        success: true,
        message: "Proposition enregistrée !"
    }
}

/**
 * Remove a proposition.
 * @param tmdb_id
 */
export async function removeProposition(tmdb_id: number): Promise<ProposeAMovieResponse> {
    const supabase = await createClient()
    
    const {error} = await supabase
        .from("suggestions")
        .delete()
        .eq("tmdb_id", tmdb_id)
    
    if (error) {
        throw new Error("Une erreur est survenue, merci de réessayer ultérieurement. La proposition n'a pas été supprimée.");
    }
    
    revalidatePath("/");
    
    return {
        success: true,
        message: "Ta proposition a été retirée."
    }
}

export async function getPropositionById(tmdb_id: string, campaign_id: string): Promise<Proposition> {
    const supabase = await createClient()
    
    const {data, error} = await supabase
        .from("movie_proposals")
        .select()
        .eq("movie_id", tmdb_id)
        .eq("campaign_id", campaign_id)
        .single();
    
    if (error || !data) {
        throw new Error("Le film n'est pas proposé dans la campagne actuelle.");
    }
    
    return data as Proposition;
}

/**
 * Returns the propositions for the current user.
 */
export async function getCurrentPropositions(): Promise<Proposition[]> {
    const supabase = await createClient()
    
    const {data: userData, error: userError} = await supabase.auth.getUser();
    
    if (!userData.user?.id || userError) {
        return [] as Proposition[];
        // throw new Error(userError?.message ?? "User not found.");
    }
    
    const user_id = userData.user.id;
    
    const {data: propositions, error: propositionsError} = await supabase
        .from("movie_proposals")
        .select()
        .eq("proposed_by", user_id)
        .is("removed_at", null);
    
    if (propositionsError) {
        return [] as Proposition[];
        console.error(propositionsError)
        throw new Error(`Une erreur est survenue, merci de réessayer ultérieurement. ${ propositionsError?.message }`);
    }
    
    return propositions as Proposition[];
}

export async function isMovieCurrentlyProposed(movie_id: number): Promise<boolean> {
    const supabase = await createClient()
    
    const {data, error} = await supabase
        .from("enhanced_movies")
        .select()
        .eq("movie_id", movie_id)
        .is("is_proposed", null)
        .limit(1);
    
    if (error) {
        console.error(error);
        throw new Error(error.message ?? "Une erreur est survenue");
    }
    
    return !!data?.length;
}

/**
 * Fetch all movies ids that have been proposed.
 */
export async function fetchProposedMoviesIds(): Promise<{ tmdb_id: number }[]> {
    const supabase = await createClient();
    
    const {data, error} = await supabase
        .from("suggestions")
        .select("tmdb_id");
    
    if (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
    
    return data;
}

/**
 * Fetch all movies ids that have been shown.
 * Fetch only movies ids with non-null "shown_at".
 */
export async function fetchShownMoviesIds(): Promise<{ tmdb_id: number; shown_at: string }[]> {
    const supabase = await createClient();
    
    const {data, error} = await supabase
        .from("suggestions")
        .select("tmdb_id,  shown_at")
        .not("shown_at", "is", null);
    
    if (error) {
        console.error("Error fetching shown movies:", error);
        return [];
    }
    
    return data;
}