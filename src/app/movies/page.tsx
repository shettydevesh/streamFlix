import { discoverMovies, getMovieGenres } from "@/lib/tmdb";
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

export default async function MoviesPage({ searchParams }: Props) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const sort = params.sort || "popularity.desc";
    const genres = params.genres;

    const [{ genres: movieGenres }, movies] = await Promise.all([
        getMovieGenres(),
        discoverMovies(currentPage, sort, genres),
    ]);

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Movies</h1>
                <p className="text-muted-foreground">
                    Discover new movies and filter by your favorite genres.
                </p>
            </div>

            <FilterBar genres={movieGenres} />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {movies.results.map((movie) => (
                    <MediaCard key={movie.id} media={movie} />
                ))}
            </div>

            {movies.results.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground">No movies found matching your criteria.</p>
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
                    disabled={currentPage >= movies.total_pages}
                    asChild={currentPage < movies.total_pages}
                >
                    {currentPage < movies.total_pages ? (
                        <Link href={{ query: { ...params, page: currentPage + 1 } }}>Next</Link>
                    ) : (
                        "Next"
                    )}
                </Button>
            </div>
        </div>
    );
}
