import MoviesGrid from "@/components/movie/moviesGrid";
import { type EnhancedMovie } from "@/server/services/movie";
import { getDiscoverMovies } from "@/server/services/tmdb";
import React, { Suspense } from "react";
import { getMoviesVotedByUser } from "@/server/services/votes";

export async function DiscoverGrid() {
  const discoverMovies = await getDiscoverMovies();

  if (!discoverMovies?.results) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <h1 className="ml-8 mt-4 text-2xl font-bold">Galerie de films</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <MoviesGrid
          movies={discoverMovies.results as unknown as EnhancedMovie[]}
          votedMovies={await getMoviesVotedByUser()}
        />
      </Suspense>
    </div>
  );
}