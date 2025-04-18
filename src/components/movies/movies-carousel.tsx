"use client";

import MovieSlide from "@/components/movies/movie-slide";
import NavigationButtons from "@/components/movies/navigation-buttons";
import { type EnhancedMovie } from "@/server/services/movie";
import useEmblaCarousel from "embla-carousel-react";
import React, { useCallback } from "react";

export interface MovieCarouselProps {
    movies: EnhancedMovie[];
}

export default function MoviesCarousel({movies}: MovieCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({loop: true, dragFree: true, align: "center", axis: "x"});
    
    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    
    if (!movies || movies.length === 0) return null;
    
    return (
        <section className="embla relative -mx-12">
            <div className="embla__viewport overflow-hidden" ref={ emblaRef }>
                <div className="embla__container flex space-x-4 py-4">
                    { movies.map((movie) => (
                        <div className="embla__slide" key={ `${ new Date().getUTCMilliseconds() }_${ movie.id }` }>
                            <MovieSlide movie={ movie }/>
                        </div>
                    )) }
                </div>
            </div>
            <NavigationButtons
                scrollPrevAction={ scrollPrev }
                scrollNextAction={ scrollNext }
            />
        </section>
    );
}
