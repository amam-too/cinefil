import { Gloock } from "next/font/google";
import { getUser } from "@/app/login/actions";
import { getDiscoverMovies } from "@/server/services/tmdb";
import { getMoviesVotedByUser } from "@/server/services/votes";
import {
  getPropositions,
  getShownMovies,
} from "@/server/services/propositions";
import type { EnhancedMovie } from "@/server/services/movie";
import React from "react";
import MoviesCarousel from "@/components/movies/movies-carousel";

const gloock = Gloock({ subsets: ["latin"], weight: "400" });

export default async function HomePage() {
  const [
    user,
    discoverMovies,
    userVotedMovies,
    shownMovies,
    proposedMovies,
    //currentUserPropositions,
    //userProposedMovies,
  ] = await Promise.all([
    getUser(),
    getDiscoverMovies(),
    getMoviesVotedByUser(),
    getShownMovies(),
    getPropositions(),
    //getCurrentPropositions(),
  ]);

  return (
    <main className="mt-14 justify-center">
      {/* Main Title */}
      <header className="mb-8 mt-14 text-left">
        <h1 className={`${gloock.className} text-5xl`}>
          Bienvenue {user?.user_metadata.name ?? ""} ! 🍿
        </h1>
      </header>

      {/* Propositions Carousel */}
      <section className="mb-12">
        <h2 className={`${gloock.className} mb-4 text-3xl font-bold`}>
          Propositions
        </h2>
        <MoviesCarousel
          movies={proposedMovies as unknown as EnhancedMovie[]}
          userVotedMovies={userVotedMovies}
          moviesId={proposedMovies.map((movie) => ({ tmdb_id: movie.id }))}
          shownMoviesId={shownMovies.map((movie) => ({
            tmdb_id: movie.id,
            shown_at: "",
          }))}
          user={user}
        />
      </section>

      {/* Découvertes Carousel */}
      <section className="mb-12">
        <h2 className={`${gloock.className} mb-4 text-3xl font-bold`}>
          Découvertes
        </h2>
        <MoviesCarousel
          movies={discoverMovies.results as unknown as EnhancedMovie[]}
          userVotedMovies={userVotedMovies}
          moviesId={proposedMovies.map((movie) => ({ tmdb_id: movie.id }))}
          shownMoviesId={shownMovies.map((movie) => ({
            tmdb_id: movie.id,
            shown_at: "",
          }))}
          user={user}
        />
      </section>

      {/* Films déjà projetés Carousel */}
      <section className="mb-12">
        <h2 className={`${gloock.className} mb-4 text-3xl font-bold`}>
          Films déjà projetés
        </h2>
        <MoviesCarousel
          movies={shownMovies as unknown as EnhancedMovie[]}
          userVotedMovies={userVotedMovies}
          moviesId={proposedMovies.map((movie) => ({ tmdb_id: movie.id }))}
          shownMoviesId={shownMovies.map((movie) => ({
            tmdb_id: movie.id,
            shown_at: "",
          }))}
          user={user}
        />
      </section>

      {/* Films votés par l'utilisateur */}
      {user && userVotedMovies.length > 0 && (
        <section className="mb-12">
          <h2 className={`${gloock.className} mb-4 text-3xl font-bold`}>
            Vos Votes
          </h2>
          <MoviesCarousel
            movies={userVotedMovies as unknown as EnhancedMovie[]}
            userVotedMovies={userVotedMovies}
            moviesId={proposedMovies.map((movie) => ({ tmdb_id: movie.id }))}
            shownMoviesId={shownMovies.map((movie) => ({
              tmdb_id: movie.id,
              shown_at: "",
            }))}
            user={user}
          />
        </section>
      )}

      {/* Films proposés par l'utilisateur */}
      {/*      {user && userProposedMovies.length > 0 && (
        <section className="mb-12">
          <h2 className={`${gloock.className} mb-4 text-3xl font-bold`}>
            Vos Propositions
          </h2>
          <MoviesCarousel
            movies={userProposedMovies as unknown as EnhancedMovie[]}
            votedMovies={votedMovies}
            moviesId={proposedMovies.map((movie) => ({ tmdb_id: movie.id }))}
            shownMoviesId={shownMovies.map((movie) => ({
              tmdb_id: movie.id,
              shown_at: "",
            }))}
            user={user}
          />
        </section>
      )}*/}
    </main>
  );
}
