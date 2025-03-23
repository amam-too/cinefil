import { DiscoverGrid } from "@/components/discoverGrid";
import MoviesGrid from "@/components/movie/moviesGrid";
import { Suspense } from "react";

export default async function HomePage() {
    
    return (
        <main className="flex flex-col justify-center p-4">
            <div className="flex flex-row items-start justify-center pt-12">
                
                <Suspense fallback={ <div>Loading...</div> }>
                    <MoviesGrid
                        movies={ [] }
                        votedMovies={ [] }
                    />
                </Suspense>
            </div>
            
            <DiscoverGrid/>
        </main>
    );
}
