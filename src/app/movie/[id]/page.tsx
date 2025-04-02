import VoteButton from "@/components/customButtons/voteButton";
import MovieRecommendations from "@/components/movie/movie-recommendations";
import MovieRecommendationsSkeleton from "@/components/movie/movie-recommendations-skeleton";
import ProposeMovieManager from "@/components/propositions/proposeMovieManager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CountryFlagBadge from "@/components/ui/country-flag-badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getEnhancedMovie } from "@/server/services/movie";
import { format } from "date-fns";
import { Calendar, Clock, ExternalLink, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getEnhancedMovie(Number.parseInt(id));

  if (!movie) {
    notFound();
  }

  // Format runtime to hours and minutes
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "";

  return (
    <main className="relative min-h-screen">
      {/* Blurred backdrop gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt=""
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/95 backdrop-blur-xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4 py-12 pt-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Left column - Movie poster and actions */}
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-2xl">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-800">
                    <div className="p-4 text-center text-gray-400">
                      No poster available
                    </div>
                  </div>
                )}
              </div>

              {/* Movie actions */}
              <div className="mt-8 space-y-6">
                {movie.is_proposed ? (
                  <VoteButton movieId={movie.id} initial={movie.userHasVoted} />
                ) : (
                  <ProposeMovieManager movie={movie} />
                )}

                {/* External links */}
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-start text-gray-400 hover:text-white"
                  >
                    <Link
                      href={`https://www.themoviedb.org/movie/${movie.id}`}
                      target="_blank"
                      className="flex items-center"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <span>Afficher sur TMDB</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Movie details */}
          <div className="text-white md:col-span-2">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {movie.title}
              </h1>

              {movie.original_title !== movie.title && (
                <h2 className="text-xl text-gray-300">
                  {movie.original_title}
                </h2>
              )}

              {/* Tagline */}
              {movie.tagline && (
                <p className="pt-1 text-xl italic text-gray-400">
                  {movie.tagline}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{format(new Date(movie.release_date), "yyyy")}</span>
              </div>

              {runtime && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{runtime}</span>
                </div>
              )}

              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>
                  {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
                </span>
              </div>

              <div className="flex items-center">
                <CountryFlagBadge code={movie.original_language} />
              </div>
            </div>

            {/* Genres */}
            <div className="mt-6 flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <Link key={genre.id} href={`/genres/${genre.id}`}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer bg-white/10 hover:bg-white/20"
                  >
                    {genre.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <Separator className="my-8 bg-white/10" />

            {/* Overview */}
            <div className="space-y-3">
              <h3 className="text-2xl font-medium">Résumé</h3>
              <p className="text-lg leading-relaxed text-gray-300">
                {movie.overview}
              </p>
            </div>

            <Separator className="my-8 bg-white/10" />

            {/* Cast and Crew */}
            <div className="space-y-8">
              <h3 className="text-2xl font-medium">Acteurs et équipe</h3>

              {/* Director */}
              {movie.director && (
                <div>
                  <h4 className="mb-4 text-lg font-medium text-gray-200">
                    {movie.director.gender === 1
                      ? "Réalisatrice"
                      : "Réalisateur"}
                  </h4>
                  <div className="flex items-center">
                    <div className="relative mr-4 h-16 w-16 overflow-hidden rounded-full bg-gray-800">
                      {movie.director.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${movie.director.profile_path}`}
                          alt={movie.director.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        {movie.director.name}
                      </p>
                      <p className="text-gray-400">{movie.director.job}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cast */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-200">Acteurs</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-400 hover:text-white"
                  >
                    <Link
                      href={`https://www.themoviedb.org/movie/${movie.id}/cast`}
                      target="_blank"
                    >
                      Tout voir
                    </Link>
                  </Button>
                </div>

                <div className="-mx-4 overflow-x-auto px-4 pb-2">
                  <div
                    className="flex space-x-4"
                    style={{ minWidth: "max-content" }}
                  >
                    {movie.cast ? (
                      movie.cast.slice(0, 6).map((person) => (
                        <Link
                          key={`${person.id}-${person.order}`}
                          href={`https://www.themoviedb.org/person/${person.id}`}
                          target="_blank"
                          className="group"
                        >
                          <div className="w-28">
                            <div className="relative mb-2 h-40 w-28 overflow-hidden rounded-lg bg-gray-800 transition-opacity group-hover:opacity-90">
                              {person.profile_path ? (
                                <Image
                                  src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                                  alt={person.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <User className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform text-gray-400" />
                              )}
                            </div>
                            <p className="truncate font-medium transition-colors group-hover:text-gray-300">
                              {person.name}
                            </p>
                            <p className="truncate text-sm text-gray-400">
                              {person.character}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="w-28">
                        <Skeleton className="h-40 w-28" />
                        <Skeleton className="mt-2 h-4 w-28" />
                        <Skeleton className="mt-1 h-4 w-28" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Production companies */}
            {movie.production_companies &&
              movie.production_companies.length > 0 && (
                <>
                  <Separator className="my-8 bg-white/10" />

                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-200">
                      Production
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {movie.production_companies.map((company) => (
                        <Badge
                          key={company.id}
                          variant="outline"
                          className="bg-white/5 px-3 py-1.5"
                        >
                          {company.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

            {/* Recommendations */}
            {movie.recommendations && movie.recommendations.length > 0 && (
              <>
                <Separator className="my-8 bg-white/10" />

                <div>
                  <h3 className="mb-6 text-2xl font-medium">
                    Films similaires
                  </h3>
                  <Suspense fallback={<MovieRecommendationsSkeleton />}>
                    <MovieRecommendations
                      recommendations={movie.recommendations}
                      fromCache={movie.fromCache}
                    />
                  </Suspense>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
