"use client";

import DiscardOneMovieDialog from "@/components/propositions/discard-one-movie-dialog";
import ProposeButton from "@/components/movie-actions/propose-button";
import { type EnhancedMovie } from "@/server/services/movie";
import {
  getCurrentPropositions,
  proposeMovie,
  removeProposition,
} from "@/server/services/propositions";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { type Proposition } from "@/types/proposition";
import { login } from "@/app/login/actions";

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
      let currentPropositions: Proposition[] = [];

      try {
        currentPropositions = await getCurrentPropositions();
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (error.message === "User not authenticated") {
          await login("discord");
          return;
        } else {
          toast.error("Erreur lors de la récupération des propositions.");
          return;
        }
      }

      if (currentPropositions.length >= 3) {
        setPendingMovie(movie);
        setDialogOpen(true);
        return;
      }

      toast.promise(proposeMovie(movie.id), {
        loading: "On enregistre...",
        success: (response) => response.message,
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