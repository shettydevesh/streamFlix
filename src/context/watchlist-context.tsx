"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { MediaItem } from "@/types/tmdb";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

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
    const { user } = useAuth();

    // Load initial state
    useEffect(() => {
        const loadWatchlist = async () => {
            if (user) {
                // Fetch from Supabase
                const { data, error } = await supabase
                    .from("watchlist")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) {
                    console.error("Error fetching watchlist:", error);
                } else if (data) {
                    const mapped: MediaItem[] = data.map(row => ({
                        ...row.metadata,
                        id: row.media_id,
                        media_type: row.media_type,
                    }));
                    setWatchlist(mapped);
                }
            } else {
                // Load from LocalStorage
                const stored = localStorage.getItem("streamflix-watchlist");
                if (stored) {
                    try {
                        setWatchlist(JSON.parse(stored));
                    } catch (e) {
                        console.error("Failed to parse watchlist", e);
                    }
                } else {
                    setWatchlist([]);
                }
            }
            setIsInitialized(true);
        };

        loadWatchlist();
    }, [user]);

    // Save to LocalStorage (for guest)
    useEffect(() => {
        if (!user && isInitialized) {
            localStorage.setItem("streamflix-watchlist", JSON.stringify(watchlist));
        }
    }, [watchlist, isInitialized, user]);

    const addToWatchlist = async (item: MediaItem) => {
        if (watchlist.some((i) => i.id === item.id)) return;

        // Optimistic update
        setWatchlist((prev) => [...prev, item]);
        toast.success("Added to Watchlist");

        if (user) {
            const { error } = await supabase
                .from("watchlist")
                .upsert({
                    user_id: user.id,
                    media_id: item.id,
                    media_type: item.media_type, // Assuming MediaItem always has media_type. If not, we need to infer it. The type definition says it should.
                    created_at: new Date().toISOString(),
                    metadata: item // Storing full item to easily reconstruct
                }, { onConflict: 'user_id, media_id, media_type' });

            if (error) {
                console.error("Error syncing watchlist to Supabase:", error);
                toast.error("Failed to sync to cloud");
            }
        }
    };

    const removeFromWatchlist = async (id: number) => {
        setWatchlist((prev) => prev.filter((i) => i.id !== id));
        toast.success("Removed from Watchlist");

        if (user) {
            const { error } = await supabase
                .from("watchlist")
                .delete()
                .match({ user_id: user.id, media_id: id });

            if (error) console.error("Error removing from Supabase:", error);
        }
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
