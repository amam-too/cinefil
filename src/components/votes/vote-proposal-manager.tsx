"use client";

import LoadingWheel from "@/components/ui/loading-wheel";
import { Button } from "@/components/ui/button";
import {
  deleteVoteForProposal,
  getCurrentVotes,
  voteForProposal,
} from "@/server/services/votes";
import React, { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import { login } from "@/app/login/actions";
import { type Vote } from "@/types/vote";
import DiscardOneVoteDialog from "@/components/votes/discard-one-vote-dialog";

interface VoteProposalManagerProps {
  proposalId: number;
  initial: boolean;
}

export default function VoteProposalManager({
  proposalId,
  initial,
}: VoteProposalManagerProps) {
  const [hasVoted, setHasVoted] = useState<boolean>(initial);
  const [loading, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [pendingProposal, setPendingProposal] = useState<number | null>(null);

  /**
   *
   */
  const handleVote = useCallback(() => {
    startTransition(async () => {
      let currentVotes: Vote[] = [];

      try {
        currentVotes = await getCurrentVotes();
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (error.message === "User not authenticated.") {
          await login("discord");
          return;
        }
        toast.error("Erreur lors de la récupération des votes.");
        return;
      }

      if (currentVotes.length >= 3) {
        setPendingProposal(proposalId);
        setDialogOpen(true);
        return;
      }

      toast.promise(voteForProposal(proposalId), {
        loading: "On enregistre ton vote...",
        success: (res) => {
          setHasVoted(true);
          return res.message ?? "A voté !";
        },
        error: async (err: Error) => {
          if (
            err?.message ===
            "Impossible de lire la session de l'utilisateur. Essayez de vous reconnecter."
          ) {
            await login("discord");
          }

          return err.message ?? "Une erreur est survenue lors de ton vote.";
        },
      });
    });
  }, [proposalId]);

  /**
   *
   */
  const handleRemoveVote = useCallback(() => {
    toast.promise(deleteVoteForProposal(proposalId), {
      loading: "On retire ton vote...",
      success: (res) => {
        setHasVoted(false);
        return res.message ?? "Vote retiré.";
      },
      error: (err: Error) =>
        err.message ?? "Erreur lors du retrait de ton vote.",
    });
  }, [proposalId]);

  /**
   *
   */
  const handleDialogConfirm = useCallback(
    async (proposal_id_to_remove: number) => {
      if (!pendingProposal) {
        toast.error("Proposition en attente non défini.");
        return;
      }

      toast.promise(
        (async () => {
          const removeResult = await deleteVoteForProposal(
            proposal_id_to_remove,
          );
          if (!removeResult.success) throw new Error(removeResult.message);

          const voteResult = await voteForProposal(pendingProposal);
          if (!voteResult.success) throw new Error(voteResult.message);

          return "Vote enregistré avec succès !";
        })(),
        {
          loading: "Mise à jour de ton vote...",
          success: (msg) => {
            setDialogOpen(false);
            setHasVoted(true);
            return msg;
          },
          error: (err: Error) =>
            err.message ??
            "Une erreur est survenue pendant la mise à jour de ton vote.",
        },
      );
    },
    [pendingProposal],
  );

  const onClick = hasVoted ? handleRemoveVote : handleVote;

  const buttonText = hasVoted ? "🗑️ Supprimer le vote" : "💌️ Voter";

  return (
    <>
      <Button
        onClick={onClick}
        disabled={loading}
        variant={hasVoted ? "destructive" : "default"}
        className="w-full py-2 text-base font-medium transition-all hover:opacity-90"
      >
        {loading ? <LoadingWheel /> : buttonText}
      </Button>

      <DiscardOneVoteDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        handleChoice={handleDialogConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
}
