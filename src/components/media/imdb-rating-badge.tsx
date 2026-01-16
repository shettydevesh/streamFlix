"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getExternalIds } from "@/lib/tmdb";
import { getOMDBRatings } from "@/lib/omdb";
import { cn } from "@/lib/utils";

interface IMDBRatingBadgeProps {
    tmdbId: number;
    mediaType: "movie" | "tv";
    voteAverage: number;
    className?: string;
}

export function IMDBRatingBadge({ tmdbId, mediaType, voteAverage, className }: IMDBRatingBadgeProps) {
    const [rating, setRating] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchRating = async () => {
            try {
                const externalIds = await getExternalIds(tmdbId, mediaType);
                if (!externalIds?.imdb_id) return;

                const omdbData = await getOMDBRatings(externalIds.imdb_id);
                if (mounted && omdbData?.imdbRating && omdbData.imdbRating !== "N/A") {
                    setRating(omdbData.imdbRating);
                }
            } catch (error) {
                console.error("Failed to fetch IMDB rating", error);
            }
        };

        fetchRating();

        return () => {
            mounted = false;
        };
    }, [tmdbId, mediaType]);

    if (rating) {
        return (
            <Badge variant="secondary" className={cn("flex items-center gap-1 bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm", className)}>
                <div className="font-bold text-[#f5c518] text-[10px]">IMDb</div>
                <Star className="h-3 w-3 fill-[#f5c518] text-[#f5c518]" />
                {rating}
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className={cn("flex items-center gap-1 bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm", className)}>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {voteAverage.toFixed(1)}
        </Badge>
    );
}
