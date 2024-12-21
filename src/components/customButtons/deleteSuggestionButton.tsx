"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { type MovieDetails } from "tmdb-ts";
import React from "react";

export default function DeleteSuggestionButton({
  movieDetails,
}: {
  movieDetails: MovieDetails
}) {
  /**
   *
   */
  const deleteSuggestion = async (movie: MovieDetails) => {
    try {
      const { error } = await createClient()
        .from("suggestions")
        .delete()
        .eq("id", movie.id);

      if (error) {
        console.error(`Error deleting suggestion with id ${movie.id}:`, error);
        toast.error("Erreur lors de la suppression de la suggestion.", {
          description: `Le film ${movie.title} n"a pas pu être supprimé. Veuillez réessayer.`,
        });
        return;
      }

      toast.success("Suggestion supprimée !", {
        description: `${movie.title} a été retiré des suggestions.`,
      });
    } catch (err) {
      console.error("Unexpected error: ", err);
      toast.error(
        "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
      );
    }
  };

  return (
    <Button
      variant="outline"
      className="text-white"
      onClick={() => deleteSuggestion(movieDetails)}
    >
      Retirer la proposition du film
    </Button>
  );
}
