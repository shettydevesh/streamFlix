"use client";

import { useWatchHistory } from "@/context/watch-history-context";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { MediaCard } from "@/components/media/media-card";
import { Film, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContinueWatchingRow() {
    const { history, removeFromHistory } = useWatchHistory();

    if (!history || history.length === 0) return null;

    return (
        <div className="space-y-4 py-8">
            <div className="flex items-center justify-between px-4 md:px-8">
                <h2 className="text-2xl font-bold tracking-tight">Continue Watching</h2>
            </div>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {history.map((item) => (
                        <CarouselItem key={item.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                            <div className="group relative">
                                <MediaCard
                                    media={{
                                        id: item.id,
                                        title: item.type === "movie" ? item.title : undefined,
                                        name: item.type === "tv" ? item.title : undefined,
                                        poster_path: item.poster_path, // Fallback handled in card if null
                                        backdrop_path: item.backdrop_path,
                                        media_type: item.type,
                                        vote_average: 0, // Not needed for history display usually, or we could store it
                                        // Mocking required fields for MediaItem compatibility if needed
                                        overview: "",
                                        genre_ids: [],
                                        original_language: "en",
                                        popularity: 0,
                                        vote_count: 0
                                    } as any}
                                />
                                {/* Quick remove button */}
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 z-20"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeFromHistory(item.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove from history</span>
                                </Button>
                                {/* Overlay info for TV shows (S1 E2) */}
                                {item.type === "tv" && item.season_number && item.episode_number && (
                                    <div className="absolute bottom-14 left-2 z-10 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                                        S{item.season_number} E{item.episode_number}
                                    </div>
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-x-1/2" />
                <CarouselNext className="right-0 translate-x-1/2" />
            </Carousel>
        </div>
    );
}
