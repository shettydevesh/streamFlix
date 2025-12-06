"use client";

interface VideoPlayerProps {
    id: number;
    type: "movie" | "tv";
    season?: number;
    episode?: number;
}

export function VideoPlayer({ id, type, season, episode }: VideoPlayerProps) {
    let url = "";

    if (type === "movie") {
        url = `https://vidlink.pro/movie/${id}?primaryColor=ffffff&secondaryColor=ffffff&iconColor=ffffff`;
    } else {
        url = `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=ffffff&secondaryColor=ffffff&iconColor=ffffff`;
    }

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
