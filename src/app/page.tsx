import { DiscoverGrid } from "@/components/discoverGrid";
import MovieDetails from "@/components/movie/movieDetails";
import MoviesGrid from "@/components/movie/moviesGrid";
import { type Vote } from "@/types/vote";
import { Suspense } from "react";

interface HomePageProps {
    searchParams: Promise<{
        query?: string;
        filmId?: string;
        displayShown?: string;
    }>
}

export default async function HomePage({searchParams}: HomePageProps) {
    const params = await searchParams;
    const {filmId} = params;
    
    return (
        <main className="flex flex-col justify-center p-4">
            <div className="flex flex-row items-start justify-center">
                
                <Suspense fallback={ <div>Loading...</div> }>
                    <MoviesGrid
                        movies={ [] }
                        votedMovies={ [] }
                    />
                </Suspense>
                
                { filmId ? (
                    <Suspense key={ filmId } fallback={ <div>Loading details...</div> }>
                        <MovieDetails filmId={ Number(filmId) } votedMovies={ null as unknown as Vote[] }/>
                    </Suspense>
                ) : null }
            </div>
            
            <DiscoverGrid/>
        </main>
    );
}
