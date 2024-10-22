"use client";
import { SearchParams } from "@/app/searchParams";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { type MovieDetails } from "tmdb-ts";

export default function SuggestButton({movieDetails}: { movieDetails: MovieDetails }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    
    /**
     *
     */
    const displaySuggestions = (): void => {
        const params = new URLSearchParams(searchParams);
        params.delete(SearchParams.QUERY);
        params.delete(SearchParams.FILM_ID);
        router.replace(`${ pathname }?${ params.toString() }`);
        
        // TODO : Remove query inside searchbar too.
    };
    
    /**
     *
     * @param movie
     */
    const createdSuggestion = async (movie: MovieDetails): Promise<void> => {
        const {error} = await createClient().from("suggestions").insert({
            tmdb_id: movie.id,
            shown_at: null,
            createdAt: new Date().toISOString()
        });
        
        if (error) {
            if (error.code.toString() === "23505") {
                toast.warning(`${ movie.title } est déjà ajouté aux suggestions.`, {
                    action: {
                        label: "Voir les suggestions",
                        onClick: displaySuggestions
                    }
                });
                return;
            }
            
            toast.error("Impossible d'ajouter la suggestion !", {
                description: `${ movie.title } n'a pas pu être ajouté aux suggestions.`
            });
        } else {
            toast.success("Suggestion ajoutée !", {
                description: `${ movie.title } a été ajouté aux suggestions.`,
                action: {
                    label: "Voir les suggestions",
                    onClick: displaySuggestions
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
