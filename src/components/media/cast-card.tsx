import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImage } from "@/lib/tmdb";
import { CastMember } from "@/types/tmdb";

interface CastCardProps {
    cast: CastMember;
}

export function CastCard({ cast }: CastCardProps) {
    return (
        <div className="flex w-[120px] flex-col gap-2 text-center">
            <Avatar className="h-[120px] w-[120px] border-2 border-border">
                <AvatarImage
                    src={getImage(cast.profile_path, "w185")}
                    alt={cast.name}
                    className="object-cover"
                />
                <AvatarFallback>{cast.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-xs font-semibold line-clamp-1">{cast.name}</span>
                <span className="text-[10px] text-muted-foreground line-clamp-1">
                    {cast.character}
                </span>
            </div>
        </div>
    );
}
