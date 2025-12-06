import { Skeleton } from "@/components/ui/skeleton";

export function MediaCardSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="space-y-1 py-1">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
        </div>
    );
}
