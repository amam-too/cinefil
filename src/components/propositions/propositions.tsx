import MoviesGrid from "@/components/movie/moviesGrid";
import { getMovieDetails } from "@/server/services/tmdb";
import { type Proposition } from "@/types/proposition";
import { createClient } from "@/utils/supabase/server";
import React, { Suspense } from "react";
import { type Movie } from "tmdb-ts";
import { getMoviesVoted } from "@/server/services/votes";

export default async function Propositions({
  displayShown,
}: {
  displayShown?: string;
}) {
  const fetchMoviesDetails = (propositions: Proposition[]) => {
    const moviePromises = propositions.map((proposition) =>
      getMovieDetails(proposition.tmdb_id),
    );
    return Promise.all(moviePromises);
  };

  const fetchPropositions = async () => {
    const { data, error } = await createClient()
      .from("suggestions")
      .select()
      .order("shown_at", { ascending: false });
    if (error) {
      console.error("Error fetching propositions:", error);
      return [];
    }
    return data && data.length > 0
      ? fetchMoviesDetails(data as Proposition[])
      : [];
  };

  return (
    <div className="flex flex-col">
      <h1 className="ml-8 mt-4 text-2xl font-bold">Films proposés</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <MoviesGrid
          movies={(await fetchPropositions()) as unknown as Movie[]}
          forProposition={true}
          displayShown={displayShown}
          votedMovies={await getMoviesVoted()}
        />
      </Suspense>
    </div>
  );
}