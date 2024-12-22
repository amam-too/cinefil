"use client";

import DiscardOneMovieDialog from "@/components/propositions/discardOneMovieDialog";
import ProposeButton from "@/components/propositions/proposeButton";
import { getCurrentPropositions, proposeMovie, removeProposition } from "@/server/services/propositions";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { MovieDetails } from "tmdb-ts";

interface ProposeMovieManagerProps {
    movieDetails: MovieDetails;
}

export default function ProposeMovieManager({movieDetails}: ProposeMovieManagerProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingMovie, setPendingMovie] = useState<MovieDetails | null>(null);
    const [loading, startTransition] = useTransition();
    
    /**
     * Handle proposing a movie.
     */
    const handleProposeMovie = (movie: MovieDetails) => {
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
                error: (error) => error.message ?? "Une erreur est survenue."
            });
        })
    };
    
    /**
     * Handle removing a movie proposition.
     */
    const handleRemoveProposition = (tmdb_id: number) => {
        const attempt = new Promise<string>(async (resolve, reject) => {
            if (!pendingMovie?.id) {
                return reject("Une erreur est survenue. Le film n'a pas pu être retiré des propositions.");
            }
            
            const removeResult = await removeProposition(tmdb_id);
            if (!removeResult.success) {
                reject(removeResult.message || "Une erreur est survenue. Le film n'a pas pu être retiré des propositions.");
            }
            
            const proposeResult = await proposeMovie(pendingMovie.id);
            if (!proposeResult.success) {
                return reject(proposeResult.message || "Une erreur est survenue. La proposition n'a pas été enregistrée.");
            }
            
            return resolve("La proposition a été ajoutée.");
        })
        
        toast.promise(attempt, {
            loading: "On enregistre...",
            success: (response) => {
                setDialogOpen(false);
                return response;
            },
            error: (error) => error.message || "Une erreur est survenue."
        });
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
                onClick={ () => handleProposeMovie(movieDetails) }
                loading={ loading }
            />
            <DiscardOneMovieDialog
                open={ dialogOpen }
                setOpen={ setDialogOpen }
                handleChoice={ handleRemoveProposition }
                onCancel={ cancelPendingProposition }
            />
        </div>
    );
}