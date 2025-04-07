"use client";

import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingWheel from "@/components/loadingWheel";
import { deleteVoteForMovie, voteForMovie } from "@/server/services/votes";

interface VoteButtonProps {
  movieId: number;
  initial: boolean;
}

export default function VoteButton({ movieId, initial }: VoteButtonProps) {
  const [hasVoted, setHasVoted] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleVote = useCallback(async () => {
    setLoading(true);
    const action = hasVoted ? deleteVoteForMovie : voteForMovie;

    toast.promise(action(movieId.toString()), {
      loading: hasVoted
        ? "On supprime ton vote..."
        : "On enregistre ton vote...",
      success: (response) => {
        setHasVoted(!hasVoted);
        setLoading(false);
        return response.message ?? (hasVoted ? "Vote supprimé !" : "A voté !");
      },
      error: (error: Error) => {
        setLoading(false);
        return error.message ?? "Une erreur est survenue, merci de réessayer.";
      },
    });
  }, [hasVoted, movieId]);

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
