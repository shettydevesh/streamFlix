import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { getImage } from "@/lib/tmdb";
import { Movie, TVShow } from "@/types/tmdb";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MediaCardProps {
    media: Movie | TVShow;
    className?: string;
    width?: number;
    height?: number;
}

export function MediaCard({ media, className, width = 300, height = 450 }: MediaCardProps) {
    const isMovie = media.media_type === "movie" || "title" in media;
    const title = "title" in media ? media.title : media.name;
    const date = "release_date" in media ? media.release_date : media.first_air_date;
    const year = date ? new Date(date).getFullYear() : "N/A";
    const href = isMovie ? `/movies/${media.id}` : `/tv/${media.id}`;

    return (
        <Link href={href}>
            <Card
                className={cn(
                    "group relative h-full overflow-hidden rounded-md border-0 bg-transparent shadow-none transition-transform hover:scale-105",
                    className
                )}
            >
                <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-md">
                        <AspectRatio ratio={2 / 3}>
                            <Image
                                src={getImage(media.poster_path, "w500")}
                                alt={title}
                                fill
                                className="object-cover transition-all group-hover:opacity-90"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                            />
                        </AspectRatio>
                        <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="flex items-center gap-1 bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {media.vote_average.toFixed(1)}
                            </Badge>
                        </div>
                    </div>
                    <div className="pt-2">
                        <h3 className="line-clamp-1 text-sm font-medium leading-none tracking-tight">
                            {title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            {year} • {isMovie ? "Movie" : "TV Series"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
