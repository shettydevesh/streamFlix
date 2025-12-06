"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { MediaItem } from "@/types/tmdb";

interface WatchlistContextType {
    watchlist: MediaItem[];
    addToWatchlist: (item: MediaItem) => void;
    removeFromWatchlist: (id: number) => void;
    isInWatchlist: (id: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
    const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("streamflix-watchlist");
        if (stored) {
            try {
                setWatchlist(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse watchlist", e);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("streamflix-watchlist", JSON.stringify(watchlist));
        }
    }, [watchlist, isInitialized]);

    const addToWatchlist = (item: MediaItem) => {
        setWatchlist((prev) => {
            if (prev.some((i) => i.id === item.id)) return prev;
            toast.success("Added to Watchlist");
            return [...prev, item];
        });
    };

    const removeFromWatchlist = (id: number) => {
        setWatchlist((prev) => {
            const newlist = prev.filter((i) => i.id !== id);
            toast.success("Removed from Watchlist");
            return newlist;
        });
    };

    const isInWatchlist = (id: number) => {
        return watchlist.some((item) => item.id === id);
    };

    return (
        <WatchlistContext.Provider
            value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
        >
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const context = useContext(WatchlistContext);
    if (context === undefined) {
        throw new Error("useWatchlist must be used within a WatchlistProvider");
    }
    return context;
}
