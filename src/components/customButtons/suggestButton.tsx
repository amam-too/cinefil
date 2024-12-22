"use client";

import { SearchParams } from "@/app/searchParams";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { type MovieDetails } from "tmdb-ts";
import LoadingWheel from "@/components/loadingWheel";
import { useState } from "react";
import { removeSuggestion, suggestMovie } from "@/server/services/suggestions";

export default function SuggestButton({
  movieDetails,
  hasBeenSuggestedByUser,
}: {
  movieDetails: MovieDetails
  hasBeenSuggestedByUser: boolean
}) {
  const [hasBeenSuggested, setHasBeenSuggested] = useState(
    hasBeenSuggestedByUser,
  );
  const [loading, setLoading] = useState(false);

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
    router.replace(`${pathname}?${params.toString()}`);

    // TODO : Remove query inside searchbar too.
  };

  /**
   * Suggest or remove suggestion based on the current state.
   */
  const handleSuggestion = async (): Promise<void> => {
    setLoading(true);
    const action = hasBeenSuggested ? removeSuggestion : suggestMovie;
    const loadingMessage = hasBeenSuggested
      ? "On retire ta suggestion..."
      : "On enregistre ta suggestion...";
    const successMessage = hasBeenSuggested
      ? `${movieDetails.title} a été retiré des suggestions.`
      : `${movieDetails.title} a été ajouté aux suggestions.`;

    toast.promise(action(movieDetails.id.toString()), {
      loading: loadingMessage,
      success: (response) => {
        setHasBeenSuggested(!hasBeenSuggested);
        setLoading(false);
        return response.message ?? successMessage;
      },
      error: (error: Error) => {
        setLoading(false);
        return (
          error.message ??
          "Une erreur est survenue, merci de réessayer ultérieurement."
        );
      },
      action: {
        label: "Voir les suggestions",
        onClick: displaySuggestions,
      },
    });
  };

  return (
    <Button variant="outline" className="text-white" onClick={handleSuggestion}>
      {loading ? (
        <LoadingWheel />
      ) : hasBeenSuggested ? (
        "Retirer la suggestion"
      ) : (
        "Suggérer le film"
      )}
    </Button>
  );
}
