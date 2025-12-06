import { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/player/video-player";
import { getMovieDetail } from "@/lib/tmdb";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const movie = await getMovieDetail(parseInt(id));
        return {
            title: `Watch ${movie.title} - StreamFlix`,
            description: `Watch ${movie.title} on StreamFlix`,
        };
    } catch (error) {
        return {
            title: "Movie Not Found - StreamFlix",
        };
    }
}

export default async function MovieWatchPage({ params }: Props) {
    const { id } = await params;
    const movieId = parseInt(id);

    try {
        const movie = await getMovieDetail(movieId);

        return (
            <div className="container py-8 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold md:text-3xl">Now Playing: <span className="text-primary">{movie.title}</span></h1>
                </div>

                <VideoPlayer id={movieId} type="movie" />

                <div className="space-y-4 max-w-4xl">
                    <h2 className="text-xl font-semibold">Overview</h2>
                    <p className="text-muted-foreground">{movie.overview}</p>
                </div>
            </div>
        );
    } catch (error) {
        console.error(error);
        notFound();
    }
}
