"use client";

import { useWatchHistory } from "@/context/watch-history-context";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/types/tmdb";
import { useEffect, useState } from "react";

interface ContinueWatchingButtonProps {
    media: MediaItem;
    className?: string;
    variant?: "default" | "secondary" | "outline" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

export function ContinueWatchingButton({
    media,
    className,
    variant = "default",
    size = "default"
}: ContinueWatchingButtonProps) {
    const { history } = useWatchHistory();
    const [historyItem, setHistoryItem] = useState<any>(null);

    // Hydration mismatch avoidance: only check history after mount
    useEffect(() => {
        const item = history.find((h) => h.id === media.id);
        setHistoryItem(item);
    }, [history, media.id]);

    const isTV = media.media_type === "tv" || "name" in media;
    const isMovie = !isTV;

    let href = "";
    let label = "";

    if (historyItem) {
        if (historyItem.type === "tv") {
            const s = historyItem.season_number || 1;
            const e = historyItem.episode_number || 1;
            href = `/tv/${media.id}/watch?s=${s}&e=${e}`;
            label = `Continue S${s} E${e}`;
        } else {
            href = `/movies/${media.id}/watch`;
            label = "Resume Movie";
        }
    } else {
        if (isTV) {
            href = `/tv/${media.id}/watch?s=1&e=1`;
            label = "Start Watching";
        } else {
            href = `/movies/${media.id}/watch`;
            label = "Watch Now";
        }
    }

    return (
        <Button variant={variant} size={size} className={cn("gap-2", className)} asChild>
            <Link href={href}>
                <Play className="h-4 w-4 fill-current" />
                {label}
            </Link>
        </Button>
    );
}
