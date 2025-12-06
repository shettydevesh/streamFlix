import { MediaGridSkeleton } from "@/components/media/media-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen pb-10 pt-20">
            <div className="container space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>

                {/* Filter Bar Skeleton */}
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-24 rounded-full" />
                    ))}
                </div>

                <MediaGridSkeleton />
            </div>
        </div>
    );
}
