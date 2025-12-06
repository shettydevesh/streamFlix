import { Skeleton } from "@/components/ui/skeleton";

export function DetailSkeleton() {
    return (
        <div className="min-h-screen bg-background pb-10">
            {/* Backdrop Section */}
            <div className="relative h-[60vh] w-full md:h-[80vh]">
                <Skeleton className="h-full w-full" />

                <div className="container relative flex h-full flex-col justify-end pb-10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-8">
                        {/* Poster */}
                        <div className="hidden shrink-0 md:block">
                            <Skeleton className="h-[300px] w-[200px] rounded-lg lg:h-[450px] lg:w-[300px]" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-4">
                            <Skeleton className="h-10 w-3/4 md:h-16 md:w-1/2" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                            <div className="pt-4">
                                <Skeleton className="h-12 w-40 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
