import HomeDiscover from "@/components/home/home-discover";
import HomeGreeting, {
  EmptyHomeGreeting,
} from "@/components/home/home-greeting";
import HomePropositions from "@/components/home/home-propositions";
import HomeShown from "@/components/home/home-shown";
import MoviesCarrouselSkeleton from "@/components/movies/movies-skeleton";
import React, { Suspense } from "react";

export default async function HomePage() {
  return (
    <main className="mx-12 flex flex-col justify-center gap-6 pt-32">
      <Suspense fallback={<EmptyHomeGreeting />}>
        <HomeGreeting />
      </Suspense>

      <Suspense fallback={<MoviesCarrouselSkeleton />}>
        <HomePropositions />
      </Suspense>

      <Suspense fallback={<MoviesCarrouselSkeleton />}>
        <HomeDiscover />
      </Suspense>

      <Suspense fallback={<MoviesCarrouselSkeleton />}>
        <HomeShown />
      </Suspense>
    </main>
  );
}
