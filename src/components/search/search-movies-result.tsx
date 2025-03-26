import MovieCard from "@/components/search/search-movie-card";
import { searchMovies } from "@/server/services/tmdb";

interface SearchMoviesResultProps {
    query?: string;
}

export default async function SearchMoviesResult({query}: SearchMoviesResultProps) {
    if (!query) {
        return <p>No query</p>;
    }
    
    const movies = await searchMovies(query);
    
    if (!movies?.results) {
        return <p>No results</p>;
    }
    
    return (
        <section className="md:w-3/4 w-full">
            <div className="flex flex-wrap justify-center gap-4 overflow-x-auto pb-10 -mx-4 px-4 mt-6">
                { movies.results.map((movie) => (
                    <MovieCard
                        key={ movie.id }
                        movie={ movie }
                    />
                )) }
            </div>
        </section>
    )
}