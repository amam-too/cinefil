import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { ToDiscardVotes } from "@/components/votes/to-discard-votes";

interface DiscardOneVoteDialogDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleChoice: (tmdb_id: number) => void;
  onCancel: () => void;
}

export default function DiscardOneVoteDialog({
  open,
  setOpen,
  handleChoice,
  onCancel,
}: DiscardOneVoteDialogDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[800px] min-h-[50vh] w-[90vw] max-w-[900px] flex-col gap-6 overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            La limite de votes a été atteinte
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Vous avez atteint la limite de votes. Pour en ajouter un nouveau,
            vous devez en supprimer un.
          </DialogDescription>
        </DialogHeader>

        <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3">
          <ToDiscardVotes handleChoiceAction={handleChoice} />
        </div>

        <DialogFooter className="mt-6 flex w-full items-center !justify-center">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-2 py-1 text-center text-xs sm:px-4 sm:py-2 sm:text-sm md:text-base"
          >
            Je maintiens ces trois votes et annule mon vote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}