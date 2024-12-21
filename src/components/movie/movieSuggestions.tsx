import MoviesCard from "@/components/movie/movieCard";
import { getSuggestions } from "@/server/services/tmdb";

export default async function SuggestedMovies({filmId}: { filmId: number }) {
    const suggestedMovies = await getSuggestions(filmId);
    
    if (!suggestedMovies?.results) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className="flex flex-col mt-4 overflow-auto">
            <h1 className="text-xl">Films Similaires</h1>
            <div className="flex flex-row justify-start gap-8">
                { suggestedMovies.results.map((movie) => (
                    <MoviesCard movie={ movie } hasBeenSuggested={ false } key={ movie.id }/>
                )) }
            </div>
        </div>
    );
}