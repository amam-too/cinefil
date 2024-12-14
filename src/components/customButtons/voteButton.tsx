"use client";

import LoadingWheel from "@/components/loadingWheel";
import { Button } from "@/components/ui/button";
import { voteForMovie } from "@/server/services/votes";
import { useState } from "react";
import { toast } from "sonner";

export default function VoteButton({movieId}: { movieId: number }) {
    const [hasVoted, setHasVoted] = useState(false);
    const [loading, setLoading] = useState(false);
    
    return !hasVoted ? (
        <Button onClick={ async () => {
            setLoading(true);
            toast.promise(voteForMovie(movieId.toString()), {
                loading: "On enregistre ton vote...",
                success: (response) => {
                    setHasVoted(true);
                    setLoading(false);
                    return response.message;
                },
                error: (error) => {
                    setLoading(false);
                    return error.message
                }
            });
        } }>
            { loading ? <LoadingWheel/> : "Voter" }
        </Button>
    ) : null
}