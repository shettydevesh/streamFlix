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
import { useEffect } from "react";

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

    let url = "";
    if (type === "movie") {
        url = `https://vidlink.pro/movie/${id}?primaryColor=ffffff&secondaryColor=ffffff&iconColor=ffffff`;
    } else {
        url = `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=ffffff&secondaryColor=ffffff&iconColor=ffffff`;
    }

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
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-border bg-black shadow-2xl">
            <iframe
                src={url}
                className="absolute inset-0 h-full w-full"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
            />
        </div>
    );
}
