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
import { Settings2, AlertCircle } from "lucide-react";

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
    const [playerEngine, setPlayerEngine] = useState("vidlink_jw");
    const [autoplay, setAutoplay] = useState("false");
    const [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        let url = "";

        // Handle different player providers
        switch (playerEngine) {
            case "vidlink":
                url = type === "movie"
                    ? `https://vidlink.pro/movie/${id}?primaryColor=ffffff&secondaryColor=ffffff&iconColor=ffffff&autoplay=${autoplay}`
                    : `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=ffffff&secondaryColor=ffffff&iconColor=ffffff&autoplay=${autoplay}`;
                break;
            case "vidlink_jw":
                url = type === "movie"
                    ? `https://vidlink.pro/movie/${id}?primaryColor=ffffff&secondaryColor=ffffff&iconColor=ffffff&autoplay=${autoplay}&player=jw`
                    : `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=ffffff&secondaryColor=ffffff&iconColor=ffffff&autoplay=${autoplay}&player=jw`;
                break;
            case "vidsrc":
                url = type === "movie"
                    ? `https://vidsrc.me/embed/movie?tmdb=${id}`
                    : `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
                break;
            case "vidsrc_to":
                url = type === "movie"
                    ? `https://vidsrc.to/embed/movie/${id}`
                    : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
                break;
            case "embed_su":
                url = type === "movie"
                    ? `https://embed.su/embed/movie/${id}`
                    : `https://embed.su/embed/tv/${id}/${season}/${episode}`;
                break;
            case "superembed":
                url = type === "movie"
                    ? `https://multiembed.mov/?video_id=${id}&tmdb=1`
                    : `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
                break;
            default:
                url = type === "movie"
                    ? `https://vidlink.pro/movie/${id}?primaryColor=ffffff&secondaryColor=ffffff&iconColor=ffffff&autoplay=${autoplay}`
                    : `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=ffffff&secondaryColor=ffffff&iconColor=ffffff&autoplay=${autoplay}`;
        }

        setBaseUrl(url);

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
                {baseUrl ? (
                    <iframe
                        src={baseUrl}
                        className="absolute inset-0 h-full w-full"
                        allowFullScreen
                        allow="autoplay; encrypted-media; picture-in-picture"
                        referrerPolicy="origin"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                        <span className="text-muted-foreground">Loading player...</span>
                    </div>
                )}
            </div>

            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Settings2 className="h-4 w-4" />
                    <h3 className="font-semibold text-sm">Player Settings</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="player-engine">Video Source / Engine</Label>
                        <Select value={playerEngine} onValueChange={setPlayerEngine}>
                            <SelectTrigger id="player-engine">
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="vidlink">Vidlink (Default)</SelectItem>
                                <SelectItem value="vidlink_jw">Vidlink (JW Player)</SelectItem>
                                <SelectItem value="vidsrc">VidSrc</SelectItem>
                                <SelectItem value="vidsrc_to">VidSrc.to</SelectItem>
                                <SelectItem value="embed_su">Embed.su</SelectItem>
                                <SelectItem value="superembed">SuperEmbed</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2 bg-muted/50 p-2 rounded-md border border-border/50">
                            <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <p>
                                If the video fails to load, shows an ad-blocker warning, or displays CORS errors, try selecting a different Video Source from the dropdown above.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="autoplay">Autoplay</Label>
                        <Select value={autoplay} onValueChange={setAutoplay} disabled={!playerEngine.includes('vidlink')}>
                            <SelectTrigger id="autoplay">
                                <SelectValue placeholder="Select autoplay" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">On</SelectItem>
                                <SelectItem value="false">Off</SelectItem>
                            </SelectContent>
                        </Select>
                        {!playerEngine.includes('vidlink') && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Autoplay setting is only supported on Vidlink.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
