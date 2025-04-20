"use server"

import {getCurrentCampaign} from "@/server/services/campaigns";
import {type EnhancedMovie, getEnhancedMovies} from "@/server/services/movie";
import {type Proposition} from "@/types/proposition";
import {type ProposeAMovieResponse} from "@/types/responses";
import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";

/**
 * Propose a movie.
 * @param tmdb_id
 */
export async function proposeMovie(tmdb_id: number): Promise<ProposeAMovieResponse> {
    const supabase = await createClient();
    const currentPropositions = await getCurrentUserPropositions();
    
    if (currentPropositions.length >= 3) {
        return {
            success: false,
            message: "Tu as déjà proposé 3 films. Un choix s'impose.",
            propositions: currentPropositions
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
        .from("movie_proposals")
        .insert({
            movie_id: tmdb_id,
            proposed_by: user_id,
            campaign_id: currentCampaign.id
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
    const supabase = await createClient();

    const { data: session, error: sessionError } = await supabase.auth.getUser();

    if (sessionError || !session) {
        throw new Error("Impossible de lire la session de l'utilisateur. Essayez de vous reconnecter.");
    }

    // Step 1: Fetch the proposition to get its ID.
    const { data: proposition, error: propositionError } = await supabase
        .from("movie_proposals")
        .select("id")
        .eq("movie_id", tmdb_id)
        .eq("proposed_by", session.user.id)
        .single();

    if (propositionError || !proposition) {
        throw new Error("La proposition est introuvable ou ne t'appartient pas.");
    }

    // Step 2: Check if there are any votes for the proposition.
    const { count: voteCount, error: votesError } = await supabase
        .from("movie_votes")
        .select("*", { count: "exact", head: true }) // `head: true` fetches only count, not actual rows
        .eq("movie_proposal_id", proposition.id);

    if (votesError) {
        throw new Error("Erreur lors de la vérification des votes.");
    }

    if ((voteCount ?? 0) > 0) {
        throw new Error("Impossible de supprimer une proposition ayant déjà reçu des votes.");
    }

    // Step 3: Proceed to delete the proposition.
    const { error: deleteError } = await supabase
        .from("movie_proposals")
        .delete()
        .eq("id", proposition.id);

    if (deleteError) {
        throw new Error("Une erreur est survenue, merci de réessayer ultérieurement. La proposition n'a pas été supprimée.");
    }

    revalidatePath("/");

    return {
        success: true,
        message: "Ta proposition a été retirée.",
    };
}


/**
 * TODO DOC
 * @param proposition_id
 * @param campaign_id
 */
export async function getPropositionById(proposition_id: number, campaign_id: number): Promise<Proposition> {
    const supabase = await createClient()

    const {data, error} = await supabase
        .from("movie_proposals")
        .select()
        .eq("id", proposition_id)
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
export async function getCurrentUserPropositions(): Promise<Proposition[]> {
    const supabase = await createClient()
    const {data: userData, error: userError} = await supabase.auth.getUser();
    
    if (!userData.user?.id || userError) {
        throw new Error("User not authenticated.");
    }
    
    const user_id = userData.user.id;
    
    const {data: propositions, error: propositionsError} = await supabase
        .from("movie_proposals")
        .select()
        .eq("proposed_by", user_id)
        .is("shown_at", null);
    
    if (propositionsError) {
        console.error(propositionsError);
        throw new Error("Failed to fetch propositions for current user.");
    }
    
    return propositions as Proposition[];
}

/**
 * Fetch all movies ids that have been shown.
 * Fetch only movies ids with non-null "shown_at".
 */
export async function fetchShownMoviesIds(): Promise<{ movie_id: number; shown_at: string }[]> {
    const supabase = await createClient();

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
    const supabase = await createClient();

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
}

