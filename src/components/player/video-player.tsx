"use client";

interface VideoPlayerProps {
    id: number;
    type: "movie" | "tv";
    season?: number;
    episode?: number;
    // Metadata for history
    title?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    episode_title?: string;
}

import { useWatchHistory } from "@/context/watch-history-context";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Settings2 } from "lucide-react";

export function VideoPlayer({
    id,
    type,
    season,
    episode,
    title,
    poster_path,
    backdrop_path,
    episode_title
}: VideoPlayerProps) {
    const { addToHistory } = useWatchHistory();
    const [playerEngine, setPlayerEngine] = useState("default");
    const [autoplay, setAutoplay] = useState("false");
    const [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        let url = "";
        if (type === "movie") {
            url = `https://vidlink.pro/movie/${id}`;
        } else {
            url = `https://vidlink.pro/tv/${id}/${season}/${episode}`;
        }

        const params = new URLSearchParams({
            primaryColor: "ffffff",
            secondaryColor: "ffffff",
            iconColor: "ffffff",
            autoplay: autoplay,
        });

        if (playerEngine === "jw") {
            params.append("player", "jw");
        }

        setBaseUrl(`${url}?${params.toString()}`);

    }, [id, type, season, episode, playerEngine, autoplay]);


    useEffect(() => {
        if (title) { // Only add if we have metadata
            addToHistory({
                id,
                type,
                title,
                poster_path: poster_path || null,
                backdrop_path: backdrop_path || null,
                timestamp: Date.now(),
                lastWatched: new Date().toISOString(),
                season_number: season,
                episode_number: episode,
                episode_title: episode_title
            });
        }
    }, [id, type, season, episode, title, poster_path, backdrop_path, episode_title, addToHistory]);

    return (
        <div className="w-full space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-border bg-black shadow-2xl">
                {baseUrl && (
                    <iframe
                        src={baseUrl}
                        className="absolute inset-0 h-full w-full"
                        allowFullScreen
                        allow="autoplay; encrypted-media; picture-in-picture"
                    />
                )}
            </div>

            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Settings2 className="h-4 w-4" />
                    <h3 className="font-semibold text-sm">Player Settings</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="player-engine">Player Engine</Label>
                        <Select value={playerEngine} onValueChange={setPlayerEngine}>
                            <SelectTrigger id="player-engine">
                                <SelectValue placeholder="Select player" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Default Player</SelectItem>
                                <SelectItem value="jw">JW Player (Alternative)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[0.8rem] text-muted-foreground">
                            Try switching players if you experience playback or subtitle issues.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="autoplay">Autoplay</Label>
                        <Select value={autoplay} onValueChange={setAutoplay}>
                            <SelectTrigger id="autoplay">
                                <SelectValue placeholder="Select autoplay" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">On</SelectItem>
                                <SelectItem value="false">Off</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
