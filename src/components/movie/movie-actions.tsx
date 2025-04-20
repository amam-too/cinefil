import React from "react";
import ProposeMovieManager from "@/components/propositions/propose-movie-manager";
import { type EnhancedMovie } from "@/server/services/movie";
import { CalendarBadge } from "@/components/ui/calendar-badge";
import VoteProposalManager from "@/components/votes/vote-proposal-manager";

interface MovieActionsProps {
  movie: EnhancedMovie;
  userId: string;
}

export default function MovieActions({ movie, userId }: MovieActionsProps) {
  // 1. Show calendar badge if the movie has been displayed.
  if (movie.shown_at) {
    return <CalendarBadge date={movie.shown_at} />;
  }

  // 2. Show propose manager if not proposed and not displayed.
  // Or show propose manager if the user is the author of the proposition,
  // allowing to remove the proposition if there is no vote for it.
  if (!movie.movie_proposal_id || movie.proposed_by === userId) {
    return (
      <ProposeMovieManager
        movie={movie}
        initial={movie.proposed_by === userId}
      />
    );
  } else {
    // 3. Show vote button if it's proposed and not displayed.
    return (
      <VoteProposalManager
        proposalId={movie.movie_proposal_id}
        initial={movie.user_has_voted}
      />
    );
  }
}
