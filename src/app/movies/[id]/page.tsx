import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CastCard } from "@/components/media/cast-card";
import { MediaCarousel } from "@/components/media/media-carousel";
import { getMovieCredits, getMovieDetail, getSimilarMovies, getImage } from "@/lib/tmdb";
import { getOMDBRatings } from "@/lib/omdb";
import { Ratings } from "@/components/media/ratings";
import { WatchlistButton } from "@/components/media/watchlist-button";
import { ContinueWatchingButton } from "@/components/media/continue-watching-button";
import { Separator } from "@/components/ui/separator";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const movie = await getMovieDetail(parseInt(id));
        return {
            title: `${movie.title} - StreamFlix`,
            description: movie.overview,
            openGraph: {
                images: [getImage(movie.backdrop_path, "original")],
            },
        };
    } catch (error) {
        return {
            title: "Movie Not Found - StreamFlix",
        };
    }
}

export default async function MoviePage({ params }: Props) {
    const { id } = await params;
    const movieId = parseInt(id);

    try {
        const [movie, credits, similar] = await Promise.all([
            getMovieDetail(movieId),
            getMovieCredits(movieId),
            getSimilarMovies(movieId),
        ]);

        // Fetch OMDB data if IMDb ID exists
        const omdbData = movie.imdb_id ? await getOMDBRatings(movie.imdb_id) : null;

        const director = credits.crew.find((c) => c.job === "Director");
        const writers = credits.crew
            .filter((c) => c.department === "Writing")
            .slice(0, 3);

        return (
            <div className="min-h-screen bg-background pb-10">
                {/* Backdrop Section */}
                <div className="relative h-[60vh] w-full md:h-[80vh]">
                    <div className="absolute inset-0">
                        <Image
                            src={getImage(movie.backdrop_path, "original")}
                            alt={movie.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    </div>

                    <div className="container relative flex h-full flex-col justify-end pb-10">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-8">
                            {/* Poster - Hidden on mobile, visible on tablet+ */}
                            <div className="hidden shrink-0 md:block">
                                <div className="relative h-[300px] w-[200px] overflow-hidden rounded-lg border-2 border-border shadow-2xl lg:h-[450px] lg:w-[300px]">
                                    <Image
                                        src={getImage(movie.poster_path, "w500")}
                                        alt={movie.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                                        {movie.title}
                                    </h1>
                                    {movie.tagline && (
                                        <p className="text-lg text-muted-foreground italic">
                                            &quot;{movie.tagline}&quot;
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1 text-foreground">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        {movie.vote_average.toFixed(1)}
                                    </div>
                                    {omdbData && (
                                        <Ratings ratings={omdbData.Ratings} imdbRating={omdbData.imdbRating} />
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {movie.release_date.split("-")[0]}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "N/A"}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {movie.genres.map((genre) => (
                                        <Badge key={genre.id} variant="secondary">
                                            {genre.name}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <ContinueWatchingButton media={movie} size="lg" className="text-base" />
                                    <WatchlistButton item={movie} variant="full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container space-y-12 py-8">
                    {/* Overview & Crew */}
                    <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold">Overview</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                {movie.overview}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {director && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Director</h3>
                                    <p className="font-medium">{director.name}</p>
                                </div>
                            )}
                            {writers.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Writers</h3>
                                    <div className="flex flex-col">
                                        {writers.map(w => <span key={w.id} className="font-medium">{w.name}</span>)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Cast */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold">Top Cast</h2>
                        <ScrollArea className="w-full whitespace-nowrap pb-4">
                            <div className="flex w-max space-x-4 p-1">
                                {credits.cast.slice(0, 15).map((cast) => (
                                    <CastCard key={cast.id} cast={cast} />
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </section>

                    <Separator />

                    {/* Similar Movies */}
                    {similar.results.length > 0 && (
                        <MediaCarousel
                            title="You Might Also Like"
                            items={similar.results}
                        />
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error(error);
        notFound();
    }
}
