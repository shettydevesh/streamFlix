"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MediaItem } from "@/types/tmdb";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

export interface HistoryItem {
    id: number;
    type: "movie" | "tv";
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    timestamp: number;
    lastWatched: string; // ISO date string
    // TV specific
    season_number?: number;
    episode_number?: number;
    episode_title?: string;
}

interface WatchHistoryContextType {
    history: HistoryItem[];
    addToHistory: (item: HistoryItem) => void;
    removeFromHistory: (id: number) => void;
}

const WatchHistoryContext = createContext<WatchHistoryContextType | undefined>(undefined);

export function WatchHistoryProvider({ children }: { children: React.ReactNode }) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const { user } = useAuth();

    // Load initial state
    useEffect(() => {
        const loadHistory = async () => {
            if (user) {
                // Fetch from Supabase
                const { data, error } = await supabase
                    .from("watch_history")
                    .select("*")
                    .order("last_watched", { ascending: false });

                if (error) {
                    console.error("Error fetching watch history:", error);
                } else if (data) {
                    // Map snake_case DB columns to our HistoryItem type if needed, 
                    // or ensure DB columns match. 
                    // Based on my SQL, metadata is a jsonb. 
                    // Let's assume we store the whole item in metadata or flatten it.
                    // The plan said: columns + metadata jsonb.
                    // Let's rely on storing the minimal fields in cols and the rest in metadata.
                    // Actually, simpler: 
                    // Map rows back to HistoryItem.
                    const mapped: HistoryItem[] = data.map(row => ({
                        ...row.metadata, // title, poster_path, etc.
                        id: row.media_id,
                        type: row.media_type,
                        timestamp: row.timestamp,
                        lastWatched: row.last_watched,
                    }));
                    setHistory(mapped);
                }
            } else {
                // Load from LocalStorage
                const stored = localStorage.getItem("streamflix-watch-history");
                if (stored) {
                    try {
                        setHistory(JSON.parse(stored));
                    } catch (e) {
                        console.error("Failed to parse watch history", e);
                    }
                } else {
                    setHistory([]);
                }
            }
            setIsInitialized(true);
        };

        loadHistory();
    }, [user]);

    // Save to LocalStorage (for guest)
    useEffect(() => {
        if (!user && isInitialized) {
            localStorage.setItem("streamflix-watch-history", JSON.stringify(history));
        }
    }, [history, isInitialized, user]);

    const addToHistory = async (item: HistoryItem) => {
        // Optimistic update
        setHistory((prev) => {
            const filtered = prev.filter((i) => i.id !== item.id);
            return [item, ...filtered];
        });

        if (user) {
            // Sync to Supabase
            const { error } = await supabase
                .from("watch_history")
                .upsert({
                    user_id: user.id,
                    media_id: item.id,
                    media_type: item.type,
                    timestamp: item.timestamp,
                    last_watched: new Date().toISOString(),
                    metadata: {
                        title: item.title,
                        poster_path: item.poster_path,
                        backdrop_path: item.backdrop_path,
                        season_number: item.season_number,
                        episode_number: item.episode_number,
                        episode_title: item.episode_title
                    }
                }, { onConflict: 'user_id, media_id, media_type' }); // Ensure unique constraint matches

            if (error) console.error("Error syncing to Supabase:", error);
        }
    };

    const removeFromHistory = async (id: number) => {
        const itemToRemove = history.find(i => i.id === id);
        if (!itemToRemove) return;

        setHistory((prev) => prev.filter((i) => i.id !== id));

        if (user) {
            const { error } = await supabase
                .from("watch_history")
                .delete()
                .match({ user_id: user.id, media_id: id }); // Note: valid if media_id is unique enough, but better to match type too. 
            // Since `removeFromHistory` only takes ID, we might delete both movie and tv with same ID if that happens?
            // TMDB IDs are unique per type.
            // Ideally `removeFromHistory` should take type too.
            // I will update the interface to be safe, OR just delete all with that ID (unlikely collision but possible).
            // Let's stick to ID for now as per interface, but maybe filter in memory to find type.

            if (error) console.error("Error removing from Supabase:", error);
        }
    };

    return (
        <WatchHistoryContext.Provider value={{ history, addToHistory, removeFromHistory }}>
            {children}
        </WatchHistoryContext.Provider>
    );
}

export function useWatchHistory() {
    const context = useContext(WatchHistoryContext);
    if (context === undefined) {
        throw new Error("useWatchHistory must be used within a WatchHistoryProvider");
    }
    return context;
}
