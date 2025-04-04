"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { type EnhancedMovie } from "@/server/services/movie";
import { type Vote } from "@/types/vote";
import type { User } from "@supabase/auth-js";
import MovieSlide from "@/components/movies/movie-slide";
import NavigationButtons from "@/components/movies/navigation-buttons";

export interface MovieCarouselProps {
  movies: EnhancedMovie[];
  moviesId: { tmdb_id: number }[];
  shownMoviesId: { tmdb_id: number; shown_at: string }[];
  userVotedMovies: Vote[];
  user: User | null;
}

export default function MoviesCarousel({
  movies,
  moviesId,
  shownMoviesId,
  user,
  userVotedMovies,
}: MovieCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!movies || movies.length === 0) return null;

  return (
    <section className="embla relative">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex space-x-4 py-4">
          {movies.map((movie) => {
            const isShown = shownMoviesId.some(
              (value) => value.tmdb_id === movie.id,
            );

            if (isShown) return null;

            const filmCanBeProposed = !moviesId.some(
              (value) => value.tmdb_id === movie.id,
            );
            const userHasVotedFor = userVotedMovies.some(
              (value) => value.tmdb_id === movie.id,
            );

            const shownAt = shownMoviesId.find(
              (value) => value.tmdb_id === movie.id,
            )?.shown_at;

            return (
              <MovieSlide
                key={movie.id}
                movie={movie}
                filmCanBeProposed={filmCanBeProposed}
                userHasVotedFor={userHasVotedFor}
                user={user}
                shownAt={shownAt ?? ""}
              />
            );
          })}
        </div>
      </div>
      <NavigationButtons
        scrollPrevAction={scrollPrev}
        scrollNextAction={scrollNext}
      />
    </section>
  );
}
