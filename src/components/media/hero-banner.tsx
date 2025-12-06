import Link from "next/link";
import { Info, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WatchlistButton } from "@/components/media/watchlist-button";
import { ContinueWatchingButton } from "@/components/media/continue-watching-button";
import { getImage } from "@/lib/tmdb";
import { Movie, TVShow } from "@/types/tmdb";
import Image from "next/image";

interface HeroBannerProps {
    media: Movie | TVShow;
}

export function HeroBanner({ media }: HeroBannerProps) {
    const isMovie = media.media_type === "movie" || "title" in media;
    const title = "title" in media ? media.title : media.name;
    const backdrop = getImage(media.backdrop_path, "original");
    const href = isMovie ? `/movies/${media.id}` : `/tv/${media.id}`;
    const watchHref = `${href}/watch`; // Assuming watch route structure

    return (
        <div className="relative h-[85vh] w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={backdrop}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="container relative flex h-full flex-col justify-center gap-4 px-4 md:px-6">
                <div className="max-w-3xl space-y-4">
                    <Badge variant="outline" className="border-primary text-primary backdrop-blur-md">
                        Featured {isMovie ? "Movie" : "TV Series"}
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        {title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-1 text-foreground">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {media.vote_average.toFixed(1)}
                        </div>
                        <div>
                            {"release_date" in media ? media.release_date?.split("-")[0] : media.first_air_date?.split("-")[0]}
                        </div>
                        {/* Add more metadata if available */}
                    </div>

                    <p className="max-w-2xl text-lg text-muted-foreground line-clamp-3 md:text-xl">
                        {media.overview}
                    </p>

                    <div className="flex gap-4 pt-4">
                        <ContinueWatchingButton media={media} size="lg" className="text-base font-semibold" />
                        <Button variant="secondary" size="lg" className="gap-2 text-base font-semibold backdrop-blur-sm bg-white/20 hover:bg-white/30 text-white" asChild>
                            <Link href={href}>
                                <Info className="h-5 w-5" />
                                More Info
                            </Link>
                        </Button>
                        <div className="flex items-center">
                            <WatchlistButton item={media} variant="icon" className="h-11 w-11 rounded-md border border-input bg-background/50 hover:bg-accent hover:text-accent-foreground" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
