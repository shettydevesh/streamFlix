import { OMDBRating } from "@/lib/omdb";
import { Badge } from "@/components/ui/badge";

interface RatingsProps {
    ratings: OMDBRating[];
    imdbRating?: string;
}

export function Ratings({ ratings, imdbRating }: RatingsProps) {
    const rottenTomatoes = ratings?.find((r) => r.Source === "Rotten Tomatoes");

    if (!imdbRating && !rottenTomatoes) return null;

    return (
        <div className="flex items-center gap-3">
            {imdbRating && imdbRating !== "N/A" && (
                <Badge variant="outline" className="gap-1 border-yellow-500/50 bg-yellow-500/10 text-yellow-500">
                    <span className="font-bold">IMDb</span>
                    <span>{imdbRating}</span>
                </Badge>
            )}
            {rottenTomatoes && (
                <Badge variant="outline" className="gap-1 border-red-500/50 bg-red-500/10 text-red-500">
                    <span className="font-bold">RT</span>
                    <span>{rottenTomatoes.Value}</span>
                </Badge>
            )}
        </div>
    );
}
