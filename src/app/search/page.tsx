import { searchMulti } from "@/lib/tmdb";
import { MediaCard } from "@/components/media/media-card";
import { Metadata } from "next";

interface Props {
    searchParams: Promise<{ q: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { q } = await searchParams;
    return {
        title: q ? `Search results for "${q}" - StreamFlix` : "Search - StreamFlix",
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams;

    if (!q) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-3xl font-bold">Search StreamFlix</h1>
                <p className="mt-4 text-muted-foreground">
                    Enter a term to find movies and TV series.
                </p>
            </div>
        );
    }

    const results = await searchMulti(q);
    // Filter out people or items without image/title if needed, though MediaCard handles basic fields
    const filteredResults = results.results.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
    );

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
                <p className="text-muted-foreground">
                    Found {filteredResults.length} results for "{q}"
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filteredResults.map((item) => (
                    <MediaCard key={item.id} media={item} />
                ))}
            </div>

            {filteredResults.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground">No results found for "{q}".</p>
                </div>
            )}
        </div>
    );
}
