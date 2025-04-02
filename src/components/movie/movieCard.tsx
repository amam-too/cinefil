import VoteButton from "@/components/customButtons/voteButton";
import ProposeMovieManager from "@/components/propositions/proposeMovieManager";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type EnhancedMovie } from "@/server/services/movie-service";
import { getHumanReadableDate, getYearOnly } from "@/utils/date";
import Link from "next/link";
import React from "react";
import { type User } from "@supabase/auth-js";

interface MovieCardProps {
  movie: EnhancedMovie;
  filmCanBeProposed: boolean;
  shown_at?: string;
  userHasVotedFor: boolean;
  numberOfVoteForFilm: number;
  user: User | null;
}

export default function MoviesCard({
  movie,
  filmCanBeProposed,
  shown_at,
  userHasVotedFor,
  numberOfVoteForFilm,
  user,
}: MovieCardProps) {
  return (
    <Card
      className="flex cursor-pointer flex-col justify-between"
      key={movie.id}
    >
      <Link href={`/movie/${movie.id}`}>
        <CardContent className="flex flex-col p-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className={`h-full max-h-40 w-full rounded-b-none rounded-t-xl object-cover ${shown_at ? "opacity-50 grayscale" : ""}`}
          />

          <div className="p-2 px-3">
            <h1 className="text-lg font-semibold">{movie.title}</h1>
            <p className="text-start text-sm text-gray-500">
              {getYearOnly(movie.release_date)}
            </p>
            {shown_at ? (
              <p className="pt-8 text-start text-sm font-bold text-red-500">
                Diffusé {getHumanReadableDate(shown_at)}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Link>
      {!shown_at && user && (
        <CardFooter className="p-4 pb-4">
          {filmCanBeProposed ? (
            <ProposeMovieManager movie={movie} />
          ) : (
            <VoteButton
              movieId={movie.id}
              initial={userHasVotedFor}
              numberOfVoteForFilm={numberOfVoteForFilm}
            />
          )}
        </CardFooter>
      )}
    </Card>
  );
}
