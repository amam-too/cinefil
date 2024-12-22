"use server"

import { ProposeAMovieResponse } from "@/types/responses";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Propose a movie.
 * @param tmdb_id
 */
export async function proposeMovie(tmdb_id: number): Promise<ProposeAMovieResponse> {
    const supabase = createClient()
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
    
    const { error } = await supabase
        .from("suggestions")
        .insert({
            tmdb_id: tmdb_id,
            user_id: user_id
        });
    
    if (error) {
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
    const supabase = createClient()
    
    const { error } = await supabase
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

/**
 * Returns the number of propositions for the current user.
 */
export async function getCurrentPropositions() {
    const supabase = createClient()
    
    const {data: userData, error: userError} = await supabase.auth.getUser();
    
    if (!userData.user?.id || userError) {
        throw new Error(userError?.message ?? "User not found.");
    }
    
    const user_id = userData.user.id;
    
    const {data: propositions, error: propositionsError} = await supabase
        .from("suggestions")
        .select()
        .eq("user_id", user_id)
        .is("shown_at", null);
    
    if (propositionsError) {
        throw new Error(`Une erreur est survenue, merci de réessayer ultérieurement. ${propositionsError?.message}`);
    }
    
    return propositions;
}