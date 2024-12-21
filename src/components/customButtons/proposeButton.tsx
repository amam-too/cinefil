"use client";
import { SearchParams } from "@/app/searchParams";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { type MovieDetails } from "tmdb-ts";

export default function ProposeButton({movieDetails, onExceedLimit}: { movieDetails: MovieDetails, onExceedLimit: (currentPropositions: any) => void }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    
    const displayPropositions = (): void => {
        const params = new URLSearchParams(searchParams);
        params.delete(SearchParams.QUERY);
        params.delete(SearchParams.FILM_ID);
        router.replace(`${ pathname }?${ params.toString() }`);
    };
    
    const createdSuggestion = async (movie: MovieDetails): Promise<void> => {
        const currentPropositions = await getCurrentPropositions()
        if (currentPropositions?.length >= 3) {
            onExceedLimit(currentPropositions);
            return;
        }
        
        const {error} = await createClient().from("suggestions").insert({
            tmdb_id: movie.id,
            shown_at: null,
            created_at: new Date().toISOString(),
            user_id: (await createClient().auth.getUser()).data.user?.id
        });
        
        if (error) {
            if (error.code.toString() === "23505") {
                toast.warning(`${ movie.title } est déjà ajouté aux suggestions.`, {
                    action: {
                        label: "Voir les suggestions",
                        onClick: displayPropositions
                    }
                });
                return;
            }
            
            toast.error("Une erreur est survenue.", {
                description: `${ movie.title } n'a pas pu être ajouté aux propositions.`
            });
            throw new Error(error.message);
        } else {
            toast.success("Attendons les votes !", {
                description: `${ movie.title } a été ajouté aux propositions.`,
                action: {
                    label: "Voir les suggestions",
                    onClick: displayPropositions
                }
            });
        }
    };
    
    return (
        <Button
            variant="outline"
            className="text-white"
            onClick={ () => createdSuggestion(movieDetails) }
        >
            Proposer le film
        </Button>
    );
}

async function getCurrentPropositions() {
    const {data: userData, error: userError} = await createClient().auth.getUser();
    
    if (!userData.user?.id || userError) {
        throw new Error(userError?.message ?? "User not found.");
    }
    
    const {data, error} = await createClient().from("suggestions").select()
        .eq("user_id", userData.user.id)
        .is("shown_at", null);
    
    if (error) {
        throw new Error(error.message);
    }
    
    return data;
}