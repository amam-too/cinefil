import { getEnhancedMovies } from "@/server/services/movie";
import Image from "next/image";
import Link from "next/link";
import { type MovieDetails, type Recommendation } from "tmdb-ts";

interface MovieRecommendationsProps {
    recommendations: Recommendation[] | MovieDetails[];
    fromCache?: boolean;
}

export default async function MovieRecommendations({recommendations, fromCache}: MovieRecommendationsProps) {
    let recom = recommendations;
    
    if (fromCache) {
        recom = await getEnhancedMovies(recommendations.map(r => r.id), {ignoreErrors: true})
    }
    
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            { recom.slice(0, 4).map((recommendation) => (
                <Link key={ recommendation.id } href={ `/movie/${ recommendation.id }` } className="group">
                    <div className="space-y-2">
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 group-hover:opacity-90 transition-opacity">
                            { recommendation.poster_path ? (
                                <Image
                                    src={ `https://image.tmdb.org/t/p/w300${ recommendation.poster_path }` }
                                    alt={ recommendation.title }
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                                    No image
                                </div>
                            ) }
                        </div>
                        <div>
                            <p className="font-medium truncate group-hover:text-gray-300 transition-colors">
                                { recommendation.title }
                            </p>
                            <p className="text-sm text-gray-400">
                                { recommendation.release_date && new Date(recommendation.release_date).getFullYear() }
                            </p>
                        </div>
                    </div>
                </Link>
            )) }
        </div>
    )
}
