import { DiscoverGrid } from "@/components/discoverGrid";
import MovieDetails from "@/components/movie/movieDetails";
import MoviesGrid from "@/components/movie/moviesGrid";
import Propositions from "@/components/propositions/propositions";
import SearchConfig from "@/components/searchConfig";
import { searchMovies } from "@/server/services/tmdb";
import { getMoviesVotedByUser } from "@/server/services/votes";
import { type Vote } from "@/types/vote";
import { Suspense } from "react";

interface HomePageProps {
    searchParams?: Promise<{
        query?: string;
        filmId?: string;
        displayShown?: string;
    }>
}

export default async function HomePage({searchParams}: HomePageProps) {
    const {
        query,
        filmId,
        displayShown
    } = await searchParams;
    
    const votedMovies: Vote[] = await getMoviesVotedByUser();
    
    return (
        <main className="flex flex-col justify-center p-4 text-white">
            <SearchConfig/>
            <div className="flex flex-row items-start justify-center">
                { !query ? (
                    /* Grille des films déjà proposés. */
                    <Propositions displayShown={ displayShown }/>
                ) : (
                    <Suspense key={ query } fallback={ <div>Loading...</div> }>
                        {/* Grille des films correspondant à la recherche. */ }
                        <MoviesGrid
                            movies={ (await searchMovies(query)).results }
                            filmId={ Number(filmId) }
                            displayShown={ displayShown }
                            votedMovies={ votedMovies }
                        />
                    </Suspense>
                ) }
                
                { filmId ? (
                    <Suspense key={ filmId } fallback={ <div>Loading details...</div> }>
                        <MovieDetails filmId={ Number(filmId) } votedMovies={ votedMovies }/>
                    </Suspense>
                ) : null }
            </div>
            
            <DiscoverGrid/>
        </main>
    );
}
