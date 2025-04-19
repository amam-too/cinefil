"use client";

import LoadingWheel from "@/components/ui/loading-wheel";
import { Button } from "@/components/ui/button";
import {
  deleteVoteForProposal,
  voteForProposal,
} from "@/server/services/votes";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { login } from "@/app/login/actions";

interface VoteButtonProps {
  proposalId: number;
  initial: boolean;
}

export default function VoteButton({ proposalId, initial }: VoteButtonProps) {
  const [hasVoted, setHasVoted] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleVote = useCallback(async () => {
    setLoading(true);
    const action = hasVoted ? deleteVoteForProposal : voteForProposal;

    toast.promise(action(proposalId), {
      loading: hasVoted
        ? "On supprime ton vote..."
        : "On enregistre ton vote...",
      success: (response) => {
        setHasVoted(!hasVoted);
        setLoading(false);
        return response.message ?? (hasVoted ? "Vote supprimé !" : "A voté !");
      },
      error: async (error: Error) => {
        setLoading(false);
        if (
          error?.message ===
          "Impossible de lire la session de l'utilisateur. Essayez de vous reconnecter."
        ) {
          await login("discord");
        }

        return error.message ?? "Une erreur est survenue, merci de réessayer.";
      },
    });
  }, [hasVoted, proposalId]);

  const buttonText = hasVoted ? "🗑️ Supprimer le vote" : "💌️ Voter";

  return (
    <Button
      onClick={handleVote}
      disabled={loading}
      variant={hasVoted ? "destructive" : "default"}
      className="w-full py-2 text-base font-medium transition-all hover:opacity-90"
    >
      {loading ? <LoadingWheel /> : buttonText}
    </Button>
  );
}
