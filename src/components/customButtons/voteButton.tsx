"use client";

import LoadingWheel from "@/components/loadingWheel";
import { Button } from "@/components/ui/button";
import { removeVoteForMovie, voteForMovie } from "@/server/services/votes";
import { useState } from "react";
import { toast } from "sonner";

export default function VoteButton({movieId}: { movieId: number }) {
    const [hasVoted, setHasVoted] = useState(false);
    const [loading, setLoading] = useState(false);

    return !hasVoted ? (
        <Button
          variant="outline"
          className="text-white"
          onClick={ async () => {
            setLoading(true);
            toast.promise(voteForMovie(movieId.toString()), {
                loading: "On enregistre ton vote...",
                success: (response) => {
                    setHasVoted(true);
                    setLoading(false);
                    return response.message ?? "A voté !";
                },
                error: (error: Error) => {
                    setLoading(false);
                    return (
              error.message ??
              "Une erreur est survenue, merci de réessayer ultérieurement."
            );
          },
        });
      }}
    >
      {loading ? <LoadingWheel /> : "Voter"}
    </Button>
  ) : (
      <Button
        variant="outline"
        className="text-white"
        onClick={async () => {
          setLoading(true);
          toast.promise(removeVoteForMovie(movieId.toString()), {
            loading: "On retire ton vote...",
            success: (response) => {
              setHasVoted(false);
              setLoading(false);
              return response.message ?? "Vote retiré !";
            },
            error: (error: Error) => {
              setLoading(false);
              return (
                error.message ??
                "Une erreur est survenue, merci de réessayer ultérieurement."
              );
            },
          });
        }}
      >
        {loading ? <LoadingWheel /> : "Retirer le vote"}
      </Button>
    );
}
