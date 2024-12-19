import { DiscoverGrid } from "@/components/discoverGrid";
import MovieDetails from "@/components/movie/movieDetails";
import MoviesGrid from "@/components/movie/moviesGrid";
import SearchConfig from "@/components/searchConfig";
import Suggestions from "@/components/suggestions";
import { getDiscoverMovies, searchMovies } from "@/server/services/tmdb";
import { Suspense } from "react";

export default async function HomePage({
                                           searchParams
                                       }: {
    searchParams?: { query?: string; filmId?: string; displayShown?: string };
}) {
    const query: string = searchParams?.query ?? "";
    const filmId: string | undefined = searchParams?.filmId;
    const displayShown: string | undefined = searchParams?.displayShown;
    
    return (
        <main className="flex flex-col justify-center p-4 text-white">
            <SearchConfig/>
            <div className="flex flex-row items-start justify-center">
                { !query ? (
                    <Suggestions displayShown={ displayShown }/>
                ) : (
                    <Suspense key={ query } fallback={ <div>Loading...</div> }>
                        <MoviesGrid
                            movies={ (await searchMovies(query)).results }
                            filmId={ Number(filmId) }
                            displayShown={ displayShown }
                            forSuggestions={ false }
                        />
                    </Suspense>
                ) }
                
                { filmId ? (
                    <Suspense key={ filmId } fallback={ <div>Loading details...</div> }>
                        <MovieDetails filmId={ Number(filmId) }/>
                    </Suspense>
                ) : null }
            </div>
            
            <DiscoverGrid/>
        </main>
    );
}
