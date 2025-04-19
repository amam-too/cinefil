"use client";

import React, { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingWheel from "@/components/ui/loading-wheel";
import DiscardOneMovieDialog from "@/components/propositions/discard-one-movie-dialog";
import { login } from "@/app/login/actions";
import {
  getCurrentPropositions,
  proposeMovie,
  removeProposition,
} from "@/server/services/propositions";

import type { EnhancedMovie } from "@/server/services/movie";
import type { Proposition } from "@/types/proposition";

interface ProposeMovieManagerProps {
  movie: EnhancedMovie;
  initial: boolean;
}

export default function ProposeMovieManager({
  movie,
  initial = false,
}: ProposeMovieManagerProps) {
  const [hasProposed, setHasProposed] = useState(initial);
  const [loading, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingMovie, setPendingMovie] = useState<EnhancedMovie | null>(null);

  /**
   *
   */
  const handlePropose = useCallback(() => {
    startTransition(async () => {
      let currentPropositions: Proposition[] = [];

      try {
        currentPropositions = await getCurrentPropositions();
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (error.message === "User not authenticated") {
          await login("discord");
          return;
        }
        toast.error("Erreur lors de la récupération des propositions.");
        return;
      }

      if (currentPropositions.length >= 3) {
        setPendingMovie(movie);
        setDialogOpen(true);
        return;
      }

      toast.promise(proposeMovie(movie.id), {
        loading: "On enregistre ta proposition...",
        success: (res) => {
          setHasProposed(true);
          return res.message ?? "Film proposé avec succès !";
        },
        error: (err: Error) =>
          err.message ?? "Une erreur est survenue lors de la proposition.",
      });
    });
  }, [movie]);

  /**
   *
   */
  const handleRemove = useCallback(() => {
    toast.promise(removeProposition(movie.id), {
      loading: "On retire ta proposition...",
      success: (res) => {
        setHasProposed(false);
        return res.message ?? "Proposition retirée.";
      },
      error: (err: Error) =>
        err.message ?? "Erreur lors du retrait de la proposition.",
    });
  }, [movie.id]);

  /**
   *
   */
  const handleDialogConfirm = useCallback(
    async (tmdb_id: number) => {
      if (!pendingMovie) {
        toast.error("Film en attente non défini.");
        return;
      }

      toast.promise(
        (async () => {
          const removeResult = await removeProposition(tmdb_id);
          if (!removeResult.success) throw new Error(removeResult.message);

          const proposeResult = await proposeMovie(pendingMovie.id);
          if (!proposeResult.success) throw new Error(proposeResult.message);

          return "Proposition enregistrée avec succès !";
        })(),
        {
          loading: "Mise à jour de ta proposition...",
          success: (msg) => {
            setDialogOpen(false);
            setHasProposed(true);
            return msg;
          },
          error: (err: Error) =>
            err.message ?? "Une erreur est survenue pendant la mise à jour.",
        },
      );
    },
    [pendingMovie],
  );

  const onClick = hasProposed ? handleRemove : handlePropose;

  const buttonText = hasProposed
    ? "🗑️ Retirer la proposition"
    : "🎬 Proposer le film";

  return (
    <>
      <Button
        onClick={onClick}
        disabled={loading}
        variant={hasProposed ? "destructive" : "default"}
        className="w-full py-2 text-base font-medium transition-all hover:opacity-90"
      >
        {loading ? <LoadingWheel /> : buttonText}
      </Button>

      <DiscardOneMovieDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        handleChoice={handleDialogConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
}