"use client";

import LoadingWheel from "@/components/loadingWheel";
import { Button } from "@/components/ui/button";
import { deleteVoteForMovie, voteForMovie } from "@/server/services/votes";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function VoteButton({
  movieId,
  initial,
}: {
  movieId: number;
  initial: boolean;
}) {
  const [hasVoted, setHasVoted] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleVote = useCallback(async () => {
    setLoading(true);

    const action = hasVoted ? deleteVoteForMovie : voteForMovie;

    const loadingMessage = hasVoted
      ? "On supprime ton vote..."
      : "On enregistre ton vote...";

    const successMessage = hasVoted ? "Vote supprimé !" : "A voté !";

    toast.promise(action(movieId.toString()), {
      loading: loadingMessage,
      success: (response) => {
        setHasVoted(!hasVoted);
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
    });
  }, [hasVoted, movieId]);

  return (
    <Button onClick={handleVote} disabled={loading}>
      {loading ? <LoadingWheel /> : hasVoted ? "Supprimer le vote" : "Voter"}
    </Button>
  );
}
