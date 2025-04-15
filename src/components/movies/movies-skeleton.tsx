import { Skeleton } from "@/components/ui/skeleton";

export default function MoviesCarrouselSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="w-full h-64 rounded-lg mb-2"/>
        </div>
    )
}
