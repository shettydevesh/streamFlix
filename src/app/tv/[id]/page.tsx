import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CastCard } from "@/components/media/cast-card";
import { EpisodeList } from "@/components/media/episode-list";
import { MediaCarousel } from "@/components/media/media-carousel";
import { getSeasonDetails, getSimilarTV, getTVCredits, getTVDetail, getImage } from "@/lib/tmdb";
import { getOMDBRatings } from "@/lib/omdb";
import { Ratings } from "@/components/media/ratings";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ season?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const tv = await getTVDetail(parseInt(id));
        return {
            title: `${tv.name} - StreamFlix`,
            description: tv.overview,
            openGraph: {
                images: [getImage(tv.backdrop_path, "original")],
            },
        };
    } catch (error) {
        return {
            title: "TV Series Not Found - StreamFlix",
        };
    }
}

export default async function TVPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { season } = await searchParams;
    const tvId = parseInt(id);
    const seasonNumber = season ? parseInt(season) : 1;

    try {
        const [tv, credits, similar, seasonDetails] = await Promise.all([
            getTVDetail(tvId),
            getTVCredits(tvId),
            getSimilarTV(tvId),
            getSeasonDetails(tvId, seasonNumber),
        ]);

        // Note: TV shows might need external ID lookup, but often TMDB ID queries work on OMDB sometimes or we need external_ids endpoint
        // For now, we'll try fetching with name/year if IMDb ID isn't directly available in standard detail (it is often in external_ids)
        // To make this robust, we should arguably fetch /tv/{id}/external_ids first, but let's see if we can get it or if we skip it for now.
        // TMDB TV detail response usually has no imdb_id directly at root? Let's check types.
        // If needed, we'll add external_ids fetch. For now, assuming we might need it.

        // Actually, let's keep it simple. If we don't have imdb_id easily, we might skip or add external_ids fetch. 
        // Checking types... TVDetail usually doesn't have imdb_id at root unlike Movie.
        // We will leave it for now or assume we might not get it for TV without extra call.
        // Let's try to add the Ratings component IF we can get data. 

        // For now, I will omit the ratings call for TV to avoid breakage until verified TV external ID structure.

        const createdBy = tv.created_by.slice(0, 3);

        return (
            <div className="min-h-screen bg-background pb-10">
                {/* Backdrop Section */}
                <div className="relative h-[60vh] w-full md:h-[80vh]">
                    <div className="absolute inset-0">
                        <Image
                            src={getImage(tv.backdrop_path, "original")}
                            alt={tv.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    </div>

                    <div className="container relative flex h-full flex-col justify-end pb-10">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-8">
                            {/* Poster */}
                            <div className="hidden shrink-0 md:block">
                                <div className="relative h-[300px] w-[200px] overflow-hidden rounded-lg border-2 border-border shadow-2xl lg:h-[450px] lg:w-[300px]">
                                    <Image
                                        src={getImage(tv.poster_path, "w500")}
                                        alt={tv.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                                <h1 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                                    {tv.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1 text-foreground">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        {tv.vote_average.toFixed(1)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {tv.first_air_date.split("-")[0]}
                                    </div>
                                    <div>
                                        {tv.number_of_seasons} Season{tv.number_of_seasons !== 1 ? "s" : ""}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {tv.genres.map((genre) => (
                                        <Badge key={genre.id} variant="secondary">
                                            {genre.name}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    {/* Start watching from S1E1 */}
                                    <Button size="lg" className="gap-2 text-base" asChild>
                                        <Link href={`/tv/${tv.id}/watch?s=1&e=1`}>
                                            Start Watching
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container space-y-12 py-8">
                    <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold">Overview</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                {tv.overview}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {createdBy.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                                    <div className="flex flex-col">
                                        {createdBy.map(c => <span key={c.id} className="font-medium">{c.name}</span>)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Season & Episodes */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">Episodes</h2>
                        </div>

                        {/* Season Selector */}
                        <Tabs defaultValue={seasonNumber.toString()} className="w-full">
                            <ScrollArea className="w-full whitespace-nowrap pb-4">
                                <TabsList className="mb-4">
                                    {tv.seasons.map((s) => (
                                        <TabsTrigger key={s.id} value={s.season_number.toString()} asChild>
                                            <Link href={`?season=${s.season_number}`} scroll={false}>
                                                {s.name}
                                            </Link>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </Tabs>

                        {/* Episode List */}
                        {seasonDetails && (
                            <EpisodeList episodes={seasonDetails.episodes || []} seriesId={tvId} />
                        )}
                    </section>

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

                    {/* Similar Shows */}
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
