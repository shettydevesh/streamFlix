"use client";

import { Heart, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/context/watchlist-context";
import { MediaItem } from "@/types/tmdb";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
    item: MediaItem;
    variant?: "icon" | "full";
    className?: string;
}

export function WatchlistButton({ item, variant = "icon", className }: WatchlistButtonProps) {
    const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
    const isSaved = isInWatchlist(item.id);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSaved) {
            removeFromWatchlist(item.id);
        } else {
            addToWatchlist(item);
        }
    };

    if (variant === "full") {
        return (
            <Button
                variant={isSaved ? "secondary" : "outline"}
                size="lg"
                className={cn("gap-2", className)}
                onClick={handleClick}
            >
                {isSaved ? (
                    <>
                        <Check className="h-4 w-4" />
                        Added to Watchlist
                    </>
                ) : (
                    <>
                        <Plus className="h-4 w-4" />
                        Add to Watchlist
                    </>
                )}
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors",
                isSaved && "text-red-500 hover:text-red-600 bg-black/60",
                className
            )}
            onClick={handleClick}
        >
            <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
            <span className="sr-only">
                {isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
            </span>
        </Button>
    );
}
