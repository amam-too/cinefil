import { Skeleton } from "@/components/ui/skeleton";

export default function MovieRecommendationsSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            { [1, 2, 3, 4].map((rec) => (
                <div key={ rec }>
                    <Skeleton className="aspect-[2/3] rounded-lg mb-2"/>
                    <Skeleton className="h-4 w-3/4 mb-1"/>
                    <Skeleton className="h-4 w-1/2"/>
                </div>
            )) }
        </div>
    );
}
