import { Button } from "@/components/ui/button";
import { voteForMovie } from "@/server/services/votes";

export default function VoteButton({movieId}: { movieId: number }) {
    return (
        <Button onClick={ async () => {
            const response = await voteForMovie(movieId.toString());
        } }>
            Voter
        </Button>
    )
}