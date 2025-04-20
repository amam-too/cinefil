import { Skeleton } from "@/components/ui/skeleton";

export default function MoviesCarrouselSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mb-2 h-96 w-full rounded-lg" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
