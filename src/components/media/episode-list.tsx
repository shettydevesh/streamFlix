import Link from "next/link";
import Image from "next/image";
import { Play, Film } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Episode } from "@/types/tmdb";
import { getImage } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface EpisodeListProps {
    episodes: Episode[];
    seriesId: number;
}

export function EpisodeList({ episodes, seriesId }: EpisodeListProps) {
    return (
        <div className="space-y-4">
            {episodes.map((episode) => {
                const isReleased = !episode.air_date || new Date(episode.air_date) <= new Date();

                const cardContent = (
                    <Card className={cn(
                        "overflow-hidden border-border/50 transition-colors",
                        isReleased ? "hover:bg-accent/50" : "opacity-75 cursor-not-allowed bg-muted/30"
                    )}>
                        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
                            <div className="relative w-full shrink-0 overflow-hidden rounded-md bg-muted sm:w-[220px]">
                                <AspectRatio ratio={16 / 9}>
                                    {episode.still_path ? (
                                        <Image
                                            src={getImage(episode.still_path, "w500")}
                                            alt={episode.name}
                                            fill
                                            className={cn("object-cover", !isReleased && "grayscale")}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-muted">
                                            <Film className="h-10 w-10 text-muted-foreground/50" />
                                        </div>
                                    )}

                                    {isReleased && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                                            <Play className="h-8 w-8 fill-white text-white" />
                                        </div>
                                    )}
                                </AspectRatio>
                            </div>

                            <div className="flex flex-1 flex-col gap-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold line-clamp-1">
                                            {episode.episode_number}. {episode.name}
                                        </h3>
                                        <span className="text-sm text-muted-foreground">{episode.air_date} • {episode.runtime ? `${episode.runtime}m` : "TBA"}</span>
                                    </div>
                                    <div className="shrink-0 md:hidden">
                                        <div className={cn("rounded-full p-2 text-primary-foreground", isReleased ? "bg-primary" : "bg-muted-foreground/30")}>
                                            <Play className="h-4 w-4 fill-current" />
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {episode.overview || "No overview available."}
                                </p>

                                <div className="mt-auto hidden md:block">
                                    <span className={cn("text-sm font-medium", isReleased ? "text-primary hover:underline" : "text-muted-foreground")}>
                                        {isReleased ? "Watch Episode" : "Coming Soon"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );

                if (!isReleased) {
                    return <div key={episode.id}>{cardContent}</div>;
                }

                return (
                    <Link key={episode.id} href={`/tv/${seriesId}/watch?s=${episode.season_number}&e=${episode.episode_number}`}>
                        {cardContent}
                    </Link>
                );
            })}
        </div>
    );
}
