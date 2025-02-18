import { ToDiscardMovies } from "@/components/propositions/toDiscardMovies";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";

interface DiscardOneMovieDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    handleChoice: (tmdb_id: number) => void;
    onCancel: () => void;
}

export default function DiscardOneMovieDialog({open, setOpen, handleChoice, onCancel}: DiscardOneMovieDialogProps) {
    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogContent className="flex flex-col gap-6 p-4 w-[90vw] max-w-[900px] min-h-[50vh] max-h-[800px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">La limite de propositions a été atteinte</DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                        Vous avez atteint la limite de propositions. Pour en ajouter une nouvelle, vous devez en supprimer une.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full justify-items-center">
                    <ToDiscardMovies handleChoice={ handleChoice }/>
                </div>
                
                <DialogFooter className="flex w-full !justify-center items-center mt-6">
                    <Button
                        variant="outline"
                        onClick={ onCancel }
                        className="text-xs sm:text-sm md:text-base text-center px-2 py-1 sm:px-4 sm:py-2"
                    >
                        Je maintiens ces trois films et annule ma proposition
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}