import HomeDiscover from "@/components/home/home-discover";
import HomeGreeting, { EmptyHomeGreeting } from "@/components/home/home-greeting";
import HomePropositions from "@/components/home/home-propositions";
import HomeShown from "@/components/home/home-shown";
import MoviesCarrouselSkeleton from "@/components/movies/movies-skeleton";
import React, { Suspense } from "react";

export default async function HomePage() {
    
    return (
        <main className="pt-32 flex flex-col gap-6 mx-12 justify-center">
            <Suspense fallback={ <EmptyHomeGreeting/> }>
                <HomeGreeting/>
            </Suspense>
            
            <Suspense fallback={ <MoviesCarrouselSkeleton/> }>
                <HomePropositions/>
            </Suspense>
            
            <Suspense fallback={ <MoviesCarrouselSkeleton/> }>
                <HomeDiscover/>
            </Suspense>
            
            <Suspense fallback={ <MoviesCarrouselSkeleton/> }>
                <HomeShown/>
            </Suspense>
            
            {/*/!* Films votés par l'utilisateur */ }
            {/*{ user && userVotedMovies.length > 0 && (*/ }
            {/*    <section className="mb-12">*/ }
            {/*        <h2 className="mb-4 text-3xl font-bold">*/ }
            {/*            Vos Votes*/ }
            {/*        </h2>*/ }
            {/*        <MoviesCarousel*/ }
            {/*            movies={ userVotedMovies as unknown as EnhancedMovie[] }*/ }
            {/*            userVotedMovies={ userVotedMovies }*/ }
            {/*            moviesId={ proposedMovies.map((movie) => ({tmdb_id: movie.id})) }*/ }
            {/*            shownMoviesId={ shownMovies.map((movie) => ({*/ }
            {/*                tmdb_id: movie.id,*/ }
            {/*                shown_at: ""*/ }
            {/*            })) }*/ }
            {/*            user={ user }*/ }
            {/*        />*/ }
            {/*    </section>*/ }
            {/*) }*/ }
            
            {/* Films proposés par l'utilisateur */ }
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
      )}*/ }
        </main>
    );
}
