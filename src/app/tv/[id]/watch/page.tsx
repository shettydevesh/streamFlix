import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { VideoPlayer } from "@/components/player/video-player";
import { getSeasonDetails, getTVDetail, getImage } from "@/lib/tmdb";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ s?: string; e?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { id } = await params;
    const { s, e } = await searchParams;
    try {
        const tv = await getTVDetail(parseInt(id));
        return {
            title: s && e
                ? `Watch ${tv.name} S${s} E${e} - StreamFlix`
                : `Watch ${tv.name} - StreamFlix`,
        };
    } catch (error) {
        return {
            title: "TV Series Not Found - StreamFlix",
        };
    }
}

export default async function TVWatchPage({ params, searchParams }: Props) {
    const { id } = await params;
    const { s, e } = await searchParams;
    const tvId = parseInt(id);

    // Default to Season 1 Episode 1 if not specified
    if (!s || !e) {
        redirect(`/tv/${id}/watch?s=1&e=1`);
    }

    const seasonNumber = parseInt(s);
    const episodeNumber = parseInt(e);

    try {
        const [tv, seasonDetails] = await Promise.all([
            getTVDetail(tvId),
            getSeasonDetails(tvId, seasonNumber),
        ]);

        const currentEpisode = seasonDetails.episodes?.find(ep => ep.episode_number === episodeNumber);

        if (!currentEpisode) {
            // Fallback or error handling if episode doesn't exist
        }

        // Determine Prev/Next Links
        const prevEpisode = seasonDetails.episodes?.find(ep => ep.episode_number === episodeNumber - 1);
        const nextEpisode = seasonDetails.episodes?.find(ep => ep.episode_number === episodeNumber + 1);

        return (
            <div className="container py-8 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold md:text-3xl">
                        <Link href={`/tv/${tvId}`} className="hover:underline text-muted-foreground transition-colors">{tv.name}</Link>
                        <span className="mx-2 text-muted-foreground">/</span>
                        <span className="text-primary">S{seasonNumber} E{episodeNumber}</span>
                    </h1>
                    {currentEpisode && <h2 className="text-xl font-medium">{currentEpisode.name}</h2>}
                </div>

                <VideoPlayer
                    id={tvId}
                    type="tv"
                    season={seasonNumber}
                    episode={episodeNumber}
                    title={tv.name}
                    poster_path={tv.poster_path}
                    backdrop_path={tv.backdrop_path}
                    episode_title={currentEpisode?.name}
                />

                {/* Episode Navigation Controls */}
                <div className="flex items-center justify-between">
                    <Button variant="outline" disabled={!prevEpisode} asChild={!!prevEpisode}>
                        {prevEpisode ? (
                            <Link href={`?s=${seasonNumber}&e=${prevEpisode.episode_number}`}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Episode
                            </Link>
                        ) : (
                            <span><ChevronLeft className="mr-2 h-4 w-4" /> Previous Episode</span>
                        )}
                    </Button>
                    <Button variant="outline" disabled={!nextEpisode} asChild={!!nextEpisode}>
                        {nextEpisode ? (
                            <Link href={`?s=${seasonNumber}&e=${nextEpisode.episode_number}`}>
                                Next Episode <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        ) : (
                            <span>Next Episode <ChevronRight className="ml-2 h-4 w-4" /></span>
                        )}
                    </Button>
                </div>

                {/* Season Episodes List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Season {seasonNumber} Episodes</h3>
                    <ScrollArea className="w-full whitespace-nowrap pb-4">
                        <div className="flex w-max space-x-4 p-1">
                            {seasonDetails.episodes?.map((episode) => (
                                <Link
                                    key={episode.id}
                                    href={`?s=${seasonNumber}&e=${episode.episode_number}`}
                                    className={cn(
                                        "relative flex w-[200px] flex-col gap-2 rounded-lg border p-2 transition-all hover:bg-accent",
                                        episode.episode_number === episodeNumber && "border-primary bg-accent/50"
                                    )}
                                >
                                    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                                        <Image
                                            src={getImage(episode.still_path, "w500")}
                                            alt={episode.name}
                                            fill
                                            className="object-cover"
                                        />
                                        {episode.episode_number === episodeNumber && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                <div className="rounded-full bg-primary p-1">
                                                    <div className="h-2 w-2 rounded-full bg-background animate-pulse" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium line-clamp-1">{episode.episode_number}. {episode.name}</span>
                                        <span className="text-xs text-muted-foreground">{episode.runtime}m</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </div>
        );
    } catch (error) {
        console.error(error);
        notFound();
    }
}
