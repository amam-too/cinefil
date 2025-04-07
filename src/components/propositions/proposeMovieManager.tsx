"use client";

import DiscardOneMovieDialog from "@/components/propositions/discardOneMovieDialog";
import ProposeButton from "@/components/propositions/propose-button";
import { type EnhancedMovie } from "@/server/services/movie";
import {
  getCurrentPropositions,
  proposeMovie,
  removeProposition,
} from "@/server/services/propositions";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

interface ProposeMovieManagerProps {
  movie: EnhancedMovie;
}

export default function ProposeMovieManager({
  movie,
}: ProposeMovieManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingMovie, setPendingMovie] = useState<EnhancedMovie | null>(null);
  const [loading, startTransition] = useTransition();

  /**
   * Handle proposing a movie.
   */
  const handleProposeMovie = (movie: EnhancedMovie) => {
    startTransition(async () => {
      const currentPropositions = await getCurrentPropositions();

      if (currentPropositions.length >= 3) {
        setPendingMovie(movie);
        setDialogOpen(true);
        return;
      }

      toast.promise(proposeMovie(movie.id), {
        loading: "On enregistre...",
        success: (response) => {
          return response.message;
        },
        error: (error: Error) => error.message ?? "Une erreur est survenue.",
      });
    });
  };

  /**
   * Handle removing a movie proposition.
   */
  const handleRemoveProposition = (tmdb_id: number) => {
    toast.promise(
      (async () => {
        if (!pendingMovie?.id) {
          throw new Error(
            "Une erreur est survenue. Le film n'a pas pu être retiré des propositions.",
          );
        }

        const removeResult = await removeProposition(tmdb_id);
        if (!removeResult.success) {
          throw new Error(
            removeResult.message ||
              "Une erreur est survenue. Le film n'a pas pu être retiré des propositions.",
          );
        }

        const proposeResult = await proposeMovie(pendingMovie.id);
        if (!proposeResult.success) {
          throw new Error(
            proposeResult.message ||
              "Une erreur est survenue. La proposition n'a pas été enregistrée.",
          );
        }

        return "Attendons les votes !";
      })(),
      {
        loading: "On enregistre...",
        success: (response) => {
          setDialogOpen(false);
          return response;
        },
        error: (error: Error) => error.message || "Une erreur est survenue.",
      },
    );
  };

  /**
   * Cancel the pending proposition.
   */
  const cancelPendingProposition = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <ProposeButton
        onClick={() => handleProposeMovie(movie)}
        loading={loading}
      />
      <DiscardOneMovieDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        handleChoice={handleRemoveProposition}
        onCancel={cancelPendingProposition}
      />
    </div>
  );
}