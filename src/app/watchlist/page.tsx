"use client";

import { useWatchlist } from "@/context/watchlist-context";
import { MediaCard } from "@/components/media/media-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Film } from "lucide-react";

export default function WatchlistPage() {
    const { watchlist } = useWatchlist();

    if (watchlist.length === 0) {
        return (
            <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Film className="h-10 w-10 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Your Watchlist is empty</h1>
                <p className="max-w-[500px] text-muted-foreground">
                    Save movies and TV shows to your watchlist to keep track of what you want to watch.
                </p>
                <Button asChild size="lg">
                    <Link href="/">Browse Content</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container min-h-screen py-8">
            <h1 className="mb-8 text-3xl font-bold">My Watchlist</h1>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {watchlist.map((item) => (
                    <MediaCard key={item.id} media={item as any} />
                ))}
            </div>
        </div>
    );
}
