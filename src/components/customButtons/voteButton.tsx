"use client";

import { Button } from "@/components/ui/button";
import { voteForMovie } from "@/server/services/votes";
import { useState } from "react";
import { toast } from "sonner";

export default function VoteButton({movieId}: { movieId: number }) {
    const [hasVoted, setHasVoted] = useState(false);
    
    return !hasVoted ? (
        <Button onClick={ async () => {
            toast.promise(voteForMovie(movieId.toString()), {
                loading: "On enregistre ton vote...",
                success: (response) => {
                    setHasVoted(true);
                    return response.message;
                },
                error: (error) => `${error.message}`,
            });
        } }>
            Voter
        </Button>
    ) : null
}