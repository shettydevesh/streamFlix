import { discoverTV, getTVGenres } from "@/lib/tmdb";
import { MediaCard } from "@/components/media/media-card";
import { FilterBar } from "@/components/media/filter-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
    searchParams: Promise<{
        sort?: string;
        genres?: string;
        page?: string;
    }>;
}

export default async function TVPage({ searchParams }: Props) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const sort = params.sort || "popularity.desc";
    const genres = params.genres;

    const [{ genres: tvGenres }, tvShows] = await Promise.all([
        getTVGenres(),
        discoverTV(currentPage, sort, genres),
    ]);

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">TV Series</h1>
                <p className="text-muted-foreground">
                    Discover new TV series and filter by your favorite genres.
                </p>
            </div>

            <FilterBar genres={tvGenres} />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {tvShows.results.map((show) => (
                    <MediaCard key={show.id} media={show} />
                ))}
            </div>

            {tvShows.results.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground">No TV series found matching your criteria.</p>
                </div>
            )}

            {/* Basic Pagination - Next/Prev */}
            <div className="flex justify-center gap-4 pt-8">
                <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    asChild={currentPage > 1}
                >
                    {currentPage > 1 ? (
                        <Link href={{ query: { ...params, page: currentPage - 1 } }}>Previous</Link>
                    ) : (
                        "Previous"
                    )}
                </Button>
                <span className="flex items-center text-sm font-medium">Page {currentPage}</span>
                <Button
                    variant="outline"
                    disabled={currentPage >= tvShows.total_pages}
                    asChild={currentPage < tvShows.total_pages}
                >
                    {currentPage < tvShows.total_pages ? (
                        <Link href={{ query: { ...params, page: currentPage + 1 } }}>Next</Link>
                    ) : (
                        "Next"
                    )}
                </Button>
            </div>
        </div>
    );
}
