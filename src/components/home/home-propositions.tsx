import MoviesCarousel from "@/components/movies/movies-carousel";
import { getEnhancedMovies } from "@/server/services/movie";
import { getPropositions } from "@/server/services/propositions";
import React from "react";

export default async function HomePropositions() {
  const propositions = await getPropositions();
  const movies = await getEnhancedMovies(
    propositions.map((movie) => movie.movie_id),
  );

  if (!movies?.length) {
    return (
      <section>
        <h2 className="mb-4 text-3xl font-bold">Propositions</h2>

        <div className="flex h-44 w-full items-center justify-center rounded-xl border border-dashed border-muted-foreground text-muted-foreground">
          <div className="flex w-full flex-col items-center justify-center gap-1">
            <h3 className="text-lg font-bold text-white">Aucune proposition</h3>
            <p className="text-muted-foreground">
              N&apos;hésite pas à proposer un film en cherchant ou en cliquant
              sur l&#39;un des films proposés.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-4 text-3xl font-bold">Propositions</h2>
      <MoviesCarousel movies={movies} />
    </section>
  );
}